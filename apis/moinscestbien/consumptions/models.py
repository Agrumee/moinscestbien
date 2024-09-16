from django.db import models
from datetime import date

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


class TrackedProduct(models.Model):
    
    class Meta:
        unique_together = ('user', 'product', 'unit')
        
    user = models.ForeignKey('accounts.User', related_name='tracked_products', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='tracked_products', on_delete=models.CASCADE)
    unit = models.ForeignKey(Unit, related_name='tracked_products', on_delete=models.CASCADE)
    motivation = models.ForeignKey(Motivation, related_name='tracked_products', on_delete=models.CASCADE, blank=True, null=True)
    start_date = models.DateField(default=date.today)  # Définir la date actuelle par défaut
    end_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f'{self.user} - {self.product}'
    
class Consumption(models.Model):
    
    class Meta:
        unique_together = ('tracked_product', 'date')
        
    tracked_product = models.ForeignKey(TrackedProduct, related_name='consumptions', on_delete=models.CASCADE)
    quantity = models.FloatField()
    date = models.DateField()

    def __str__(self):
        return f' {self.tracked_product} - {self.quantity} - {self.date} '