from django.db import migrations


def injectProductUnitTable(apps, schema_editor):
    Unit = apps.get_model("consumptions", "Unit")
    Product = apps.get_model("consumptions", "Product")

    units = Unit.objects.all()
    alcohol = Product.objects.get(name="alcohol")
    coffee = Product.objects.get(name="coffee")
    tobacco = Product.objects.get(name="tobacco")
    bets = Product.objects.get(name="bets")
    shopping = Product.objects.get(name="shopping")
    meal_deliveries = Product.objects.get(name="meal-deliveries")
    deliveries = Product.objects.get(name="deliveries")
    meat = Product.objects.get(name="meat")
    animal_products = Product.objects.get(name="animal-products")
    car = Product.objects.get(name="car")
    plane = Product.objects.get(name="plane")

    for unit in units:
        if unit.name == "cigarette":
            unit.products.add(tobacco)
        elif unit.name == "pack-of-cigarettes":
            unit.products.add(tobacco)
        elif unit.name == "euros":
            unit.products.add(
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
            unit.products.add(alcohol)
        elif unit.name == "kilometers":
            unit.products.add(*[car, plane])
        elif unit.name == "hours":
            unit.products.add(*[car, plane])
        elif unit.name == "liters":
            unit.products.add(car)
        elif unit.name == "journeys":
            unit.products.add(*[car, plane])
        elif unit.name == "cups":
            unit.products.add(coffee)
        elif unit.name == "deliveries":
            unit.products.add(*[deliveries, meal_deliveries])
        elif unit.name == "bets":
            unit.products.add(bets)
        elif unit.name == "bought-products":
            unit.products.add(shopping)
        elif unit.name == "meals":
            unit.products.add(*[meal_deliveries, meat, animal_products])
        elif unit.name == "product":
            unit.products.add(*[meat, animal_products])
        elif unit.name == "kilogrammes":
            unit.products.add(*[meat, animal_products])


class Migration(migrations.Migration):
    dependencies = [
        ("consumptions", "0006_products_populate"),
    ]

    operations = [
        migrations.RunPython(injectProductUnitTable),
    ]
