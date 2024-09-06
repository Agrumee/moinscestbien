from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from accounts.models import User
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from django.contrib import auth
import logging
from rest_framework import status

logger = logging.getLogger(__name__)
@method_decorator(csrf_protect, name='dispatch')
class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = self.request.data
        email = data['email']
        password = data['password']
        re_password = data['re_password']
        try:
            if password == re_password:
                if User.objects.filter(email=email).exists():
                    return Response({'error': 'Email already exists'})
                else:
                    if len(password) < 6:
                        return Response({'error': 'Password must be at least 6 characters'})
                    else:
                        user = User.objects.create_user(email=email, password=password, username=email)
                        user.save()
                        return Response({'success': 'User created successfully'})
            else:
                return Response({'error': 'Passwords do not match'})
        except:
            return Response({'error': 'Error creating user'})

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        return Response({'success': 'CSRF cookie set'})
 
@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = request.data
        username = data.get('email')
        password = data.get('password')
        try:
            # Rest of the code...

                        user = auth.authenticate(username=username, password=password)
                        if user is not None:
                            auth.login(request, user)
                            return Response(
                                {'message': 'User authenticated', 'username': username},
                                status=status.HTTP_200_OK
                            )
                        else:
                            return Response(
                                {'message': 'Invalid email or password'},
                                status=status.HTTP_401_UNAUTHORIZED
                            )
        except Exception as e:
            logger.error(f"Error authenticating user: {e}")
            return Response(
                {'message': f'Error authenticating user: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class LogoutView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        try:
            auth.logout(request)
            return Response({'success': 'User logged out'})
        except:
            return Response({'error': 'Error logging out user'})
 
@method_decorator(csrf_protect, name='dispatch')       
class CheckAuthView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        try:
            isAuthenticated = User.is_authenticated
            if isAuthenticated:
                return Response({'success': 'User is authenticated'})
            else:
                return Response({'error': 'User is not authenticated'})
        except:
            return Response({'error': 'Error checking user authentication'})

                