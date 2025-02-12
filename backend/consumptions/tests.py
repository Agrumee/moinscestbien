from django.test import TestCase
from accounts.models import User
from consumptions.models import (
    Motivation,
    Unit,
    Habit,
    TrackedHabit,
    Consumption,
    TrackingFrequency,
)
from django.apps import apps
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
import random


User = apps.get_model("accounts", "User")
Habit = apps.get_model("consumptions", "Habit")
Unit = apps.get_model("consumptions", "Unit")
Motivation = apps.get_model("consumptions", "Motivation")
TrackingFrequency = apps.get_model("consumptions", "TrackingFrequency")
TrackedHabit = apps.get_model("consumptions", "TrackedHabit")
Consumption = apps.get_model("consumptions", "Consumption")


class TrackedHabitsListTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="user@example.com",
            username="user@example.com",
            password="password123",
        )

        self.trackedHabits = [
            TrackedHabit.objects.create(
                user=self.user,
                habit=Habit.objects.get(name="coffee"),
                unit=Unit.objects.get(name="cups"),
                motivation=Motivation.objects.get(name="health"),
                tracking_frequency=TrackingFrequency.objects.get(name="weekly"),
                start_date=date.today() - relativedelta(months=4),
                end_date=None,
            ),
            TrackedHabit.objects.create(
                user=self.user,
                habit=Habit.objects.get(name="alcohol"),
                unit=Unit.objects.get(name="glasses"),
                motivation=Motivation.objects.get(name="health"),
                tracking_frequency=TrackingFrequency.objects.get(name="monthly"),
                start_date=date.today() - relativedelta(months=1),
                end_date=None,
            ),
            TrackedHabit.objects.create(
                user=self.user,
                habit=Habit.objects.get(name="car"),
                unit=Unit.objects.get(name="kilometers"),
                motivation=Motivation.objects.get(name="ecology"),
                tracking_frequency=TrackingFrequency.objects.get(name="weekly"),
                start_date=date.today()
                - relativedelta(months=4)
                - relativedelta(days=4),
                end_date=None,
            ),
            TrackedHabit.objects.create(
                user=self.user,
                habit=Habit.objects.get(name="bets"),
                unit=Unit.objects.get(name="euros"),
                motivation=Motivation.objects.get(name="money"),
                tracking_frequency=TrackingFrequency.objects.get(name="weekly"),
                start_date=date.today() - relativedelta(days=4),
                end_date=date.today() - relativedelta(days=2),
            ),
        ]

        self.client = APIClient()
        self.tracked_habits_url = reverse("tracked-habits")
        self.client.login(username="user@example.com", password="password123")

    def test_user_habit_lists_order_by_date(self):
        response = self.client.get(self.tracked_habits_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data["data"]
        self.assertEqual(len(data), 3)

        dates = []
        for trackedHabit in data:
            date_str = trackedHabit["start_date"]
            date_obj = date.fromisoformat(date_str)
            dates.append(date_obj)

        self.assertEqual(dates, sorted(dates))


class ApiConsumptionsListByHabitTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="user@example.com",
            username="user@example.com",
            password="password123",
        )

        self.trackedHabit = TrackedHabit.objects.create(
            user=self.user,
            habit=Habit.objects.get(name="coffee"),
            unit=Unit.objects.get(name="cups"),
            motivation=Motivation.objects.get(name="health"),
            tracking_frequency=TrackingFrequency.objects.get(name="weekly"),
            start_date=date.today() - relativedelta(months=4),
            end_date=None,
        )

        self.consumptions = []
        for _ in range(100):
            random_date = self.trackedHabit.start_date + timedelta(
                days=random.randint(
                    0, (date.today() - self.trackedHabit.start_date).days
                )
            )
            if not Consumption.objects.filter(
                tracked_habit=self.trackedHabit, date=random_date
            ):
                consumption = Consumption.objects.create(
                    tracked_habit=self.trackedHabit,
                    quantity=round(random.uniform(0, 40), 1),
                    date=random_date,
                )
                self.consumptions.append(consumption)

        self.client = APIClient()
        self.consumptions_url = reverse(
            "consumptions-by-habit", args=[self.trackedHabit.id]
        )
        self.client.login(username="user@example.com", password="password123")

    def test_user_can_consult_all_consumptions(self):
        response = self.client.get(self.consumptions_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(response.data["data"]), len(self.consumptions))

        dates = [item["date"] for item in response.data["data"]]
        self.assertEqual(dates, sorted(dates))


class ApiAddConsumption(TestCase):
    def setUp(self):
        self.habit = Habit.objects.get(name="coffee")
        self.user = User.objects.create_user(
            email="user@example.com",
            username="user@example.com",
            password="password123",
        )

        self.user_tracked_habit = TrackedHabit.objects.create(
            user=self.user,
            habit=self.habit,
            unit=Unit.objects.get(name="cups"),
            motivation=Motivation.objects.get(name="health"),
            tracking_frequency=TrackingFrequency.objects.get(name="weekly"),
            start_date=date.today() - relativedelta(months=4),
        )

        self.other_user = User.objects.create_user(
            email="other_user@example.com",
            username="other_user@example.com",
            password="password123",
        )

        self.other_user_tracked_habit = TrackedHabit.objects.create(
            user=self.other_user,
            habit=self.habit,
            unit=Unit.objects.get(name="cups"),
            motivation=Motivation.objects.get(name="health"),
            tracking_frequency=TrackingFrequency.objects.get(name="weekly"),
            start_date=date.today() - relativedelta(months=4),
        )

        self.client = APIClient()
        self.client.login(username="user@example.com", password="password123")
        self.add_user_consumption_url = reverse(
            "add-consumption", args=[self.user_tracked_habit.id]
        )
        self.add_other_user_consumption_url = reverse(
            "add-consumption", args=[self.other_user_tracked_habit.id]
        )
        self.payload = {"date": date.today().isoformat(), "quantity": 5}

    def test_user_cannot_update_consumptions_of_habit_tracked_by_another_user(self):
        response = self.client.post(
            self.add_other_user_consumption_url, data=self.payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_can_update_consumptions_of_today(self):
        response = self.client.post(
            self.add_user_consumption_url, data=self.payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertTrue(
            Consumption.objects.filter(
                tracked_habit=self.user_tracked_habit, date=self.payload["date"]
            ).exists()
        )

    def test_user_can_update_consumptions_of_past(self):
        past_date = date.today() - relativedelta(months=2)
        self.payload = {"date": past_date.isoformat(), "quantity": 5}
        response = self.client.post(
            self.add_user_consumption_url, data=self.payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertTrue(
            Consumption.objects.filter(
                tracked_habit=self.user_tracked_habit, date=self.payload["date"]
            ).exists()
        )

    def test_user_cannot_update_consumptions_of_futur(self):
        future_date = date.today() + relativedelta(months=2)
        self.payload = {"date": future_date.isoformat(), "quantity": 5}
        response = self.client.post(
            self.add_user_consumption_url, data=self.payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_cannot_update_consumptions_outside_tracking_period(self):
        past_date = date.today() - relativedelta(months=6)
        self.payload = {"date": past_date.isoformat(), "quantity": 5}
        response = self.client.post(
            self.add_user_consumption_url, data=self.payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class DeleteTrackedHabitTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@test.test",
            username="username",
            password="password123",
        )
        self.trackedHabit = TrackedHabit.objects.create(
            user=self.user,
            habit=Habit.objects.get(name="coffee"),
            unit=Unit.objects.get(name="cups"),
            motivation=Motivation.objects.get(name="health"),
            tracking_frequency=TrackingFrequency.objects.get(name="weekly"),
            start_date=date.today() - relativedelta(months=4),
            end_date=None,
        )
        self.client = APIClient()
        self.client.login(username="username", password="password123")
        self.delete_tracked_habit_url = reverse(
            "delete-tracked-habit", args=[self.trackedHabit.id]
        )

    def test_user_can_delete_tracked_habit(self):
        response = self.client.delete(self.delete_tracked_habit_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(TrackedHabit.objects.count(), 0)


class ApiCreateTrackedHabitTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="user@example.com",
            username="user@example.com",
            password="password123",
        )

        self.habit = Habit.objects.create(name="coffee")
        self.unit = Unit.objects.create(name="cups")
        self.motivation = Motivation.objects.create(name="health")
        self.tracking_frequency = TrackingFrequency.objects.create(name="weekly")

        self.client = APIClient()
        self.client.login(username="user@example.com", password="password123")

        self.add_habit_url = reverse("tracked-habits")

    def test_user_can_add_habit(self):
        data = {
            "habit_id": self.habit.id,
            "unit_id": self.unit.id,
            "motivation_id": self.motivation.id,
            "tracking_frequency_id": self.tracking_frequency.id,
        }

        response = self.client.post(self.add_habit_url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("success", response.data)
        self.assertEqual(TrackedHabit.objects.count(), 1)
        self.assertEqual(TrackedHabit.objects.first().habit, self.habit)

    def test_user_can_add_untracked_habit_anymore(self):
        # Create a previously tracked habit with an end date in the past
        self.tracked_habit = TrackedHabit.objects.create(
            user=self.user,
            habit=self.habit,
            unit=self.unit,
            motivation=self.motivation,
            tracking_frequency=self.tracking_frequency,
            end_date=date.today() - relativedelta(months=4),
        )

        data = {
            "habit_id": self.habit.id,
            "unit_id": self.unit.id,
            "motivation_id": self.motivation.id,
            "tracking_frequency_id": self.tracking_frequency.id,
        }

        response = self.client.post(self.add_habit_url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("success", response.data)
        self.assertEqual(TrackedHabit.objects.count(), 1)
        self.assertEqual(TrackedHabit.objects.first().habit, self.habit)

    def test_user_cannot_add_habit_already_assigned(self):
        self.tracked_habit = TrackedHabit.objects.create(
            user=self.user,
            habit=self.habit,
            unit=self.unit,
            motivation=self.motivation,
            tracking_frequency=self.tracking_frequency,
            end_date=None,
        )

        data = {
            "habit_id": self.habit.id,
            "unit_id": self.unit.id,
            "motivation_id": self.motivation.id,
            "tracking_frequency_id": self.tracking_frequency.id,
        }

        response = self.client.post(self.add_habit_url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already assigned", response.data["message"])


class ApiPauseTrackedHabitTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="user@example.com",
            username="user@example.com",
            password="password123",
        )

        self.habit = Habit.objects.create(name="coffee")
        self.unit = Unit.objects.create(name="cups")
        self.motivation = Motivation.objects.create(name="health")
        self.tracking_frequency = TrackingFrequency.objects.create(name="weekly")

        self.client = APIClient()
        self.client.login(username="user@example.com", password="password123")

        self.trackedHabit = TrackedHabit.objects.create(
            user=self.user,
            habit=self.habit,
            unit=self.unit,
            motivation=self.motivation,
            tracking_frequency=self.tracking_frequency,
            start_date=date.today() - relativedelta(months=4),
            end_date=None,
        )

        self.pause_tracked_habit_url = reverse(
            "pause-tracked-habit", args=[self.trackedHabit.id]
        )

    def test_user_can_pause_tracked_habit(self):
        response = self.client.patch(self.pause_tracked_habit_url)
        self.trackedHabit.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(self.trackedHabit.end_date)


class ApiUnpauseTrackedHabitTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="user@example.com",
            username="user@example.com",
            password="password123",
        )

        self.habit = Habit.objects.create(name="coffee")
        self.unit = Unit.objects.create(name="cups")
        self.motivation = Motivation.objects.create(name="health")
        self.tracking_frequency = TrackingFrequency.objects.create(name="weekly")

        self.client = APIClient()
        self.client.login(username="user@example.com", password="password123")

        self.trackedHabit = TrackedHabit.objects.create(
            user=self.user,
            habit=self.habit,
            unit=self.unit,
            motivation=self.motivation,
            tracking_frequency=self.tracking_frequency,
            start_date=date.today() - relativedelta(months=4),
            end_date=date.today(),
        )

        self.unpause_tracked_habit_url = reverse(
            "unpause-tracked-habit", args=[self.trackedHabit.id]
        )

    def test_user_can_unpause_tracked_habit(self):
        response = self.client.patch(self.unpause_tracked_habit_url)
        self.trackedHabit.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNone(self.trackedHabit.end_date)
