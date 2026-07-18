import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Login() {

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
  const { login } = useAuth();

  // ================= LOGIN =================

  const handleLogin = async () => {

    try {

      await login({ email, password });

     // Success Message

setMessage("Login Successful");
setMessageType("success");

// Delay Login + Redirect

setTimeout(() => {
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
