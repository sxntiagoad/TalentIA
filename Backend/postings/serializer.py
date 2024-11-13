from rest_framework import serializers
from .models import Category, Subcategory, NestedCategory, Service, Job, Review, JobApplication, ServiceOrder, Payment, ServiceRequest
from accounts.serializer import FreelancerSerializer, CompanySerializer
from accounts.models import Freelancer, Company
from django.db import models
from django.db.models import Avg

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class SubcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Subcategory
        fields = '__all__'

class NestedcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NestedCategory
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    freelancer = FreelancerSerializer(read_only=True)
    service_image = serializers.SerializerMethodField()
    freelancer_name = serializers.CharField(source='freelancer.name', read_only=True)
    freelancer_lastname = serializers.CharField(source='freelancer.lastname', read_only=True)
    service_title = serializers.CharField(source='title', read_only=True)
    service_description = serializers.CharField(source='description', read_only=True)
    freelancer_language = serializers.CharField(source='freelancer.language', read_only=True)
    freelancer_location = serializers.CharField(source='freelancer.location', read_only=True)
    freelancer_avatar = serializers.SerializerMethodField()
    service_category = serializers.CharField(source='category.name', read_only=True)
    service_subcategory = serializers.CharField(source='subcategory.name', read_only=True)
    service_nestedcategory = serializers.CharField(source='nestedcategory.name', read_only=True)
    reviews = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    def get_service_image(self, obj):
        request = self.context.get('request')
        if request and obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_freelancer_avatar(self, obj):
        request = self.context.get('request')
        if request and obj.freelancer and obj.freelancer.freelancer_avatar:
            return request.build_absolute_uri(obj.freelancer.freelancer_avatar.url)
        return None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')

        if request:
            for field in ['image', 'service_image', 'freelancer_avatar']:
                if representation.get(field):
                    representation[field] = request.build_absolute_uri(representation[field])

        return representation

    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ('freelancer',)

    def create(self, validated_data):
        freelancer = self.context['request'].user.freelancer
        # Removemos el campo 'freelancer' de validated_data si existe
        validated_data.pop('freelancer', None)
        service = Service.objects.create(freelancer=freelancer, **validated_data)
        return service

    def get_reviews(self, obj):
        reviews = obj.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data

    def get_average_rating(self, obj):
        return obj.reviews.aggregate(Avg('rating'))['rating__avg'] or 0

    def get_review_count(self, obj):
        return obj.reviews.count()

    def validate(self, data):
        # Validar que al menos un plan esté activo
        if not any([
            data.get('basic_active', False),
            data.get('standard_active', False),
            data.get('premium_active', False)
        ]):
            raise serializers.ValidationError(
                "Debe activar al menos un plan"
            )

        # Validar campos del plan básico
        if data.get('basic_active'):
            basic_fields = [
                'basic_price',
                'basic_description',
                'basic_delivery_time',
                'basic_revisions'
            ]
            for field in basic_fields:
                if not data.get(field):
                    raise serializers.ValidationError(
                        f"El campo {field} es requerido para el plan básico"
                    )

        # Validar campos del plan estándar
        if data.get('standard_active'):
            standard_fields = [
                'standard_price',
                'standard_description',
                'standard_delivery_time',
                'standard_revisions'
            ]
            for field in standard_fields:
                if not data.get(field):
                    raise serializers.ValidationError(
                        f"El campo {field} es requerido para el plan estándar"
                    )

        # Validar campos del plan premium
        if data.get('premium_active'):
            premium_fields = [
                'premium_price',
                'premium_description',
                'premium_delivery_time',
                'premium_revisions'
            ]
            for field in premium_fields:
                if not data.get(field):
                    raise serializers.ValidationError(
                        f"El campo {field} es requerido para el plan premium"
                    )

        return data

class JobSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    job_image = serializers.SerializerMethodField()
    company_name = serializers.CharField(source='company.name', read_only=True)
    job_title = serializers.CharField(source='title', read_only=True)
    job_description = serializers.CharField(source='description', read_only=True)
    company_language = serializers.CharField(source='company.company_language', read_only=True)
    company_location = serializers.CharField(source='company.company_location', read_only=True)
    company_avatar = serializers.SerializerMethodField()
    job_category = serializers.CharField(source='category.name', read_only=True)
    job_subcategory = serializers.CharField(source='subcategory.name', read_only=True)
    job_nestedcategory = serializers.CharField(source='nestedcategory.name', read_only=True)
    reviews = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    def get_job_image(self, obj):
        request = self.context.get('request')
        if request and obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_company_avatar(self, obj):
        request = self.context.get('request')
        if request and obj.company and obj.company.company_avatar:
            return request.build_absolute_uri(obj.company.company_avatar.url)
        return None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')

        if request:
            for field in ['image', 'job_image', 'company_avatar']:
                if representation.get(field):
                    representation[field] = request.build_absolute_uri(representation[field])

        return representation
    def create(self, validated_data):
        company = self.context['request'].user.company
        job = Job.objects.create(company=company, **validated_data)
        return job
    class Meta:
        model = Job
        fields = '__all__'

    def get_reviews(self, obj):
        reviews = obj.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data

    def get_average_rating(self, obj):
        return obj.reviews.aggregate(Avg('rating'))['rating__avg'] or 0

    def get_review_count(self, obj):
        return obj.reviews.count()

class ReviewSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()
    author_email = serializers.SerializerMethodField()

    def get_author_name(self, obj):
        if hasattr(obj.author, 'freelancer'):
            return f"{obj.author.freelancer.name} {obj.author.freelancer.lastname}"
        elif hasattr(obj.author, 'company'):
            return obj.author.company.name
        return obj.author.email

    def get_author_email(self, obj):
        return obj.author.email

    def get_author_avatar(self, obj):
        request = self.context.get('request')
        avatar = None
        
        if hasattr(obj.author, 'freelancer'):
            avatar = obj.author.freelancer.freelancer_avatar
        elif hasattr(obj.author, 'company'):
            avatar = obj.author.company.company_avatar

        if request and avatar:
            return request.build_absolute_uri(avatar.url)
        return None

    class Meta:
        model = Review
        fields = ['id', 'content', 'rating', 'created_at', 'author_name', 
                 'author_avatar', 'author_email', 'service', 'job']
        read_only_fields = ['author']

class JobApplicationSerializer(serializers.ModelSerializer):
    freelancer_id = serializers.IntegerField(source='freelancer.id', read_only=True)
    freelancer_name = serializers.CharField(source='freelancer.name', read_only=True)
    freelancer_lastname = serializers.CharField(source='freelancer.lastname', read_only=True)
    freelancer_email = serializers.CharField(source='freelancer.user.email', read_only=True)
    freelancer_phone = serializers.CharField(source='freelancer.phone', read_only=True)
    freelancer_avatar = serializers.SerializerMethodField()
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.company.name', read_only=True)
    job_location = serializers.CharField(source='job.location', read_only=True)

    def get_freelancer_avatar(self, obj):
        request = self.context.get('request')
        if request and obj.freelancer.freelancer_avatar:
            return request.build_absolute_uri(obj.freelancer.freelancer_avatar.url)
        return None

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'freelancer', 'freelancer_id', 'status', 'cover_letter', 
            'created_at', 'updated_at', 'freelancer_name', 'freelancer_lastname', 
            'freelancer_email', 'freelancer_phone', 'freelancer_avatar', 
            'job_title', 'company_name', 'job_location'
        ]
        read_only_fields = ['job', 'freelancer', 'freelancer_id']

class ServiceOrderSerializer(serializers.ModelSerializer):
    service_title = serializers.CharField(source='service.title', read_only=True)
    client_name = serializers.CharField(source='client.email', read_only=True)
    freelancer_name = serializers.CharField(source='freelancer.name', read_only=True)
    
    class Meta:
        model = ServiceOrder
        fields = [
            'id', 'service', 'service_title', 'client', 'client_name',
            'freelancer', 'freelancer_name', 'status', 'plan_type',
            'amount', 'requirements', 'created_at', 'updated_at'
        ]
        read_only_fields = ['client', 'freelancer', 'status']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['status', 'transaction_id']

class ServiceRequestSerializer(serializers.ModelSerializer):
    service_title = serializers.CharField(source='service.title', read_only=True)
    client_name = serializers.SerializerMethodField()
    client_email = serializers.CharField(source='client.email', read_only=True)
    freelancer_name = serializers.CharField(source='freelancer.name', read_only=True)
    order_amount = serializers.DecimalField(
        source='order.amount',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    plan_type = serializers.CharField(source='order.plan_type', read_only=True)
    
    def get_client_name(self, obj):
        return f"{obj.client.email}"
    
    class Meta:
        model = ServiceRequest
        fields = [
            'id', 'service', 'service_title', 'client', 'client_name',
            'client_email', 'freelancer', 'freelancer_name', 'status',
            'requirements', 'created_at', 'updated_at', 'order_amount',
            'plan_type'
        ]
        read_only_fields = ['client', 'freelancer', 'service']
