from django.db import migrations


def injectHabitMotivationTable(apps, schema_editor):
    Motivation = apps.get_model("consumptions", "Motivation")
    Habit = apps.get_model("consumptions", "Habit")

    motivations = Motivation.objects.all()
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
    for motivation in motivations:
        if motivation.name == "health":
            motivation.habits.add(
                *[coffee, alcohol, tobacco, meal_deliveries, meat, animal_products]
            )
        elif motivation.name == "money":
            motivation.habits.add(
                *[
                    shopping,
                    alcohol,
                    tobacco,
                    meal_deliveries,
                    bets,
                    meat,
                    car,
                    plane,
                    deliveries,
                ]
            )
        elif motivation.name == "ecology":
            motivation.habits.add(meat, coffee, shopping, car, deliveries)
        elif motivation.name == "ethics":
            motivation.habits.add(car, coffee, meal_deliveries, shopping, meat)


class Migration(migrations.Migration):
    dependencies = [
        ("consumptions", "0007_habits_units_populate"),
    ]

    operations = [
        migrations.RunPython(injectHabitMotivationTable),
    ]
