from django.db import migrations

def populate_motivations(apps, schema_editor):
    Motivation = apps.get_model('consumptions', 'Motivation')
    
    Motivation.objects.bulk_create([
        Motivation(name='health'),
        Motivation(name='money'),
        Motivation(name='ecology'),
        Motivation(name='ethics'),
    ])

# Classe de migration
class Migration(migrations.Migration):
    # Dépendances, le cas échéant
    dependencies = [
        ('consumptions', '0003_units_populate'),
    ]

    operations = [
        migrations.RunPython(populate_motivations),
    ]