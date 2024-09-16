import CountButton from "../components/molecules/CountButton/CountButton";
import Dropdown from "../components/molecules/Dropdown/Dropdown";
import Label from "../components/atoms/Label/Label";
import Heading from "../components/atoms/Heading/Heading";
import Button from "../components/atoms/Button/Button";
import Paragraph from "../components/atoms/Paragraph/Paragraph";
import { useEffect, useState } from "react";
import { getCSRFCookie } from "../utils/cookies";

interface ContentItem {
  name: string;
  id: number;
}

const AddNew = () => {
  const [currentProduct, setCurrentProduct] = useState<ContentItem | null>(
    null
  );
  const [currentUnit, setCurrentUnit] = useState<ContentItem | null>(null);
  const [productsList, setProductsList] = useState<ContentItem[]>([]);
  const [unitsList, setUnitsList] = useState<ContentItem[]>([]);

  const handleAddNewProduct = () => {
    console.log("Produit ajouté:", currentProduct);
    console.log("Unité sélectionnée:", currentUnit);
  };

  const getProductsList = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/products/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFCookie("csrftoken"),
        },
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        setProductsList(data.data);
      } else {
        console.error("Error:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error during fetching products:", error);
    }
  };

  const getUnitsList = async (productId: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/units/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFCookie("csrftoken"),
          },
          credentials: "include",
        }
      );
      const data = await response.json();

      if (response.ok) {
        console.log(data.data);
        setUnitsList(data.data);
      } else {
        console.error("Error:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error during fetching units:", error);
    }
  };

  useEffect(() => {
    getProductsList();
  }, []);

  useEffect(() => {
    if (currentProduct) {
      console.log("Produit sélectionné:", currentProduct);
      getUnitsList(currentProduct.id);
    }
  }, [currentProduct]);

  return (
    <>
      <Heading level={1} content="Suivre un nouveau produit" />
      <Label content="Produit :" />
      <Dropdown
        label={currentProduct ? currentProduct.name : "Sélectionner"}
        contentList={productsList}
        onSelect={(selectedProduct: ContentItem) =>
          setCurrentProduct(selectedProduct)
        }
      />
      <Label content="Unité :" />
      <Dropdown
        label={currentUnit ? currentUnit.name : "Sélectionner"}
        contentList={unitsList}
        onSelect={(selectedUnit: ContentItem) => setCurrentUnit(selectedUnit)}
      />
      <Button
        className="primary"
        content="Ajouter"
        onClick={handleAddNewProduct}
      />
    </>
  );
};

export default AddNew;
