import CountButton from "../components/molecules/CountButton/CountButton";
import Dropdown from "../components/molecules/Dropdown/Dropdown";
import Label from "../components/atoms/Label/Label";
import Heading from "../components/atoms/Heading/Heading";
import Button from "../components/atoms/Button/Button";
import Paragraph from "../components/atoms/Paragraph/Paragraph";
import { useState } from "react";

const AddNew = () => {
    // const [currentProduct, setCurrentProduct] = useState("")
    // const [productList, setProductList] = useState("")
    // const [currentUnity, setCurrentUnity] = useState("")
    // const [unityList, setUnityList] = useState("")
    // const [currentMotivation, setCurrentMotivaiton] = useState("")
    // const [motivationList, setMotivationList] = useState("")
      const [count, setCount] = useState(0);

    const handleCountChange = (value: number) => {
      setCount((prevCount) => prevCount + value);
    };


  return (
    // <>
    //   <Heading level={1} content="Suivre un nouveau produit" />
    //   <Label content="Produit :" />
    //   <Dropdown
    //     label= ""
    //     contentList={label:"", value:"", ""}
    //     // value={email}
    //     // onChange={(e) => setEmail(e.target.value)}
    //   />
    //   <Label content="Unité :" />
    //   <Input
    //     className="large-input"
    //     placeholder="**********"
    //     type="password"
    //     // value={password}
    //     // onChange={(e) => setPassword(e.target.value)}
    //   />
    //   <Label content="Motivation :" />
    //   <Input
    //     className="large-input"
    //     placeholder="**********"
    //     type="password"
    //     // value={confirmedPassword}
    //     // onChange={(e) => setConfirmedPassword(e.target.value)}
    //   />
    //   {/* <Button
    //     className="primary"
    //     content="S'inscrire"
    //     onClick={handleRegister}
    //   /> */}
    //   <div>
    //     <Paragraph content="Déjà inscrit ?" size="medium" color="black" />
    //     <a href="/login">
    //       <Paragraph content="Se connecter" />
    //     </a>
    //   </div>
    // </>

      <div>
          <CountButton operation="plus" onClick={handleCountChange} />
          <CountButton operation="minus" onClick={handleCountChange} />
          <p>Current count: {count}</p>
      </div>
  );
};

export default AddNew;
