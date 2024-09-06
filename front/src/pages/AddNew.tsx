import CountButton from "../components/molecules/CountButton/CountButton";
import Dropdown from "../components/molecules/Dropdown/Dropdown";
import Label from "../components/atoms/Label/Label";
import Heading from "../components/atoms/Heading/Heading";
import Button from "../components/atoms/Button/Button";
import Paragraph from "../components/atoms/Paragraph/Paragraph";
import { useState } from "react";

const AddNew = () => {
  const [currentProduct, setCurrentProduct] = useState("");
  const [productList, setProductList] = useState("");
  const [currentUnity, setCurrentUnity] = useState("");
  const [unityList, setUnityList] = useState("");
  const [currentMotivation, setCurrentMotivaiton] = useState("");
  const [motivationList, setMotivationList] = useState("");

  const getProductList = () => {};

  return (
    <>
      <Heading level={1} content="Suivre un nouveau produit" />
      <Label content="Produit :" />
      <Dropdown
        label="Séléctionner"
        contentList={[
          { label: "shopping", value: "shopping" },
          { label: "tabac", value: "tobacco" },
          { label: "café", value: "coffee" },
        ]}
      />
      <Label content="Unité :" />
      <Dropdown
        label="Séléctionner"
        contentList={[
          { label: "shopping", value: "shopping" },
          { label: "tabac", value: "tobacco" },
          { label: "café", value: "coffee" },
        ]}
      />
      <Label content="Motivation :" />
      <Dropdown
        label="Séléctionner"
        contentList={[
          { label: "shopping", value: "shopping" },
          { label: "tabac", value: "tobacco" },
          { label: "café", value: "coffee" },
        ]}
      />
      {/* <Button
        className="primary"
        content="S'inscrire"
        onClick={handleRegister}
      /> */}
    </>

    // <div>
    //   <CountButton operation="plus" onClick={handleCountChange} />
    //   <CountButton operation="minus" onClick={handleCountChange} />
    //   <p>Current count: {count}</p>
    // </div>
  );
};

export default AddNew;
