from django.urls import path
from . import views

urlpatterns = [
    path('init/', views.init_chat, name='init-chat'),
    path('channel/create/', views.create_channel, name='create-channel'),
    path('user-info/<int:user_id>/', views.get_user_info, name='get-user-info'),
] 