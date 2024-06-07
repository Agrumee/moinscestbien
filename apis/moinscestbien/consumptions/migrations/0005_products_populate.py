from django.db import migrations


def injectProductTable(apps, schema_editor):
    Product = apps.get_model('consumptions', 'Product')
    # On a besoin de créer les produits que nous allons permettre aux utilisateurs de suivre : 
    # Alcool
    # Café
    # Tabac
    # Livraison de repas à domicile (Uber eats)
    # Paris sportifs
    # Vêtements
    # Viande
    # Voyages/Trajets

    products_names = ["alcool", "coffee", "tobacco", "meal deliveries", "sports betting", "shopping", "meat", "car trips"]
    for product_name in products_names :
        Product.objects.create(
            name=product_name
        )

class Migration(migrations.Migration):
    dependencies = [
        ('consumptions', '0004_motivations_populate'),
    ]

    operations = [
        migrations.RunPython(injectProductTable),
    ]
