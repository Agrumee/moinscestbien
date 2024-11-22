from django.core.management.base import BaseCommand
from accounts.factories import UserFactory
from accounts.models import User


class Command(BaseCommand):
    help = "Populate the database with fake users"

    def add_arguments(self, parser):
        parser.add_argument("count", type=int, help="The number of users to create")
        parser.add_argument(
            "--reset", action="store_true", help="Reset the database before populating"
        )

    def handle(self, *args, **kwargs):
        count = kwargs["count"]
        reset = kwargs["reset"]

        if reset:
            User.objects.all().delete()
            self.stdout.write(self.style.SUCCESS("Database has been reset"))

        for _ in range(count):
            UserFactory.create()

        self.stdout.write(self.style.SUCCESS(f"{count} users have been created"))
