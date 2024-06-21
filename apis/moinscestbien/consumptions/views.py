from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Product, Consumption, TrackedProduct
from accounts.models import User
from .serializers import ProductSerializer, UnitSerializer
from datetime import datetime

class ApiProductsList(APIView):
    def get(self, request):
        try:
            product_list = Product.objects.all()
            serializer = ProductSerializer(product_list, many=True)
            return Response({
                "success": True,
                "message": "Products retrieved successfully.",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({
                "success": False,
                "message": "No products found.",
                "data": []
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "success": False,
                "message": f"An error occurred: {str(e)}",
                "data": []
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class ApiUnitsList(APIView):
    def get(self, *args, **kwargs):
        try:
            product = Product.objects.get(id=kwargs['productId'])
            units = product.units.all()
            serializer = UnitSerializer(units, many=True)
            if units:
                return Response({
                    "success": True,
                    "message": "Units retrieved successfully.",
                    "data": serializer.data
                }, status=status.HTTP_200_OK)
            else :
                return Response({
                    "success": False,
                    "message": "No units found.",
                    "data": []
                }, status=status.HTTP_404_NOT_FOUND)
        except Product.DoesNotExist:
            return Response({
                "success": False,
                "message": "No product found.",
                "data": []
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "success": False,
                "message": f"An error occurred: {str(e)}",
                "data": []
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ApiAddProduct(APIView):
    def post(self, *args, **kwargs):
        try:
            user = User.objects.get(id=kwargs['userId'])
            product = Product.objects.get(id=kwargs['productId'])
            if not product in user.products.all():
                user.products.add(product)
                return Response({
                    "success": True,
                    "message": repr(product.name + " assigned successfully to " + user.username + "."),
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "success": False,
                    "message": repr(product.name + " already assigned to " + user.username + "."),
                }, status=status.HTTP_400_BAD_REQUEST)
        except Product.DoesNotExist:
            return Response({
                "success": False,
                "message": "No product found.",
                "data": []
            }, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({
                "success": False,
                "message": "No user found.",
                "data": []
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "success": False,
                "message": f"An error occurred: {str(e)}",
                "data": []
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class ApiUserProductsList(APIView):
    def get(self, *args, **kwargs):
        try:
            user = User.objects.get(id=kwargs['userId'])
            user_products_list = user.products.all()
            serializer = ProductSerializer(user_products_list, many=True)
            if user_products_list:
                return Response({
                    "success": True,
                    "message": "Products retrieved successfully.",
                    "data": serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "success": False,
                    "message": "No products found.",
                    "data": []
                }, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({
                "success": False,
                "message": "No user found.",
                "data": []
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "success": False,
                "message": f"An error occurred: {str(e)}",
                "data": []
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ApiAddConsumption(APIView):
    def post(self, request, *args, **kwargs):
        try:
            userId = kwargs.get('userId')
            productId = kwargs.get('productId')
            data = request.data

            quantity = data.get('quantity')
            date = data.get('date')

            if not all([quantity, date]):
                return Response({
                    "success": False,
                    "message": "Quantity and date are required.",
                    "data": []
                }, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.get(id=userId)
            product = Product.objects.get(id=productId)
            date = datetime.strptime(date, "%Y-%m-%d").date()

            # Check if the product is tracked by the user
            try:
                TrackedProduct.objects.get(user=user, product=product)
            except TrackedProduct.DoesNotExist:
                return Response({
                    "success": False,
                    "message": "The product is not tracked by this user.",
                    "data": []
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create or update the consumption
            consumption, created = Consumption.objects.get_or_create(
                user=user,
                product=product,
                date=date,
                defaults={'quantity': quantity}
            )

            if not created:
                consumption.quantity += quantity
                consumption.save()

            return Response({
                "success": True,
                "message": "Consumption added/updated successfully.",
                "data": {
                    "user": userId,
                    "product": productId,
                    "quantity": consumption.quantity,
                    "date": consumption.date
                }
            }, status=status.HTTP_201_CREATED)

        except User.DoesNotExist:
            return Response({
                "success": False,
                "message": "User not found.",
                "data": []
            }, status=status.HTTP_404_NOT_FOUND)
        except Product.DoesNotExist:
            return Response({
                "success": False,
                "message": "Product not found.",
                "data": []
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "success": False,
                "message": f"An error occurred: {str(e)}",
                "data": []
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)