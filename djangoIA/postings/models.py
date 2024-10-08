from django.db import models
from django.utils.text import slugify
from authentication.models import CustomUser

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

class User(models.Model):
    LANGUAGE_CHOICES = [
        ('es', 'Español'),
        ('en', 'English'),
        ('fr', 'Français'),
        ('de', 'Deutsch'),
        # Agrega más idiomas según sea necesario
    ]

    name = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Consider using a larger max_length for hashed passwords
    role = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    information = models.TextField(max_length=500, blank=True)
    user_avatar = models.ImageField(upload_to='users/', null=True, blank=True)
    user_location = models.CharField(max_length=100, blank=True)
    user_language = models.CharField(max_length=50, choices=LANGUAGE_CHOICES, blank=True, default='es')
    image = models.ImageField(upload_to='users/', null=True, blank=True)
    interests = models.ManyToManyField(Category, related_name='users', blank=True)

    def __str__(self):
        return f"{self.name} {self.lastname}"

class Company(models.Model):
    LANGUAGE_CHOICES = [
        ('es', 'Español'),
        ('en', 'English'),
        ('fr', 'Français'),
        ('de', 'Deutsch'),
        # Agrega más idiomas según sea necesario
    ]

    name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Consider using a larger max_length for hashed passwords
    phone = models.CharField(max_length=15, blank=True)
    information = models.TextField(max_length=500, blank=True)
    image = models.ImageField(upload_to='companies/', null=True, blank=True)
    interests = models.ManyToManyField(Category, related_name='companies', blank=True)
    company_avatar = models.ImageField(upload_to='companies/', null=True, blank=True)
    company_location = models.CharField(max_length=100, blank=True)
    company_language = models.CharField(max_length=50, choices=LANGUAGE_CHOICES, blank=True, default='es')

    def __str__(self):
        return self.name

class Service(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    description = models.TextField() #pensar en short description y detail description
    price = models.FloatField()
    availability = models.BooleanField(default=True) 
    location = models.CharField(max_length=100) #pensar como lo vamos a usar porque el usuario y va adar su propia obicacion
    image = models.ImageField(upload_to='services/', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.SET_NULL, null=True)
    nestedcategory = models.ForeignKey(NestedCategory, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.title

class Job(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField()
    requirements = models.TextField()
    salary = models.FloatField()
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    availability = models.BooleanField(default=True)  # Corrected spelling
    location = models.CharField(max_length=100)  # Increased max_length for location
    image = models.ImageField(upload_to='jobs/', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.SET_NULL, null=True)
    nestedcategory = models.ForeignKey(NestedCategory, on_delete=models.SET_NULL, null=True)

    DRAFT = 'draft'
    PENDING = 'pending'
    PUBLISHED = 'published'
    STATUS_CHOICES = [
        (DRAFT, 'Borrador'),
        (PENDING, 'Pendiente de revisión'),
        (PUBLISHED, 'Publicado'),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=DRAFT,
    )
    
    # Campos para rastrear el progreso de la publicación
    step_completed = models.IntegerField(default=0)

    def __str__(self):
        return self.title
