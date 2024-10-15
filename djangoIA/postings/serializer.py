from rest_framework import serializers
from .models import Category, Subcategory, NestedCategory, Service, Job
from accounts.serializer import FreelancerSerializer, CompanySerializer
from accounts.models import Freelancer, Company

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
    service_title = serializers.CharField(source='title', read_only=True)
    service_description = serializers.CharField(source='description', read_only=True)
    freelancer_language = serializers.CharField(source='freelancer.language', read_only=True)
    freelancer_location = serializers.CharField(source='freelancer.location', read_only=True)
    freelancer_avatar = serializers.SerializerMethodField()
    service_category = serializers.CharField(source='category.name', read_only=True)
    service_subcategory = serializers.CharField(source='subcategory.name', read_only=True)
    service_nestedcategory = serializers.CharField(source='nestedcategory.name', read_only=True)

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

class JobSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(read_only=True)
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
