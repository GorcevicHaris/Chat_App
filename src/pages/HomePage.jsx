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
  const [messages, setMessages] = useState([]);
  const [item, setItem] = useState([]);
  const [users, setUsers] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const navigate = useNavigate();
  const [ime, setIme] = useState("");
  function joinRoom() {
    socket.emit("join_room", room);
    console.log(room, "duzina sobe");
  }

  useEffect(() => {
    axios
      .get("http://localhost:8000", { withCredentials: true })
      .then((response) => {
        if (response.data.Status === "Success") {
          setIme(response.data.name);
        } else {
          console.log("greska");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function sendMessage() {
    const newMessage = { text: message, username: ime };
    socket.emit("send_message", { room, message, ime });

    axios
      .post("http://localhost:8000/api/getMessage", newMessage)
      .then((response) => {
        console.log("Message saved:", response.data);
        // setMessages((prevData) => [...prevData, newMessage]);
      })
      .catch((error) => {
        console.error("greska", error);
      });
    console.log(newMessage, "nova poruka");
  }
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/getMessages")
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, []);
  useEffect(() => {
    socket.on("received_message", (data) => {
      const newMessage = { text: data.message, username: data.username };
      setMessages((prevData) => [...prevData, newMessage]);
      console.log(data);
    });
    socket.on("user_joined", (data) => {
      console.log(data, "erhadpenda");
      setUsers((prev) => [...prev, data]);
    });
  }, []);

  useEffect(() => {
    function getData() {
      axios.get("http://localhost:8000/api/home").then((res) => {
        setItem(res.data);
      });
    }
    getData();
    function getUsers() {
      axios.get("http://localhost:8000/api/GetAllUsers").then((res) => {
        console.log(res.data, "svi useri");
        setUserNames(res.data);
      });
    }
    getUsers();
  }, []);
  return (
    <div className="container">
      home
      {/* <div>
          {item?.map((data, index) => (
            <Homecomponent key={index} data={data} />
          ))}
        </div> */}
      {/* <h1 onClick={() => navigate("/basket")}>idi do korpe</h1> */}
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
        <p style={{ backgroundColor: "white" }}>{messageReceived}</p>
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            flexDirection: "column",
            gap: "3px",
            overflow: "auto",
            backgroundColor: "blue",
          }}
          className="message-list"
        >
          {messages.map((msg, index) => (
            <p
              key={index}
              style={{
                backgroundColor: msg.userName === ime ? "lightgreen" : "white",
              }}
            >
              {msg.text}
            </p>
          ))}
          <h1>ime:{ime}</h1>
        </div>

        {/* {userNames?.map((name) => (
          <p style={{ backgroundColor: "purple" }}>friend :{name.name}</p>
        ))} */}
      </div>
    </div>
    // <div>
    //   {users?.map((data) => (
    //     <p>{data}</p>
    //   ))}
    // </div>
  );
}

export default HomePage;
