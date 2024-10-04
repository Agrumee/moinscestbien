import { useState, useEffect, useRef } from "react";
import CalendarComponent from "../../atoms/CalendarComponent/CalendarComponent";
import Icon from "../../atoms/Icon/Icon";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import "./CalendarButton.scss";

interface CalendarProps {
  initialDate?: Date;
  period?: Array<{ start_date: Date; end_date: Date }>;
  onDateChange?: (initialDate: Date | null) => void;
}

const CalendarButton: React.FC<CalendarProps> = ({
  initialDate,
  period,
  onDateChange, // Assurez-vous de passer cette prop
}) => {
  const [display, setDisplay] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialDate ? new Date(initialDate) : new Date()
  );
  const calendarRef = useRef<HTMLDivElement | null>(null);

  const toggleDisplay = () => {
    setDisplay((prevDisplay) => !prevDisplay);
  };

  // Effect pour fermer le calendrier lorsque la date est sélectionnée
  useEffect(() => {
    if (selectedDate) {
      setDisplay(false);
      // Appel de la fonction onDateChange si elle est définie
      if (onDateChange) {
        onDateChange(selectedDate);
      }
    }
  }, [selectedDate, onDateChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setDisplay(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isInPeriod = (date: Date) => {
    if (!period) return false; // Si aucune période n'est définie, retourner faux
    return period.some(({ start_date, end_date }) => {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      return date >= startDate && date <= endDate;
    });
  };

  return (
    <div>
      <div className="m-calendar-button">
        {isToday(selectedDate) ? (
          <Paragraph color="white" content="Aujourd'hui" />
        ) : (
          <Paragraph
            color="white"
            content={selectedDate.toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
        )}
        {isInPeriod(selectedDate) && <span>Période active</span>}
        <Icon
          name="calendar"
          size="small"
          color="white"
          onClick={toggleDisplay}
        />
      </div>
      {display && (
        <div ref={calendarRef}>
          <CalendarComponent
            value={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarButton;
