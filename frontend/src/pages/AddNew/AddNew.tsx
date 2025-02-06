import Dropdown from "../../components/molecules/Dropdown/Dropdown";
import Label from "../../components/atoms/Label/Label";
import Heading from "../../components/atoms/Heading/Heading";
import Button from "../../components/atoms/Button/Button";
import Paragraph from "../../components/atoms/Paragraph/Paragraph";
import { Habit, Unit, Motivation, TrackingFrequency, Frequency } from "../../types/tracked-habit.model";

import { useEffect, useState } from "react";
import { useNavigateWithScroll } from "../../hooks/useNavigateWithScroll";
import { useAuth } from "../../hooks/useAuth";

import fetchAPI from "../../utils/fetch";

import "./AddNew.scss";



const AddNew = () => {
  const navigate = useNavigateWithScroll();
  const [currentHabit, setCurrentHabit] = useState<Habit | null>(
    null
  );
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);
  const [currentMotivation, setCurrentMotivation] =
    useState<Motivation | null>(null);
  const [currentTrackingFrequency, setCurrentTrackingFrequency] =
    useState<TrackingFrequency | null>(null);
  const [habitsList, setHabitsList] = useState<Habit[]>([]);
  const [unitsList, setUnitsList] = useState<Unit[]>([]);
  const [motivationsList, setMotivationsList] = useState<Motivation[]>([]);
  const [trackingFrequenciesList, setTrackingFrequenciesList] =
    useState<TrackingFrequency[]>([]);
  const { trackedHabitCount } = useAuth();

  const handleAddNewHabit = async () => {
    try {
      await fetchAPI(
        `/consumptions/tracked-habits`,
        {
          method: "POST",
          body: {
            habit_id: currentHabit?.id,
            unit_id: currentUnit?.id,
            motivation_id: currentMotivation?.id,
            tracking_frequency_id: currentTrackingFrequency?.id,
          },
        }
      );
      navigate("/");
    } catch (error) {
      console.error("Error during add new habit", error);
    }
  };

  const getHabitsList = async () => {
    try {
      const response = await fetchAPI(`/consumptions/habits`, {
        method: "GET",
      });
      setHabitsList(response.data);
    } catch (error) {
      console.error("Error during fetching habits:", error);
    }
  };

  const getUnitsList = async (habitId: number) => {
    try {
      const response = await fetchAPI(`/consumptions/habits/${habitId}/units`, {
        method: "GET",
      });
      setUnitsList(response.data);
    } catch (error) {
      console.error("Error during fetching units:", error);
    }
  };

  const getMotivationsList = async (habitId: number) => {
    try {
      const response = await fetchAPI(`/consumptions/habits/${habitId}/motivations`, {
        method: "GET",
      });
      setMotivationsList(response.data);
    } catch (error) {
      console.error("Error during fetching units:", error);
    }
  };

  const getTrackingFrequenciesList = async () => {
    try {
      const response = await fetchAPI(`/consumptions/tracking-frequencies`, {
        method: "GET",
      });
      setTrackingFrequenciesList(response.data);
    } catch (error) {
      console.error("Error during fetching tracking frequencies:", error);
    }
  }

  useEffect(() => {
    getHabitsList();
    getTrackingFrequenciesList();
  }, []);

  useEffect(() => {
    if (currentHabit) {
      getUnitsList(currentHabit.id);
      getMotivationsList(currentHabit.id);
    }
  }, [currentHabit]);

  return (
    <div className="p-addnew">
      <Heading
        className="a-add-new-title"
        level={2}
        content="Suivre une nouvelle habitude"
      />
      {
        trackedHabitCount === 0 &&
        <div className="p-addnew_instructions">
          <Paragraph content="Pour commencer, veuillez choisir une habitude de consommation sur laquelle vous souhaitez évoluer." size="big" color="black" />
        </div>
      }
      <div className="a-add-new_form">
        <div className="a-add-new_dropdown_with_label">
          <Label content="Habitude :" />
          <Dropdown
            label={
              currentHabit ? currentHabit.name : "Que voulez-vous suivre ?"
            }
            contentList={habitsList}
            onSelect={(selectedHabit: Habit) =>
              setCurrentHabit(selectedHabit)
            }
          />
        </div>
        <div className="a-add-new_dropdown_with_label">
          <Label content="Unité :" />
          <Dropdown
            label={currentUnit ? currentUnit.name : "De quelle façon compter ?"}
            contentList={unitsList}
            onSelect={(selectedUnit: Unit) => setCurrentUnit(selectedUnit)}
          />
        </div>
        <div className="a-add-new_dropdown_with_label">
          <Label content="Motivation :" />
          <Dropdown
            label={
              currentMotivation ? currentMotivation.name : "Pour quelle raison ?"
            }
            contentList={motivationsList}
            onSelect={(selectedMotivation: Motivation) =>
              setCurrentMotivation(selectedMotivation)
            }
          /></div>
        <div className="a-add-new_dropdown_with_label">
          <Label content="Fréquence de suivi :" />
          <Dropdown<Frequency>
            label={
              currentTrackingFrequency
                ? currentTrackingFrequency.name
                : "A quelle fréquence ?"
            }
            contentList={trackingFrequenciesList}
            onSelect={(selectedTrackingFrequency: TrackingFrequency) =>
              setCurrentTrackingFrequency(selectedTrackingFrequency)
            }
          />
        </div>
      </div>
      <Button
        className="a-add-new-button"
        variant="primary"
        size="large"
        content="Ajouter"
        onClick={handleAddNewHabit}
        disabled={!currentHabit || !currentUnit || !currentMotivation || !currentTrackingFrequency}
      />
    </div>
  );
};

export default AddNew;
