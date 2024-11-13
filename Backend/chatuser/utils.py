from .config import get_stream_client
import logging
import traceback

logger = logging.getLogger(__name__)

def get_user_display_info(user):
    """
    Obtiene el nombre y avatar del usuario según su tipo
    """
    if hasattr(user, 'freelancer'):
        return {
            'name': f"{user.freelancer.name} {user.freelancer.lastname}",
            'avatar': user.freelancer.freelancer_avatar.url if user.freelancer.freelancer_avatar else None
        }
    elif hasattr(user, 'company'):
        return {
            'name': user.company.name,
            'avatar': user.company.company_avatar.url if user.company.company_avatar else None
        }
    return {
        'name': user.email,
        'avatar': None
    }

def generate_stream_token(user_id):
    """
    Genera un token de Stream Chat para un usuario específico
    """
    client = get_stream_client()
    return client.create_token(str(user_id)), client

def create_stream_user(user):
    """
    Crea o actualiza un usuario en Stream Chat
    """
    client = get_stream_client()
    user_info = get_user_display_info(user)
    
    user_data = {
        "id": str(user.id),
        "name": user_info['name'],
        "email": user.email,
        "image": user_info['avatar']
    }

    client.upsert_user(user_data)
    return client, user_data

def generate_channel_id(user_id1, user_id2):
    """
    Genera un ID único para el canal de chat
    """
    return f"messaging_{'_'.join(sorted([str(user_id1), str(user_id2)]))}"

def create_chat_channel(client, current_user, other_user_id):
    """
    Crea un canal de chat entre dos usuarios
    """
    try:
        channel_id = generate_channel_id(current_user.id, other_user_id)
        
        channel = client.channel(
            'messaging', 
            channel_id,
            {
                'members': [str(current_user.id), str(other_user_id)]
            }
        )
        
        channel.create(str(current_user.id))
        return channel
        
    except Exception as e:
        logger.error(f"Error al crear canal: {str(e)}")
        logger.error(traceback.format_exc())
        raise

def delete_chat_channel(client, channel_id):
    """
    Elimina un canal de chat
    """
    client.channel('messaging', channel_id).delete()

def get_user_channels(client, user_id):
    """
    Obtiene todos los canales de chat de un usuario
    """
    return client.query_channels({
        'members': {'$in': [str(user_id)]},
        'type': 'messaging'
    })