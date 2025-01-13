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
    PasswordResetView,
    PasswordResetDoneView,
)

urlpatterns = [
    path("login", LoginView.as_view(), name="login"),
    path("register", RegisterView.as_view(), name="register"),
    path("logout", LogoutView.as_view(), name="logout"),
    path("csrf-cookie", GetCSRFToken.as_view(), name="csrf-cookie"),
    path("authenticate", CheckAuthView.as_view(), name="authenticate"),
    path("delete-account", DeleteAccountView.as_view(), name="delete-account"),
    path("change-password", ChangePasswordView.as_view(), name="change-password"),
    path("password-reset", PasswordResetView.as_view(), name="password-reset"),
    path(
        "password-reset/done",
        PasswordResetDoneView.as_view(),
        name="password-reset-done",
    ),
]
