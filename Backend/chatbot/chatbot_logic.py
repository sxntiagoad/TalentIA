import requests
import json
import logging
from postings.models import Job, Service, Category
from django.db.models import Q
import nltk
from nltk.corpus import stopwords
import os
from dotenv import load_dotenv

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

# Obtener la API key del archivo .env
api_key = os.getenv("API_KEY")
url = "https://api.segmind.com/v1/claude-3-haiku"

memoria_temporal = []

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

def process_user_message(mensaje):
    try:
        global memoria_temporal
        
        memoria_temporal.append({"role": "user", "content": mensaje})
        
        palabras_clave = extraer_palabras_clave(mensaje)
        trabajos, servicios = buscar_en_base_de_datos(palabras_clave)
        
        info_trabajos_servicios = ""

        if trabajos:
            info_trabajos_servicios += "TRABAJOS DISPONIBLES:\n\n"
            for i, trabajo in enumerate(trabajos, 1):
                info_trabajos_servicios += f"{i}. {trabajo.title}\n"
                info_trabajos_servicios += "-" * 40 + "\n"
                info_trabajos_servicios += f"Descripción: {trabajo.description[:150]}...\n\n"
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
                info_trabajos_servicios += f"Precio: {servicio.price}\n"
                info_trabajos_servicios += f"Ubicación: {servicio.location}\n"
                info_trabajos_servicios += f"Freelancer: {servicio.freelancer.name} {servicio.freelancer.lastname}\n"
                
                if servicio.freelancer.skills:
                    info_trabajos_servicios += f"Habilidades: {servicio.freelancer.skills[:100]}...\n"
                
                categoria_info = f"Categoría: {servicio.category.name if servicio.category else 'No especificada'}"
                if servicio.subcategory:
                    categoria_info += f" > {servicio.subcategory.name}"
                if servicio.nestedcategory:
                    categoria_info += f" > {servicio.nestedcategory.name}"
                info_trabajos_servicios += f"{categoria_info}\n\n"

        if not (trabajos or servicios):
            info_trabajos_servicios = "No he encontrado trabajos o servicios disponibles que coincidan con tu búsqueda."
        
        resumen_db = obtener_resumen_base_de_datos()
        
        datos = {
            "instruction": f"Eres TalentIa chatbot, diseñado para ayudar a encontrar empleo, trabajos y servicios freelancer. {resumen_db} Responde al usuario basándote en esta información: {info_trabajos_servicios}. Da respuestas concisas y relevantes. Si no hay resultados específicos, sugiere alternativas o pide más detalles sobre el tipo de trabajo que busca el usuario.",
            "temperature": 0.3,
            "messages": memoria_temporal
        }

        headers = {'x-api-key': api_key, 'Content-Type': 'application/json'}
        respuesta = requests.post(url, json=datos, headers=headers, timeout=10)
        respuesta.raise_for_status()
        respuesta_json = respuesta.json()
        
        logger.info(f"Respuesta de la API: {respuesta_json}")
        
        if 'content' in respuesta_json and respuesta_json['content']:
            contenido_respuesta = respuesta_json['content'][0]['text']
        else:
            contenido_respuesta = "Lo siento, no pude procesar tu solicitud. Por favor, intenta de nuevo con más detalles sobre el tipo de trabajo que buscas."
        
        memoria_temporal.append({"role": "assistant", "content": contenido_respuesta})
        
        if len(memoria_temporal) > 10:
            memoria_temporal = memoria_temporal[-10:]
        
        return {
            'type': 'general',
            'response': contenido_respuesta,
            'trabajos': [{
                'id': t.id,
                'title': t.title,
                'description': t.description,
                'requirements': t.requirements,
                'salary': t.salary,
                'location': t.location,
                'company': t.company.name,
                'category': t.category.name if t.category else None,
                'subcategory': t.subcategory.name if t.subcategory else None,
                'nestedcategory': t.nestedcategory.name if t.nestedcategory else None,
                'availability': t.availability
            } for t in trabajos],
            'servicios': [{
                'id': s.id,
                'title': s.title,
                'description': s.description,
                'price': s.price,
                'location': s.location,
                'freelancer': {
                    'name': s.freelancer.name,
                    'lastname': s.freelancer.lastname,
                    'skills': s.freelancer.skills,
                    'experience': s.freelancer.experience
                },
                'category': s.category.name if s.category else None,
                'subcategory': s.subcategory.name if s.subcategory else None,
                'nestedcategory': s.nestedcategory.name if s.nestedcategory else None,
                'availability': s.availability
            } for s in servicios]
        }
    except requests.exceptions.RequestException as error:
        logger.error(f"Error en la solicitud a la API: {error}")
        return {'type': 'error', 'response': "Lo siento, ocurrió un error al procesar tu mensaje. Por favor, inténtalo de nuevo más tarde."}
    except Exception as e:
        logger.error(f"Error inesperado: {e}")
        return {'type': 'error', 'response': "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde."}

# Ejemplo de uso
if __name__ == "__main__":
    respuesta = process_user_message("Estoy buscando trabajo como desarrollador de software en Madrid.")
    print(respuesta)