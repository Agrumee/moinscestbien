from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Product
from accounts.models import User
from .serializers import ProductSerializer, UnitSerializer

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