from rest_framework import serializers
from .models import (
    Habit,
    Unit,
    Motivation,
    Consumption,
    TrackedHabit,
    TrackingFrequency,
)


class HabitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
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


class TrackedHabitSerializer(serializers.ModelSerializer):
    habit = HabitSerializer()
    unit = UnitSerializer()
    motivation = MotivationSerializer()
    tracking_frequency = TrackingFrequencySerializer()

    class Meta:
        model = TrackedHabit
        fields = [
            "id",
            "habit",
            "unit",
            "motivation",
            "tracking_frequency",
            "start_date",
            "end_date",
        ]


class ConsumptionSerializer(serializers.ModelSerializer):
    tracked_habit = TrackedHabitSerializer()

    class Meta:
        model = Consumption
        fields = [
            "quantity",
            "date",
            "tracked_habit",
        ]
