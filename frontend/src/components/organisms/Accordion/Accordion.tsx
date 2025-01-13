import { useState } from "react";
import ConsumptionsChart from "../../atoms/ConsumptionsChart/ConsumptionsChart";
import "./Accordion.scss";
import CountButton from "../../molecules/CountButton/CountButton";
import Input from "../../atoms/Input/Input";
import CalendarButton from "../../molecules/CalendarButton/CalendarButton";
import Icon from "../../atoms/Icon/Icon";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import Button from "../../atoms/Button/Button";
import Heading from "../../atoms/Heading/Heading";
import Modal from "../../molecules/Modal/Modal";
import { Frequency, TrackedProduct } from "../../../types/tracked-product.model";
import { Consumption } from "../../../types/consumption.model";

interface AccordionProps {
  trackedProduct: TrackedProduct;
  consumptions: Consumption[];
  currentConsumption: number;
  frequency: Frequency;
  onDateChange: (date: string) => void;
  onUpdateConsumption: (quantity: number) => void;
  deleteTracking: () => void;
  pauseTracking?: () => void;
  unpauseTracking?: () => void;
}

const Accordion = ({
  trackedProduct,
  consumptions,
  currentConsumption,
  frequency,
  onDateChange,
  onUpdateConsumption,
  deleteTracking,
  pauseTracking,
  unpauseTracking,
}: AccordionProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentFrequency, setCurrentFrequency] = useState<
    Frequency
  >(frequency);
  const [isPaused, setIsPaused] = useState(trackedProduct.end_date !== null);
  const [isModalOpen, setIsModalOpen] = useState(false);


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

  const handleDeleteClick = () => {
    setIsModalOpen(true); // Ouvre la modal
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false); // Ferme la modal
    deleteTracking(); // Exécute la suppression
  };

  const handleModalCancel = () => {
    setIsModalOpen(false); // Ferme la modal sans action
  };

  return (
    <div className="o-accordion" key={trackedProduct.id}>
      <div
        className={`o-accordion__title ${isActive ? "active" : ""}`}
        onClick={() => {
          if (isPaused) return;
          setIsActive(!isActive);
        }}
      >
        <Heading
          level={2}
          color="white"
          content={trackedProduct.product.label}
          className="o-accordion__title__text"
        />
        <div className="toggled_accordion_icon">
          {isPaused ? (
            <div onClick={unpauseTracking}>
              <Paragraph content="Reprendre le suivi" size="small" color="white"></Paragraph>
            </div>
          ) : isActive ? '-' : '+'}
        </div>
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

          {consumptions.length === 0 ? (
            <div className="o-accordion__content__noData">
              <Paragraph
                color="white"
                content="Entrez vos premières données pour commencer à suivre votre consommation."
              />
            </div>
          ) : (
            <>
              <ConsumptionsChart
                className="o-accordion__content__chart"
                consumptions={consumptions}
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
              className="o-accordion__content__footer__button -pause"
              variant="tertiary"
              size="small"
              content="Mettre en pause"
              onClick={pauseTracking}
            />
            <Button
              className="o-accordion__content__footer__button -delete"
              variant="secondary"
              size="small"
              content="Ne plus suivre"
              onClick={handleDeleteClick}
            />
          </div>
        </div>
      )
      }{isModalOpen && (
        <Modal
          message="Êtes-vous sûr(e) de vouloir arrêter ce suivi ? Vos données seront définitivement supprimées."
          onCancel={handleModalCancel}
          onConfirm={handleModalConfirm}
        />
      )}
    </div >
  );
};

export default Accordion;