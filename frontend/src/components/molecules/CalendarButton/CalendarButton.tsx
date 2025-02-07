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
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleDisplay = () => {
    // Si un timeout existe (c'est-à-dire qu'on vient de fermer le calendrier), on empêche la réouverture immédiate
    if (closeTimeoutRef.current) {
      return;
    }

    setDisplay((prevDisplay) => !prevDisplay);
  };

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

        // Empêche l’icône de rouvrir immédiatement après la fermeture
        closeTimeoutRef.current = setTimeout(() => {
          closeTimeoutRef.current = null;
        }, 200);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
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
          <Paragraph color="white" content="Aujourd'hui" size="medium" />
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
