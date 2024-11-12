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
from django.contrib.auth.models import User
from django.conf import settings
from accounts.models import Freelancer, Company

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

def buscar_en_base_de_datos(palabras_clave, perfil_usuario=None):
    # Query para trabajos
    query_trabajos = Q()
    for palabra in palabras_clave:
        query_trabajos |= (
            Q(title__icontains=palabra) | 
            Q(description__icontains=palabra) |
            Q(location__icontains=palabra) |
            Q(category__name__icontains=palabra) |
            Q(subcategory__name__icontains=palabra) |
            Q(nestedcategory__name__icontains=palabra) |
            Q(technical_skills__icontains=palabra) |
            Q(soft_skills__icontains=palabra)
        )
    
    # Query para servicios (sin campos específicos de trabajos)
    query_servicios = Q()
    for palabra in palabras_clave:
        query_servicios |= (
            Q(title__icontains=palabra) | 
            Q(description__icontains=palabra) |
            Q(location__icontains=palabra) |
            Q(category__name__icontains=palabra) |
            Q(subcategory__name__icontains=palabra) |
            Q(nestedcategory__name__icontains=palabra) |
            Q(freelancer__skills__icontains=palabra)  # Buscar en las habilidades del freelancer
        )
    
    trabajos = Job.objects.filter(query_trabajos, availability=True).distinct()
    servicios = Service.objects.filter(query_servicios, availability=True).distinct()
    
    if perfil_usuario and perfil_usuario.get('tipo') == 'freelancer':
        habilidades = perfil_usuario.get('habilidades', '').split(',')
        for habilidad in habilidades:
            habilidad = habilidad.strip()
            if habilidad:
                trabajos = trabajos.filter(
                    Q(technical_skills__icontains=habilidad) |
                    Q(soft_skills__icontains=habilidad) |
                    Q(description__icontains=habilidad)
                )
    
    return trabajos[:5], servicios[:5]

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

def obtener_perfil_usuario(user_id):
    try:
        user = User.objects.get(id=user_id)
        Profile = getattr(settings, 'AUTH_USER_MODEL', 'auth.User').split('.')[0]
        profile = Profile.objects.get(user=user)
        return {
            'nombre': user.first_name,
            'apellido': user.last_name,
            'email': user.email,
            'telefono': getattr(profile, 'phone', ''),
            'ubicacion': getattr(profile, 'location', ''),
            'habilidades': getattr(profile, 'skills', ''),
            'experiencia': getattr(profile, 'experience', ''),
            'educacion': getattr(profile, 'education', ''),
            'portfolio': getattr(profile, 'portfolio_link', ''),
            'linkedin': getattr(profile, 'linkedin_profile', ''),
            'github': getattr(profile, 'github_profile', '')
        }
    except User.DoesNotExist:
        logger.error(f"Usuario con ID {user_id} no encontrado")
        return None
    except Exception as e:
        logger.error(f"Error al obtener perfil de usuario: {e}")
        return None

def process_user_message(mensaje, user_id=None):
    try:
        global chat
        
        # Obtener información del perfil del usuario si está disponible
        perfil_usuario = None
        if user_id:
            try:
                # Intentar obtener directamente el Freelancer o Company
                try:
                    freelancer = Freelancer.objects.get(id=user_id)
                    perfil_usuario = {
                        'tipo': 'freelancer',
                        'nombre': freelancer.name,
                        'apellido': freelancer.lastname,
                        'email': freelancer.email,
                        'telefono': freelancer.phone,
                        'ubicacion': freelancer.location,
                        'habilidades': freelancer.skills,
                        'experiencia': freelancer.experience,
                        'educacion': freelancer.education,
                        'portfolio': freelancer.portfolio_link,
                        'linkedin': freelancer.linkedin_profile,
                        'github': freelancer.github_profile,
                        'idioma': freelancer.language,
                        'avatar': freelancer.freelancer_avatar.url if freelancer.freelancer_avatar else None
                    }
                    # Mensaje de inicio personalizado para freelancer
                    if not chat.history:
                        chat.send_message(
                            f"¡Hola {freelancer.name}! Soy TalentIA, tu asistente personal. "
                            f"Veo que tienes experiencia en {freelancer.skills if freelancer.skills else 'diferentes áreas'}. "
                            "¿En qué puedo ayudarte hoy? ¿Estás buscando trabajo o servicios?"
                        )
                except Freelancer.DoesNotExist:
                    try:
                        company = Company.objects.get(id=user_id)
                        perfil_usuario = {
                            'tipo': 'company',
                            'nombre': company.name,
                            'email': company.email,
                            'telefono': company.phone,
                            'ubicacion': company.company_location,
                            'informacion': company.information,
                            'intereses': company.interests,
                            'idioma': company.company_language,
                            'avatar': company.company_avatar.url if company.company_avatar else None
                        }
                        # Mensaje de inicio personalizado para empresa
                        if not chat.history:
                            chat.send_message(
                                f"¡Hola {company.name}! Soy TalentIA, tu asistente personal. "
                                "¿En qué puedo ayudarte a encontrar el talento que necesitas hoy?"
                            )
                    except Company.DoesNotExist:
                        logger.error(f"No se encontró ni Freelancer ni Company con ID {user_id}")
                        perfil_usuario = None
                
            except Exception as e:
                logger.error(f"Error al obtener perfil: {str(e)}")
                perfil_usuario = None

        palabras_clave = extraer_palabras_clave(mensaje)
        trabajos, servicios = buscar_en_base_de_datos(palabras_clave, perfil_usuario)
        
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
            info_trabajos_servicios = "No he encontrado trabajos o servicios que coincidan exactamente con tu búsqueda, pero puedo sugerirte algunas opciones similares basadas en tu perfil."
        
        resumen_db = obtener_resumen_base_de_datos()
        
        prompt = f"""Eres TalentIa chatbot, diseñado para ayudar a encontrar empleo, trabajos y servicios freelancer.

INFORMACIÓN DEL USUARIO ACTUAL:
{f'''Tipo de usuario: {perfil_usuario["tipo"]}
Nombre: {perfil_usuario["nombre"]} {perfil_usuario.get("apellido", "")}
Email: {perfil_usuario["email"]}
Ubicación: {perfil_usuario["ubicacion"]}
''' + (f'''Habilidades: {perfil_usuario["habilidades"]}
Experiencia: {perfil_usuario["experiencia"]}
Educación: {perfil_usuario["educacion"]}''' if perfil_usuario["tipo"] == "freelancer" else f'''
Información de la empresa: {perfil_usuario["informacion"]}
Intereses: {perfil_usuario["intereses"]}''') if perfil_usuario else 'Usuario no identificado'}

{resumen_db}

Información de trabajos y servicios disponibles:
{info_trabajos_servicios}

INSTRUCCIONES ESPECÍFICAS:
1. Usa el nombre del usuario en tus respuestas para hacerlas más personales.
2. Proporciona respuestas concisas y relevantes con una longitud moderada.
3. Si el usuario es freelancer:
   - Enfócate en recomendarle trabajos basados en sus habilidades y experiencia.
   - No es necesario que las habilidades coincidan exactamente, busca similitudes y relaciones.
   - Sugiere trabajos que puedan ser relevantes aunque no sean una coincidencia perfecta.
   - No menciones servicios a menos que el usuario lo solicite específicamente.
4. Si el usuario es empresa:
   - Ayúdale a encontrar freelancers que coincidan con sus necesidades.
   - Céntrate en los servicios disponibles que se ajusten a sus requerimientos.
5. Si no hay resultados específicos, sugiere alternativas basadas en el perfil del usuario y explica por qué podrían ser interesantes.
6. Pregunta al usuario si está buscando trabajo o servicios para enfocar mejor la conversación.
7. Mantén la conversación centrada en el tipo de búsqueda que el usuario ha indicado (trabajo o servicios).

Pregunta del usuario: {mensaje}"""

        # Configurar la generación
        generation_config = genai.types.GenerationConfig(
            temperature=0.7,
            max_output_tokens=1000,
        )

        # Obtener respuesta de Gemini
        response = chat.send_message(
            prompt,
            generation_config=generation_config
        )
        
        contenido_respuesta = response.text
        
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
        return {'type': 'error', 'response': "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde."}

# Ejemplo de uso
if __name__ == "__main__":
    respuesta = process_user_message("Estoy buscando trabajo como desarrollador de software en Madrid.", user_id=1)
    print(respuesta)