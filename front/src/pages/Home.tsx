import { useEffect, useState } from "react";
import Accordion from "../components/organisms/Accordion/Accordion";
import fetchAPI from "../utils/fetch";

const Home = () => {
  const [trackedProducts, setTrackedProducts] = useState([]);
  const [consumptions, setConsumptions] = useState<{ [key: number]: any[] }>(
    {}
  );
  const [currentConsumptions, setCurrentConsumptions] = useState<{
    [key: number]: number;
  }>({});
  const [date, setDate] = useState<string>("");

  // Charger les produits suivis au chargement de la page
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchAPI("/tracked-products/", {
          method: "GET",
        });
        setTrackedProducts(data.data);
      } catch (error) {
        console.error("Get products failed", error);
        throw error;
      }
    };

    getProducts();
  }, []);

  // Déclenchement de getConsumptions lorsque currentconsumption est mis à jour
  useEffect(() => {
    for (let productId in currentConsumptions) {
      if (currentConsumptions.hasOwnProperty(productId)) {
        getConsumptions(Number(productId));
      }
    }
  }, [currentConsumptions]);

  // Récupérer les consommations pour un produit lorsque l'accordéon est ouvert
  const getConsumptions = async (productId: number) => {
    try {
      const data = await fetchAPI(`/consumptions/${productId}`, {
        method: "GET",
      });
      setConsumptions((prev) => ({
        ...prev,
        [productId]: data.data,
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
      setCurrentConsumptions((prev) => ({
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
      await fetchAPI(`/consumption/${productId}/add-consumption/`, {
        method: "POST",
        body: { date: date, quantity: quantity },
        headers: {
          "Content-Type": "application/json",
        },
      });

      const updatedConsumptionData = await fetchAPI(
        `/consumption/${productId}/${date}/`,
        {
          method: "GET",
        }
      );

      setCurrentConsumptions((prev) => ({
        ...prev,
        [productId]: updatedConsumptionData.data.quantity,
      }));
    } catch (error) {
      console.error("Update consumption failed", error);
    }
  };

  return (
    <div>
      {trackedProducts.map((trackedProduct: any) => (
        <Accordion
          key={trackedProduct.id}
          trackedProduct={trackedProduct}
          consumptions={consumptions[trackedProduct.product.id] || []}
          currentConsumption={
            currentConsumptions[trackedProduct.product.id] || 0
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
};

export default Home;
