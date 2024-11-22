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


@method_decorator(csrf_protect, name="dispatch")
class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = self.request.data
        email = data["email"]
        password = data["password"]
        confirmed_password = data["confirmedPassword"]
        try:
            regex_email = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b"
            if not re.match(regex_email, email):
                return Response(
                    {"message": "Invalid email format"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            elif password == confirmed_password:
                if User.objects.filter(email=email).exists():
                    return Response(
                        {"message": "Email already exists"},
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
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        return Response({"success": "CSRF cookie set"})


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
