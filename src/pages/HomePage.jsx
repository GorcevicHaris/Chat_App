import React, { useContext, useEffect, useState } from "react";
import "./HomePage.css";
import axios from "axios";
import Homecomponent from "../components/Homecomponent";
import { Context } from "../Context/ContextProvider";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
const socket = io.connect("http://localhost:8000");

function HomePage() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [item, setItem] = useState([]);
  const navigate = useNavigate();

  function joinRoom() {
    socket.emit("join_room", room);
  }

  function sendMessage() {
    socket.emit("send_message", { room, message });

    // Slanje poruke na backend da se sačuva u bazi
    axios
      .post("http://localhost:8000/api/getMessage", { text: message })
      .then((response) => {
        console.log("Message saved:", response.data);
      })
      .catch((error) => {
        console.error("There was an error saving the message:", error);
      });
  }

  useEffect(() => {
    socket.on("received_message", (data) => {
      setMessageReceived(data.message);
      console.log(data);
    });
  }, []);

  useEffect(() => {
    function getData() {
      axios.get("http://localhost:8000/api/home").then((res) => {
        setItem(res.data);
      });
    }
    getData();
  }, []);

  return (
    <div className="container">
      home
      <div>
        {item?.map((data) => (
          <Homecomponent data={data} />
        ))}
      </div>
      <h1 onClick={() => navigate("/basket")}>idi do korpe</h1>
      <h1 onClick={() => navigate("/")}>go to profile</h1>
      <div className="chat">
        <input
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Join Room"
        ></input>
        <button onClick={joinRoom}>Join room</button>
        <input
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
        ></input>
        <button onClick={sendMessage}>Send Message</button>
        <h2>Message : {messageReceived}</h2>
      </div>
    </div>
  );
}

export default HomePage;
