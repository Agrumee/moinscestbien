from django.urls import path
from .views import (
    ApiProductsList, 
    ApiUnitsList, 
    ApiMotivationsList,
    ApiAddProduct, 
    ApiUserProductsList, 
    ApiAddConsumption,
    ApiConsumptionDetail,
    ApiConsumptionsList,
    ApiConsumptionPeriodList,
    ApiConsumptionsListByProduct
    )

urlpatterns = [
    path('products/', ApiProductsList.as_view(), name='products-list'),
    path('units/<int:productId>/', ApiUnitsList.as_view(), name='units-list'),
    path('motivations/<int:productId>/', ApiMotivationsList.as_view(), name='motivations-list'),
    path('users/products/<int:productId>/<int:unitId>/<int:motivationId>/add-product/', ApiAddProduct.as_view(), name='add-product'),
    path('products/<uuid:userId>/', ApiUserProductsList.as_view(), name='user-products-list'),
    path('consumptions/<uuid:userId>/<int:productId>/add-consumption/', ApiAddConsumption.as_view(), name='add-consumption'),
    path('consumption/<uuid:userId>/<int:productId>/<str:date>/', ApiConsumptionDetail.as_view(), name='consumption-detail'),
    path('consumptions/<uuid:userId>/<int:productId>/<str:start_date>/<str:end_date>/', ApiConsumptionPeriodList.as_view(), name='consumption-period-list'),
    path('consumptions/<uuid:userId>/<int:productId>/', ApiConsumptionsListByProduct.as_view(), name='consumptions-list-by-product'),
    path('consumptions/<uuid:userId>/<str:start_date>/<str:end_date>/', ApiConsumptionsList.as_view(), name='consumptions-list'),

]