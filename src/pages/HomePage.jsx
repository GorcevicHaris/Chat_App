import React, { useEffect, useState } from "react";
import "./HomePage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
const socket = io.connect("http://localhost:8000");

function HomePage() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [item, setItem] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const navigate = useNavigate();
  const [ime, setIme] = useState("");
  const [vreme, setVreme] = useState("");
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
    const currentTime = new Date().toLocaleTimeString();
    setVreme(currentTime);
    const newMessage = { text: message, userName: ime, time: currentTime };
    socket.emit("send_message", { room, message, ime, time: currentTime });
    axios
      .post("http://localhost:8000/api/getMessage", newMessage)
      .then((response) => {
        console.log("Message saved:", response.data);
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
      console.log(data, "ajde");
      const newMessage = {
        text: data.message,
        userName: data.ime,
        time: data.time,
      };
      setMessages((prevData) => [...prevData, newMessage]);
      console.log(messages, "hamza");
    });
    // socket.on("user_joined", (data) => {
    //   console.log(data, "erhadpenda");
    //   setUsers((prev) => [...prev, data]);
    // });
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
  console.log(messages, "poruke");
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
          {messages &&
            messages.map((msg, index) => {
              console.log(msg.time, "vreme");
              return (
                <p
                  key={index}
                  style={{
                    backgroundColor:
                      msg?.userName === ime ? "lightgreen" : "white",
                  }}
                >
                  {msg.text}
                  {msg?.time}
                </p>
              );
            })}
          <h1>ime:{ime}</h1>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
