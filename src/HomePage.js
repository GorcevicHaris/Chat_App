import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get("http://localhost:8000").then((response) => {
      if (response.data.Status === "Success") {
        setAuth(true);
        setName(response.data.name);
      } else {
        setAuth(false);
      }
    });
  }, []);
  //
  function onLogout() {
    axios.get("http://localhost:8000/logout").then((response) => {
      if (response.data.Status === "Success") {
        window.location.reload();
      } else {
        alert(response.data.Message);
      }
    });
  }
  return (
    <div>
      {auth ? (
        <div>
          <h1>You are authorizhed {name}</h1>
          <p>{message}</p>
          <button onClick={onLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <p>{message}</p>
          <button onClick={() => navigate("/login")}>go to login</button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
