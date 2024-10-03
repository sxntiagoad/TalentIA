from rest_framework import serializers
from django.contrib.auth.models import User
from .models import CustomUser, Company, Freelancer

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['type_user']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    custom_user = CustomUserSerializer(source='customuser', required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'custom_user']

    def create(self, validated_data):
        custom_user_data = validated_data.pop('customuser', {})
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        CustomUser.objects.create(user=user, **custom_user_data)
        return user

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        custom_user = instance.customuser
        ret['custom_user'] = CustomUserSerializer(custom_user).data
        return ret

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['company_name']

class FreelancerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Freelancer
        fields = ['skills']