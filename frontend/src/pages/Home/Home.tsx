import { useEffect, useState } from "react";
import { useNavigateWithScroll } from "../../hooks/useNavigateWithScroll";
import { useAuth } from "../../hooks/useAuth";
import Accordion from "../../components/organisms/Accordion/Accordion";
import DesktopButtons from "../../components/molecules/DesktopButtons/DesktopButtons";
import HabitPanel from "../../components/organisms/HabitPanel/HabitPanel";
import fetchAPI from "../../utils/fetch";
import { TrackedHabit } from "../../types/tracked-habit.model";
import { ConsumptionsListByTrackedHabitId } from "../../types/consumption.model";
import "./Home.scss"

const Home = () => {
  const [trackedHabits, setTrackedHabits] = useState<TrackedHabit[]>([]);
  const [desktopTrackedHabit, setDesktopTrackedHabit] = useState<TrackedHabit>()
  const [enabledTrackedHabits, setEnabledTrackedHabits] = useState<number[]>([]);
  const [ConsumptionsListByTrackedHabitId, setConsumptionsListByTrackedHabitId] = useState<ConsumptionsListByTrackedHabitId>(
    {}
  );
  const [currentConsumptionByTrackedHabitId, setCurrentConsumptionByTrackedHabitId] = useState<{
    [key: number]: number;
  }>({});
  const [date, setDate] = useState<string>("");
  const navigate = useNavigateWithScroll();
  const { trackedHabitCount, authenticate } = useAuth();

  useEffect(() => {
    if (trackedHabitCount === 0) {
      navigate("/addnew");
    }
  }, [trackedHabitCount, navigate]);

  useEffect(() => {
    const getHabits = async () => {
      try {
        if (trackedHabitCount > 0) {
          const response = await fetchAPI("/consumptions/tracked-habits", {
            method: "GET",
          });
          setTrackedHabits(response.data);
          setDesktopTrackedHabit(response.data[0])
          addEnabledTrackedHabit(response.data[0].id)
        }
      } catch (error) {
        console.error("Get habits failed", error);
        throw error;
      }
    };

    getHabits();
  }, [trackedHabitCount]);

  useEffect(() => {
    enabledTrackedHabits.forEach((trackedHabitId) => {
      if (!ConsumptionsListByTrackedHabitId[trackedHabitId]) {
        getConsumptions(trackedHabitId);
      }
    });
  }, [ConsumptionsListByTrackedHabitId, enabledTrackedHabits]);


  const getConsumptions = async (trackedHabitId: number) => {
    try {
      const response = await fetchAPI(`/consumptions/tracked-habits/${trackedHabitId}/consumptions`, {
        method: "GET",
      });
      setConsumptionsListByTrackedHabitId((previousConsumptions) => ({
        ...previousConsumptions,
        [trackedHabitId]: response.data,
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
      getConsumptions(trackedHabitId)
    } catch (error) {
      console.error("Update consumption failed", error);
    }
  };

  const handleDeleteTracking = async (trackedHabitId: number) => {
    try {
      await fetchAPI(`/consumptions/tracked-habits/${trackedHabitId}`, {
        method: "DELETE",
      });

      setTrackedHabits((prev) => prev.filter((habit) => habit.id !== trackedHabitId));

      setConsumptionsListByTrackedHabitId((prev) => {
        const updated = { ...prev };
        delete updated[trackedHabitId];
        return updated;
      });

      setCurrentConsumptionByTrackedHabitId((prev) => {
        const updated = { ...prev };
        delete updated[trackedHabitId];
        return updated;
      });

      authenticate();
    } catch (error) {
      console.error("Delete tracked habit failed", error);
    }
  };

  const handlePauseTracking = async (trackedHabitId: number) => {
    try {
      await fetchAPI(`/consumptions/tracked-habits/${trackedHabitId}/pause`, {
        method: "PATCH",
      });

      setTrackedHabits((prev) => prev.filter((habit) => habit.id !== trackedHabitId));

      setConsumptionsListByTrackedHabitId((prev) => {
        const updated = { ...prev };
        delete updated[trackedHabitId];
        return updated;
      });

      setCurrentConsumptionByTrackedHabitId((prev) => {
        const updated = { ...prev };
        delete updated[trackedHabitId];
        return updated;
      });

      authenticate();
    } catch (error) {
      console.error("Pause tracked habit failed", error);
    }
  };

  const addEnabledTrackedHabit = (id: number) => {
    setEnabledTrackedHabits((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
  };



  return (
    <div className="p-home">
      <div className="desktop-container">
        <DesktopButtons setCurrentTrackedHabit={setDesktopTrackedHabit} setEnabledTrackedHabits={addEnabledTrackedHabit} enabledTrackedHabits={enabledTrackedHabits} trackedHabits={trackedHabits} />
        {
          desktopTrackedHabit &&
          <HabitPanel key={desktopTrackedHabit.id}
            trackedHabit={desktopTrackedHabit}
            consumptions={ConsumptionsListByTrackedHabitId[desktopTrackedHabit.id] || []}
            currentConsumption={currentConsumptionByTrackedHabitId[desktopTrackedHabit.id] || 0}
            onDateChange={(date) => handleDateChange(desktopTrackedHabit.id, date)}
            onUpdateConsumption={(quantity) =>
              handleUpdateConsumption(desktopTrackedHabit.id, date, quantity)
            }
            frequency={desktopTrackedHabit.tracking_frequency.name}
            deleteTracking={() => handleDeleteTracking(desktopTrackedHabit.id)}
            pauseTracking={() => handlePauseTracking(desktopTrackedHabit.id)} />
        }
      </div>
      <div className="mobile-container">
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
            setEnabledTrackedHabits={addEnabledTrackedHabit}
            frequency={trackedHabit.tracking_frequency.name}
            deleteTracking={() => handleDeleteTracking(trackedHabit.id)}
            pauseTracking={() => handlePauseTracking(trackedHabit.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
