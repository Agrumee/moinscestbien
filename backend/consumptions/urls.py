from django.urls import path
from .views import (
    ApiProductsList,
    ApiUnitsList,
    ApiMotivationsList,
    ApiCreateTrackedProduct,
    ApiTrackedProductsList,
    ApiAddConsumption,
    ApiConsumptionDetail,
    # ApiConsumptionsList,
    # ApiConsumptionPeriodList,
    ApiConsumptionsListByTrackedProduct,
    ApiTrackingFrequenciesList,
    ApiDeleteTrackedProduct,
    ApiPauseTrackedProduct,
    ApiUnpauseTrackedProduct,
)

urlpatterns = [
    path("products/", ApiProductsList.as_view(), name="products-list"),
    path("units/<int:productId>/", ApiUnitsList.as_view(), name="units-list"),
    path(
        "motivations/<int:productId>/",
        ApiMotivationsList.as_view(),
        name="motivations-list",
    ),
    # Modification du nom de l'api pour une meilleure clarté de son action, ApiAddProduct, evoque plus la possibilité pour un utilisateur de créer un nouveau produit.
    path(
        "user/tracked-product/<int:productId>/<int:unitId>/<int:motivationId>/<int:trackingFrequencyId>/create/",
        ApiCreateTrackedProduct.as_view(),
        name="add-product",
    ),
    path(
        "user/tracked-products/",
        ApiTrackedProductsList.as_view(),
        name="user-products-list",
    ),
    # Ici il vaut mieux passer directement l'id du tracked-product car on met à jour la consommation sur un tracked product et non sur un product directement
    path(
        "consumption/<int:trackedProductId>/add-consumption/",
        ApiAddConsumption.as_view(),
        name="add-consumption",
    ),
    path(
        "consumption/<int:trackedProductId>/<str:date>/",
        ApiConsumptionDetail.as_view(),
        name="consumption-detail",
    ),
    path(
        "tracking-frequencies/",
        ApiTrackingFrequenciesList.as_view(),
        name="tracking-frequencies-list",
    ),
    # API non utilisée, pourrait être utile dans un futur déploiement de l'app mais devrait être réécrite car l'uuid de l'user n'est pas utile
    # path('consumptions/<uuid:userId>/<int:productId>/<str:start_date>/<str:end_date>/', ApiConsumptionPeriodList.as_view(), name='consumption-period-list'),
    path(
        "consumptions/<int:trackedProductId>/",
        ApiConsumptionsListByTrackedProduct.as_view(),
        name="consumptions-list-by-product",
    ),
    # API non utilisée, pourrait être utile dans un futur déploiement de l'app mais devrait être réécrite car l'uuid de l'user n'est pas utile
    # path('consumptions/<uuid:userId>/<str:start_date>/<str:end_date>/', ApiConsumptionsList.as_view(), name='consumptions-list'),
    path(
        "users/products/<int:trackedProductId>/delete/",
        ApiDeleteTrackedProduct.as_view(),
        name="delete-tracked-product",
    ),
    path(
        "user/products/<int:trackedProductId>/pause/",
        ApiPauseTrackedProduct.as_view(),
        name="pause-tracked-product",
    ),
    path(
        "user/products/<int:trackedProductId>/unpause/",
        ApiUnpauseTrackedProduct.as_view(),
        name="unpause-tracked-product",
    ),
]
