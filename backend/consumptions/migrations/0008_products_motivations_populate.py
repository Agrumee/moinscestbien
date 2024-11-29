from django.db import migrations


def injectProductMotivationTable(apps, schema_editor):
    Motivation = apps.get_model("consumptions", "Motivation")
    Product = apps.get_model("consumptions", "Product")

    motivations = Motivation.objects.all()
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
    for motivation in motivations:
        if motivation.name == "health":
            motivation.products.add(
                *[coffee, alcohol, tobacco, meal_deliveries, meat, animal_products]
            )
        elif motivation.name == "money":
            motivation.products.add(
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
            motivation.products.add(meat, coffee, shopping, car, deliveries)
        elif motivation.name == "ethics":
            motivation.products.add(car, coffee, meal_deliveries, shopping, meat)


class Migration(migrations.Migration):
    dependencies = [
        ("consumptions", "0007_products_units_populate"),
    ]

    operations = [
        migrations.RunPython(injectProductMotivationTable),
    ]
