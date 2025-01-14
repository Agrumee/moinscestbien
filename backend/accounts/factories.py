import factory
from faker import Faker
from django.utils.crypto import get_random_string
from django.utils.timezone import datetime
import random
from accounts.models import User
from consumptions.models import Habit, TrackedHabit, TrackingFrequency
import uuid
from datetime import date, timedelta

fake = Faker()


def random_start_date():
    today = date.today()
    # Calculer une date 6 mois avant aujourd'hui
    six_months_ago = today.month - 6
    year = today.year
    if six_months_ago <= 0:  # Ajuster l'année et le mois si nécessaire
        six_months_ago += 12
        year -= 1
    # Calculer le jour en évitant les dépassements de fin de mois
    day = min(today.day, (date(year, six_months_ago + 1, 1) - timedelta(days=1)).day)
    return date(year, six_months_ago, day)


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    id = factory.LazyAttribute(lambda _: uuid.uuid4())
    email = factory.LazyAttribute(lambda _: fake.email())
    username = factory.SelfAttribute("email")
    first_name = factory.LazyAttribute(lambda _: fake.first_name())
    last_name = factory.LazyAttribute(lambda _: fake.last_name())
    password = factory.PostGenerationMethodCall("set_password", "password")

    @factory.post_generation
    def tracked_habits(self, create, extracted, **kwargs):
        habits = Habit.objects.order_by("?")[:3]
        tracking_frequencies = list(TrackingFrequency.objects.all())
        TrackedHabit.objects.bulk_create(
            [
                TrackedHabit(
                    user=self,
                    habit=habit,
                    unit=habit.units.first(),
                    motivation=habit.motivations.first(),
                    tracking_frequency=random.choice(tracking_frequencies),
                    start_date=random_start_date(),
                )
                for habit in habits
            ]
        )

    @factory.post_generation
    def consumptions(self, create, extracted, **kwargs):
        endDate = date.today()
        for tracked_habit in self.tracked_habits.all():
            currentDate = random_start_date()
            while currentDate <= endDate:
                tracked_habit.consumptions.create(
                    quantity=random.randint(1, 100), date=currentDate
                )
                currentDate += timedelta(days=1)
