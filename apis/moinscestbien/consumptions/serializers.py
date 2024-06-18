from rest_framework import serializers
from .models import Product, Unit

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['name']

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ['name']