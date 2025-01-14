from django.db import connection
from django.core.management.base import BaseCommand
from django.core.management import call_command


class Command(BaseCommand):
    help = "Reset the database and apply migrations"

    def handle(self, *args, **kwargs):
        with connection.cursor() as cursor:
            cursor.execute("DROP SCHEMA public CASCADE; CREATE SCHEMA public;")

        call_command("migrate")

        self.stdout.write(
            self.style.SUCCESS("Database has been reset and migrations applied")
        )
