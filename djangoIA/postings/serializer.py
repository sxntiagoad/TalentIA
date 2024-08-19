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

class NestedcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NestedCategory
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    user_avatar = serializers.ImageField(source='user.user_avatar', read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_location = serializers.CharField(source='user.user_location', read_only=True)
    user_lastname = serializers.CharField(source='user.lastname', read_only=True)
    user_language = serializers.CharField(source='user.user_language', read_only=True)
    service_title = serializers.CharField(source='title', read_only=True)
    service_description = serializers.CharField(source='description', read_only=True)
    service_price = serializers.FloatField(source='price', read_only=True)
    service_category = serializers.CharField(source='category.name', read_only=True)
    service_subcategory = serializers.CharField(source='subcategory.name', read_only=True)
    service_nestedcategory = serializers.CharField(source='nestedcategory.name', read_only=True)
    service_image = serializers.ImageField(source='image', read_only=True)

    class Meta:
        model = Service
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)  # Ajuste aquí
    job_title = serializers.CharField(source='title', read_only=True)
    job_description = serializers.CharField(source='description', read_only=True)
    company_avatar = serializers.ImageField(source='company.company_avatar', read_only=True)
    company_language = serializers.CharField(source='company.company_language', read_only=True)
    company_location = serializers.CharField(source='company.company_location', read_only=True)
    job_category = serializers.CharField(source='category.name', read_only=True)
    job_subcategory = serializers.CharField(source='subcategory.name', read_only=True)
    job_nestedcategory = serializers.CharField(source='nestedcategory.name', read_only=True)
    job_image = serializers.ImageField(source='image', read_only=True)
    class Meta:
        model = Job
        fields = '__all__'
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'