import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "./CalendarComponent.scss";

interface CalendarComponentProps {
  startDate: Date;
  value: Date;
  onDateChange: (newValue: Date | null) => void;
}

const CalendarComponent = ({
  startDate,
  value: initialDate,
  onDateChange,
}: CalendarComponentProps) => {
  const [value, setValue] = useState<Date | null>(initialDate || new Date());

  const disableDates = ({ date }: { date: Date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    return date < start || date > today;
  };

  return (
    <div className="a-calendar">
      <Calendar
        onChange={onDateChange}
        value={value}
        tileDisabled={disableDates}
      />
    </div>
  );
};

export default CalendarComponent;
