import requests
from langchain_community.llms import Ollama
from postings.models import Job, Service

# Inicializar el modelo de Llama 2 a través de Ollama
llm = Ollama(model="llama3")

# Funciones de búsqueda en la base de datos
def search_jobs(keywords):
    query = Job.objects.all()
    for keyword in keywords:
        query = query.filter(title__icontains=keyword)
    return query

def search_services(keywords):
    query = Service.objects.all()
    for keyword in keywords:
        query = query.filter(title__icontains=keyword)
    return query

# Funciones para extraer palabras clave
def extract_job_keywords(text):
    job_keywords = ["trabajo", "empleo", "puesto", "vacante", "contratar"]
    keywords_found = [word for word in job_keywords if word in text.lower()]
    return keywords_found if keywords_found else None

def extract_service_keywords(text):
    service_keywords = ["servicio", "freelancer", "trabajo independiente", "proyecto", "ayuda"]
    keywords_found = [word for word in service_keywords if word in text.lower()]
    return keywords_found if keywords_found else None

# Procesamiento del mensaje del usuario
def process_user_message(message):
    response = llm(message)
    
    if response is None:
        return {
            'type': 'general',
            'response': "Lo siento, no pude procesar tu mensaje. ¿Podrías intentarlo de nuevo?"
        }
    
    job_keywords = extract_job_keywords(response)
    service_keywords = extract_service_keywords(response)
    
    if job_keywords:
        jobs = search_jobs(job_keywords)
        return {
            'type': 'job_search',
            'response': response,
            'results': [{'title': job.title, 'description': job.description} for job in jobs]
        }
    elif service_keywords:
        services = search_services(service_keywords)
        return {
            'type': 'service_search',
            'response': response,
            'results': [{'title': service.title, 'description': service.description} for service in services]
        }
    else:
        return {
            'type': 'general',
            'response': response
        }
