from django.db import models

class Motivation(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Unit(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    motivations = models.ManyToManyField(Motivation, related_name='products', blank=True)
    units = models.ManyToManyField(Unit, related_name='products')

    def __str__(self):
        return self.name

class Consumption(models.Model):
    user = models.ForeignKey('accounts.User', related_name='consumptions', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='consumptions', on_delete=models.CASCADE)
    quantity = models.FloatField()
    date = models.DateField()
    unit = models.ForeignKey(Unit, related_name='consumptions', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user} - {self.product} - {self.quantity} - {self.date} - {self.unit}'
