import Calendar from "react-calendar";
import "./CalendarComponent.scss";
import { Value } from "react-calendar/dist/cjs/shared/types";

interface CalendarComponentProps {
  startDate: Date;
  value: Date;
  onDateChange: (newValue: Date) => void;
}

const CalendarComponent = ({
  startDate,
  value: initialDate,
  onDateChange,
}: CalendarComponentProps) => {
  const value = initialDate || new Date();

  const disableDates = ({ date }: { date: Date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    return date < start || date > today;
  };

  const handleOnChangeDate = (value: Value) => {
    if (value && !Array.isArray(value)) {
      onDateChange(value as Date); // Forward the `value` as `Date`
    }
  };

  return (
    <div className="a-calendar">
      <Calendar
        value={value}
        tileDisabled={disableDates}
        onChange={handleOnChangeDate}
      />
    </div>
  );
};

export default CalendarComponent;
