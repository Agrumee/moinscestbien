from django.db import migrations


def injectProductMotivationTable(apps, schema_editor):
    Product = apps.get_model('consumptions', 'Product')
    # On a besoin de créer les produits que nous allons permettre aux utilisateurs de suivre : 
    # Alcool - Santé/pécunier/ecologie/ethique
    # Café - santé/écologie/pécunier ?/éthique
    # Tabac -santé/éthique/écologique/pécunier
    # Livraison de repas à domicile (Uber eats) - santé/éthique/écologique ?/éthique
    # Paris sportifs santé/éthique ?/écologie ?/pécunier
    # Vêtements éthique/écologie/pécunier
    # Viande éthique/écologie/pécunier
    # Voyages/Trajets écologie/pécunier/santé
    # Motivation(name='health'),
    #     Motivation(name='money'),
    #     Motivation(name='ecology'),
    #     Motivation(name='ethics'),

    products_names = ["alcohol", "coffee", "tobacco", "meal_deliveries", "bets", "shopping", "meat", "car"]
    for product_name in products_names :
        Product.objects.create(
            name=product_name
        )

class Migration(migrations.Migration):
    dependencies = [
        ('consumptions', '0005_products_populate'),
    ]

    operations = [
        migrations.RunPython(injectProductMotivationTable),
    ]
