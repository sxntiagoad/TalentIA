from django.db import models

# Create your models here.
class User(models.Model):
    # id = models.CharField(max_length=)
    name = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=50)
    role = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Subcategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
class Service(models.Model):
    category = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    description = models.TextField()
    price = models.FloatField()
    aviliability = models.BooleanField(default=True) # True = available, False = not available 
    # o se puede usar un charfield con choices
    location = models.CharField(max_length=50)
    image = models.ImageField(upload_to='services/', null=True, blank=True)  # Campo de imagen
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.title

