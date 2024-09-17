import Dropdown from "../components/molecules/Dropdown/Dropdown";
import Label from "../components/atoms/Label/Label";
import Heading from "../components/atoms/Heading/Heading";
import Button from "../components/atoms/Button/Button";
import { useEffect, useState } from "react";
import { getCSRFCookie } from "../utils/cookies";

import "./AddNew.scss";

interface ContentItem {
  name: string;
  id: number;
}

const AddNew = () => {
  const [currentProduct, setCurrentProduct] = useState<ContentItem | null>(
    null
  );
  const [currentUnit, setCurrentUnit] = useState<ContentItem | null>(null);
  const [currentMotivation, setCurrentMotivation] =
    useState<ContentItem | null>(null);
  const [productsList, setProductsList] = useState<ContentItem[]>([]);
  const [unitsList, setUnitsList] = useState<ContentItem[]>([]);
  const [motivationsList, setMotivationsList] = useState<ContentItem[]>([]);

  const handleAddNewProduct = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/products/${currentProduct.id}/${currentUnit.id}/${currentMotivation.id}/add-product/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFCookie("csrftoken"),
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Product added successfully:", data);
    } catch (error) {
      console.error("Error during add new product", error);
    }
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
        setUnitsList(data.data);
      } else {
        console.error("Error:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error during fetching units:", error);
    }
  };

  const getMotivationsList = async (productId: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/motivations/${productId}`,
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
        setMotivationsList(data.data);
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
      getUnitsList(currentProduct.id);
      getMotivationsList(currentProduct.id);
      console.log(motivationsList);
    }
  }, [currentProduct]);

  return (
    <div className="p-addnew">
      <Heading
        className="a-add-new-title"
        level={1}
        content="Suivre un nouveau produit"
      />
      <div>
        <Label content="Produit :" />
        <Dropdown
          label={
            currentProduct ? currentProduct.name : "Que voulez-vous suivre ?"
          }
          contentList={productsList}
          onSelect={(selectedProduct: ContentItem) =>
            setCurrentProduct(selectedProduct)
          }
        />
      </div>
      <div style={unitsList.length === 0 ? { display: "none" } : {}}>
        <Label content="Unité :" />
        <Dropdown
          label={currentUnit ? currentUnit.name : "De quelle façon compter ?"}
          contentList={unitsList}
          onSelect={(selectedUnit: ContentItem) => setCurrentUnit(selectedUnit)}
        />
        <br></br>
        <Label content="Motivation :" />
        <Dropdown
          label={
            currentMotivation ? currentMotivation.name : "Pour quelle raison ?"
          }
          contentList={motivationsList}
          onSelect={(selectedMotivation: ContentItem) =>
            setCurrentMotivation(selectedMotivation)
          }
        />
      </div>
      <Button
        className="a-add-new-button"
        variant="primary"
        size="large"
        content="Ajouter"
        onClick={handleAddNewProduct}
        disabled={!currentProduct || !currentUnit}
      />
    </div>
  );
};

export default AddNew;
