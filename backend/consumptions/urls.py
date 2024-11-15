from django.urls import path
from .views import (
    ApiProductsList, 
    ApiUnitsList, 
    ApiMotivationsList,
    ApiAddProduct, 
    ApiTrackedProductsList, 
    ApiAddConsumption,
    ApiConsumptionDetail,
    ApiConsumptionsList,
    ApiConsumptionPeriodList,
    ApiConsumptionsListByProduct,
    ApiTrackingFrequenciesList,
    ApiDeleteTrackedProduct,
    ApiPauseTrackedProduct,
    ApiUnpauseTrackedProduct,
    )

urlpatterns = [
    path('products/', ApiProductsList.as_view(), name='products-list'),
    path('units/<int:productId>/', ApiUnitsList.as_view(), name='units-list'),
    path('motivations/<int:productId>/', ApiMotivationsList.as_view(), name='motivations-list'),
    path('users/products/<int:productId>/<int:unitId>/<int:motivationId>/add-product/', ApiAddProduct.as_view(), name='add-product'),
    path('tracked-products/', ApiTrackedProductsList.as_view(), name='user-products-list'),
    path('consumption/<int:productId>/add-consumption/', ApiAddConsumption.as_view(), name='add-consumption'),
    path('consumption/<int:productId>/<str:date>/', ApiConsumptionDetail.as_view(), name='consumption-detail'),
    path('tracking-frequencies/', ApiTrackingFrequenciesList.as_view(), name='tracking-frequencies-list'),
    path('users/products/<int:productId>/<int:unitId>/<int:motivationId>/<int:trackingFrequencyId>/add-product/', ApiAddProduct.as_view(), name='add-product'),
    # path('consumptions/<uuid:userId>/<int:productId>/<str:start_date>/<str:end_date>/', ApiConsumptionPeriodList.as_view(), name='consumption-period-list'),
    path('consumptions/<int:productId>/', ApiConsumptionsListByProduct.as_view(), name='consumptions-list-by-product'),
    # path('consumptions/<uuid:userId>/<str:start_date>/<str:end_date>/', ApiConsumptionsList.as_view(), name='consumptions-list'),
    path('users/products/<int:trackedProductId>/delete/', ApiDeleteTrackedProduct.as_view(), name='delete-tracked-product'),
    path('user/products/<int:trackedProductId>/pause/', ApiPauseTrackedProduct.as_view(), name='pause-tracked-product'),
    path('user/products/<int:trackedProductId>/unpause/', ApiUnpauseTrackedProduct.as_view(), name='unpause-tracked-product'),

]