# views.py
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from .chatbot_logic import process_user_message
from rest_framework.permissions import IsAuthenticated

class ChatbotViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def chat(self, request):
        user_message = request.data.get('message')
        
        if not user_message:
            return Response({'error': 'No se proporcionó ningún mensaje'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = request.user
            user_id = None
            
            if hasattr(user, 'freelancer'):
                user_id = user.freelancer.id
            elif hasattr(user, 'company'):
                user_id = user.company.id
                
            chatbot_response = process_user_message(user_message, user_id)
            return Response(chatbot_response)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
