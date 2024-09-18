import { useState } from "react";
import Button from "../../atoms/Button/Button";
import ConsumptionsChart from "../../atoms/ConsumptionsChart/ConsumptionsChart";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import "./Accordion.scss";
import CountButton from "../../molecules/CountButton/CountButton";
import Input from "../../atoms/Input/Input";
import CalendarButton from "../../molecules/CalendarButton/CalendarButton";

interface AccordionProps {
  productName: string;
}

const Accordion = ({ productName }: AccordionProps) => {
  const [isActive, setIsActive] = useState(false);

  const chartData = [
    { quantity: 18.0, date: "2024-01-08", product: "shopping" },
    { quantity: 12.0, date: "2024-01-22", product: "shopping" },
    { quantity: 14.0, date: "2024-02-10", product: "shopping" },
    { quantity: 8.0, date: "2024-02-28", product: "shopping" },
    { quantity: 16.0, date: "2024-03-12", product: "shopping" },
    { quantity: 20.0, date: "2024-03-26", product: "shopping" },
    { quantity: 13.0, date: "2024-04-05", product: "shopping" },
    { quantity: 17.0, date: "2024-04-20", product: "shopping" },
    { quantity: 15.0, date: "2024-05-08", product: "shopping" },
    { quantity: 11.0, date: "2024-05-22", product: "shopping" },
    { quantity: 14.0, date: "2024-06-10", product: "shopping" },
    { quantity: 9.0, date: "2024-06-25", product: "shopping" },
  ];

  return (
    <div className="o-accordion">
      <div
        className={`o-accordion__title ${isActive ? "active" : ""}`}
        onClick={() => setIsActive(!isActive)}
      >
        <div>{productName}</div>
        <div>{isActive ? "-" : "+"}</div>
      </div>
      {isActive && (
        <div className="o-accordion__content">
          <div className="o-accordion__content__dates">
            <CalendarButton/>
          </div>
          <div className="o-accordion__content__counter">
            <CountButton operation="minus"/>
            <Input className="small-input"/>
            <CountButton operation="plus"/>
          </div>
          <ConsumptionsChart
            className="o-accordion__content__chart"
            data={chartData}
            period="monthly"
          />
          <div className="o-accordion__content__footer">
            <Button
              variant="tertiary"
              size="small"
              content="Mettre en pause"
              onClick={() => console.log("Pause")}
            />
            <Button
              variant="secondary"
              size="small"
              content="Ne plus suivre"
              onClick={() => console.log("Ne plus suivre")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Accordion;
