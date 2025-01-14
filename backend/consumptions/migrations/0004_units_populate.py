from django.db import migrations


def populate_units(apps, schema_editor):
    Unit = apps.get_model("consumptions", "Unit")

    Unit.objects.bulk_create(
        [
            Unit(name="cigarette", label="Cigarettes", code="cigarette"),
            Unit(
                name="pack-of-cigarettes", label="Paquet de cigarettes", code="paquet"
            ),
            Unit(name="euros", label="Euros", code="€"),
            Unit(name="glasses", label="Verres", code="verre"),
            Unit(name="kilometers", label="Kilomètres", code="km"),
            Unit(name="hours", label="Heures", code="h"),
            Unit(name="liters", label="Litres d'essence", code="L"),
            Unit(name="journeys", label="Trajets", code="trajet"),
            Unit(name="cups", label="Tasses", code="tasse"),
            Unit(name="deliveries", label="Livraisons", code="livraison"),
            Unit(name="bets", label="Paris", code="paris"),
            Unit(name="bought-habits", label="Produits achetés", code="produit"),
            Unit(name="meals", label="Repas", code="repas"),
            Unit(name="habits", label="Produits", code="produit"),
            Unit(name="kilogrammes", label="Kilogrammes", code="kg"),
        ]
    )


class Migration(migrations.Migration):
    dependencies = [
        ("consumptions", "0003_consumption"),
    ]

    operations = [
        migrations.RunPython(populate_units),
    ]
