# views.py
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from .chatbot_logic import process_user_message
import traceback

class ChatbotViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def chat(self, request):
        user_message = request.data.get('message')
        
        if not user_message:
            return Response({'error': 'No se proporcionó ningún mensaje'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            chatbot_response = process_user_message(user_message)
            return Response(chatbot_response)
        except Exception as e:
            traceback.print_exc()  # Esto imprimirá el traceback completo en la consola
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
