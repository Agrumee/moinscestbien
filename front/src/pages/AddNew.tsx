import CountButton from "../components/molecules/CountButton/CountButton";
import { useState } from "react";

const AddNew = () => {
  const [count, setCount] = useState(0);

  const handleCountChange = (value: number) => {
      setCount(prevCount => prevCount + value);
  };

  return (
      <div>
          <CountButton operation="plus" onClick={handleCountChange} />
          <CountButton operation="minus" onClick={handleCountChange} />
          <p>Current count: {count}</p>
      </div>
  );
};

export default AddNew;
