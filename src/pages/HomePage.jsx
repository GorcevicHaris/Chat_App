import React, { useContext, useEffect, useState } from "react";
import "./HomePage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const socket = io.connect("http://192.168.0.102:8000");
window.socket = socket;

function HomePage() {
  const [room, setRoom] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [ime, setIme] = useState("");
  const [vreme, setVreme] = useState("");
  const [isBlue, setIsBlue] = useState(null);
  const [position, setPosition] = useState({ top: 100, left: 0 });
  const [position2, setPosition2] = useState({
    top: 100,
    left: window.innerWidth - 100,
  });

  const [checkRoom, setCheckRoom] = useState(0);
  const [userID, setUserID] = useState(null);
  const [browserId, setBrowserId] = useState(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  console.log(browserId, "browserid");
  useEffect(() => {
    axios
      .get("http://192.168.0.102:8000", { withCredentials: true })
      .then((response) => {
        if (response.data.Status === "Success") {
          setIme(response.data.name);
          setUserID(response.data.userID);
          // setRoom(response.data?.room);
          console.log(response.data, "svi datas");
        } else {
          console.log("greska");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Postavi početne pozicije krugova
    setPosition({ top: 100, left: 0 }); // Primer: skroz levo
    setPosition2({ top: 100, left: window.innerWidth - 200 }); // Primer: skroz desno
  }, []);

  function joinRoom() {
    socket.emit("join_room", room);
  }

  function sendMessage() {
    const currentTime = new Date().toLocaleTimeString();
    const newMessage = { text: message, userName: ime, time: currentTime };

    socket.emit("send_message", {
      room,
      message,
      ime,
      time: currentTime,
    });

    axios
      .post("http://192.168.0.102:8000/api/getMessage", newMessage)
      .then((response) => {
        console.log("Message saved:", response.data);
      })
      .catch((error) => {
        console.error("greska", error);
      });
  }

  useEffect(() => {
    console.log(uuidv4(), "specific id");
  }, []);

  useEffect(() => {
    axios
      .get("http://192.168.0.102:8000/api/getMessages")
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, []);

  useEffect(() => {
    socket.on("received_message", (data) => {
      const newMessage = {
        text: data.message,
        userName: data.ime,
        time: data.time,
      };
      setMessages((prevData) => [...prevData, newMessage]);
    });

    socket.on("assigned_circle", (data) => {
      console.log(data, "dara");
      setIsBlue(data.isBlue);
    });

    socket.on("update_circle", (data) => {
      if (data.isBlue) {
        setPosition({ top: data.top, left: data.left });
      } else {
        setPosition2({ top: data.top, left: data.left });
      }
    });
  }, []);

  useEffect(() => {
    function getData() {
      axios.get("http://192.168.0.102:8000/api/home").then((res) => {
        setUserNames(res.data);
      });
    }
    getData();
  }, []);

  function onArrows(e) {
    if (isBlue !== null) {
      if (isBlue) {
        if (e.key === "ArrowDown") position.top += 10;
        else if (e.key === "ArrowUp") position.top -= 10;
        else if (e.key === "ArrowLeft") position.left -= 10;
        else if (e.key === "ArrowRight") position.left += 10;
        setPosition(position);

        socket.emit("move_circle", {
          top: position.top,
          left: position.left,
          isBlue,
        });
      } else {
        if (e.key === "ArrowDown") position2.top += 10;
        else if (e.key === "ArrowUp") position2.top -= 10;
        else if (e.key === "ArrowLeft") position2.left -= 10;
        else if (e.key === "ArrowRight") position2.left += 10;

        setPosition2(position2);

        socket.emit("move_circle", {
          top: position2.top,
          left: position2.left,
          isBlue,
        });
      }
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", onArrows);
    return () => {
      window.removeEventListener("keydown", onArrows);
    };
  }, [position, position2, isBlue]);

  return (
    <div className="container">
      <div
        style={{
          position: "absolute",
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        className="krug"
      ></div>
      <div
        style={{
          position: "absolute",
          top: `${position2.top}px`,
          left: `${position2.left}px`,
        }}
        className="krug2"
      ></div>
      <div className="chat">
        <input
          type="text"
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Join Room"
        ></input>
        <button onClick={joinRoom}>Join room</button>
        <input
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
        ></input>
        <button onClick={sendMessage}>Send Message</button>
        <div className="message-list">
          {messages.map((msg, index) => (
            <p
              key={index}
              style={{
                backgroundColor: msg.userName === ime ? "lightgreen" : "white",
              }}
            >
              {msg.text} {msg.time}
            </p>
          ))}
          <h1>ime:{ime}</h1>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
