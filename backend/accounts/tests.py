from django.test import TestCase
from django.apps import apps
from accounts.models import User
from accounts.views import RegisterView, LoginView
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

User = apps.get_model('accounts', 'User')

class RegisterTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.register_url = reverse('register')

    def test_user_can_register_with_corrects_email_and_password(self):
        data= {
            'email' : "test@test.com",
            'password' : "password",
            'confirmedPassword' : "password",
        }
        response = self.client.post(self.register_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_user_cannot_register_with_incorrect_email(self):
        data= {
            'email' : "test@test",
            'password' : "password",
            'confirmedPassword' : "password",
        }
        response = self.client.post(self.register_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_cannot_register_with_password_length_under_six_characters(self):
        data= {
            'email' : "test@test.fr",
            'password' : "123",
            'confirmedPassword' : "123",
        }
        response = self.client.post(self.register_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_user_cannot_register_with_already_used_email(self):
        data= {
            'email' : "test@test.com",
            'password' : "password",
            'confirmedPassword' : "password",
        }
        self.client.post(self.register_url, data, format='json')
        
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class LoginTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="user@example.com",
            username="user@example.com",
            password="password123",
        )

        self.client = APIClient()

        self.login_url = reverse('login')

    def test_user_can_login_with_correct_email_and_password(self):
        data = {
            'email':'user@example.com',
            'password':'password123',
        }
        response = self.client.post(self.login_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_user_cannot_login_with_incorrect_email(self):
        data = {
            'email' : "user2@example.com",
            'password' : "password123",
        }
        
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_user_cannot_login_with_incorrect_password(self):
        data = {
            'email' : "user@example.com",
            'password' : "password1234",
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
class LogoutTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="user@example.com",
            username="user@example.com",
            password="password123",
        )

        self.client = APIClient()
        
    def test_user_can_logout_if_login(self):
        self.client.force_authenticate(user=self.user)   
        response = self.client.post(reverse('logout'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_user_cannot_logout_if_not_login(self):
        response = self.client.post(reverse('logout'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
class DeleteAccountTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="user@example.com",
            username="user@example.com",
            password="password123",
        )

        self.client = APIClient()
        
    def test_user_can_delete_account_if_login(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(reverse('delete-account'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.count(), 0)
        
    def test_user_cannot_delete_account_if_not_authenticated(self):
        response = self.client.delete(reverse('delete-account'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(User.objects.count(), 1)
        
class ChangePasswordTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@test.test",
            username="test",
            password="password123",
        )
        
        self.client = APIClient()
        
    def test_user_can_change_password_with_valid_password(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'password' : 'password1234',
            'confirmedPassword' : 'password1234',
        }
        response = self.client.patch(reverse('change-password'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_user_cannot_change_password_with_invalid_password(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'password' : '0000',
            'confirmedPassword' : '0000',
        }
        response = self.client.patch(reverse('change-password'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_user_cannot_change_password_with_invalid_password_confirmation(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'password' : 'password1234',
            'confirmedPassword' : 'password',
        }
        response = self.client.patch(reverse('change-password'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)