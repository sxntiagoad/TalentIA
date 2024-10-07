from django.urls import path
from . import views

urlpatterns = [
    path('register/freelancer/', views.register_freelancer, name='register_freelancer'),
    path('register/company/', views.register_company, name='register_company'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
]