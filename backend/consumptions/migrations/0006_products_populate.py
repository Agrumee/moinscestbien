from django.db import migrations


def injectProductTable(apps, schema_editor):
    Product = apps.get_model("consumptions", "Product")

    products_names = [
        "alcohol",
        "coffee",
        "tobacco",
        "meal_deliveries",
        "bets",
        "shopping",
        "meat",
        "car",
    ]
    for product_name in products_names:
        Product.objects.create(name=product_name)


class Migration(migrations.Migration):
    dependencies = [
        ("consumptions", "0005_motivations_populate"),
    ]

    operations = [
        migrations.RunPython(injectProductTable),
    ]
