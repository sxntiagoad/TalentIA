# serializers.py
from rest_framework import serializers
from .models import Mensaje

class MensajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mensaje
        fields = '__all__'
