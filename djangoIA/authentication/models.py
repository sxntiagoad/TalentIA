from django.contrib.auth.models import User
from django.db import models

class CustomUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    TYPE_CHOICES = (
        ('company', 'Company'),
        ('freelancer', 'Freelancer'),
    )
    type_user = models.CharField(max_length=10, choices=TYPE_CHOICES)

class Company(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=100)
    # Agrega más campos específicos de la empresa si es necesario

class Freelancer(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    skills = models.TextField()
    # Agrega más campos específicos del freelancer si es necesario