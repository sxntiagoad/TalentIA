from django.urls import path
from django.http import HttpResponse
from .views import ChatbotViewSet

urlpatterns = [
    path('', lambda request: HttpResponse("API base path"), name='api-root'),  # Ruta base para /api/
    path('chatbot/chat/', ChatbotViewSet.as_view({'post': 'chat'}), name='chatbot-chat'),
]
