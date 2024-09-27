from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Product, Consumption, TrackedProduct, Unit, Motivation
from accounts.models import User
from .serializers import ProductSerializer, UnitSerializer, ConsumptionSerializer, MotivationSerializer
from datetime import datetime
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.utils.decorators import method_decorator

from rest_framework.permissions import AllowAny, IsAuthenticated

@method_decorator(ensure_csrf_cookie, name='dispatch')
class ApiProductsList(APIView):
    permission_classes = [IsAuthenticated,] 

    def get(self, request):
        try:
            user = request.user
            user_tracked_products = TrackedProduct.objects.filter(user=user).values_list('product', flat=True)
            user_untracked_products = Product.objects.exclude(id__in=user_tracked_products)
            serializer = ProductSerializer(user_untracked_products, many=True)
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

@method_decorator(ensure_csrf_cookie, name='dispatch')
class ApiUnitsList(APIView):
    permission_classes = [AllowAny,] 

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


@method_decorator(ensure_csrf_cookie, name='dispatch')
class ApiMotivationsList(APIView):
    permission_classes = [IsAuthenticated,] 

    def get(self, *args, **kwargs):
        try:
            product = Product.objects.get(id=kwargs['productId'])
            motivations = product.motivations.all()
            serializer = MotivationSerializer(motivations, many=True)
            if motivations:
                return Response({
                    "success": True,
                    "message": "Motivations retrieved successfully.",
                    "data": serializer.data
                }, status=status.HTTP_200_OK)
            else :
                return Response({
                    "success": False,
                    "message": "No Motivations found.",
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



@method_decorator(csrf_protect, name='dispatch')
class ApiAddProduct(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request,*args, **kwargs):
        try:
            user = request.user
            product = Product.objects.get(id=kwargs['productId'])
            unit = Unit.objects.get(id=kwargs['unitId'])
            motivation = Motivation.objects.get(id=kwargs['motivationId'])
            if not TrackedProduct.objects.filter(product=product, unit=unit, user=user, motivation=motivation):
                TrackedProduct.objects.create(
                    product=product, unit=unit, user=user, motivation=motivation
                )
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

@method_decorator(ensure_csrf_cookie, name='dispatch')
class ApiUserProductsList(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request,*args, **kwargs):
        try:
            user = request.user
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

@method_decorator(csrf_protect, name='dispatch')
class ApiAddConsumption(APIView):
    permission_classes = (IsAuthenticated,)
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
                tracked_product = TrackedProduct.objects.get(user=user, product=product)
            except TrackedProduct.DoesNotExist:
                return Response({
                    "success": False,
                    "message": "The product is not tracked by this user.",
                    "data": []
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create or update the consumption
            consumption, created = Consumption.objects.get_or_create(
                tracked_product=tracked_product,
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
        

@method_decorator(ensure_csrf_cookie, name='dispatch')
class ApiConsumptionsListByProduct(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        try:
            user = get_object_or_404(User, id=kwargs['userId'])
            product = get_object_or_404(Product, id=kwargs['productId'])
            tracked_product = get_object_or_404(TrackedProduct, user=user, product=product, end_date=None)
            consumptions = Consumption.objects.filter(tracked_product=tracked_product)
            serializer = ConsumptionSerializer(consumptions, many=True)
            return Response({
                "success": True,
                "message": "Consumptions retrieved successfully.",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
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
        except TrackedProduct.DoesNotExist:
            return Response({
                "success": False,
                "message": "Tracked product not found.",
                "data": []
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "success": False,
                "message": f"An error occurred: {str(e)}",
                "data": []
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class ApiConsumptionPeriodList(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        try:
            user = get_object_or_404(User, id=kwargs['userId'])
            product = get_object_or_404(Product, id=kwargs['productId'])
            start_date = kwargs['start_date']
            end_date = kwargs['end_date']
            tracked_product = get_object_or_404(TrackedProduct, user=user, product=product, end_date=None)
            consumptions = Consumption.objects.filter(tracked_product=tracked_product, date__range=[start_date, end_date])
            serializer = ConsumptionSerializer(consumptions, many=True)
            return Response({
                "success": True,
                "message": "Consumptions retrieved successfully.",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
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
        except TrackedProduct.DoesNotExist:
            return Response({
                "success": False,
                "message": "Tracked product not found.",
                "data": []
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "success": False,
                "message": f"An error occurred: {str(e)}",
                "data": []
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class ApiConsumptionDetail(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        try:
            user = get_object_or_404(User, id=kwargs['userId'])
            product = get_object_or_404(Product, id=kwargs['productId'])
            date = kwargs['date']
            tracked_product = get_object_or_404(TrackedProduct, user=user, product=product, end_date=None)
            consumption = get_object_or_404(Consumption, tracked_product=tracked_product, date=date)
            serializer = ConsumptionSerializer(consumption)
            return Response({
                "success": True,
                "message": "Consumption retrieved successfully.",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
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
        except TrackedProduct.DoesNotExist:
            return Response({
                "success": False,
                "message": "Tracked product not found.",
                "data": []
            }, status=status.HTTP_404_NOT_FOUND)
        except Consumption.DoesNotExist:
            return Response({
                "success": False,
                "message": "Consumption not found.",
                "data": []
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "success": False,
                "message": f"An error occurred: {str(e)}",
                "data": []
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class ApiConsumptionsList(APIView):
    permission_classes = (IsAuthenticated,)    
    def get(self, request, *args, **kwargs):
        try:
            user = get_object_or_404(User, id=kwargs['userId'])
            start_date_str = kwargs['start_date']
            end_date_str = kwargs['end_date']
            
            # Convertir les chaînes en objets date
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
            
            # Filtrer les consommations pour l'utilisateur et la plage de dates
            consumptions = Consumption.objects.filter(
                tracked_product__user=user,
                date__range=[start_date, end_date]
            )
            
            # Utiliser le sérialiseur modifié
            serializer = ConsumptionSerializer(consumptions, many=True)
            return Response({
                "success": True,
                "message": "Consumptions retrieved successfully.",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                "success": False,
                "message": "User not found.",
                "data": []
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "success": False,
                "message": f"An error occurred: {str(e)}",
                "data": []
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)