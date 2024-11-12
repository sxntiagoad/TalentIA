import requests
import json
import logging
from postings.models import Job, Service, Category
from django.db.models import Q
import nltk
from nltk.corpus import stopwords
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Cargar variables de entorno
load_dotenv()

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Intenta descargar los recursos necesarios una sola vez al inicio
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
except Exception as e:
    logger.error(f"Error al descargar recursos NLTK: {e}")

# Configurar Gemini API
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

# Iniciar chat
chat = model.start_chat(history=[])

def extraer_palabras_clave(mensaje):
    try:
        tokens = nltk.word_tokenize(mensaje.lower())
        stop_words = set(stopwords.words('spanish'))
    except LookupError:
        tokens = mensaje.lower().split()
        stop_words = set(['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'pero', 'si', 'no', 'en', 'por', 'para'])
    
    return [palabra for palabra in tokens if palabra.isalnum() and palabra not in stop_words]

def buscar_en_base_de_datos(palabras_clave):
    query = Q()
    for palabra in palabras_clave:
        query |= (
            Q(title__icontains=palabra) | 
            Q(description__icontains=palabra) |
            Q(location__icontains=palabra) |
            Q(category__name__icontains=palabra) |
            Q(subcategory__name__icontains=palabra) |
            Q(nestedcategory__name__icontains=palabra)
        )
    
    trabajos = Job.objects.filter(query, availability=True).distinct()[:5]
    servicios = Service.objects.filter(query, availability=True).distinct()[:5]
    
    return trabajos, servicios

def obtener_resumen_base_de_datos():
    try:
        total_trabajos = Job.objects.filter(availability=True).count()
        total_servicios = Service.objects.filter(availability=True).count()
        categorias = Category.objects.prefetch_related('subcategories__nestedcategories').all()
        
        resumen = f"Actualmente en nuestra base de datos tenemos {total_trabajos} trabajos y {total_servicios} servicios disponibles.\n\n"
        resumen += "Categorías disponibles:\n"
        
        for categoria in categorias:
            resumen += f"\n- {categoria.name}:\n"
            for subcategoria in categoria.subcategories.all():
                resumen += f"  · {subcategoria.name}\n"
                nested = subcategoria.nestedcategories.all()
                if nested:
                    resumen += "".join([f"    - {nc.name}\n" for nc in nested])
        
        return resumen
    except Exception as e:
        logger.error(f"Error al obtener resumen de la base de datos: {e}")
        return "No se pudo obtener el resumen de la base de datos."

def reiniciar_gemini():
    global model, chat
    try:
        # Reconfigurar Gemini
        api_key = os.getenv("GOOGLE_API_KEY")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        chat = model.start_chat(history=[])
        return True
    except Exception as e:
        logger.error(f"Error al reiniciar Gemini: {e}")
        return False

def process_user_message(mensaje):
    try:
        global chat
        
        if not reiniciar_gemini():
            return {
                'type': 'error',
                'response': "Error al conectar con el servicio de chat. Por favor, intenta más tarde.",
                'trabajos': [],
                'servicios': []
            }
        
        palabras_clave = extraer_palabras_clave(mensaje)
        trabajos, servicios = buscar_en_base_de_datos(palabras_clave)
        
        info_trabajos_servicios = ""

        if trabajos:
            info_trabajos_servicios += "TRABAJOS DISPONIBLES:\n\n"
            for i, trabajo in enumerate(trabajos, 1):
                info_trabajos_servicios += f"{i}. {trabajo.title}\n"
                info_trabajos_servicios += "-" * 40 + "\n"
                info_trabajos_servicios += f"Descripción: {trabajo.description[:150]}...\n\n"
                info_trabajos_servicios += f"Requisitos: {trabajo.requirements[:150]}...\n"
                info_trabajos_servicios += f"Responsabilidades: {trabajo.responsibilities[:150]}...\n"
                info_trabajos_servicios += f"Nivel educativo: {trabajo.education_level}\n"
                info_trabajos_servicios += f"Posición: {trabajo.position}\n"
                info_trabajos_servicios += f"Habilidades técnicas: {trabajo.technical_skills}\n"
                info_trabajos_servicios += f"Habilidades blandas: {trabajo.soft_skills}\n"
                info_trabajos_servicios += f"Salario: {trabajo.salary}\n"
                info_trabajos_servicios += f"Ubicación: {trabajo.location}\n"
                info_trabajos_servicios += f"Empresa: {trabajo.company.name}\n"
                
                categoria_info = f"Categoría: {trabajo.category.name if trabajo.category else 'No especificada'}"
                if trabajo.subcategory:
                    categoria_info += f" > {trabajo.subcategory.name}"
                if trabajo.nestedcategory:
                    categoria_info += f" > {trabajo.nestedcategory.name}"
                info_trabajos_servicios += f"{categoria_info}\n\n"

        if servicios:
            info_trabajos_servicios += "SERVICIOS DISPONIBLES:\n\n"
            for i, servicio in enumerate(servicios, 1):
                info_trabajos_servicios += f"{i}. {servicio.title}\n"
                info_trabajos_servicios += "-" * 40 + "\n"
                info_trabajos_servicios += f"Descripción: {servicio.description[:150]}...\n\n"
                
                # Información de planes
                if servicio.basic_active:
                    info_trabajos_servicios += "Plan Básico:\n"
                    info_trabajos_servicios += f"- Precio: {servicio.basic_price}\n"
                    info_trabajos_servicios += f"- Descripción: {servicio.basic_description[:100]}...\n"
                    info_trabajos_servicios += f"- Tiempo de entrega: {servicio.basic_delivery_time} días\n"
                    info_trabajos_servicios += f"- Revisiones: {servicio.basic_revisions}\n\n"
                
                if servicio.standard_active:
                    info_trabajos_servicios += "Plan Estándar:\n"
                    info_trabajos_servicios += f"- Precio: {servicio.standard_price}\n"
                    info_trabajos_servicios += f"- Descripción: {servicio.standard_description[:100]}...\n"
                    info_trabajos_servicios += f"- Tiempo de entrega: {servicio.standard_delivery_time} días\n"
                    info_trabajos_servicios += f"- Revisiones: {servicio.standard_revisions}\n\n"
                
                if servicio.premium_active:
                    info_trabajos_servicios += "Plan Premium:\n"
                    info_trabajos_servicios += f"- Precio: {servicio.premium_price}\n"
                    info_trabajos_servicios += f"- Descripción: {servicio.premium_description[:100]}...\n"
                    info_trabajos_servicios += f"- Tiempo de entrega: {servicio.premium_delivery_time} días\n"
                    info_trabajos_servicios += f"- Revisiones: {servicio.premium_revisions}\n\n"
                
                info_trabajos_servicios += f"Ubicación: {servicio.location}\n"
                info_trabajos_servicios += f"Freelancer: {servicio.freelancer.name} {servicio.freelancer.lastname}\n"
                
                if servicio.freelancer.skills:
                    info_trabajos_servicios += f"Habilidades: {servicio.freelancer.skills[:100]}...\n"
                if servicio.freelancer.experience:
                    info_trabajos_servicios += f"Experiencia: {servicio.freelancer.experience[:100]}...\n"
                
                categoria_info = f"Categoría: {servicio.category.name if servicio.category else 'No especificada'}"
                if servicio.subcategory:
                    categoria_info += f" > {servicio.subcategory.name}"
                if servicio.nestedcategory:
                    categoria_info += f" > {servicio.nestedcategory.name}"
                info_trabajos_servicios += f"{categoria_info}\n\n"

        if not (trabajos or servicios):
            info_trabajos_servicios = "No he encontrado trabajos o servicios disponibles que coincidan con tu búsqueda."
        
        resumen_db = obtener_resumen_base_de_datos()
        
        # Preparar el prompt para Gemini
        prompt = f"""Eres TalentIa chatbot, diseñado para ayudar a encontrar empleo, trabajos y servicios freelancer.
{resumen_db}
Responde al usuario basándote en esta información: {info_trabajos_servicios}
Da respuestas concisas y relevantes. Si no hay resultados específicos, sugiere alternativas o pide más detalles.
Pregunta del usuario: {mensaje}"""

        # Configurar la generación
        generation_config = genai.types.GenerationConfig(
            temperature=0.7,
            max_output_tokens=1000,
        )

        # Obtener respuesta de Gemini con manejo de errores más robusto
        try:
            # Reiniciar el chat si hay algún problema
            global chat
            try:
                chat = model.start_chat(history=[])
            except Exception as chat_error:
                logger.error(f"Error al reiniciar el chat: {chat_error}")
                
            # Intentar obtener respuesta
            response = chat.send_message(
                content=prompt,
                generation_config=generation_config
            )
            
            # Manejar la respuesta
            if response is None:
                logger.error("La respuesta de Gemini es None")
                contenido_respuesta = "Lo siento, no pude procesar tu mensaje en este momento. Por favor, intenta de nuevo."
            else:
                try:
                    # Intentar diferentes formas de obtener el contenido de la respuesta
                    if hasattr(response, 'text'):
                        contenido_respuesta = response.text
                    elif hasattr(response, 'parts'):
                        contenido_respuesta = ' '.join(part.text for part in response.parts)
                    else:
                        contenido_respuesta = str(response)
                except Exception as content_error:
                    logger.error(f"Error al extraer contenido de la respuesta: {content_error}")
                    contenido_respuesta = "Lo siento, hubo un problema al procesar la respuesta."
                
        except Exception as gemini_error:
            logger.error(f"Error al obtener respuesta de Gemini: {gemini_error}")
            contenido_respuesta = "Lo siento, hubo un problema al procesar tu mensaje. Por favor, intenta de nuevo."

        # Verificación final de la respuesta
        if not contenido_respuesta or contenido_respuesta.strip() == "":
            contenido_respuesta = "Lo siento, no pude generar una respuesta apropiada. Por favor, intenta reformular tu pregunta."

        return {
            'type': 'general',
            'response': contenido_respuesta,
            'trabajos': [{
                'id': t.id,
                'title': t.title,
                'description': t.description,
                'requirements': t.requirements,
                'responsibilities': t.responsibilities,
                'education_level': t.education_level,
                'position': t.position,
                'technical_skills': t.technical_skills,
                'soft_skills': t.soft_skills,
                'salary': t.salary,
                'location': t.location,
                'company': t.company.name,
                'category': t.category.name if t.category else None,
                'subcategory': t.subcategory.name if t.subcategory else None,
                'nestedcategory': t.nestedcategory.name if t.nestedcategory else None,
                'availability': t.availability,
                'published_date': t.published_date
            } for t in trabajos],
            'servicios': [{
                'id': s.id,
                'title': s.title,
                'description': s.description,
                'location': s.location,
                'basic_active': s.basic_active,
                'basic_price': s.basic_price,
                'basic_description': s.basic_description,
                'basic_delivery_time': s.basic_delivery_time,
                'basic_revisions': s.basic_revisions,
                'standard_active': s.standard_active,
                'standard_price': s.standard_price,
                'standard_description': s.standard_description,
                'standard_delivery_time': s.standard_delivery_time,
                'standard_revisions': s.standard_revisions,
                'premium_active': s.premium_active,
                'premium_price': s.premium_price,
                'premium_description': s.premium_description,
                'premium_delivery_time': s.premium_delivery_time,
                'premium_revisions': s.premium_revisions,
                'freelancer': {
                    'name': s.freelancer.name,
                    'lastname': s.freelancer.lastname,
                    'skills': s.freelancer.skills,
                    'experience': s.freelancer.experience,
                    'education': s.freelancer.education,
                    'portfolio_link': s.freelancer.portfolio_link,
                    'linkedin_profile': s.freelancer.linkedin_profile,
                    'github_profile': s.freelancer.github_profile
                },
                'category': s.category.name if s.category else None,
                'subcategory': s.subcategory.name if s.subcategory else None,
                'nestedcategory': s.nestedcategory.name if s.nestedcategory else None,
                'availability': s.availability
            } for s in servicios]
        }
    except Exception as e:
        logger.error(f"Error inesperado: {e}")
        return {
            'type': 'error', 
            'response': "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.",
            'trabajos': [],
            'servicios': []
        }

# Ejemplo de uso
if __name__ == "__main__":
    respuesta = process_user_message("Estoy buscando trabajo como desarrollador de software en Madrid.")
    print(respuesta)