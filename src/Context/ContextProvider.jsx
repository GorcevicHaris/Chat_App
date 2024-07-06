import React, { createContext, useState } from "react";
const Context = createContext();
function ContextProvider({ children }) {
  const [product, setProduct] = useState([]);
  const [userID, setUserID] = useState(null);

  return (
    <Context.Provider value={{ product, setProduct, userID, setUserID }}>
      {children}
    </Context.Provider>
  );
}
export { Context };
export default ContextProvider;
