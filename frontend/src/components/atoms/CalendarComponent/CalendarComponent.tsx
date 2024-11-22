import Calendar from "react-calendar";
import "./CalendarComponent.scss";

interface CalendarComponentProps {
  startDate: string;
  value: Date;
  onDateChange: (newValue: Date | null | [Date | null, Date | null]) => void;
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

  return (
    <div className="a-calendar">
      <Calendar
        value={value}
        tileDisabled={disableDates}
        onChange={onDateChange}
      />
    </div>
  );
};

export default CalendarComponent;
