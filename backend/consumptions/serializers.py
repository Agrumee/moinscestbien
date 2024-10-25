from rest_framework import serializers
from .models import Product, Unit, Consumption, TrackedProduct, TrackingFrequency

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name']

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ['id', 'name']

class MotivationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ['id', 'name']

class TrackingFrequencySerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackingFrequency
        fields = ['id', 'name']

class ConsumptionSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()

    class Meta:
        model = Consumption
        fields = [
            "quantity",
            "date",
            "product",  
        ]

    def get_product(self, obj):
        return obj.tracked_product.product.name
    
class TrackedProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    unit = UnitSerializer()
    motivation = MotivationSerializer()
    tracking_frequency = TrackingFrequencySerializer()

    class Meta:
        model = TrackedProduct
        fields = [
            "id",
            "product",
            "unit",
            "motivation",
            "tracking_frequency",
            "start_date",
            "end_date"
        ]