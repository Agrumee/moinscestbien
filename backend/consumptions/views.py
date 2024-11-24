from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import (
    Product,
    Consumption,
    TrackedProduct,
    Unit,
    Motivation,
    TrackingFrequency,
)
from accounts.models import User
from .serializers import (
    ProductSerializer,
    UnitSerializer,
    ConsumptionSerializer,
    MotivationSerializer,
    TrackedProductSerializer,
    TrackingFrequencySerializer,
)
from datetime import datetime
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.utils.decorators import method_decorator

from rest_framework.permissions import AllowAny, IsAuthenticated


@method_decorator(ensure_csrf_cookie, name="dispatch")
class ApiProductsList(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        try:
            user = request.user
            user_tracked_products = TrackedProduct.objects.filter(
                user=user, end_date=None
            ).values_list("product", flat=True)
            user_untracked_products = Product.objects.exclude(
                id__in=user_tracked_products
            )
            serializer = ProductSerializer(user_untracked_products, many=True)
            return Response(
                {
                    "success": True,
                    "message": "Products retrieved successfully.",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except Product.DoesNotExist:
            return Response(
                {"success": False, "message": "No products found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": f"An error occurred: {str(e)}",
                    "data": [],
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(ensure_csrf_cookie, name="dispatch")
class ApiUnitsList(APIView):
    permission_classes = [
        AllowAny,
    ]

    def get(self, *args, **kwargs):
        try:
            product = Product.objects.get(id=kwargs["productId"])
            units = product.units.all()
            serializer = UnitSerializer(units, many=True)
            if units:
                return Response(
                    {
                        "success": True,
                        "message": "Units retrieved successfully.",
                        "data": serializer.data,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"success": False, "message": "No units found.", "data": []},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Product.DoesNotExist:
            return Response(
                {"success": False, "message": "No product found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": f"An error occurred: {str(e)}",
                    "data": [],
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(ensure_csrf_cookie, name="dispatch")
class ApiMotivationsList(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, *args, **kwargs):
        try:
            product = Product.objects.get(id=kwargs["productId"])
            motivations = product.motivations.all()
            serializer = MotivationSerializer(motivations, many=True)
            if motivations:
                return Response(
                    {
                        "success": True,
                        "message": "Motivations retrieved successfully.",
                        "data": serializer.data,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"success": False, "message": "No Motivations found.", "data": []},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Product.DoesNotExist:
            return Response(
                {"success": False, "message": "No product found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": f"An error occurred: {str(e)}",
                    "data": [],
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(csrf_protect, name="dispatch")
class ApiCreateTrackedProduct(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            product = Product.objects.get(id=kwargs["productId"])
            unit = Unit.objects.get(id=kwargs["unitId"])
            motivation = Motivation.objects.get(id=kwargs["motivationId"])
            tracking_frequency = TrackingFrequency.objects.get(
                id=kwargs["trackingFrequencyId"]
            )

            tracked_product, created = TrackedProduct.objects.get_or_create(
                user=user,
                product=product,
                unit=unit,
                motivation=motivation,
                tracking_frequency=tracking_frequency,
            )

            if created:
                return Response(
                    {
                        "success": True,
                        "message": repr(
                            product.name
                            + " assigned successfully to "
                            + user.username
                            + "."
                        ),
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                if tracked_product.end_date == None:
                    return Response(
                        {
                            "success": False,
                            "message": repr(
                                product.name
                                + " already assigned to "
                                + user.username
                                + "."
                            ),
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                else:
                    tracked_product.end_date = None
                    tracked_product.save()
                    return Response(
                        {
                            "success": True,
                            "message": f"{product.name} tracking reactivated for {user.username}.",
                        },
                        status=status.HTTP_200_OK,
                    )

        except Product.DoesNotExist:
            return Response(
                {"success": False, "message": "No product found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except User.DoesNotExist:
            return Response(
                {"success": False, "message": "No user found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": f"An error occurred: {str(e)}",
                    "data": [],
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(ensure_csrf_cookie, name="dispatch")
class ApiTrackedProductsList(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            user = request.user
            tracked_products = user.tracked_products.filter(end_date=None).order_by(
                "start_date"
            )
            serializer = TrackedProductSerializer(tracked_products, many=True)
            if tracked_products:
                return Response(
                    {
                        "success": True,
                        "message": "Products retrieved successfully.",
                        "data": serializer.data,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"success": False, "message": "No products found.", "data": []},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except User.DoesNotExist:
            return Response(
                {"success": False, "message": "No user found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": f"An error occurred: {str(e)}",
                    "data": [],
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(csrf_protect, name="dispatch")
class ApiAddConsumption(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        try:
            tracked_product_id = kwargs.get("trackedProductId")
            data = request.data
            quantity = data.get("quantity")
            date = data.get("date")

            if quantity is None or date is None:
                return Response(
                    {
                        "success": False,
                        "message": "Quantity and date are required.",
                        "data": [],
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                quantity = int(quantity)
            except ValueError:
                return Response(
                    {
                        "success": False,
                        "message": "Quantity must be an integer.",
                        "data": [],
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                date = datetime.strptime(date, "%Y-%m-%d").date()
            except ValueError:
                return Response(
                    {
                        "success": False,
                        "message": "Date must be in the format YYYY-MM-DD.",
                        "data": [],
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = request.user
            try:
                tracked_product = TrackedProduct.objects.get(id=tracked_product_id)

                # Vérifiez si le produit appartient à l'utilisateur
                if tracked_product.user != user:
                    return Response(
                        {
                            "success": False,
                            "message": "The product is not tracked by this user.",
                            "data": [],
                        },
                        status=status.HTTP_401_UNAUTHORIZED,
                    )

                # Vérifiez si la date est valide
                if date > date.today():
                    return Response(
                        {"error": "The date cannot be in the future."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if date < tracked_product.start_date:
                    return Response(
                        {
                            "error": "The date is earlier than the product's tracking start date."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            except TrackedProduct.DoesNotExist:
                return Response(
                    {"error": "Tracked product not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            consumption, created = Consumption.objects.get_or_create(
                tracked_product=tracked_product,
                date=date,
                defaults={"quantity": quantity},
            )

            if not created:
                consumption.quantity = quantity
                consumption.save()

            return Response(
                {
                    "success": True,
                    "message": "Consumption added/updated successfully.",
                    "data": {
                        "product": tracked_product.product.name,
                        "quantity": consumption.quantity,
                        "date": str(consumption.date),
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        except Product.DoesNotExist:
            return Response(
                {"success": False, "message": "Product not found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": f"An error occurred: {str(e)}",
                    "data": [],
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(ensure_csrf_cookie, name="dispatch")
class ApiConsumptionsListByTrackedProduct(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            user = request.user
            tracked_product = get_object_or_404(
                TrackedProduct, user=user, id=kwargs["trackedProductId"], end_date=None
            )
            consumptions = Consumption.objects.filter(
                tracked_product=tracked_product
            ).order_by("date")
            serializer = ConsumptionSerializer(consumptions, many=True)
            return Response(
                {
                    "success": True,
                    "message": "Consumptions retrieved successfully.",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response(
                {"success": False, "message": "User not found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Product.DoesNotExist:
            return Response(
                {"success": False, "message": "Product not found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except TrackedProduct.DoesNotExist:
            return Response(
                {"success": False, "message": "Tracked product not found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": f"An error occurred: {str(e)}",
                    "data": [],
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(ensure_csrf_cookie, name="dispatch")
class ApiConsumptionPeriodList(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            user = get_object_or_404(User, id=kwargs["userId"])
            product = get_object_or_404(Product, id=kwargs["productId"])
            start_date = kwargs["start_date"]
            end_date = kwargs["end_date"]
            tracked_product = get_object_or_404(
                TrackedProduct, user=user, product=product, end_date=None
            )
            consumptions = Consumption.objects.filter(
                tracked_product=tracked_product, date__range=[start_date, end_date]
            )
            serializer = ConsumptionSerializer(consumptions, many=True)
            return Response(
                {
                    "success": True,
                    "message": "Consumptions retrieved successfully.",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response(
                {"success": False, "message": "User not found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Product.DoesNotExist:
            return Response(
                {"success": False, "message": "Product not found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except TrackedProduct.DoesNotExist:
            return Response(
                {"success": False, "message": "Tracked product not found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": f"An error occurred: {str(e)}",
                    "data": [],
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(ensure_csrf_cookie, name="dispatch")
class ApiConsumptionDetail(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            product = get_object_or_404(Product, id=kwargs["productId"])
            date = kwargs["date"]
            tracked_product = get_object_or_404(
                TrackedProduct, user=request.user, product=product, end_date=None
            )
            try:
                consumption = Consumption.objects.get(
                    tracked_product=tracked_product, date=date
                )
            except Consumption.DoesNotExist:
                consumption = Consumption.objects.create(
                    tracked_product=tracked_product, date=date, quantity=0
                )

            serializer = ConsumptionSerializer(consumption)
            return Response(
                {
                    "success": True,
                    "message": "Consumption retrieved successfully.",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        except User.DoesNotExist:
            return Response(
                {"success": False, "message": "User not found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Product.DoesNotExist:
            return Response(
                {"success": False, "message": "Product not found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except TrackedProduct.DoesNotExist:
            return Response(
                {"success": False, "message": "Tracked product not found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": f"An error occurred: {str(e)}",
                    "data": [],
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(ensure_csrf_cookie, name="dispatch")
class ApiConsumptionsList(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            user = get_object_or_404(User, id=kwargs["userId"])
            start_date_str = kwargs["start_date"]
            end_date_str = kwargs["end_date"]

            # Convertir les chaînes en objets date
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()

            # Filtrer les consommations pour l'utilisateur et la plage de dates
            consumptions = Consumption.objects.filter(
                tracked_product__user=user, date__range=[start_date, end_date]
            )

            # Utiliser le sérialiseur modifié
            serializer = ConsumptionSerializer(consumptions, many=True)
            return Response(
                {
                    "success": True,
                    "message": "Consumptions retrieved successfully.",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        except User.DoesNotExist:
            return Response(
                {"success": False, "message": "User not found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": f"An error occurred: {str(e)}",
                    "data": [],
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(ensure_csrf_cookie, name="dispatch")
class ApiTrackingFrequenciesList(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        try:
            tracking_frequencies = TrackingFrequency.objects.all()
            serializer = TrackingFrequencySerializer(tracking_frequencies, many=True)
            return Response(
                {
                    "success": True,
                    "message": "Tracking frequencies retrieved successfully.",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except TrackingFrequency.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "No tracking frequencies found.",
                    "data": [],
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": f"An error occurred: {str(e)}",
                    "data": [],
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(csrf_protect, name="dispatch")
class ApiDeleteTrackedProduct(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def delete(self, request, *args, **kwargs):
        try:
            user = request.user
            tracked_product = TrackedProduct.objects.get(
                user=user, id=kwargs["trackedProductId"]
            )
            tracked_product.delete()
            return Response(
                {
                    "success": True,
                    "message": "Tracked product deleted successfully.",
                },
                status=status.HTTP_200_OK,
            )
        except TrackedProduct.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Tracked product not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": f"An error occurred: {str(e)}",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(ensure_csrf_cookie, name="dispatch")
class ApiPauseTrackedProduct(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def patch(self, request, *args, **kwargs):
        try:
            user = request.user
            tracked_product = TrackedProduct.objects.get(
                user=user, id=kwargs["trackedProductId"]
            )
            tracked_product.end_date = datetime.now().date()
            tracked_product.save()
            return Response(
                {
                    "success": True,
                    "message": "Tracked product paused successfully.",
                },
                status=status.HTTP_200_OK,
            )
        except TrackedProduct.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Tracked product not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": f"An error occurred: {str(e)}",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(ensure_csrf_cookie, name="dispatch")
class ApiUnpauseTrackedProduct(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def patch(self, request, *args, **kwargs):
        try:
            user = request.user
            tracked_product = TrackedProduct.objects.get(
                user=user, id=kwargs["trackedProductId"]
            )
            tracked_product.end_date = None
            tracked_product.save()

            return Response(
                {
                    "success": True,
                    "message": "Tracked product reactivated successfully.",
                },
                status=status.HTTP_200_OK,
            )
        except TrackedProduct.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Tracked product not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": f"An error occurred: {str(e)}",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
