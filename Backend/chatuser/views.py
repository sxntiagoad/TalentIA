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
            return Response({'error': 'ID del otro usuario requerido'}, status=status.HTTP_400_BAD_REQUEST)
            
        other_user = get_object_or_404(CustomUser, id=other_user_id)
        current_user = request.user
        
        # Crear cliente Stream
        client = StreamChat(api_key=settings.STREAM_API_KEY, api_secret=settings.STREAM_API_SECRET)
        
        # Generar ID del canal
        user_ids = sorted([str(current_user.id), str(other_user.id)])
        channel_id = f"messaging_{'_'.join(user_ids)}"
        
        # Preparar datos de usuarios
        def get_user_display_name(user):
            if hasattr(user, 'freelancer'):
                return f"{user.freelancer.name} {user.freelancer.lastname}"
            elif hasattr(user, 'company'):
                return user.company.name
            return user.email

        current_user_name = get_user_display_name(current_user)
        other_user_name = get_user_display_name(other_user)

        # Crear o actualizar usuarios en Stream
        client.upsert_user({
            "id": str(current_user.id),
            "name": current_user_name,
            "email": current_user.email
        })
        
        client.upsert_user({
            "id": str(other_user.id),
            "name": other_user_name,
            "email": other_user.email
        })

        # Intentar obtener el canal existente
        channel = client.channel('messaging', channel_id)
        
        try:
            # Intentar obtener el canal
            channel.query()
            logger.info("Canal existente encontrado")
        except Exception as e:
            logger.info(f"Canal no encontrado, creando nuevo: {str(e)}")
            # Si no existe, crear nuevo canal
            channel = client.channel(
                'messaging', 
                channel_id, 
                {
                    "members": [str(current_user.id), str(other_user.id)],
                    "name": f"Chat entre {current_user_name} y {other_user_name}"
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
        logger.info(f"Buscando usuario con ID: {user_id}")
        
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response(
                {'error': 'Usuario no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        user_data = {
            'id': str(user.id),
            'email': user.email,
        }
        
        if hasattr(user, 'freelancer'):
            profile = user.freelancer
            user_data.update({
                'name': f"{profile.name} {profile.lastname}",
                'avatar': profile.freelancer_avatar.url if profile.freelancer_avatar else None,
                'type': 'freelancer',
                'profile_id': str(profile.id),
                'freelancer': {
                    'id': str(profile.id),
                    'name': profile.name,
                    'lastname': profile.lastname
                }
            })
        elif hasattr(user, 'company'):
            profile = user.company
            user_data.update({
                'name': profile.name,
                'avatar': profile.company_avatar.url if profile.company_avatar else None,
                'type': 'company',
                'profile_id': str(profile.id),
                'company': {
                    'id': str(profile.id),
                    'name': profile.name
                }
            })
            
        logger.info(f"Datos del usuario a devolver: {user_data}")
        return Response(user_data)
        
    except Exception as e:
        logger.error(f"Error en get_user_info: {str(e)}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
