from django.db import migrations


def injectProductUnitTable(apps, schema_editor):
    Unit = apps.get_model("consumptions", "Unit")
    Product = apps.get_model("consumptions", "Product")

    units = Unit.objects.all()
    coffee = Product.objects.get(name="coffee")
    alcohol = Product.objects.get(name="alcohol")
    tobacco = Product.objects.get(name="tobacco")
    meal_deliveries = Product.objects.get(name="meal_deliveries")
    bets = Product.objects.get(name="bets")
    meat = Product.objects.get(name="meat")
    car = Product.objects.get(name="car")
    shopping = Product.objects.get(name="shopping")
    for unit in units:
        if unit.name == "count":
            unit.products.add(
                *[coffee, alcohol, tobacco, meal_deliveries, bets, meat, car]
            )
        elif unit.name == "euros":
            unit.products.add(
                *[shopping, alcohol, tobacco, meal_deliveries, bets, meat, car]
            )
        elif unit.name == "grams":
            unit.products.add(meat)
        elif unit.name == "kilometers":
            unit.products.add(car)


class Migration(migrations.Migration):
    dependencies = [
        ("consumptions", "0006_products_populate"),
    ]

    operations = [
        migrations.RunPython(injectProductUnitTable),
    ]
