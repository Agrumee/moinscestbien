import Dropdown from "../components/molecules/Dropdown/Dropdown";
import Label from "../components/atoms/Label/Label";
import Heading from "../components/atoms/Heading/Heading";
import Button from "../components/atoms/Button/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import fetchAPI from "../utils/fetch";

import "./AddNew.scss";

interface ContentItem {
  name: string;
  id: number;
}

const AddNew = () => {
  const navigate = useNavigate();
  const [currentProduct, setCurrentProduct] = useState<ContentItem | null>(
    null
  );
  const [currentUnit, setCurrentUnit] = useState<ContentItem | null>(null);
  const [currentMotivation, setCurrentMotivation] =
    useState<ContentItem | null>(null);
  const [currentTrackingFrequency, setCurrentTrackingFrequency] =
    useState<ContentItem | null>(null);
  const [productsList, setProductsList] = useState<ContentItem[]>([]);
  const [unitsList, setUnitsList] = useState<ContentItem[]>([]);
  const [motivationsList, setMotivationsList] = useState<ContentItem[]>([]);
  const [trackingFrequenciesList, setTrackingFrequenciesList] =
    useState<ContentItem[]>([]);

  const handleAddNewProduct = async () => {
    try {
      const data = await fetchAPI(
        `/users/products/${currentProduct?.id}/${currentUnit?.id}/${currentMotivation?.id}/${currentTrackingFrequency?.id}/add-product/`,
        {
          method: "POST",
        }
      );
      console.log("Product added successfully:", data);
      navigate("/");
    } catch (error) {
      console.error("Error during add new product", error);
    }
  };

  const getProductsList = async () => {
    try {
      const response = await fetchAPI(`/products/`, {
        method: "GET",
      });
      setProductsList(response.data);
    } catch (error) {
      console.error("Error during fetching products:", error);
    }
  };

  const getUnitsList = async (productId: number) => {
    try {
      const response = await fetchAPI(`/units/${productId}`, {
        method: "GET",
      });
      setUnitsList(response.data);
    } catch (error) {
      console.error("Error during fetching units:", error);
    }
  };

  const getMotivationsList = async (productId: number) => {
    try {
      const response = await fetchAPI(`/motivations/${productId}`, {
        method: "GET",
      });
      setMotivationsList(response.data);
    } catch (error) {
      console.error("Error during fetching units:", error);
    }
  };

  const getTrackingFrequenciesList = async () => {
    try {
      const response = await fetchAPI(`/tracking-frequencies/`, {
        method: "GET",
      });
      setTrackingFrequenciesList(response.data);
    } catch (error) {
      console.error("Error during fetching tracking frequencies:", error);
    }
  }

  useEffect(() => {
    getProductsList();
    getTrackingFrequenciesList();
  }, []);

  useEffect(() => {
    if (currentProduct) {
      getUnitsList(currentProduct.id);
      getMotivationsList(currentProduct.id);
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
        <br></br>
        <Label content="Fréquence de suivi :" />
        <Dropdown
          label={
            currentTrackingFrequency
              ? currentTrackingFrequency.name
              : "A quelle fréquence ?"
          }
          contentList={trackingFrequenciesList}
          onSelect={(selectedTrackingFrequency: ContentItem) =>
            setCurrentTrackingFrequency(selectedTrackingFrequency)
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
