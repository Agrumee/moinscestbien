import { useState, useEffect } from "react";
import Calendar from "react-calendar"; // Import standard de Calendar
import "./CalendarComponent.scss";

// Définition du type attendu pour la valeur de la date
type Value = Date | [Date, Date] | null;

interface CalendarComponentProps {
  value: Date; // La prop `value` reste une date unique
  onDateChange: (newValue: Date | null) => void; // La fonction `onDateChange` prend une `Date` ou `null`
}

const CalendarComponent = ({
  value: initialDate,
  onDateChange,
}: CalendarComponentProps) => {
  const [value, setValue] = useState<Date | null>(initialDate || new Date());

  // Désactive les dates futures
  const disableFutureDates = ({ date }: { date: Date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialise l'heure pour ne comparer que la date
    return date > today; // Désactive les dates futures
  };

  useEffect(() => {
    // Chaque fois que la date change localement, on appelle la prop `onDateChange`
    if (onDateChange) {
      onDateChange(value);
    }
  }, [value, onDateChange]);

  // Gestion du changement de date
  const handleDateChange = (newValue: Value) => {
    if (newValue instanceof Date) {
      setValue(newValue); // Si `newValue` est une seule date, on la prend
      onDateChange(newValue);
    } else if (Array.isArray(newValue)) {
      setValue(newValue[0]); // Si `newValue` est une plage de dates, on prend la première
      onDateChange(newValue[0]);
    } else {
      setValue(null); // Si `newValue` est null
      onDateChange(null);
    }
  };

  return (
    <div className="a-calendar">
      <Calendar
        onChange={handleDateChange} // Gère le changement de date
        value={value} // Date actuelle
        tileDisabled={disableFutureDates} // Désactive les dates futures
      />
    </div>
  );
};

export default CalendarComponent;
