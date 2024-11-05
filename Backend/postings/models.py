from django.db import models
from django.utils.text import slugify
from accounts.models import Freelancer, Company, CustomUser
from django.core.exceptions import ValidationError

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

    def __str__(self):
        return self.title

class Job(models.Model):
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

    def __str__(self):
        return self.title

class Review(models.Model):
    RATING_CHOICES = (
        (1, '1'),
        (2, '2'),
        (3, '3'),
        (4, '4'),
        (5, '5'),
    )
    
    content = models.TextField()
    rating = models.IntegerField(choices=RATING_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    service = models.ForeignKey(Service, on_delete=models.CASCADE, null=True, blank=True, related_name='reviews')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, null=True, blank=True, related_name='reviews')
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviews')

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(
                    models.Q(service__isnull=False, job__isnull=True) |
                    models.Q(service__isnull=True, job__isnull=False)
                ),
                name='review_service_or_job'
            )
        ]

    def clean(self):
        super().clean()
        # Validar que el autor tenga un token válido
        if not self.author.auth_token:
            raise ValidationError('El usuario debe estar autenticado para crear una review')
            
        # Validar que el autor no sea el dueño del servicio/trabajo
        if self.service and self.service.freelancer.user == self.author:
            raise ValidationError('No puedes revisar tu propio servicio')
        if self.job and self.job.company.user == self.author:
            raise ValidationError('No puedes revisar tu propio trabajo')

        # Validar que solo se pueda hacer una review por servicio/trabajo
        if self.service:
            existing_review = Review.objects.filter(
                service=self.service,
                author=self.author
            ).exists()
            if existing_review:
                raise ValidationError('Ya has realizado una review para este servicio')
        
        if self.job:
            existing_review = Review.objects.filter(
                job=self.job,
                author=self.author
            ).exists()
            if existing_review:
                raise ValidationError('Ya has realizado una review para este trabajo')

    def __str__(self):
        return f"Review by {self.author} - {'Service' if self.service else 'Job'}"
