from .config import get_stream_client
import logging
import traceback

logger = logging.getLogger(__name__)

def generate_stream_token(user_id):
    """
    Genera un token de Stream Chat para un usuario específico
    """
    client = get_stream_client()
    token = client.create_token(str(user_id))
    return token, client

def create_stream_user(user):
    """
    Crea o actualiza un usuario en Stream Chat
    """
    client = get_stream_client()
    
    # Determinar el nombre y avatar basado en el tipo de usuario
    if hasattr(user, 'freelancer'):
        name = f"{user.freelancer.name} {user.freelancer.lastname}"
        avatar = user.freelancer.freelancer_avatar.url if user.freelancer.freelancer_avatar else None
    elif hasattr(user, 'company'):
        name = user.company.name
        avatar = user.company.company_avatar.url if user.company.company_avatar else None
    else:
        name = user.email
        avatar = None

    user_data = {
        "id": str(user.id),
        "name": name,
        "email": user.email,
        "image": avatar
    }

    # Crear o actualizar usuario en Stream
    client.upsert_user(user_data)
    
    return client, user_data

def create_chat_channel(client, current_user, other_user_id):
    """
    Crea un canal de chat entre dos usuarios
    """
    try:
        # Convertir IDs a strings
        current_user_id = str(current_user.id)
        other_user_id = str(other_user_id)
        
        # Crear un ID único para el canal
        user_ids = sorted([current_user_id, other_user_id])
        channel_id = f"messaging_{'_'.join(user_ids)}"
        
        # Configurar el canal
        channel = client.channel(
            'messaging', 
            channel_id,
            {
                'members': user_ids
            }
        )
        
        # Crear el canal
        channel.create(current_user_id)
        
        return channel
        
    except Exception as e:
        logger.error(f"Error al crear canal: {str(e)}")
        logger.error(traceback.format_exc())
        raise

def delete_chat_channel(client, channel_id):
    """
    Elimina un canal de chat
    """
    channel = client.channel('messaging', channel_id)
    channel.delete()

def get_user_channels(client, user_id):
    """
    Obtiene todos los canales de chat de un usuario
    """
    channels = client.query_channels({
        'members': {'$in': [str(user_id)]},
        'type': 'messaging'
    })
    return channels