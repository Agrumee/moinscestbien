from django.urls import path
from .views import RegisterView, GetCSRFToken, LoginView, LogoutView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('csrf_cookie/', GetCSRFToken.as_view(), name='csrf-cookie'),
    path('authenticate/', GetCSRFToken.as_view(), name='authenticate'),
]
