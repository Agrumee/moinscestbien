from django.db import migrations


def injectProductMotivationTable(apps, schema_editor):
    Motivation = apps.get_model("consumptions", "Motivation")
    Product = apps.get_model("consumptions", "Product")

    motivations = Motivation.objects.all()
    coffee = Product.objects.get(name="coffee")
    alcohol = Product.objects.get(name="alcohol")
    tobacco = Product.objects.get(name="tobacco")
    meal_deliveries = Product.objects.get(name="meal_deliveries")
    bets = Product.objects.get(name="bets")
    meat = Product.objects.get(name="meat")
    car = Product.objects.get(name="car")
    shopping = Product.objects.get(name="shopping")
    for motivation in motivations:
        if motivation.name == "health":
            motivation.products.add(*[coffee, alcohol, tobacco, meal_deliveries, meat])
        elif motivation.name == "money":
            motivation.products.add(
                *[shopping, alcohol, tobacco, meal_deliveries, bets, meat, car]
            )
        elif motivation.name == "ecology":
            motivation.products.add(meat, coffee, shopping, car)
        elif motivation.name == "ethics":
            motivation.products.add(car, coffee, meal_deliveries, shopping, meat)


class Migration(migrations.Migration):
    dependencies = [
        ("consumptions", "0007_products_units_populate"),
    ]

    operations = [
        migrations.RunPython(injectProductMotivationTable),
    ]
