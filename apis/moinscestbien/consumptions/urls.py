from django.urls import path
from .views import ApiProductList

urlpatterns = [
    path('products/', ApiProductList.as_view(), name='product-list'),
]