from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from accounts.models import User
from consumptions.models import TrackedHabit
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
                unpaused_tracked_habit_count = TrackedHabit.objects.filter(
                    user=request.user, end_date=None
                ).count()
                tracked_habit_count = TrackedHabit.objects.filter(
                    user=request.user
                ).count()
                paused_tracked_habit_count = (
                    tracked_habit_count - unpaused_tracked_habit_count
                )
                return Response(
                    {
                        "success": "User is authenticated",
                        "isAuthenticated": True,
                        "unpaused_tracked_habit_count": unpaused_tracked_habit_count,
                        "paused_tracked_habit_count": paused_tracked_habit_count,
                    },
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
                {"message": "Le compte utilisateur a été supprimé avec succès"},
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
                        {
                            "message": "Votre mot de passe doit être composé d'au moins 6 caractères"
                        },
                        status=status.HTTP_401_UNAUTHORIZED,
                    )
                else:
                    user = User.objects.get(username=request.user.username)
                    user.set_password(password)
                    user.save()
                    return Response(
                        {"message": "Le mot de passe a été changé avec succès !"},
                        status=status.HTTP_200_OK,
                    )
            else:
                return Response(
                    {
                        "message": "La confirmation du mot de passe ne correspond pas au mot de passe."
                    },
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
                {"message": "L'adresse mail est requise."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Vérifier si l'utilisateur existe avec cet email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"message": "Une erreur est survenue."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Générer un token sécurisé
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_url = (
            f"{config('FRONT_BASE_URL')}/reset-password-confirm?uid={uid}&token={token}"
        )

        # Envoyer l'email
        subject = "Password Reset Request"
        message = f"Bonjour, {user.username},\n\nPour réinitialiser votre mot de passe, cliquez sur le lien suivant :\n{reset_url}\n\nSi vous n'avez pas demandé à réinitialisé votre mot de passe, merci d'ignorer ce mail."
        from_email = settings.DEFAULT_FROM_EMAIL
        send_mail(subject, message, from_email, [user.email])

        return Response(
            {"message": "Un lien de réinitialisation vous a été adressé par mail."},
            status=status.HTTP_200_OK,
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
                        "message": "Le mot de passe a été réinitialisé avec succès !",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "message": "La confirmation du mot de passe ne correspond pas au mot de passe."
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        else:
            return Response(
                {"error": "Token is invalid or expired"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ContactUs(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        name = request.data.get("name")
        message_content = request.data.get("message")

        if not email or not name or not message_content:
            return Response(
                {"message": "Tous les champs (nom, email, message) sont requis."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user
        username = user.username

        subject = "Contact - Moins c'est bien"
        message = (
            f"Vous avez reçu un message depuis l'application Moins c'est bien :\n\n"
            f"Utilisateur : {username}\n"
            f"Nom : {name}\n"
            f"Email : {email}\n\n"
            f"Message :\n{message_content}"
        )

        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [settings.CONTACT_EMAIL]

        try:
            send_mail(subject, message, from_email, recipient_list)
            return Response(
                {"message": "Votre message a bien été envoyé !"},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"error": f"Une erreur est survenue lors de l'envoi de l'email."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
