from django.urls import path, re_path
from . import views


urlpatterns = [
    re_path('login', views.login),
    re_path('register', views.register),
    re_path('logout', views.logout),
    path('profile', views.profile),
]