from rest_framework import serializers
from .models import (
    Product,
    Unit,
    Motivation,
    Consumption,
    TrackedProduct,
    TrackingFrequency,
)


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "label"]


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ["id", "name", "label", "code"]


class MotivationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Motivation
        fields = ["id", "name", "label"]


class TrackingFrequencySerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackingFrequency
        fields = ["id", "name", "label"]


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
            "end_date",
        ]


class ConsumptionSerializer(serializers.ModelSerializer):
    tracked_product = TrackedProductSerializer()

    class Meta:
        model = Consumption
        fields = [
            "quantity",
            "date",
            "tracked_product",
        ]
