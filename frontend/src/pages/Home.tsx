import { useEffect, useState } from "react";
import Accordion from "../components/organisms/Accordion/Accordion";
import fetchAPI from "../utils/fetch";
import { TrackedProduct } from "../types/tracked-product.model";
import { ConsumptionsListByTrackedProductId } from "../types/consumption.model";
import "./Home.scss"

const Home = () => {
  const [trackedProducts, setTrackedProducts] = useState<TrackedProduct[]>([]);
  const [ConsumptionsListByTrackedProductId, setConsumptionsListByTrackedProductId] = useState<ConsumptionsListByTrackedProductId>(
    {}
  );
  const [currentConsumptionByTrackedProductId, setCurrentConsumptionByTrackedProductId] = useState<{
    [key: number]: number;
  }>({});
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetchAPI("/user/tracked-products/", {
          method: "GET",
        });
        setTrackedProducts(response.data);
      } catch (error) {
        console.error("Get products failed", error);
        throw error;
      }
    };

    getProducts();
  }, []);

  // Déclenchement de getConsumptions lorsque currentconsumption est mis à jour
  useEffect(() => {
    for (let productId in currentConsumptionByTrackedProductId) {
      getConsumptions(Number(productId));
    }
  }, [currentConsumptionByTrackedProductId]);

  // Récupérer les consommations pour un produit lorsque l'accordéon est ouvert
  const getConsumptions = async (productId: number) => {
    try {
      const response = await fetchAPI(`/consumptions/${productId}`, {
        method: "GET",
      });
      setConsumptionsListByTrackedProductId((previousConsumptions) => ({
        ...previousConsumptions,
        [productId]: response.data,
      }));
    } catch (error) {
      console.error("Get consumptions failed", error);
      throw error;
    }
  };

  //Récupération de la date à updater
  const handleDateChange = async (trackedProductId: number, date: string) => {
    try {
      const data = await fetchAPI(`/consumption/${trackedProductId}/${date}/`, {
        method: "GET",
      });
      setCurrentConsumptionByTrackedProductId((prev) => ({
        ...prev,
        [trackedProductId]: data.data.quantity,
      }));
      setDate(date);
    } catch (error) {
      console.error("Get consumption by date failed", error);
      throw error;
    }
  };

  // maj des données de consommation en fonction d'une date
  const handleUpdateConsumption = async (
    trackedProductId: number,
    date: string,
    quantity: number
  ) => {
    try {
      const response = await fetchAPI(`/consumption/${trackedProductId}/add-consumption/`, {
        method: "POST",
        body: { date: date, quantity: quantity },
        headers: {
          "Content-Type": "application/json",
        },
      });

      setCurrentConsumptionByTrackedProductId((prev) => ({
        ...prev,
        [trackedProductId]: response.data.quantity,
      }));
    } catch (error) {
      console.error("Update consumption failed", error);
    }
  };

  return (
    <div className="p-home">
      {trackedProducts.map((trackedProduct: TrackedProduct) => (
        <Accordion
          trackedProduct={trackedProduct}
          consumptions={ConsumptionsListByTrackedProductId[trackedProduct.id] || []}
          currentConsumption={
            currentConsumptionByTrackedProductId[trackedProduct.id] || 0
          }
          onDateChange={(date) =>
            handleDateChange(trackedProduct.id, date)
          }
          onUpdateConsumption={(quantity) =>
            handleUpdateConsumption(trackedProduct.id, date, quantity)
          }
          frequency={trackedProduct.tracking_frequency.name}
        />
      ))}
    </div>
  );
}

export default Home;
