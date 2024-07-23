import React from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import Validation from "../SignupValidation";
import { useState } from "react";
import axios from "axios";
function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function handleInputSubmit(event) {
    event.preventDefault();
    setErrors(Validation(values));
    axios
      .post("http://192.168.0.102:8000/register", values)
      .then((res) => {
        navigate("/login");
        console.log(res);
      })
      .catch((err) => console.log(err, "err"));
  }
  return (
    <div className="Big">
      <div className="Logincontainer">
        <h1>Sign-Up</h1>
        <form onSubmit={handleInputSubmit}>
          <div className="form-group">
            <strong>
              <label>Name:</label>
            </strong>
            <input
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              type="name"
              placeholder="Enter your Name "
              name="name"
            />
            {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
          </div>
          <div className="form-group">
            <strong>
              <label>Email:</label>
            </strong>
            <input
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              type="email"
              placeholder="Enter your email adress"
              name="email"
            />
            {errors.email && (
              <span style={{ color: "red" }}>{errors.email}</span>
            )}
          </div>
          <div className="form-group">
            <strong>
              <label>Password:</label>
            </strong>
            <input
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              type="password"
              placeholder="Enter your password"
              name="password"
            />
            {errors.password && (
              <span style={{ color: "red" }}>{errors.password}</span>
            )}
          </div>
          <button type="submit">Sign up </button>
          <p style={{ paddingLeft: "20px" }}>
            You are agree to aour terms and policies
          </p>
          <button type="button" onClick={() => navigate("/")}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
