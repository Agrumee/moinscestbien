from django.urls import path
from .views import (
    ApiHabitsList,
    ApiUnitsList,
    ApiMotivationsList,
    ApiTrackedHabitsList,
    ApiAddConsumption,
    ApiConsumptionByDate,
    ApiConsumptionsListByTrackedHabit,
    ApiTrackingFrequenciesList,
    ApiDeleteTrackedHabit,
    ApiPauseTrackedHabit,
    ApiUnpauseTrackedHabit,
    ApiPausedTrackedHabitsList,
)

urlpatterns = [
    path("habits", ApiHabitsList.as_view(), name="habits"),
    path("habits/<int:habit_id>/units", ApiUnitsList.as_view(), name="units"),
    path(
        "habits/<int:habit_id>/motivations",
        ApiMotivationsList.as_view(),
        name="motivations",
    ),
    path(
        "tracked-habits",
        ApiTrackedHabitsList.as_view(),
        name="tracked-habits",
    ),
    path(
        "tracked-habits/paused",
        ApiPausedTrackedHabitsList.as_view(),
        name="paused-tracked-habits",
    ),
    path(
        "tracked-habits/<int:tracked_habit_id>",
        ApiDeleteTrackedHabit.as_view(),
        name="delete-tracked-habit",
    ),
    path(
        "tracked-habits/<int:tracked_habit_id>/consumptions",
        ApiConsumptionsListByTrackedHabit.as_view(),
        name="consumptions-by-habit",
    ),
    path(
        "tracked-habits/<int:tracked_habit_id>/consumptions/add-consumption",
        ApiAddConsumption.as_view(),
        name="add-consumption",
    ),
    path(
        "tracked-habits/<int:tracked_habit_id>/consumptions/<str:date>",
        ApiConsumptionByDate.as_view(),
        name="consumptions-by-date",
    ),
    path(
        "tracked-habits/<int:tracked_habit_id>/pause",
        ApiPauseTrackedHabit.as_view(),
        name="pause-tracked-habit",
    ),
    path(
        "tracked-habits/<int:tracked_habit_id>/unpause",
        ApiUnpauseTrackedHabit.as_view(),
        name="unpause-tracked-habit",
    ),
    path(
        "tracking-frequencies",
        ApiTrackingFrequenciesList.as_view(),
        name="tracking-frequencies",
    ),
]
