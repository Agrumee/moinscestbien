import { useEffect, useState } from "react";
import Button from "../../atoms/Button/Button";
import ConsumptionsChart from "../../atoms/ConsumptionsChart/ConsumptionsChart";
import "./Accordion.scss";
import CountButton from "../../molecules/CountButton/CountButton";
import Input from "../../atoms/Input/Input";
import CalendarButton from "../../molecules/CalendarButton/CalendarButton";
import fetchAPI from "../../../utils/fetch";

interface productItem {
  id: number;
  name: string;
}

interface trackedProductItem {
  id: number;
  product: productItem;
  start_date: string;
  end_date: string;
}

interface AccordionProps {
  trackedProduct: trackedProductItem;
  consumptions: Array<{ date: string; product: string; quantity: number }>;
}

const Accordion = ({ trackedProduct, consumptions }: AccordionProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentConsumption, setCurrentConsumption] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isConsumptionLoaded, setIsConsumptionLoaded] = useState(false); // Indicateur pour savoir si les données sont chargées
  const [isNewDateLoaded, setIsNewDateLoaded] = useState(false); // Indicateur pour savoir si les données sont chargées

  // Fonction pour changer la date sélectionnée
  const handleDateChange = (selectedDate: Date | null) => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
      setIsNewDateLoaded(false); // Marquer que les données doivent être rechargées
    }
  };

  // Fonction pour formater la date au format "YYYY-MM-DD"
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Appel API pour obtenir la consommation du produit pour une date donnée
  const getConsumptionDetail = async (productId: number, date: string) => {
    try {
      const data = await fetchAPI(`/consumption/${productId}/${date}/`, {
        method: "GET",
      });
      setCurrentConsumption(data.data.quantity);
    } catch (error) {
      console.error("Get consumption by date failed", error);
      throw error;
    }
  };

  // Appel API pour mettre à jour la consommation du produit
  const updateConsumptionDetail = async (
    productId: number,
    date: string,
    quantity: number
  ) => {
    try {
      await fetchAPI(`/consumption/${productId}/add-consumption/`, {
        method: "POST",
        body: { date: date, quantity: quantity },
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Update consumption failed", error);
      throw error;
    }
  };

  // Charger la consommation du produit lorsque l'accordéon est ouvert ou la date est changée
  useEffect(() => {
    if (isActive && !isNewDateLoaded) {
      const formattedDate = formatDate(currentDate);
      getConsumptionDetail(trackedProduct.product.id, formattedDate);
      setIsConsumptionLoaded(true); // Marquer que la consommation est chargée
      setIsNewDateLoaded(true);
    }
  }, [currentDate]);

  // Mettre à jour la consommation via l'API uniquement lorsque l'utilisateur modifie la consommation (et non lors de l'ouverture ou du changement de date)
  useEffect(() => {
    console.log(isConsumptionLoaded);
    if (isConsumptionLoaded) {
      const formattedDate = formatDate(currentDate);
      updateConsumptionDetail(
        trackedProduct.product.id,
        formattedDate,
        currentConsumption
      );
    }
  }, [currentConsumption]);
  // Ne déclencher que lorsqu'on change la consommation

  // Mise à jour de la consommation en fonction de l'input de l'utilisateur
  const updateInputValue = (value: number) => {
    console.log(value);
    setCurrentConsumption((prevConsumption) =>
      Math.max(prevConsumption + value, 0)
    );
    console.log(currentConsumption);
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
              onChange={(e) => {
                setCurrentConsumption(Number(e.target.value));
                console.log(currentConsumption);
              }}
            />
            <CountButton operation="plus" onClick={() => updateInputValue(1)} />
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
