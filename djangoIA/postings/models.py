from django.db import models

class User(models.Model):
    name = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Consider using a larger max_length for hashed passwords
    role = models.CharField(max_length=100)

    def _str_(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def _str_(self):
        return self.name

class Subcategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=255)

    def _str_(self):
        return self.name
    
class NestedCategory(models.Model):
    subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE, related_name='nestedcategories', default=1)  # Ajusta el valor predeterminado según sea necesario
    name = models.CharField(max_length=255)

    def _str_(self):
        return self.name
    
class Service(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    description = models.TextField()
    price = models.FloatField()
    aviliability = models.BooleanField(default=True)  # True = available, False = not available 
    location = models.CharField(max_length=100)  # Increased max_length for location
    image = models.ImageField(upload_to='services/', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.SET_NULL, null=True)
    nestedcategory = models.ForeignKey(NestedCategory, on_delete=models.SET_NULL, null=True)

    def _str_(self):
        return self.title