from django.db import models
from django.utils.text import slugify
from accounts.models import Freelancer, Company, CustomUser
from django.core.exceptions import ValidationError
from django.utils import timezone

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
    TIER_CHOICES = [
        ('basic', 'Básico'),
        ('standard', 'Estándar'),
        ('premium', 'Premium'),
    ]

    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE, related_name='services')
    title = models.CharField(max_length=50)
    description = models.TextField()
    availability = models.BooleanField(default=True)
    location = models.CharField(max_length=100)
    image = models.ImageField(upload_to='services/', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='services')
    subcategory = models.ForeignKey(Subcategory, on_delete=models.SET_NULL, null=True, related_name='services')
    nestedcategory = models.ForeignKey(NestedCategory, on_delete=models.SET_NULL, null=True, related_name='services')

    # Campos para el plan básico
    basic_active = models.BooleanField(default=True)
    basic_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    basic_description = models.TextField(null=True, blank=True)
    basic_delivery_time = models.PositiveIntegerField(null=True, blank=True, help_text="Tiempo de entrega en días")
    basic_revisions = models.PositiveIntegerField(null=True, blank=True)

    # Campos para el plan estándar
    standard_active = models.BooleanField(default=False)
    standard_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    standard_description = models.TextField(null=True, blank=True)
    standard_delivery_time = models.PositiveIntegerField(null=True, blank=True, help_text="Tiempo de entrega en días")
    standard_revisions = models.PositiveIntegerField(null=True, blank=True)

    # Campos para el plan premium
    premium_active = models.BooleanField(default=False)
    premium_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    premium_description = models.TextField(null=True, blank=True)
    premium_delivery_time = models.PositiveIntegerField(null=True, blank=True, help_text="Tiempo de entrega en días")
    premium_revisions = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return self.title

    def clean(self):
        super().clean()
        if not any([self.basic_active, self.standard_active, self.premium_active]):
            raise ValidationError("Al menos un plan debe estar activo")
        
        # Validar campos requeridos para plan básico
        if self.basic_active:
            if not all([
                self.basic_price,
                self.basic_description,
                self.basic_delivery_time,
                self.basic_revisions
            ]):
                raise ValidationError("Todos los campos del plan básico son requeridos")
        
        # Validar campos requeridos para plan estándar
        if self.standard_active:
            if not all([
                self.standard_price,
                self.standard_description,
                self.standard_delivery_time,
                self.standard_revisions
            ]):
                raise ValidationError("Todos los campos del plan estándar son requeridos")
        
        # Validar campos requeridos para plan premium
        if self.premium_active:
            if not all([
                self.premium_price,
                self.premium_description,
                self.premium_delivery_time,
                self.premium_revisions
            ]):
                raise ValidationError("Todos los campos del plan premium son requeridos")

class Job(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=50)
    description = models.TextField()
    requirements = models.TextField()
    responsibilities = models.TextField()
    education_level = models.TextField(default='No especificado')
    position = models.CharField(max_length=100, default='No especificado')
    technical_skills = models.TextField(default='No especificado')
    soft_skills = models.TextField(default='No especificado')
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    availability = models.BooleanField(default=True)
    location = models.CharField(max_length=100)
    image = models.ImageField(upload_to='jobs/', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='jobs')
    subcategory = models.ForeignKey(Subcategory, on_delete=models.SET_NULL, null=True, related_name='jobs')
    nestedcategory = models.ForeignKey(NestedCategory, on_delete=models.SET_NULL, null=True, related_name='jobs')
    published_date = models.DateTimeField(default=timezone.now)

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

    def __str__(self):
        return f"Review by {self.author} - {'Service' if self.service else 'Job'}"

class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('Pendiente', 'Pendiente'),
        ('Aceptada', 'Aceptada'),
        ('Rechazada', 'Rechazada'),
    ]

    job = models.ForeignKey('Job', on_delete=models.CASCADE, related_name='applications')
    freelancer = models.ForeignKey('accounts.Freelancer', on_delete=models.CASCADE, related_name='job_applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pendiente')
    cover_letter = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('job', 'freelancer')

    def __str__(self):
        return f"{self.freelancer} - {self.job} ({self.status})"

    def save(self, *args, **kwargs):
        # Asegurarse de que el estado inicial sea 'Pendiente'
        if not self.pk:  # Si es una nueva aplicación
            self.status = 'Pendiente'
        super().save(*args, **kwargs)

class ServiceOrder(models.Model):
    STATUS_CHOICES = [
        ('Pendiente', 'Pendiente'),
        ('Pagado', 'Pagado'),
        ('En Proceso', 'En Proceso'),
        ('Completado', 'Completado'),
        ('Cancelado', 'Cancelado'),
    ]

    PLAN_CHOICES = [
        ('basic', 'Básico'),
        ('standard', 'Estándar'),
        ('premium', 'Premium'),
    ]

    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='orders')
    client = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='service_orders')
    freelancer = models.ForeignKey('accounts.Freelancer', on_delete=models.CASCADE, related_name='service_sales')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pendiente')
    plan_type = models.CharField(max_length=20, choices=PLAN_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    requirements = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} - {self.service.title} ({self.status})"

class Payment(models.Model):
    STATUS_CHOICES = [
        ('Pendiente', 'Pendiente'),
        ('Completado', 'Completado'),
        ('Fallido', 'Fallido'),
    ]

    order = models.OneToOneField(ServiceOrder, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pendiente')
    payment_method = models.CharField(max_length=50)
    transaction_id = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.id} for Order {self.order.id}"

class ServiceRequest(models.Model):
    STATUS_CHOICES = [
        ('Pendiente', 'Pendiente'),
        ('Aceptada', 'Aceptada'),
        ('Rechazada', 'Rechazada'),
        ('En Proceso', 'En Proceso'),
        ('Completada', 'Completada'),
        ('Cancelada', 'Cancelada'),
    ]

    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='requests')
    client = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='service_requests')
    freelancer = models.ForeignKey('accounts.Freelancer', on_delete=models.CASCADE, related_name='service_requests_received')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pendiente')
    requirements = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    order = models.OneToOneField(ServiceOrder, on_delete=models.CASCADE, related_name='request')

    def save(self, *args, **kwargs):
        # Actualizar el estado de la orden cuando cambia el estado de la solicitud
        if self.pk:  # Si la solicitud ya existe
            old_request = ServiceRequest.objects.get(pk=self.pk)
            if old_request.status != self.status:  # Si el estado cambió
                if self.status == 'Aceptada':
                    self.order.status = 'En Proceso'
                elif self.status == 'Rechazada':
                    self.order.status = 'Cancelado'
                elif self.status == 'Completada':
                    self.order.status = 'Completado'
                self.order.save()
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Request {self.id} - {self.service.title} ({self.status})"

    class Meta:
        ordering = ['-created_at']
