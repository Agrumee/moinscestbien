import { useState } from "react";
import ConsumptionsChart from "../../atoms/ConsumptionsChart/ConsumptionsChart";
import "./Accordion.scss";
import CountButton from "../../molecules/CountButton/CountButton";
import Input from "../../atoms/Input/Input";
import CalendarButton from "../../molecules/CalendarButton/CalendarButton";

interface AccordionProps {
  trackedProduct: any;
  consumptions: Array<{ date: string; product: string; quantity: number }>;
  currentConsumption: number;
  onDateChange: (date: string) => void;
  onUpdateConsumption: (quantity: number) => void;
}

const Accordion = ({
  trackedProduct,
  consumptions,
  currentConsumption,
  onDateChange,
  onUpdateConsumption,
}: AccordionProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (selectedDate: Date | null) => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
      const formattedDate = formatDate(selectedDate);
      onDateChange(formattedDate);
    }
  };

  const updateInputValue = (value: number) => {
    onUpdateConsumption(currentConsumption + value);
  };

  return (
    <div className="o-accordion">
      <div
        className={`o-accordion__title ${isActive ? "active" : ""}`}
        onClick={() => setIsActive(!isActive)}
      >
        <div>{trackedProduct.product.name}</div>
        <div>{isActive ? "-" : "+"}</div>
      </div>
      {isActive && (
        <div className="o-accordion__content">
          <div className="o-accordion__content__dates">
            <CalendarButton
              initialDate={currentDate}
              onDateChange={handleDateChange}
              startDate={trackedProduct.start_date}
            />
          </div>
          <div className="o-accordion__content__counter">
            <CountButton
              operation="minus"
              onClick={() => updateInputValue(-1)}
            />
            <Input
              className="small-input"
              value={currentConsumption.toString()}
              onChange={(e) => onUpdateConsumption(Number(e.target.value))}
            />

            <CountButton operation="plus" onClick={() => updateInputValue(1)} />
          </div>
          <ConsumptionsChart
            className="o-accordion__content__chart"
            data={consumptions}
            period="monthly"
          />
        </div>
      )}
    </div>
  );
};

export default Accordion;
