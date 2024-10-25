# reset_db_command.py

import os
import django

# Définissez les paramètres d'environnement Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'moinscestbien.settings')
django.setup()

# Importez les modules Django nécessaires pour les opérations sur la base de données
from django.db import connection
from django.core.management.base import BaseCommand
from django.core.management import call_command

class Command(BaseCommand):
    help = 'Reset the database and apply migrations'

    def handle(self, *args, **kwargs):
        # Supprimez toutes les tables de la base de données
        with connection.cursor() as cursor:
            cursor.execute("DROP SCHEMA public CASCADE; CREATE SCHEMA public;")

        # Recréez le schéma de la base de données et appliquez les migrations
        call_command('migrate')

        # Appel à d'autres commandes si nécessaire, par exemple :
        # call_command('populate_users', 10)

        self.stdout.write(self.style.SUCCESS('Database has been reset and migrations applied'))