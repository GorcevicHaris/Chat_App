import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import { Context } from "./Context/ContextProvider";
function Profile() {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [counter, setCounter] = useState();
  const navigate = useNavigate();
  const { userID, setUserID } = useContext(Context);
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://192.168.0.102:8000")
      .then((response) => {
        if (response.data.Status === "Success") {
          console.log(response.data);
          setAuth(true);
          setName(response.data.name);
          setCounter(response.data.counter);
          setUserID(response.data.userID);
        } else {
          setAuth(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  function onLogout() {
    axios
      .get("http://192.168.0.102:8000/logout")
      .then((response) => {
        if (response.data.Status === "Success") {
          window.location.reload();
        } else {
          alert(response.data.Message);
        }
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  }

  async function addNumber() {
    const newCounter = counter + 1;
    setCounter(newCounter);
    axios
      .post("http://192.168.0.102:8000/api/update_counter", {
        counter: newCounter,
        userID: userID,
      })
      .then((response) => {
        if (response.data.Status !== "Success") {
          alert(response.data.Message);
        } else {
          console.log("Counter updated successfully");
        }
      })
      .catch((error) => {
        console.error("Error updating counter:", error);
      });
  }

  return (
    <div>
      {auth ? (
        <div>
          <h1>You are authorized {name}</h1>
          <p>{message}</p>
          <button onClick={onLogout}>Logout</button>
          <div>Counter: {counter}</div>
          <button onClick={addNumber}>Add Number</button>
          <h1 onClick={() => navigate("/home")}>Go to HomePage</h1>
        </div>
      ) : (
        <div>
          <p>{message}</p>
          <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      )}
    </div>
  );
}

export default Profile;
