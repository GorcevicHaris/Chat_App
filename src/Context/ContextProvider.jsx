import React, { createContext, useState } from "react";
const Context = createContext();
function ContextProvider({ children }) {
  const [product, setProduct] = useState([]);
  const [userID, setUserID] = useState(null);
  const [ime, setIme] = useState("");
  return (
    <Context.Provider
      value={{ ime, setIme, product, setProduct, userID, setUserID }}
    >
      {children}
    </Context.Provider>
  );
}
export { Context };
export default ContextProvider;
