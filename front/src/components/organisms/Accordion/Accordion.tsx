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
  consumptions: Array<{ date: string; product: string; quantity: number }>;
}

const Accordion = ({ productName, consumptions }: AccordionProps) => {
  const [isActive, setIsActive] = useState(false);

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
            data={consumptions}
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
