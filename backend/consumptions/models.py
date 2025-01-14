from django.db import models
from datetime import date


class Motivation(models.Model):
    name = models.CharField(max_length=100)
    label = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Unit(models.Model):
    name = models.CharField(max_length=100)
    label = models.CharField(max_length=100)
    code = models.CharField(max_length=24)

    def __str__(self):
        return self.name


class Habit(models.Model):
    name = models.CharField(max_length=100)
    label = models.CharField(max_length=100)
    motivations = models.ManyToManyField(Motivation, related_name="habits")
    units = models.ManyToManyField(Unit, related_name="habits")

    def __str__(self):
        return self.name


class TrackedHabit(models.Model):
    class Meta:
        unique_together = ("user", "habit", "unit")

    user = models.ForeignKey(
        "accounts.User", related_name="tracked_habits", on_delete=models.CASCADE
    )
    habit = models.ForeignKey(
        Habit, related_name="tracked_habits", on_delete=models.CASCADE
    )
    unit = models.ForeignKey(
        Unit, related_name="tracked_habits", on_delete=models.CASCADE
    )
    motivation = models.ForeignKey(
        Motivation,
        related_name="tracked_habits",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    tracking_frequency = models.ForeignKey(
        "TrackingFrequency",
        related_name="tracked_habits",
        on_delete=models.CASCADE,
        default=1,
    )
    start_date = models.DateField(default=date.today)
    end_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.user} - {self.habit}"


class Consumption(models.Model):
    class Meta:
        unique_together = ("tracked_habit", "date")

    tracked_habit = models.ForeignKey(
        TrackedHabit, related_name="consumptions", on_delete=models.CASCADE
    )
    quantity = models.FloatField()
    date = models.DateField()

    def __str__(self):
        return f" {self.tracked_habit} - {self.quantity} - {self.date} "


class TrackingFrequency(models.Model):
    name = models.CharField(max_length=100)
    label = models.CharField(max_length=100)

    def __str__(self):
        return self.name
