from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/consumptions/", include("consumptions.urls")),
    path("api/accounts/", include("accounts.urls")),
]
