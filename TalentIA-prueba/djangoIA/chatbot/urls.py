from django.urls import path
from .views import ChatbotViewSet

urlpatterns = [
    path('chatbot/chat/', ChatbotViewSet.as_view({'post': 'chat'}), name='chatbot-chat'),
]