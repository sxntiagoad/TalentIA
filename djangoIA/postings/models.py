from django.db import models

class User(models.Model):
    name = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Consider using a larger max_length for hashed passwords
    role = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    information = models.TextField(max_length=500, blank=True)
    image = models.ImageField(upload_to='users/', null=True, blank=True)
    interests = models.ManyToManyField('Category', related_name='users', blank=True)

    def __str__(self):
        return f"{self.name} {self.lastname}"

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
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    description = models.TextField()
    price = models.FloatField()
    availability = models.BooleanField(default=True)  # Corrected spelling
    location = models.CharField(max_length=100)  # Increased max_length for location
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
    company = models.ForeignKey('Company', on_delete=models.CASCADE)
    availability = models.BooleanField(default=True)  # Corrected spelling
    location = models.CharField(max_length=100)  # Increased max_length for location
    image = models.ImageField(upload_to='jobs/', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.SET_NULL, null=True)
    nestedcategory = models.ForeignKey(NestedCategory, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.title

class Company(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Consider using a larger max_length for hashed passwords
    phone = models.CharField(max_length=15, blank=True)
    information = models.TextField(max_length=500, blank=True)
    image = models.ImageField(upload_to='companies/', null=True, blank=True)
    interests = models.ManyToManyField('Category', related_name='companies', blank=True)

    def __str__(self):
        return self.name
