from django.db import migrations


def injectHabitUnitTable(apps, schema_editor):
    Unit = apps.get_model("consumptions", "Unit")
    Habit = apps.get_model("consumptions", "Habit")

    units = Unit.objects.all()
    alcohol = Habit.objects.get(name="alcohol")
    coffee = Habit.objects.get(name="coffee")
    tobacco = Habit.objects.get(name="tobacco")
    bets = Habit.objects.get(name="bets")
    shopping = Habit.objects.get(name="shopping")
    meal_deliveries = Habit.objects.get(name="meal-deliveries")
    deliveries = Habit.objects.get(name="deliveries")
    meat = Habit.objects.get(name="meat")
    animal_products = Habit.objects.get(name="animal-products")
    car = Habit.objects.get(name="car")
    plane = Habit.objects.get(name="plane")

    for unit in units:
        if unit.name == "cigarette":
            unit.habits.add(tobacco)
        elif unit.name == "pack-of-cigarettes":
            unit.habits.add(tobacco)
        elif unit.name == "euros":
            unit.habits.add(
                *[
                    shopping,
                    alcohol,
                    tobacco,
                    meal_deliveries,
                    deliveries,
                    bets,
                    meat,
                    car,
                    plane,
                ]
            )
        elif unit.name == "glasses":
            unit.habits.add(alcohol)
        elif unit.name == "kilometers":
            unit.habits.add(*[car, plane])
        elif unit.name == "hours":
            unit.habits.add(*[car, plane])
        elif unit.name == "liters":
            unit.habits.add(car)
        elif unit.name == "journeys":
            unit.habits.add(*[car, plane])
        elif unit.name == "cups":
            unit.habits.add(coffee)
        elif unit.name == "deliveries":
            unit.habits.add(*[deliveries, meal_deliveries])
        elif unit.name == "bets":
            unit.habits.add(bets)
        elif unit.name == "bought-habits":
            unit.habits.add(shopping)
        elif unit.name == "meals":
            unit.habits.add(*[meal_deliveries, meat, animal_products])
        elif unit.name == "habit":
            unit.habits.add(*[meat, animal_products])
        elif unit.name == "kilogrammes":
            unit.habits.add(*[meat, animal_products])


class Migration(migrations.Migration):
    dependencies = [
        ("consumptions", "0006_habits_populate"),
    ]

    operations = [
        migrations.RunPython(injectHabitUnitTable),
    ]
