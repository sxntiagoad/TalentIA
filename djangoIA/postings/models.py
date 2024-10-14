from django.db import models
from django.utils.text import slugify
from accounts.models import Freelancer, Company

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Subcategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class NestedCategory(models.Model):
    subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE, related_name='nestedcategories')
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Service(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Borrador'),
        ('pending', 'Pendiente de revisión'),
        ('published', 'Publicado'),
    ]

    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE, related_name='services')
    title = models.CharField(max_length=50)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    availability = models.BooleanField(default=True)
    location = models.CharField(max_length=100)
    image = models.ImageField(upload_to='services/', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='services')
    subcategory = models.ForeignKey(Subcategory, on_delete=models.SET_NULL, null=True, related_name='services')
    nestedcategory = models.ForeignKey(NestedCategory, on_delete=models.SET_NULL, null=True, related_name='services')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    step_completed = models.IntegerField(default=0)

    def __str__(self):
        return self.title

class Job(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Borrador'),
        ('pending', 'Pendiente de revisión'),
        ('published', 'Publicado'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=50)
    description = models.TextField()
    requirements = models.TextField()
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    availability = models.BooleanField(default=True)
    location = models.CharField(max_length=100)
    image = models.ImageField(upload_to='jobs/', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='jobs')
    subcategory = models.ForeignKey(Subcategory, on_delete=models.SET_NULL, null=True, related_name='jobs')
    nestedcategory = models.ForeignKey(NestedCategory, on_delete=models.SET_NULL, null=True, related_name='jobs')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    step_completed = models.IntegerField(default=0)

    def __str__(self):
        return self.title
