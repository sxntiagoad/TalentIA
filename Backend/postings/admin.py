from django.contrib import admin
from .models import (
    Service, Category, Subcategory, NestedCategory, 
    Job, Review, JobApplication, ServiceOrder, Payment, ServiceRequest
)

# Registro de los modelos existentes
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')

@admin.register(NestedCategory)
class NestedCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'subcategory')

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'freelancer', 'availability')
    list_filter = ('availability',)
    search_fields = ('title', 'description')

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'availability')
    list_filter = ('availability',)
    search_fields = ('title', 'description')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('author', 'rating', 'service', 'job', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('content', 'author__email')

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('freelancer', 'job', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('freelancer__name', 'job__title')

# Añadir los nuevos modelos
@admin.register(ServiceOrder)
class ServiceOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'service', 'client', 'freelancer', 'status', 'plan_type', 'amount', 'created_at')
    list_filter = ('status', 'plan_type', 'created_at')
    search_fields = ('service__title', 'client__email', 'freelancer__name')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'amount', 'status', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('order__service__title', 'transaction_id')

@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'service', 'client', 'freelancer', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('service__title', 'client__email', 'freelancer__name')