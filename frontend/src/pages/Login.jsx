import { useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
import { PiGraduationCapFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login-transparent.png";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await login({ email, password });
      setMessage("Login Successful");
      setMessageType("success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login Failed!");
      setMessageType("error");
    }
  };

  return (
    <main className="login-page min-h-screen bg-butter-50">
      <section className="login-showcase-panel" aria-label="Tutor management introduction">
        <div className="login-showcase-content">
          <div className="login-logo-row">
            <span className="login-logo-icon" aria-hidden="true">
              <PiGraduationCapFill />
            </span>
            <div>
              <p className="login-logo-name">
                Tutor<span>Manage</span>
              </p>
              <p className="login-logo-tagline">Tutor Management System</p>
            </div>
          </div>

          <div className="login-showcase-copy">
            <h1>
              Manage students.
              <span>Inspire success.</span>
            </h1>
            <p>
              A focused workspace to manage students, attendance, schedules,
              and everyday teaching progress—all in one place.
            </p>
          </div>

          <div className="login-artwork-shell">
            <img
              src={loginImage}
              alt="Tutor working at a laptop with education tools"
              className="login-artwork"
            />
          </div>
        </div>
      </section>

      <section className="login-access-panel">
        <form className="login-card w-full" onSubmit={handleLogin}>
          <div className="login-user-icon" aria-hidden="true">
            <FiUser />
          </div>

          <div className="login-form-heading">
            <h2>Welcome Back!</h2>
            <p>Sign in to your account to continue</p>
          </div>

          {message && (
            <p
              className={
                messageType === "success"
                  ? "success-msg rounded-xl px-4 py-3 text-sm"
                  : "error-msg rounded-xl px-4 py-3 text-sm"
              }
            >
              {message}
            </p>
          )}

          <label className="login-field">
            <span>Email Address</span>
            <span className="login-input-wrap">
              <FiMail aria-hidden="true" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                autoComplete="email"
                required
                onChange={(event) => setEmail(event.target.value)}
              />
            </span>
          </label>

          <label className="login-field">
            <span>Password</span>
            <span className="login-input-wrap">
              <FiLock aria-hidden="true" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                autoComplete="current-password"
                required
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="login-password-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </span>
          </label>

          <label className="login-remember">
            <input type="checkbox" />
            <span>Remember me on this device</span>
          </label>

          <button type="submit" className="login-submit-button">
            Sign In
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
