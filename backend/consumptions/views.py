from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import (
    Habit,
    Consumption,
    TrackedHabit,
    Unit,
    Motivation,
    TrackingFrequency,
)
from accounts.models import User
from .serializers import (
    HabitSerializer,
    UnitSerializer,
    ConsumptionSerializer,
    MotivationSerializer,
    TrackedHabitSerializer,
    TrackingFrequencySerializer,
)
from datetime import datetime
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.utils.decorators import method_decorator

from rest_framework.permissions import AllowAny, IsAuthenticated


class ApiHabitsList(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        try:
            user = request.user
            user_tracked_habits = TrackedHabit.objects.filter(
                user=user, end_date=None
            ).values_list("habit", flat=True)
            user_untracked_habits = Habit.objects.exclude(id__in=user_tracked_habits)
            serializer = HabitSerializer(user_untracked_habits, many=True)
            return Response(
                {
                    "success": True,
                    "message": "Habits retrieved successfully.",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except Habit.DoesNotExist:
            return Response(
                {"success": False, "message": "No habits found.", "data": []},
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


class ApiUnitsList(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request, *args, **kwargs):
        try:
            habit = Habit.objects.get(id=kwargs["habit_id"])
            user = request.user
            tracked_habit = user.tracked_habits.filter(habit=habit).first()
            if tracked_habit:
                units = Unit.objects.filter(id=tracked_habit.unit.id)
            else:
                units = habit.units.all()
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
        except Habit.DoesNotExist:
            return Response(
                {"success": False, "message": "No habit found.", "data": []},
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


class ApiMotivationsList(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, *args, **kwargs):
        try:
            habit = Habit.objects.get(id=kwargs["habit_id"])
            motivations = habit.motivations.all()
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
        except Habit.DoesNotExist:
            return Response(
                {"success": False, "message": "No habit found.", "data": []},
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
class ApiTrackedHabitsList(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            user = request.user
            tracked_habits = user.tracked_habits.filter(end_date=None).order_by(
                "start_date"
            )
            serializer = TrackedHabitSerializer(tracked_habits, many=True)
            if tracked_habits:
                return Response(
                    {
                        "success": True,
                        "message": "Habits retrieved successfully.",
                        "data": serializer.data,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"success": False, "message": "No habits found.", "data": []},
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

    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            habit_id = request.data.get("habit_id")
            unit_id = request.data.get("unit_id")
            motivation_id = request.data.get("motivation_id")
            tracking_frequency_id = request.data.get("tracking_frequency_id")

            habit = Habit.objects.get(id=habit_id)
            unit = Unit.objects.get(id=unit_id)
            motivation = Motivation.objects.get(id=motivation_id)
            tracking_frequency = TrackingFrequency.objects.get(id=tracking_frequency_id)

            tracked_habit = TrackedHabit.objects.filter(
                user=user, habit=habit, unit=unit
            ).first()

            if tracked_habit:
                if tracked_habit.end_date is not None:
                    tracked_habit.end_date = None
                    tracked_habit.motivation = motivation
                    tracked_habit.tracking_frequency = tracking_frequency
                    tracked_habit.save()

                    return Response(
                        {
                            "success": True,
                            "message": f"{habit.name} tracking reactivated for {user.username}.",
                        },
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {
                            "success": False,
                            "message": f"{habit.name} is already assigned to {user.username}.",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                tracked_habit = TrackedHabit.objects.create(
                    user=user,
                    habit=habit,
                    unit=unit,
                    motivation=motivation,
                    tracking_frequency=tracking_frequency,
                )

                return Response(
                    {
                        "success": True,
                        "message": f"{habit.name} assigned successfully to {user.username}.",
                    },
                    status=status.HTTP_201_CREATED,
                )

        except Habit.DoesNotExist:
            return Response(
                {"success": False, "message": "No habit found.", "data": []},
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


class ApiPausedTrackedHabitsList(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            user = request.user
            tracked_habits = user.tracked_habits.filter(
                end_date__isnull=False
            ).order_by("start_date")
            serializer = TrackedHabitSerializer(tracked_habits, many=True)
            if tracked_habits:
                return Response(
                    {
                        "success": True,
                        "message": "Habits retrieved successfully.",
                        "data": serializer.data,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"success": False, "message": "No habits found.", "data": []},
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
            tracked_habit_id = kwargs.get("tracked_habit_id")
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
                tracked_habit = TrackedHabit.objects.get(id=tracked_habit_id)

                if tracked_habit.user != user:
                    return Response(
                        {
                            "success": False,
                            "message": "The habit is not tracked by this user.",
                            "data": [],
                        },
                        status=status.HTTP_401_UNAUTHORIZED,
                    )

                if date > date.today():
                    return Response(
                        {"error": "The date cannot be in the future."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if date < tracked_habit.start_date:
                    return Response(
                        {
                            "error": "The date is earlier than the habit's tracking start date."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            except TrackedHabit.DoesNotExist:
                return Response(
                    {"error": "Tracked habit not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            consumption, created = Consumption.objects.get_or_create(
                tracked_habit=tracked_habit,
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
                        "habit": tracked_habit.habit.name,
                        "quantity": consumption.quantity,
                        "date": str(consumption.date),
                    },
                },
                status=status.HTTP_201_CREATED,
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


class ApiConsumptionsListByTrackedHabit(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            user = request.user
            tracked_habit = get_object_or_404(
                TrackedHabit,
                user=user,
                id=kwargs["tracked_habit_id"],
                end_date=None,
            )
            consumptions = Consumption.objects.filter(
                tracked_habit=tracked_habit
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
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": f"An error occurred: {str(e)}",
                    "data": [],
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ApiConsumptionPeriodList(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            user = get_object_or_404(User, id=kwargs["user_id"])
            habit = get_object_or_404(Habit, id=kwargs["habit_id"])
            start_date = kwargs["start_date"]
            end_date = kwargs["end_date"]
            tracked_habit = get_object_or_404(
                TrackedHabit, user=user, habit=habit, end_date=None
            )
            consumptions = Consumption.objects.filter(
                tracked_habit=tracked_habit, date__range=[start_date, end_date]
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
        except Habit.DoesNotExist:
            return Response(
                {"success": False, "message": "Habit not found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except TrackedHabit.DoesNotExist:
            return Response(
                {"success": False, "message": "Tracked habit not found.", "data": []},
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


class ApiConsumptionDetail(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            date = kwargs["date"]
            tracked_habit = TrackedHabit.objects.get(id=kwargs["tracked_habit_id"])
            try:
                consumption = Consumption.objects.get(
                    tracked_habit=tracked_habit, date=date
                )
            except Consumption.DoesNotExist:
                consumption = Consumption.objects.create(
                    tracked_habit=tracked_habit, date=date, quantity=0
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
        except Habit.DoesNotExist:
            return Response(
                {"success": False, "message": "Habit not found.", "data": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        except TrackedHabit.DoesNotExist:
            return Response(
                {"success": False, "message": "Tracked habit not found.", "data": []},
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
class ApiDeleteTrackedHabit(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def delete(self, request, *args, **kwargs):
        try:
            user = request.user
            tracked_habit = TrackedHabit.objects.get(
                user=user, id=kwargs["tracked_habit_id"]
            )
            tracked_habit.delete()
            return Response(
                {
                    "success": True,
                    "message": "Tracked habit deleted successfully.",
                },
                status=status.HTTP_200_OK,
            )
        except TrackedHabit.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Tracked habit not found.",
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


@method_decorator(csrf_protect, name="dispatch")
class ApiPauseTrackedHabit(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def patch(self, request, *args, **kwargs):
        try:
            user = request.user
            tracked_habit = TrackedHabit.objects.get(
                user=user, id=kwargs["tracked_habit_id"]
            )
            tracked_habit.end_date = datetime.now().date()
            tracked_habit.save()
            return Response(
                {
                    "success": True,
                    "message": "Tracked habit paused successfully.",
                },
                status=status.HTTP_200_OK,
            )
        except TrackedHabit.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Tracked habit not found.",
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


@method_decorator(csrf_protect, name="dispatch")
class ApiUnpauseTrackedHabit(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def patch(self, request, *args, **kwargs):
        try:
            user = request.user
            tracked_habit = TrackedHabit.objects.get(
                user=user, id=kwargs["tracked_habit_id"]
            )
            tracked_habit.end_date = None
            tracked_habit.save()

            return Response(
                {
                    "success": True,
                    "message": "Tracked habit reactivated successfully.",
                },
                status=status.HTTP_200_OK,
            )
        except TrackedHabit.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Tracked habit not found.",
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
