import requests
import json

api_key = ""
url = "https://api.segmind.com/v1/claude-3-haiku"

def process_user_message(mensaje, nueva_conversacion=False):
    historial_chat = []
    
    if not nueva_conversacion:
        # Aquí podrías cargar el historial de chat previo si lo tienes almacenado
        pass
    
    datos = {
        "instruction": "Eres TalentIa chatbot, diseñado para ayudar a encontrar empleo y servicios freelancer. Recopila información del usuario y mantén tus respuestas concisas.",
        "temperature": 0.1,
        "messages": historial_chat + [
            {
                "role": "user",
                "content": mensaje
            }
        ]
    }

    try:
        headers = {
            'x-api-key': api_key,
            'Content-Type': 'application/json'
        }
        respuesta = requests.post(url, data=json.dumps(datos), headers=headers)
        respuesta.raise_for_status()  # Esto lanzará una excepción si el código de estado HTTP es 4xx o 5xx
        respuesta_json = respuesta.json()
        print(respuesta_json)  # Imprime la respuesta completa para depuración
        
        # Ajuste para manejar la nueva estructura de la respuesta
        if 'content' in respuesta_json and len(respuesta_json['content']) > 0:
            contenido_respuesta = respuesta_json['content'][0]['text']
        else:
            contenido_respuesta = "No se recibió contenido válido en la respuesta."
        
        historial_chat.extend([
            {
                "role": "user",
                "content": mensaje
            },
            {
                "role": "assistant",
                "content": contenido_respuesta
            }
        ])
        
        return {
            'type': 'general',
            'response': contenido_respuesta
        }
    except requests.exceptions.RequestException as error:
        print(f'Error: {error}')
        print(f'Respuesta del servidor: {respuesta.text}')  # Agrega esta línea para imprimir la respuesta del servidor
        return {
            'type': 'error',
            'response': "Lo siento, ocurrió un error al procesar tu mensaje. Por favor, inténtalo de nuevo más tarde."
        }

# Ejemplo de uso
if __name__ == "__main__":
    respuesta = process_user_message("Hola, estoy buscando trabajo como desarrollador.")
    print(respuesta)
