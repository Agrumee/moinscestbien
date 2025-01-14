from django.db import migrations


def injectHabitTable(apps, schema_editor):
    Habit = apps.get_model("consumptions", "Habit")

    Habit.objects.bulk_create(
        [
            Habit(name="alcohol", label="Alcool"),
            Habit(name="coffee", label="Café"),
            Habit(name="tobacco", label="Tabac"),
            Habit(name="bets", label="Paris sportifs"),
            Habit(name="shopping", label="Shopping"),
            Habit(name="meal-deliveries", label="Livraison de repas"),
            Habit(name="deliveries", label="Livraison à domicile"),
            Habit(name="meat", label="Viande"),
            Habit(name="animal-products", label="Produits d'origine animal"),
            Habit(name="car", label="Trajets en voiture"),
            Habit(name="plane", label="Trajets en avion"),
        ]
    )


class Migration(migrations.Migration):
    dependencies = [
        ("consumptions", "0005_motivations_populate"),
    ]

    operations = [
        migrations.RunPython(injectHabitTable),
    ]
