from rest_framework import serializers
from .models import Freelancer, Company

class FreelancerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    avatar = serializers.ImageField(required=False, allow_null=True)
    name = serializers.CharField(required=False, allow_blank=True)
    lastname = serializers.CharField(required=False, allow_blank=True)
    profile_completed = serializers.BooleanField(read_only=True)

    class Meta:
        model = Freelancer
        fields = ('id', 'email', 'password', 'name', 'lastname', 'phone', 'avatar', 'location', 'language', 'skills', 'experience', 'education', 'portfolio_link', 'linkedin_profile', 'github_profile', 'profile_completed')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        freelancer = Freelancer.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            lastname=validated_data.get('lastname', ''),
            phone=validated_data.get('phone', ''),
            avatar=validated_data.get('avatar', None),
            location=validated_data.get('location', ''),
            language=validated_data.get('language', 'es'),
            skills=validated_data.get('skills', ''),
            experience=validated_data.get('experience', ''),
            education=validated_data.get('education', ''),
            portfolio_link=validated_data.get('portfolio_link', ''),
            linkedin_profile=validated_data.get('linkedin_profile', ''),
            github_profile=validated_data.get('github_profile', '')
        )
        return freelancer

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class CompanySerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    company_avatar = serializers.ImageField(required=False, allow_null=True)
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
            company_avatar=validated_data.get('company_avatar', None),
            company_location=validated_data.get('company_location', ''),
            company_language=validated_data.get('company_language', 'es'),
            interests=validated_data.get('interests', '')
        )
        return company
