from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Product
from .serializers import ProductSerializer

class ApiProductList(APIView):
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
