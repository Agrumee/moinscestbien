import { useState } from "react";
import CalendarComponent from "../../atoms/Calendar/Calendar";
import Icon from "../../atoms/Icon/Icon";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import "./CalendarButton.scss";

const CalendarButton = () => {
  const [display, setDisplay] = useState("none");
  const [date, setDate] = useState<Date | null>(null);

  const toggleDisplay = () => {
    setDisplay((prevDisplay) => (prevDisplay === "none" ? "" : "none"));
  };

  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);
  };

  return (
    <div>
      <div className="m-calendar-button">
        {date && <Paragraph color="white" content={date.toDateString()} />}
        <Icon name="calendar" size="small" color="white" onClick={toggleDisplay} />
      </div>
      <div style={{ display: display }}>
        <CalendarComponent onDateChange={handleDateChange} />
      </div>
    </div>
  );
};

export default CalendarButton;
