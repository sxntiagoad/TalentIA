from stream_chat import StreamChat
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def get_stream_client():
    """
    Crea y retorna una instancia del cliente de Stream Chat
    usando las credenciales configuradas en settings.py
    """
    try:
        api_key = settings.STREAM_API_KEY
        api_secret = settings.STREAM_API_SECRET

        logger.info(f"Usando API Key: {api_key[:5]}...")
        logger.info(f"Usando API Secret: {api_secret[:5]}...")

        if not api_key or not api_secret:
            raise ValueError("Stream Chat credentials are not configured")
        
        client = StreamChat(
            api_key=api_key,
            api_secret=api_secret
        )
        
        return client
    except Exception as e:
        logger.error(f"Error initializing Stream Chat client: {str(e)}")
        raise