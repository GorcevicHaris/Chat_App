import React, { useContext } from "react";
import { Context } from "../Context/ContextProvider";
import axios from "axios";

function Homecomponent({ data }) {
  const { product, setProduct, userID, setUserID } = useContext(Context);

  function alreadyInCart(item) {
    return product.find((data) => data.id == item.id);
  }
  console.log(userID, "ljaljan");
  async function addToBasket(item) {
    if (alreadyInCart(item)) {
      alert("vec dodato");
    } else {
      setProduct((prev) => [...prev, item]);
      try {
        await axios.post("http://localhost:8000/api/updateUser", {
          item: item.id,
          id: userID,
        });
      } catch (error) {
        console.error("Error adding to basket:", error);
      }
    }
  }

  return (
    <div>
      <h2>{data.title}</h2>
      <h2>{data.description}</h2>
      <img style={{ width: "300px" }} src={data.imageURL}></img>
      <button onClick={() => addToBasket(data)}>add To Basket</button>
    </div>
  );
}

export default Homecomponent;
