from rest_framework import serializers
from .models import Freelancer, Company

class FreelancerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    avatar = serializers.ImageField(required=False)
    name = serializers.CharField(required=False, allow_blank=True)
    lastname = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Freelancer
        fields = ('id', 'email', 'password', 'name', 'lastname', 'phone', 'avatar', 'location', 'language', 'skills', 'experience', 'education', 'hourly_rate', 'availability', 'portfolio_link', 'linkedin_profile', 'github_profile')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        freelancer = Freelancer.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            lastname=validated_data.get('lastname', ''),
            phone=validated_data.get('phone', ''),
            avatar=validated_data.get('avatar'),
            location=validated_data.get('location', ''),
            language=validated_data.get('language', 'es'),
            skills=validated_data.get('skills', ''),
            experience=validated_data.get('experience', ''),
            education=validated_data.get('education', ''),
            hourly_rate=validated_data.get('hourly_rate'),
            availability=validated_data.get('availability', ''),
            portfolio_link=validated_data.get('portfolio_link', ''),
            linkedin_profile=validated_data.get('linkedin_profile', ''),
            github_profile=validated_data.get('github_profile', '')
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