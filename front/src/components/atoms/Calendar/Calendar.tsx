import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "./Calendar.scss";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalendarComponentProps {
  onDateChange: (
    value: Value,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
}

const CalendarComponent = ({ onDateChange }: CalendarComponentProps) => {
  const [value, setValue] = useState<Date>(new Date());

  const disableFutureDates = ({ date }: { date: Date }) => {
    const today = new Date();
    return date > today;
  };

  useEffect(() => {
    onDateChange(value);
  }, [value, onDateChange]);

  const handleDateChange = (newValue: Date) => {
    setValue(newValue);
    onDateChange(newValue);
  };

  return (
    <div className="a-calendar">
      <Calendar
        onChange={handleDateChange}
        value={value}
        tileDisabled={disableFutureDates}
      />
    </div>
  );
};

export default CalendarComponent;
