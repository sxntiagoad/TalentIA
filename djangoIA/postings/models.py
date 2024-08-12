from django.db import models

# Create your models here.
class User(models.Model):
    # id = models.CharField(max_length=)
    name = models.CharField(max_length=30),
    lastname = models.CharField(max_length=30),
    