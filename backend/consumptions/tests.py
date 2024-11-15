from django.test import TestCase
from accounts.models import User
from consumptions.models import ( 
    Motivation, 
    Unit, 
    Product, 
    TrackedProduct, 
    Consumption, 
    TrackingFrequency, )
from django.apps import apps
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
import random


User = apps.get_model('accounts', 'User')
Product = apps.get_model('consumptions', 'Product')
Unit = apps.get_model('consumptions', 'Unit')
Motivation = apps.get_model('consumptions', 'Motivation')
TrackingFrequency =apps.get_model('consumptions', 'TrackingFrequency')
TrackedProduct = apps.get_model('consumptions', 'TrackedProduct')
Consumption = apps.get_model('consumptions', 'Consumption')

class TrackedProductsListTest(TestCase):
    def setUp(self):
        # Test 1 utilisateur 1 liste de produits suivis
        self.user = User.objects.create_user(
            email="user@example.com",
            username="user@example.com",
            password="password123",
        )

        self.trackedProducts = [
            TrackedProduct.objects.create(
                user=self.user, 
                product=Product.objects.get(name="coffee"),
                unit=Unit.objects.get(name="count"),
                motivation=Motivation.objects.get(name="health"),
                tracking_frequency=TrackingFrequency.objects.get(name="weekly"),
                start_date=date.today() - relativedelta(months=4),
                end_date=None,
            ),
            TrackedProduct.objects.create(
                user = self.user, 
                product = Product.objects.get(name="alcohol"),
                unit = Unit.objects.get(name="count"),
                motivation = Motivation.objects.get(name="health"),
                tracking_frequency = TrackingFrequency.objects.get(name="monthly"),
                start_date = date.today()- relativedelta(months=1),
                end_date = None,
            ),
            TrackedProduct.objects.create(
                user = self.user, 
                product = Product.objects.get(name="car"),
                unit = Unit.objects.get(name="count"),
                motivation = Motivation.objects.get(name="ecology"),
                tracking_frequency = TrackingFrequency.objects.get(name="weekly"),
                start_date =  date.today()- relativedelta(months=4) - relativedelta(days=4),
                end_date = None,
            ),
        ]

        self.client = APIClient()
        self.tracked_products_list_url = reverse('user-products-list')
        self.client.login(username="user@example.com", password="password123")

    def test_user_product_lists_order_by_date(self):
        response = self.client.get(self.tracked_products_list_url)
    
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
        data = response.data['data']
        self.assertEqual(len(data), 3) 
        
        dates = []
        for trackedProduct in data:
            date_str = trackedProduct['start_date']
            date_obj = date.fromisoformat(date_str)
            dates.append(date_obj)
        
        self.assertEqual(dates, sorted(dates))


class ApiConsumptionsListByProductTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="user@example.com",
            username="user@example.com",
            password="password123",
        )

        self.trackedProduct = TrackedProduct.objects.create(
            user=self.user, 
            product=Product.objects.get(name="coffee"),
            unit=Unit.objects.get(name="count"),
            motivation=Motivation.objects.get(name="health"),
            tracking_frequency=TrackingFrequency.objects.get(name="weekly"),
            start_date=date.today() - relativedelta(months=4),
            end_date=None,
        )

        self.consumptions = []
        for _ in range(100):
            random_date = self.trackedProduct.start_date + timedelta(days=random.randint(0, (date.today() - self.trackedProduct.start_date).days))
            if not Consumption.objects.filter(tracked_product=self.trackedProduct,date=random_date):
                consumption = Consumption.objects.create(
                    tracked_product=self.trackedProduct,
                    quantity=round(random.uniform(0, 40), 1),
                    date=random_date
                )
                self.consumptions.append(consumption)

        self.client = APIClient()
        self.consumptions_list_url = reverse('consumptions-list-by-product', args=[self.trackedProduct.product.id])
        self.client.login(username="user@example.com", password="password123")

    def test_user_can_consult_all_consumptions(self):
        response = self.client.get(self.consumptions_list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(response.data['data']), len(self.consumptions))

        dates = [item['date'] for item in response.data['data']]
        self.assertEqual(dates, sorted(dates))
    

class ApiAddConsumption(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="user@example.com",
            username="user@example.com",
            password="password123",
        )
        self.product = Product.objects.get(name="coffee")
        self.client = APIClient()
        self.client.login(username="user@example.com", password="password123")
        self.add_consumption_url = reverse('add-consumption', args=[self.product.id])
        self.payload = {
            "date": date.today().isoformat(),
            "quantity": 5
        }

    def test_user_cannot_update_consumptions_of_untracked_products(self):
        response = self.client.post(self.add_consumption_url, data=self.payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_can_update_consumptions_of_today(self):
        self.trackedProduct = TrackedProduct.objects.create(
            user=self.user,
            product=self.product,
            unit=Unit.objects.get(name="count"),
            motivation=Motivation.objects.get(name="health"),
            tracking_frequency=TrackingFrequency.objects.get(name="weekly"),
            start_date=date.today() - relativedelta(months=4),
            end_date=None,
        )
        response = self.client.post(self.add_consumption_url, data=self.payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        self.assertTrue(Consumption.objects.filter(
            tracked_product=self.trackedProduct,
            date=self.payload["date"]
        ).exists())

    def test_user_can_update_consumptions_of_past(self):
        past_date = date.today() - relativedelta(months=2)
        self.payload = {
            "date": past_date.isoformat(),
            "quantity": 5
        }
        self.trackedProduct = TrackedProduct.objects.create(
            user=self.user,
            product=self.product,
            unit=Unit.objects.get(name="count"),
            motivation=Motivation.objects.get(name="health"),
            tracking_frequency=TrackingFrequency.objects.get(name="weekly"),
            start_date=date.today() - relativedelta(months=4),
            end_date=None,
        )
        response = self.client.post(self.add_consumption_url, data=self.payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        self.assertTrue(Consumption.objects.filter(
            tracked_product=self.trackedProduct,
            date=self.payload["date"]
        ).exists())

    def test_user_cannot_update_consumptions_of_futur(self):
        future_date = date.today() + relativedelta(months=2)
        self.payload = {
            "date": future_date.isoformat(),
            "quantity": 5
        }
        self.trackedProduct = TrackedProduct.objects.create(
            user=self.user,
            product=self.product,
            unit=Unit.objects.get(name="count"),
            motivation=Motivation.objects.get(name="health"),
            tracking_frequency=TrackingFrequency.objects.get(name="weekly"),
            start_date=date.today() - relativedelta(months=4),
            end_date=None,
        )
        response = self.client.post(self.add_consumption_url, data=self.payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_cannot_update_consumptions_outside_tracking_period(self):
        past_date = date.today() + relativedelta(months=2)
        self.payload = {
            "date": past_date.isoformat(),
            "quantity": 5
        }
        self.trackedProduct = TrackedProduct.objects.create(
            user=self.user,
            product=self.product,
            unit=Unit.objects.get(name="count"),
            motivation=Motivation.objects.get(name="health"),
            tracking_frequency=TrackingFrequency.objects.get(name="weekly"),
            start_date=date.today() - relativedelta(months=1),
            end_date=None,
        )
        response = self.client.post(self.add_consumption_url, data=self.payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)