from django.urls import path
from . import views

urlpatterns = [
    path('register/freelancer/', views.register_freelancer, name='register_freelancer'),
    path('register/company/', views.register_company, name='register_company'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('complete-profile/freelancer/', views.complete_freelancer_profile, name='complete_freelancer_profile'),
    path('complete-profile/company/', views.complete_company_profile, name='complete_company_profile'),
    path('get-company-email/<str:company_name>/', views.get_company_email, name='get-company-email'),
    path('get-freelancer-email/<str:name>/<str:lastname>/', views.get_freelancer_email, name='get-freelancer-email'),
    path('get-company-id/<str:company_name>/', views.get_company_id, name='get-company-id'),
    path('freelancers/search/', views.search_freelancers, name='search-freelancers'),
    path('profile/<str:user_type>/<int:user_id>/', views.get_public_profile, name='public-profile'),
]
