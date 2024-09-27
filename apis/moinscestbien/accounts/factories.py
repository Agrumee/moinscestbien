import factory
from faker import Faker
from django.utils.crypto import get_random_string
from django.utils.timezone import datetime
import random
from accounts.models import User
from consumptions.models import Product, TrackedProduct
import uuid
from datetime import date, timedelta

fake = Faker()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    id = factory.LazyAttribute(lambda _: uuid.uuid4())
    email = factory.LazyAttribute(lambda _: fake.email())
    username = factory.SelfAttribute('email')
    first_name = factory.LazyAttribute(lambda _: fake.first_name())
    last_name = factory.LazyAttribute(lambda _: fake.last_name())
    password = factory.PostGenerationMethodCall('set_password', 'password')

    @factory.post_generation
    def tracked_products(self, create, extracted, **kwargs):
        products = Product.objects.order_by('?')[:3]
        TrackedProduct.objects.bulk_create([
            TrackedProduct(user=self, product=product, unit=product.units.first(), motivation=product.motivations.first(), start_date=date.today().replace(month=date.today().month-1))
            for product in products
        ])
            
    @factory.post_generation
    def consumptions(self, create, extracted, **kwargs):
        endDate= date.today()
        for tracked_product in self.tracked_products.all():
            currentDate = date.today().replace(month=date.today().month-1)
            while currentDate <= endDate:
                tracked_product.consumptions.create(quantity=random.randint(1, 100), date=currentDate)
                currentDate += timedelta(days=1)