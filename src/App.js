import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./LoginFolder/Login";
import Signup from "./SignupFolder/Signup";
import HomePage from "./HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
