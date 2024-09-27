import { useState, useEffect, useRef } from "react";
import CalendarComponent from "../../atoms/CalendarComponent/CalendarComponent";
import Icon from "../../atoms/Icon/Icon";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import "./CalendarButton.scss";

const CalendarButton = () => {
  const [display, setDisplay] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const calendarRef = useRef<HTMLDivElement | null>(null);

  const toggleDisplay = () => {
    setDisplay((prevDisplay) => !prevDisplay);
  };

  const handleDateChange = (selectedDate: Date | null) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  useEffect(() => {
    if (date) {
      setDisplay(false);
    }
  }, [date]);

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
        {isToday(date) ? (
          <Paragraph color="white" content="Aujourd'hui" />
        ) : (
          <Paragraph
            color="white"
            content={date.toLocaleDateString("fr-FR", {
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
          {" "}
          <CalendarComponent value={date} onDateChange={handleDateChange} />
        </div>
      )}
    </div>
  );
};

export default CalendarButton;
