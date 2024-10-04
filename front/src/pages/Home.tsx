import Accordion from "../components/organisms/Accordion/Accordion";
import fetchAPI from "../utils/fetch";
import { useEffect, useState } from "react";

const Home = () => {
  const [trackedProducts, setTrackedProducts] = useState([]);
  const [consumptions, setConsumptions] = useState<{ [key: number]: any[] }>(
    {}
  );

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchAPI("/tracked-products/", {
          method: "GET",
        });
        setTrackedProducts(data.data);

        data.data.forEach((product: any) => {
          getConsumptions(product.product.id);
        });
      } catch (error) {
        console.error("Get products failed", error);
        throw error;
      }
    };

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

    getProducts();
  }, []);

  return (
    <div>
      {trackedProducts.map((trackedProduct: any) => (
        <Accordion
          key={trackedProduct.id}
          // productName={trackedProduct.product.name}
          // productId={trackedProduct.product.id}
          trackedProduct={trackedProduct}
          consumptions={consumptions[trackedProduct.product.id] || []}
        />
      ))}
    </div>
  );
};

export default Home;
