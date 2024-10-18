import { useState } from "react";
import Button from "../../atoms/Button/Button";
import ConsumptionsChart from "../../atoms/ConsumptionsChart/ConsumptionsChart";
import "./Accordion.scss";
import CountButton from "../../molecules/CountButton/CountButton";
import Input from "../../atoms/Input/Input";
import CalendarButton from "../../molecules/CalendarButton/CalendarButton";
import Icon from "../../atoms/Icon/Icon";
import Paragraph from "../../atoms/Paragraph/Paragraph";

interface AccordionProps {
  productName: string;
  consumptions: Array<{ date: string; product: string; quantity: number }>;
  frequency: "daily" | "weekly" | "monthly";
}

const Accordion = ({
  productName,
  consumptions,
  frequency,
}: AccordionProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState<
    "daily" | "weekly" | "monthly"
  >(frequency);

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
            <CalendarButton />
          </div>
          <div className="o-accordion__content__counter">
            <CountButton operation="minus" />
            <Input className="small-input" />
            <CountButton operation="plus" />
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
            <div
              className="o-accordion__content__footer__button -pause"
            >
              <Icon name="pause" size="tiny" />
            </div>
            <div
              className="o-accordion__content__footer__button -delete"
            >
              <Icon name="trash" size="tiny" />
            </div>
          </div>
        </div>)}
    </div>
  );
}

export default Accordion;
