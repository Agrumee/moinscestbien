import factory
from faker import Faker
from django.utils.crypto import get_random_string
import random
from accounts.models import User
from consumptions.models import Product
import uuid

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

    # def add_products(self, create, extracted, **kwargs):
    #     if not create:
    #         return

    #     first_product_id = Product.objects.order_by('-id').first().id
    #     last_product_id = Product.objects.order_by('-id').last().id
    #     random_product_id = random.randint(first_product_id, last_product_id)
    #     random_product = Product.objects.get(id=random_product_id)
    #     self.product.add(random_product)

    @factory.post_generation
    def products(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for product in extracted:
                self.products.add(product)
        else:
            products = Product.objects.order_by('?')[:3]
            self.products.add(*products)