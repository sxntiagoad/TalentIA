from rest_framework import serializers
from .models import *
from authentication.models import CustomUser

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
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(type_user='freelancer'))
    user_avatar = serializers.SerializerMethodField()
    service_image = serializers.SerializerMethodField()
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

    def get_user_avatar(self, obj):
        request = self.context.get('request')
        if request and obj.user.user_avatar:
            return request.build_absolute_uri(obj.user.user_avatar.url)
        return None

    def get_service_image(self, obj):
        request = self.context.get('request')
        if request and obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')

        if request:
            for field in ['image', 'user_avatar', 'service_image']:
                if representation.get(field):
                    representation[field] = request.build_absolute_uri(representation[field])

        return representation

    class Meta:
        model = Service
        fields = [
            'id', 'user', 'category', 'subcategory', 'nestedcategory', 'title', 'description', 
            'price', 'image', 'user_avatar', 'service_image', 
            'user_name', 'user_location', 'user_lastname', 'user_language', 'service_title', 
            'service_description', 'service_price', 'service_category', 'service_subcategory', 
            'service_nestedcategory', 'availability', 'location'
        ]
        read_only_fields = ['user_avatar', 'service_image', 'user_name', 'user_location', 'user_lastname', 'user_language']
        def create(self, validated_data):
            user = self.context['request'].user
            service = Service.objects.create(user=user, **validated_data)
            return service
    def validate_user(self, value):
        if value.type_user != 'freelancer':
            raise serializers.ValidationError("Solo los freelancers pueden publicar servicios")
        return value
        
class JobSerializer(serializers.ModelSerializer):
    company_avatar = serializers.SerializerMethodField()
    job_image = serializers.SerializerMethodField()
    company_name = serializers.CharField(source='company.name', read_only=True)
    job_title = serializers.CharField(source='title', read_only=True)
    job_description = serializers.CharField(source='description', read_only=True)
    company_language = serializers.CharField(source='company.company_language', read_only=True)
    company_location = serializers.CharField(source='company.company_location', read_only=True)
    job_category = serializers.CharField(source='category.name', read_only=True)
    job_subcategory = serializers.CharField(source='subcategory.name', read_only=True)
    job_nestedcategory = serializers.CharField(source='nestedcategory.name', read_only=True)

    def get_company_avatar(self, obj):
        request = self.context.get('request')
        if request and obj.company.company_avatar:
            return request.build_absolute_uri(obj.company.company_avatar.url)
        return None

    def get_job_image(self, obj):
        request = self.context.get('request')
        if request and obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')

        if request:
            for field in ['image', 'company_avatar', 'job_image']:
                if representation.get(field):
                    representation[field] = request.build_absolute_uri(representation[field])

        return representation

    class Meta:
        model = Job
        fields = '__all__'
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'