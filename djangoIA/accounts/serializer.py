from rest_framework import serializers
from .models import Freelancer, Company

class FreelancerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    avatar = serializers.ImageField(required=False)
    name = serializers.CharField(required=False, allow_blank=True)
    lastname = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Freelancer
        fields = ('id', 'email', 'password', 'name', 'lastname', 'role', 'phone', 'information', 'avatar', 'location', 'language', 'interests')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        freelancer = Freelancer.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            lastname=validated_data.get('lastname', ''),
            role=validated_data.get('role', ''),
            phone=validated_data.get('phone', ''),
            information=validated_data.get('information', ''),
            avatar=validated_data.get('avatar'),
            location=validated_data.get('location', ''),
            language=validated_data.get('language', 'es'),
            interests=validated_data.get('interests', '')
        )
        return freelancer

class CompanySerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    company_avatar = serializers.ImageField(required=False)
    name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Company
        fields = ('id', 'email', 'password', 'name', 'phone', 'information', 'company_avatar', 'company_location', 'company_language', 'interests')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        company = Company.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            phone=validated_data.get('phone', ''),
            information=validated_data.get('information', ''),
            company_avatar=validated_data.get('company_avatar'),
            company_location=validated_data.get('company_location', ''),
            company_language=validated_data.get('company_language', 'es'),
            interests=validated_data.get('interests', '')
        )
        return company