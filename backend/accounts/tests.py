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
