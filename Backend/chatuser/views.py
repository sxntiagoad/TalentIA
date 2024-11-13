from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from accounts.models import CustomUser, Company
import logging
from stream_chat import StreamChat

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def init_chat(request):
    """Inicializar el chat para un usuario"""
    try:
        client = StreamChat(api_key=settings.STREAM_API_KEY, api_secret=settings.STREAM_API_SECRET)
        user_id = str(request.user.id)
        token = client.create_token(user_id)
        
        user_data = {
            'id': user_id,
            'email': request.user.email,
            'name': request.user.email
        }

        if hasattr(request.user, 'freelancer'):
            profile = request.user.freelancer
            user_data.update({
                'name': f"{profile.name} {profile.lastname}",
                'image': profile.freelancer_avatar.url if profile.freelancer_avatar else None,
                'type': 'freelancer',
                'profile_id': str(profile.id)
            })
        elif hasattr(request.user, 'company'):
            profile = request.user.company
            user_data.update({
                'name': profile.name,
                'image': profile.company_avatar.url if profile.company_avatar else None,
                'type': 'company',
                'profile_id': str(profile.id)
            })

        return Response({
            'token': token,
            'apiKey': settings.STREAM_API_KEY,
            'userData': user_data
        })
        
    except Exception as e:
        logger.error(f"Error en init_chat: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_channel(request):
    try:
        other_user_id = request.data.get('other_user_id')
        if not other_user_id:
            return Response({'error': 'ID del usuario requerido'}, status=status.HTTP_400_BAD_REQUEST)
            
        other_user = get_object_or_404(CustomUser, id=other_user_id)
        current_user = request.user
        
        client = StreamChat(api_key=settings.STREAM_API_KEY, api_secret=settings.STREAM_API_SECRET)
        channel_id = f"messaging_{min(current_user.id, other_user.id)}_{max(current_user.id, other_user.id)}"
        
        # Obtener nombres de usuario
        current_name = current_user.company.name if hasattr(current_user, 'company') else \
                      f"{current_user.freelancer.name} {current_user.freelancer.lastname}" if hasattr(current_user, 'freelancer') else \
                      current_user.email
                      
        other_name = other_user.company.name if hasattr(other_user, 'company') else \
                     f"{other_user.freelancer.name} {other_user.freelancer.lastname}" if hasattr(other_user, 'freelancer') else \
                     other_user.email

        # Crear usuarios en Stream
        for user, name in [(current_user, current_name), (other_user, other_name)]:
            client.upsert_user({
                "id": str(user.id),
                "name": name,
                "email": user.email
            })

        # Crear o recuperar canal
        channel = client.channel('messaging', channel_id)
        try:
            channel.query()
        except:
            channel = client.channel(
                'messaging', 
                channel_id,
                {
                    "members": [str(current_user.id), str(other_user.id)],
                    "name": f"Chat entre {current_name} y {other_name}"
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
        logger.error(f"Error en create_channel: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request, user_id):
    try:
        user = get_object_or_404(CustomUser, id=user_id)
        
        user_data = {
            'id': str(user.id),
            'email': user.email,
            'type': 'company' if hasattr(user, 'company') else 'freelancer'
        }
        
        if user_data['type'] == 'company':
            user_data.update({
                'name': user.company.name,
                'avatar': user.company.company_avatar.url if user.company.company_avatar else None,
                'profile_id': str(user.company.id)
            })
        else:
            user_data.update({
                'name': f"{user.freelancer.name} {user.freelancer.lastname}",
                'avatar': user.freelancer.freelancer_avatar.url if user.freelancer.freelancer_avatar else None,
                'profile_id': str(user.freelancer.id)
            })
            
        return Response(user_data)
        
    except Exception as e:
        logger.error(f"Error en get_user_info: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
