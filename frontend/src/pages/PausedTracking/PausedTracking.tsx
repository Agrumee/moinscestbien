import { useEffect, useState } from "react";
import { useNavigateWithScroll } from "../../hooks/useNavigateWithScroll";
import { useAuth } from "../../hooks/useAuth";

import Accordion from "../../components/organisms/Accordion/Accordion";
import fetchAPI from "../../utils/fetch";
import { TrackedHabit } from "../../types/tracked-habit.model";
import { ConsumptionsListByTrackedHabitId } from "../../types/consumption.model";
import "./PausedTracking.scss"


const PausedTracking = () => {
  const [trackedHabits, setTrackedHabits] = useState<TrackedHabit[]>([]);
  const [ConsumptionsListByTrackedHabitId, setConsumptionsListByTrackedHabitId] = useState<ConsumptionsListByTrackedHabitId>(
    {}
  );
  const [currentConsumptionByTrackedHabitId, setCurrentConsumptionByTrackedHabitId] = useState<{
    [key: number]: number;
  }>({});
  const [date, setDate] = useState<string>("");
  const navigate = useNavigateWithScroll();
  const { pausedTrackedHabitCount, authenticate } = useAuth();

  useEffect(() => {
    authenticate()
    if (pausedTrackedHabitCount === 0) {
      navigate("/home");
    }
  }, [pausedTrackedHabitCount, trackedHabits, navigate]);

  useEffect(() => {
    const getHabits = async () => {
      try {
        const response = await fetchAPI("/consumptions/tracked-habits/paused", {
          method: "GET",
        });
        setTrackedHabits(response.data);
      } catch (error) {
        console.error("Get habits failed", error);
        throw error;
      }
    };

    getHabits();
  }, []);

  // Déclenchement de getConsumptions lorsque currentconsumption est mis à jour
  useEffect(() => {
    for (let habitId in currentConsumptionByTrackedHabitId) {
      getConsumptions(Number(habitId));

    }
  }, [currentConsumptionByTrackedHabitId]);

  // Récupérer les consommations pour un produit lorsque l'accordéon est ouvert
  const getConsumptions = async (habitId: number) => {
    try {
      const response = await fetchAPI(`/consumptions/${habitId}`, {
        method: "GET",
      });
      setConsumptionsListByTrackedHabitId((previousConsumptions) => ({
        ...previousConsumptions,
        [habitId]: response.data,
      }));
    } catch (error) {
      console.error("Get consumptions failed", error);
      throw error;
    }
  };

  //Récupération de la date à updater
  const handleDateChange = async (trackedHabitId: number, date: string) => {
    try {
      const data = await fetchAPI(`/consumptions/${trackedHabitId}/${date}/`, {
        method: "GET",
      });
      setCurrentConsumptionByTrackedHabitId((prev) => ({
        ...prev,
        [trackedHabitId]: data.data.quantity,
      }));
      setDate(date);
    } catch (error) {
      console.error("Get consumption by date failed", error);
      throw error;
    }
  };

  // maj des données de consommation en fonction d'une date
  const handleUpdateConsumption = async (
    trackedHabitId: number,
    date: string,
    quantity: number
  ) => {
    try {
      const response = await fetchAPI(`/consumptions/${trackedHabitId}/add-consumption/`, {
        method: "POST",
        body: { date: date, quantity: quantity },
        headers: {
          "Content-Type": "application/json",
        },
      });

      setCurrentConsumptionByTrackedHabitId((prev) => ({
        ...prev,
        [trackedHabitId]: response.data.quantity,
      }));
    } catch (error) {
      console.error("Update consumption failed", error);
    }
  };

  const handleDeleteTracking = async (trackedHabitId: number) => {
    try {
      await fetchAPI(`/consumptions/tracked-habits/${trackedHabitId}/delete`, {
        method: "DELETE",
      });
      setTrackedHabits((prev) =>
        prev.filter((trackedHabit) => trackedHabit.id !== trackedHabitId)
      );
    } catch (error) {
      console.error("Delete tracked habit failed", error);
    }
  }

  const handleUnPauseTracking = async (trackedHabitId: number) => {
    try {
      await fetchAPI(`/consumptions/tracked-habits/${trackedHabitId}/unpause`, {
        method: "PATCH",
      });
      setTrackedHabits((prev) =>
        prev.filter((trackedHabit) => trackedHabit.id !== trackedHabitId)
      );
    } catch (error) {
      console.error("Unpause tracked habit failed", error);
    }
  }

  return (
    <div className="p-pausedtracking">
      {trackedHabits.map((trackedHabit: TrackedHabit) => (
        <Accordion
          key={trackedHabit.id}
          trackedHabit={trackedHabit}
          consumptions={ConsumptionsListByTrackedHabitId[trackedHabit.id] || []}
          currentConsumption={
            currentConsumptionByTrackedHabitId[trackedHabit.id] || 0
          }
          onDateChange={(date) =>
            handleDateChange(trackedHabit.id, date)
          }
          onUpdateConsumption={(quantity) =>
            handleUpdateConsumption(trackedHabit.id, date, quantity)
          }
          frequency={trackedHabit.tracking_frequency.name}
          deleteTracking={() => handleDeleteTracking(trackedHabit.id)}
          unpauseTracking={() => handleUnPauseTracking(trackedHabit.id)}
        />
      ))}
    </div>
  );
}

export default PausedTracking;
