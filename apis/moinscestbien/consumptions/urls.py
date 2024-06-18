from django.urls import path
from .views import ApiProductsList, ApiUnitsList, ApiAddProduct, ApiUserProductsList

urlpatterns = [
    path('products/', ApiProductsList.as_view(), name='products-list'),
    path('units/<int:productId>/', ApiUnitsList.as_view(), name='units-list'),
    path('users/<uuid:userId>/products/<int:productId>/add-product/', ApiAddProduct.as_view(), name='add-product'),
    path('products/<uuid:userId>/', ApiUserProductsList.as_view(), name='user-products-list')
]