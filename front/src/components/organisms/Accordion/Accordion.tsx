import { useEffect, useState } from "react";
import Button from "../../atoms/Button/Button";
import ConsumptionsChart from "../../atoms/ConsumptionsChart/ConsumptionsChart";
import Paragraph from "../../atoms/Paragraph/Paragraph";
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
  start_date: Date;
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

  const handleDateChange = (selectedDate: Date | null) => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  };

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

  const updateConsumptionDetail = async (
    productId: number,
    date: string,
    quantity: number
  ) => {
    try {
      const data = await fetchAPI(
        `/consumption/${productId}/add-consumption/`,
        {
          method: "POST",
          body: { date: date, quantity: quantity },
        }
      );
    } catch (error) {
      console.error("Get consumption by date failed", error);
      throw error;
    }
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const formattedDate = formatDate(today);
    getConsumptionDetail(trackedProduct.product.id, formattedDate);
  }, []);

  useEffect(() => {
    currentDate.setHours(0, 0, 0, 0);
    const formattedDate = formatDate(currentDate);
    updateConsumptionDetail(
      trackedProduct.product.id,
      formattedDate,
      currentConsumption
    );
  }, [currentConsumption]);

  useEffect(() => {
    getConsumptionDetail(trackedProduct.product.id, formatDate(currentDate)),
      [currentDate];
  });

  const updateInputValue = (value: number) => {
    setCurrentConsumption((prevConsumption) =>
      Math.max(prevConsumption + value, 0)
    );
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
              onChange={(e) => setCurrentConsumption(Number(e.target.value))}
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
