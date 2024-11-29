from django.db import migrations


def populate_motivations(apps, schema_editor):
    Motivation = apps.get_model("consumptions", "Motivation")

    Motivation.objects.bulk_create(
        [
            Motivation(name="health", label="Santé"),
            Motivation(name="money", label="Financier"),
            Motivation(name="ecology", label="Écologie"),
            Motivation(name="ethics", label="Éthique"),
        ]
    )


# Classe de migration
class Migration(migrations.Migration):
    # Dépendances, le cas échéant
    dependencies = [
        ("consumptions", "0004_units_populate"),
    ]

    operations = [
        migrations.RunPython(populate_motivations),
    ]
