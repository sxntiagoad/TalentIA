from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .utils import generate_stream_token, create_stream_user, create_chat_channel
from accounts.models import CustomUser
import logging
import traceback
from .config import get_stream_client
from stream_chat import StreamChat

logger = logging.getLogger(__name__)

# Create your views here.

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def init_chat(request):
    """Inicializar el chat para un usuario"""
    try:
        logger.info(f"Iniciando chat para usuario: {request.user.id}")
        
        # Crear cliente de Stream
        client = StreamChat(
            api_key=settings.STREAM_API_KEY,
            api_secret=settings.STREAM_API_SECRET
        )
        
        # Convertir ID a string
        user_id = str(request.user.id)
        logger.info(f"User ID convertido a string: {user_id}")
        
        # Generar token
        token = client.create_token(user_id)
        logger.info(f"Token generado: {token}")
        
        # Preparar datos de usuario basados en el tipo de usuario
        user_data = {
            'id': user_id,
            'email': request.user.email,
        }

        # Verificar si el usuario es Freelancer o Company
        if hasattr(request.user, 'freelancer'):
            user_data.update({
                'name': f"{request.user.freelancer.name} {request.user.freelancer.lastname}",
                'image': request.user.freelancer.freelancer_avatar.url if request.user.freelancer.freelancer_avatar else None,
                'type': 'freelancer'
            })
        elif hasattr(request.user, 'company'):
            user_data.update({
                'name': request.user.company.name,
                'image': request.user.company.company_avatar.url if request.user.company.company_avatar else None,
                'type': 'company'
            })
        else:
            user_data['name'] = request.user.email
            
        logger.info(f"Datos de usuario preparados: {user_data}")
        
        # Preparar respuesta
        response_data = {
            'token': token,
            'apiKey': settings.STREAM_API_KEY,
            'userData': user_data
        }
        
        logger.info(f"Respuesta preparada: {response_data}")
        return Response(response_data)
        
    except Exception as e:
        logger.error(f"Error al inicializar chat: {str(e)}")
        logger.error(traceback.format_exc())
        return Response(
            {
                'error': str(e),
                'detail': traceback.format_exc()
            }, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

def generate_token(user_id):
    client = StreamChat(
        api_key=settings.STREAM_API_KEY,
        api_secret=settings.STREAM_API_SECRET
    )
    return client.create_token(user_id)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_channel(request):
    try:
        other_user_id = request.data.get('other_user_id')
        if not other_user_id:
            return Response(
                {'error': 'ID del otro usuario no proporcionado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Obtener usuarios por ID
        try:
            other_user = CustomUser.objects.get(id=other_user_id)
        except CustomUser.DoesNotExist:
            return Response(
                {'error': 'Usuario no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        current_user = request.user
        
        # Inicializar cliente Stream
        client = StreamChat(
            api_key=settings.STREAM_API_KEY,
            api_secret=settings.STREAM_API_SECRET
        )
        
        # Crear ID único para el canal (siempre el mismo para los mismos usuarios)
        user_ids = sorted([str(current_user.id), str(other_user.id)])
        channel_id = f"messaging_{'_'.join(user_ids)}"
        
        # Intentar obtener el canal existente
        try:
            channel = client.channel('messaging', channel_id)
            channel.query()
            # Si el canal existe, simplemente lo retornamos
            return Response({
                'channel': {
                    'id': channel_id,
                    'type': 'messaging',
                    'members': [str(current_user.id), str(other_user.id)]
                }
            })
        except:
            # Si el canal no existe, lo creamos
            channel = client.channel(
                'messaging', 
                channel_id,
                {
                    'members': [str(current_user.id), str(other_user.id)],
                    'created_by': str(current_user.id)
                }
            )
            
            channel.create(str(current_user.id))
            
            return Response({
                'channel': {
                    'id': channel_id,
                    'type': 'messaging',
                    'members': [str(current_user.id), str(other_user.id)]
                }
            })
            
    except Exception as e:
        logger.error(f"Error al crear canal: {str(e)}")
        logger.error(traceback.format_exc())
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        
        # Preparar datos del usuario
        user_data = {
            'id': user.id,
            'email': user.email,
        }
        
        if hasattr(user, 'freelancer'):
            user_data.update({
                'name': f"{user.freelancer.name} {user.freelancer.lastname}",
                'avatar': user.freelancer.freelancer_avatar.url if user.freelancer.freelancer_avatar else None,
                'type': 'freelancer'
            })
        elif hasattr(user, 'company'):
            user_data.update({
                'name': user.company.name,
                'avatar': user.company.company_avatar.url if user.company.company_avatar else None,
                'type': 'company'
            })
            
        return Response(user_data)
        
    except CustomUser.DoesNotExist:
        return Response(
            {'error': 'Usuario no encontrado'}, 
            status=status.HTTP_404_NOT_FOUND
        )
