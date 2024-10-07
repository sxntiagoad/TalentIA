from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password, check_password
import binascii
import os

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El Email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

class Freelancer(CustomUser):
    name = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    role = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    information = models.TextField(max_length=500, blank=True)
    avatar = models.ImageField(upload_to='users/', null=True, blank=True)
    location = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=50, choices=[
        ('es', 'Español'),
        ('en', 'English'),
        ('fr', 'Français'),
        ('de', 'Deutsch'),
    ], blank=True, default='es')
    interests = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} {self.lastname}"

class Company(CustomUser):
    name = models.CharField(max_length=50)
    phone = models.CharField(max_length=15, blank=True)
    information = models.TextField(max_length=500, blank=True)
    company_avatar = models.ImageField(upload_to='companies/', null=True, blank=True)
    company_location = models.CharField(max_length=100, blank=True)
    company_language = models.CharField(max_length=50, choices=[
        ('es', 'Español'),
        ('en', 'English'),
        ('fr', 'Français'),
        ('de', 'Deutsch'),
    ], blank=True, default='es')
    interests = models.TextField(blank=True)

    def __str__(self):
        return self.name