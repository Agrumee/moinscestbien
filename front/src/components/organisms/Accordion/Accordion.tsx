import { useState } from "react";
import ConsumptionsChart from "../../atoms/ConsumptionsChart/ConsumptionsChart";
import "./Accordion.scss";
import CountButton from "../../molecules/CountButton/CountButton";
import Input from "../../atoms/Input/Input";
import CalendarButton from "../../molecules/CalendarButton/CalendarButton";
import Icon from "../../atoms/Icon/Icon";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import Button from "../../atoms/Button/Button";

interface AccordionProps {
  trackedProduct: any;
  consumptions: Array<{ date: string; product: string; quantity: number }>;
  frequency: "daily" | "weekly" | "monthly";
  currentConsumption: number;
  onDateChange: (date: string) => void;
  onUpdateConsumption: (quantity: number) => void;
}

const Accordion = ({
  trackedProduct,
  consumptions,
  currentConsumption,
  frequency,
  onDateChange,
  onUpdateConsumption,
}: AccordionProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentFrequency, setCurrentFrequency] = useState<
    "daily" | "weekly" | "monthly"
  >(frequency);

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
            <Icon name="pause" color="white" size="medium" />
            <Icon name="trash" color="white" size="medium" />
            {/* <Icon name="calendar" color="white" size="medium" /> */}

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

          {consumptions.length === 0 ? (
            <div className="o-accordion__content__noData">
              <Paragraph
                color="white"
                content="Entrez vos premières données pour commencer à suivre votre consommation."
              ></Paragraph>
            </div>
          ) : (
            <>
              <ConsumptionsChart
                className="o-accordion__content__chart"
                data={consumptions}
                frequency={currentFrequency}
              />

              <div className="o-accordion__content__frequency">
                <Button
                  variant={
                    currentFrequency === "daily" ? "primary" : "tertiary"
                  }
                  size="tiny"
                  content="Par jour"
                  onClick={() => setCurrentFrequency("daily")}
                />
                <Button
                  variant={
                    currentFrequency === "weekly" ? "primary" : "tertiary"
                  }
                  size="tiny"
                  content="Par semaine"
                  onClick={() => setCurrentFrequency("weekly")}
                />
                <Button
                  variant={
                    currentFrequency === "monthly" ? "primary" : "tertiary"
                  }
                  size="tiny"
                  content="Par mois"
                  onClick={() => setCurrentFrequency("monthly")}
                />
              </div>
            </>
          )}

          <div className="o-accordion__content__footer">
            <Button
              variant="tertiary"
              size="small"
              onClick={() => console.log("Pause")}
            >
              <Icon name="add" />
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => console.log("Ne plus suivre")}
            >
              <Icon name="add" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accordion;
