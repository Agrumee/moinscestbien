from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from accounts.models import User
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from django.contrib import auth
from rest_framework import status
import re
from decouple import config


from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse


class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = self.request.data
        email = data["email"]
        password = data["password"]
        confirmed_password = data["confirmedPassword"]
        try:
            regex_email = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b"
            if not re.match(regex_email, email):
                return Response(
                    {"message": "Invalid email format"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            elif password == confirmed_password:
                if User.objects.filter(email=email).exists():
                    return Response(
                        {"message": "Registration failed"},
                        status=status.HTTP_401_UNAUTHORIZED,
                    )
                else:
                    if len(password) < 6:
                        return Response(
                            {"message": "Password must be at least 6 characters"},
                            status=status.HTTP_401_UNAUTHORIZED,
                        )
                    else:
                        user = User.objects.create_user(
                            email=email, password=password, username=email
                        )
                        user.save()
                        return Response(
                            {"message": "User created successfully"},
                            status=status.HTTP_200_OK,
                        )
            else:
                return Response(
                    {"message": "Passwords do not match"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        except Exception as e:
            return Response(
                {"message": f"Error registering user: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(ensure_csrf_cookie, name="dispatch")
class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = request.data
        username = data.get("email")
        password = data.get("password")
        try:
            user = auth.authenticate(username=username, password=password)
            if user is not None:
                auth.login(request, user)
                return Response(
                    {"message": "User authenticated", "username": username},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": "Invalid email or password"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        except Exception as e:
            return Response(
                {"message": f"Error authenticating user: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(csrf_protect, name="dispatch")
class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        try:
            auth.logout(request)
            return Response({"success": "User logged out"})
        except:
            return Response({"error": "Error logging out user"})


class CheckAuthView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        try:
            isAuthenticated = request.user.is_authenticated
            if isAuthenticated:
                return Response(
                    {"success": "User is authenticated", "isAuthenticated": True},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": "User is not authenticated", "isAuthenticated": False},
                    status=status.HTTP_200_OK,
                )
        except:
            return Response({"error": "Error checking user authentication"})


@method_decorator(csrf_protect, name="dispatch")
class DeleteAccountView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def delete(self, request, format=None):
        try:
            user = User.objects.get(username=request.user.username)
            auth.logout(request)
            user.delete()
            return Response(
                {"success": "User account deleted"},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_protect, name="dispatch")
class ChangePasswordView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def patch(self, request, format=None):
        data = request.data
        password = data["password"]
        confirmed_password = data["confirmedPassword"]
        try:
            if password == confirmed_password:
                if len(password) < 6:
                    return Response(
                        {"message": "Password must be at least 6 characters"},
                        status=status.HTTP_401_UNAUTHORIZED,
                    )
                else:
                    user = User.objects.get(username=request.user.username)
                    user.set_password(password)
                    user.save()
                    return Response(
                        {"message": "Password changed successfully"},
                        status=status.HTTP_200_OK,
                    )
            else:
                return Response(
                    {"message": "Passwords do not match"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        except Exception as e:
            return Response(
                {"message": f"Error changing password: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PasswordResetView(APIView):
    permission_classes = (permissions.AllowAny,)
    """
    Gère la demande de réinitialisation de mot de passe.
    """

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        if not email:
            return Response(
                {"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        # Vérifier si l'utilisateur existe avec cet email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"message": "Email not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Générer un token sécurisé
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_url = (
            f"{config("FRONT_BASE_URL")}/reset-password-confirm?uid={uid}&token={token}"
        )

        # Envoyer l'email
        subject = "Password Reset Request"
        message = f"Hello {user.username},\n\nTo reset your password, click the link below:\n{reset_url}\n\nIf you didn't request this, please ignore this email."
        from_email = settings.DEFAULT_FROM_EMAIL
        send_mail(subject, message, from_email, [user.email])

        return Response(
            {"message": "Password reset email sent."}, status=status.HTTP_200_OK
        )


class PasswordResetDoneView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        password = request.data.get("password")
        confirmed_password = request.data.get("confirmedPassword")
        uidb64 = request.data.get("uid")
        token = request.data.get("token")
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response(
                {"error": "Invalid token or user"}, status=status.HTTP_400_BAD_REQUEST
            )

        if default_token_generator.check_token(user, token):
            if password == confirmed_password:
                user.set_password(password)
                user.save()
                return Response(
                    {
                        "message": "Password was reset successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": "Passwords do not match"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        else:
            return Response(
                {"error": "Token is invalid or expired"},
                status=status.HTTP_400_BAD_REQUEST,
            )
