# models.py
from django.db import models

class Mensaje(models.Model):
    contenido = models.TextField()
    creado_en = models.DateTimeField(auto_now_add=True)
