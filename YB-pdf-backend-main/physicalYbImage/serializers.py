from rest_framework import serializers
from .models import idData

class idDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = idData
        fields = '__all__'