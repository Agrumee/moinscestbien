import { useEffect, useState } from "react";
import Accordion from "../components/organisms/Accordion/Accordion";
import fetchAPI from "../utils/fetch";
import { TrackedProduct } from "../types/tracked-product.model";
import { ConsumptionsListByProductId } from "../types/consumption.model";

const Home = () => {
  const [trackedProducts, setTrackedProducts] = useState<TrackedProduct[]>([]);
  const [consumptionsListByProductId, setConsumptionsListByProductId] = useState<ConsumptionsListByProductId>(
    {}
  );
  const [currentConsumptionByProductId, setCurrentConsumptionByProductId] = useState<{
    [key: number]: number;
  }>({});
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetchAPI("/tracked-products/", {
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
    for (let productId in currentConsumptionByProductId) {
        getConsumptions(Number(productId));
      
    }
  }, [currentConsumptionByProductId]);

  // Récupérer les consommations pour un produit lorsque l'accordéon est ouvert
  const getConsumptions = async (productId: number) => {
    try {
      const response = await fetchAPI(`/consumptions/${productId}`, {
        method: "GET",
      });
      setConsumptionsListByProductId((previousConsumptions) => ({
        ...previousConsumptions,
        [productId]: response.data,
      }));
    } catch (error) {
      console.error("Get consumptions failed", error);
      throw error;
    }
  };

  //Récupération de la date à updater
  const handleDateChange = async (productId: number, date: string) => {
    try {
      const data = await fetchAPI(`/consumption/${productId}/${date}/`, {
        method: "GET",
      });
      setCurrentConsumptionByProductId((prev) => ({
        ...prev,
        [productId]: data.data.quantity,
      }));
      setDate(date);
    } catch (error) {
      console.error("Get consumption by date failed", error);
      throw error;
    }
  };

  // maj des données de consommation en fonction d'une date
  const handleUpdateConsumption = async (
    productId: number,
    date: string,
    quantity: number
  ) => {
    try {
      const response = await fetchAPI(`/consumption/${productId}/add-consumption/`, {
        method: "POST",
        body: { date: date, quantity: quantity },
        headers: {
          "Content-Type": "application/json",
        },
      });

      setCurrentConsumptionByProductId((prev) => ({
        ...prev,
        [productId]: response.data.quantity,
      }));
    } catch (error) {
      console.error("Update consumption failed", error);
    }
  };

  return (
    <div>
      {trackedProducts.map((trackedProduct: TrackedProduct) => (
        <Accordion
          trackedProduct={trackedProduct}
          consumptions={consumptionsListByProductId[trackedProduct.product.id] || []}
          currentConsumption={
            currentConsumptionByProductId[trackedProduct.product.id] || 0
          }
          onDateChange={(date) =>
            handleDateChange(trackedProduct.product.id, date)
          }
          onUpdateConsumption={(quantity) =>
            handleUpdateConsumption(trackedProduct.product.id, date, quantity)
          }
          frequency={trackedProduct.tracking_frequency.name}
        />
      ))}
    </div>
  );
}

export default Home;
