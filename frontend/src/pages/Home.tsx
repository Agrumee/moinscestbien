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

  useEffect(() => {
    for (let productId in currentConsumptionByTrackedProductId) {
      getConsumptions(Number(productId));
    }
  }, [currentConsumptionByTrackedProductId]);

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
    }
  };

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
    }
  };

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

  const handleDeleteTracking = async (trackedProductId: number) => {
    try {
      await fetchAPI(`/user/products/${trackedProductId}/delete/`, {
        method: "DELETE",
      });
      setTrackedProducts((prev) =>
        prev.filter((product) => product.id !== trackedProductId)
      );
    } catch (error) {
      console.error("Delete tracked product failed", error);
    }
  };

  const handlePauseTracking = async (trackedProductId: number) => {
    try {
      await fetchAPI(`/user/products/${trackedProductId}/pause/`, {
        method: "PATCH",
      });
      setTrackedProducts((prev) =>
      prev.filter((product) => product.id !== trackedProductId)
    );
    } catch (error) {
      console.error("Pause tracked product failed", error);
    }
  };

  return (
    <div className="p-home">
      {trackedProducts.map((trackedProduct: TrackedProduct) => (
        <Accordion
          key={trackedProduct.id}
          trackedProduct={trackedProduct}
          consumptions={ConsumptionsListByTrackedProductId[trackedProduct.id] || []}
          currentConsumption={currentConsumptionByTrackedProductId[trackedProduct.id] || 0}
          onDateChange={(date) => handleDateChange(trackedProduct.id, date)}
          onUpdateConsumption={(quantity) =>
            handleUpdateConsumption(trackedProduct.id, date, quantity)
          }
          frequency={trackedProduct.tracking_frequency.name}
          deleteTracking={() => handleDeleteTracking(trackedProduct.id)}
          pauseTracking={() => handlePauseTracking(trackedProduct.id)}
        />
      ))}
    </div>
  );
};

export default Home;
