from django.urls import path
from django.contrib.auth import views as auth_views
from .views import (
    RegisterView,
    GetCSRFToken,
    LoginView,
    LogoutView,
    DeleteAccountView,
    ChangePasswordView,
    CheckAuthView,
)

urlpatterns = [
    path("api/login/", LoginView.as_view(), name="login"),
    path("api/register/", RegisterView.as_view(), name="register"),
    path("api/logout/", LogoutView.as_view(), name="logout"),
    path("api/csrf_cookie/", GetCSRFToken.as_view(), name="csrf-cookie"),
    path("api/authenticate/", CheckAuthView.as_view(), name="authenticate"),
    path("api/delete_account/", DeleteAccountView.as_view(), name="delete-account"),
    path("api/change_password/", ChangePasswordView.as_view(), name="change-password"),
    # Gestion réinitilisation du mot de passe
    path(
        "api/password_reset/",
        auth_views.PasswordResetView.as_view(),
        name="password_reset",
    ),
    path(
        "password_reset/done/",
        auth_views.PasswordResetDoneView.as_view(),
        name="password_reset_done",
    ),
    path(
        "reset/<uidb64>/<token>/",
        auth_views.PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "reset/done/",
        auth_views.PasswordResetCompleteView.as_view(),
        name="password_reset_complete",
    ),
]
