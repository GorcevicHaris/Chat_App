import React, { useContext, useEffect } from "react";
import { Context } from "../Context/ContextProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Basket() {
  const { product, setProduct } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    axios
      .get("http://localhost:8000/api/fetchData", { withCredentials: true })
      .then((res) => setProduct(res?.data))
      .catch((err) => console.log(err));
  }
  console.log(product, "prod");

  return (
    <div>
      basket
      {product?.map((data) => (
        <>
          <h1 key={data.id}>{data.description}</h1>
          <img src={data.imageURL}></img>
        </>
      ))}
      <h1
        style={{ color: "red", cursor: "pointer" }}
        onClick={() => navigate("/home")}
      >
        idi home
      </h1>
    </div>
  );
}

export default Basket;
