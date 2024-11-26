from django.db import migrations


def injectProductTable(apps, schema_editor):
    Product = apps.get_model("consumptions", "Product")

    Product.objects.bulk_create(
        [
            Product(name="alcohol", label="Alcool"),
            Product(name="coffee", label="Café"),
            Product(name="tobacco", label="Tabac"),
            Product(name="bets", label="Paris sportifs"),
            Product(name="shopping", label="Shopping"),
            Product(name="meal-deliveries", label="Livraison de repas"),
            Product(name="deliveries", label="Livraison à domicile"),
            Product(name="meat", label="Viande"),
            Product(name="animal-products", label="Produits d'origine animal"),
            Product(name="car", label="Trajets en voiture"),
            Product(name="plane", label="Trajets en avion"),
        ]
    )


class Migration(migrations.Migration):
    dependencies = [
        ("consumptions", "0005_motivations_populate"),
    ]

    operations = [
        migrations.RunPython(injectProductTable),
    ]
