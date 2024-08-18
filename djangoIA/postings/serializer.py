from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class SubcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Subcategory
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_lastname = serializers.CharField(source='user.lastname', read_only=True)
    service_title = serializers.CharField(source='title', read_only=True)
    service_description = serializers.CharField(source='description', read_only=True)
    class Meta:
        model = Service
        fields = '__all__'

class NestedCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Subcategory
        fields = '__all__'
class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)  # Ajuste aquí
    job_title = serializers.CharField(source='title', read_only=True)
    job_description = serializers.CharField(source='description', read_only=True)
    class Meta:
        model = Job
        fields = '__all__'
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'