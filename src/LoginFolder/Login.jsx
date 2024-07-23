import React, { useContext, useEffect, useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../Context/ContextProvider";

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const { ime, setIme } = useContext(Context);
  const [errors, setError] = useState({});
  axios.defaults.withCredentials = true;

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post("http://192.168.0.102:8000/login", values)
      .then((response) => {
        if (response.data.Status === "Success") {
          navigate("/");
        } else {
        }
      })
      .catch((error) => {
        console.error("Greška prilikom prijave:", error);
      });
  }

  const auth = document.cookie;

  console.log(document.cookie, "document");
  useEffect(() => {
    if (auth) {
      navigate("/");
    }
  }, []);
  console.log(values);
  return (
    <div className="Big">
      <div className="Logincontainer">
        <h1>Sign-In</h1>
        <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              name="password"
            />
            {errors.password && (
              <span style={{ color: "red" }}>{errors.password}</span>
            )}
          </div>
          <button type="submit">Login</button>

          <p style={{ paddingLeft: "20px" }}>
            You are agree to aour terms and policies
          </p>
          <button onClick={() => navigate("/signup")} type="button">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
