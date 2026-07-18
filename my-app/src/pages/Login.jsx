import axios from "axios";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {

  // ================= STATES =================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  const navigate = useNavigate();

  // ================= LOGIN =================

  const handleLogin = async () => {

    try {

      const response = await axios.post(

        "http://localhost:5000/api/auth/login",

        {
          email,
          password,
        }

      );

      // ================= SAVE TOKEN =================

      localStorage.setItem(

        "token",

        response.data.token

      );

      // ================= LOGIN STATE =================

      localStorage.setItem(

        "isLoggedIn",

        true

      );

      // ================= USER DATA =================

      localStorage.setItem("user",
        JSON.stringify(
          response.data.user
        )
      );

     // Success Message

setMessage("Login Successful");
setMessageType("success");

// Delay Login + Redirect

setTimeout(() => {
  setIsLoggedIn(true);
  navigate("/dashboard");
}, 1000);
    } catch (error) {

      // ================= ERROR MESSAGE =================

      setMessage(

        error.response?.data?.message ||
        "Login Failed!"
      );
      setMessageType(
        "error"
      );

    }

  };

  return (

    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>

        {/* ================= MESSAGE ================= */}

        {message && (

          <p
            className={
              messageType ===
              "success"
                ? "success-msg"
                : "error-msg"
            }
          >
            {message}
          </p>
        )}

        {/* ================= EMAIL ================= */}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }

        />

        {/* ================= PASSWORD ================= */}

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        {/* ================= BUTTON ================= */}

        <button onClick={handleLogin}>
          Login
        </button>

      </div>

    </div>

  );

}

export default Login;