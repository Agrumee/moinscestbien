from django.db import migrations


def populate_units(apps, schema_editor):
    Unit = apps.get_model("consumptions", "Unit")

    Unit.objects.bulk_create(
        [
            Unit(name="count"),
            Unit(name="euros"),
            Unit(name="grams"),
            Unit(name="kilometers"),
        ]
    )


class Migration(migrations.Migration):
    dependencies = [
        ("consumptions", "0003_consumption"),
    ]

    operations = [
        migrations.RunPython(populate_units),
    ]
