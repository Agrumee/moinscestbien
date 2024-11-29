# Generated by Django 5.0 on 2024-10-04 08:58

from django.db import migrations, models


def populate_tracking_frequencies(apps, schema_editor):
    TrackingFrequency = apps.get_model("consumptions", "TrackingFrequency")

    TrackingFrequency.objects.bulk_create(
        [
            TrackingFrequency(name="daily", label="Jour"),
            TrackingFrequency(name="weekly", label="Semaine"),
            TrackingFrequency(name="monthly", label="Mois"),
        ]
    )


class Migration(migrations.Migration):
    dependencies = [
        ("consumptions", "0008_products_motivations_populate"),
    ]

    operations = [
        migrations.CreateModel(
            name="TrackingFrequency",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("label", models.CharField(max_length=100)),
            ],
        ),
        migrations.RunPython(populate_tracking_frequencies),
    ]
