import { useState, useEffect, useRef } from "react";
import CalendarComponent from "../../atoms/CalendarComponent/CalendarComponent";
import Icon from "../../atoms/Icon/Icon";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import "./CalendarButton.scss";

interface CalendarProps {
  startDate: Date;
  initialDate?: Date;
  onDateChange?: (initialDate: Date | null) => void;
}

const CalendarButton: React.FC<CalendarProps> = ({
  startDate,
  initialDate,
  onDateChange,
}) => {
  const [display, setDisplay] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialDate ? new Date(initialDate) : new Date()
  );
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const previousDateRef = useRef<Date | null>(null);

  const toggleDisplay = () => {
    setDisplay((prevDisplay) => !prevDisplay);
  };

  //Gestion des changements de date pour maj les données de l'input
  useEffect(() => {
    if (selectedDate && selectedDate !== previousDateRef.current) {
      setDisplay(false);
      previousDateRef.current = selectedDate;
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
            startDate={startDate}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarButton;
