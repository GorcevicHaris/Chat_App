import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./LoginFolder/Login";
import Signup from "./SignupFolder/Signup";
import HomePage from "./pages/HomePage";
import Profile from "./Profile";
import ContextProvider from "./Context/ContextProvider";
import Basket from "./pages/Basket";

function App() {
  return (
    <BrowserRouter>
      <ContextProvider>
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/basket" element={<Basket />} />
        </Routes>
      </ContextProvider>
    </BrowserRouter>
  );
}

export default App;
