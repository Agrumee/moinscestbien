import factory
from faker import Faker
from django.utils.crypto import get_random_string
from django.utils.timezone import datetime
import random
from accounts.models import User
from consumptions.models import Product
import uuid
from datetime import date, timedelta

fake = Faker()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    id = factory.LazyAttribute(lambda _: uuid.uuid4())
    username = factory.LazyAttribute(lambda _: fake.user_name())
    email = factory.LazyAttribute(lambda _: fake.email())
    first_name = factory.LazyAttribute(lambda _: fake.first_name())
    last_name = factory.LazyAttribute(lambda _: fake.last_name())
    password = factory.PostGenerationMethodCall('set_password', get_random_string(10))

    @factory.post_generation
    def products(self):
        products = Product.objects.order_by('?')[:3]
        self.products.add(*products)
            
    @factory.post_generation
    def consumptions(self):
        currentDate = date.today().replace(month=date.today().month-1)
        endDate= date.today()
        for product in self.products.all():
            units = product.units.all()
            unit = units[random.randint(0, len(units)-1)]
            while currentDate <= endDate:
                product.consumptions.create(user=self, quantity=random.randint(1, 100), date=currentDate, unit=unit)
                currentDate += timedelta(days=1)