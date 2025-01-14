import { useEffect, useState } from "react";
import Accordion from "../components/organisms/Accordion/Accordion";
import fetchAPI from "../utils/fetch";
import { TrackedHabit } from "../types/tracked-habit.model";
import { ConsumptionsListByTrackedHabitId } from "../types/consumption.model";
import "./Home.scss"

const Home = () => {
  const [trackedHabits, setTrackedHabits] = useState<TrackedHabit[]>([]);
  const [ConsumptionsListByTrackedHabitId, setConsumptionsListByTrackedHabitId] = useState<ConsumptionsListByTrackedHabitId>(
    {}
  );
  const [currentConsumptionByTrackedHabitId, setCurrentConsumptionByTrackedHabitId] = useState<{
    [key: number]: number;
  }>({});
  const [date, setDate] = useState<string>("");


  useEffect(() => {
    const getHabits = async () => {
      try {
        const response = await fetchAPI("/consumptions/tracked-habits", {
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

  useEffect(() => {
    for (let habitId in currentConsumptionByTrackedHabitId) {
      getConsumptions(Number(habitId));
    }
  }, [currentConsumptionByTrackedHabitId]);

  const getConsumptions = async (habitId: number) => {
    try {
      const response = await fetchAPI(`/consumptions/tracked-habits/${habitId}/consumptions`, {
        method: "GET",
      });
      setConsumptionsListByTrackedHabitId((previousConsumptions) => ({
        ...previousConsumptions,
        [habitId]: response.data,
      }));
    } catch (error) {
      console.error("Get consumptions failed", error);
    }
  };

  const handleDateChange = async (trackedHabitId: number, date: string) => {
    try {
      const data = await fetchAPI(`/consumptions/tracked-habits/${trackedHabitId}/consumptions/${date}`, {
        method: "GET",
      });
      setCurrentConsumptionByTrackedHabitId((prev) => ({
        ...prev,
        [trackedHabitId]: data.data.quantity,
      }));
      setDate(date);
    } catch (error) {
      console.error("Get consumption by date failed", error);
    }
  };

  const handleUpdateConsumption = async (
    trackedHabitId: number,
    date: string,
    quantity: number
  ) => {
    try {
      const response = await fetchAPI(`/consumptions/tracked-habits/${trackedHabitId}/consumptions/add-consumption`, {
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
      await fetchAPI(`/consumptions/tracked-habits/${trackedHabitId}`, {
        method: "DELETE",
      });
      setTrackedHabits((prev) =>
        prev.filter((habit) => habit.id !== trackedHabitId)
      );
    } catch (error) {
      console.error("Delete tracked habit failed", error);
    }
  };

  const handlePauseTracking = async (trackedHabitId: number) => {
    try {
      await fetchAPI(`/consumptions/tracked-habits/${trackedHabitId}/pause`, {
        method: "PATCH",
      });
      setTrackedHabits((prev) =>
        prev.filter((habit) => habit.id !== trackedHabitId)
      );
    } catch (error) {
      console.error("Pause tracked habit failed", error);
    }
  };

  return (
    <div className="p-home">
      {trackedHabits.map((trackedHabit: TrackedHabit) => (
        <Accordion
          key={trackedHabit.id}
          trackedHabit={trackedHabit}
          consumptions={ConsumptionsListByTrackedHabitId[trackedHabit.id] || []}
          currentConsumption={currentConsumptionByTrackedHabitId[trackedHabit.id] || 0}
          onDateChange={(date) => handleDateChange(trackedHabit.id, date)}
          onUpdateConsumption={(quantity) =>
            handleUpdateConsumption(trackedHabit.id, date, quantity)
          }
          frequency={trackedHabit.tracking_frequency.name}
          deleteTracking={() => handleDeleteTracking(trackedHabit.id)}
          pauseTracking={() => handlePauseTracking(trackedHabit.id)}
        />
      ))}
    </div>
  );
};

export default Home;
