import { useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser, FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login.png";
import logoImage from "../assets/logo.png";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setMessage("");
    setMessageType("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (mode === "signup") {
      if (!name.trim()) {
        setMessage("Please enter your name");
        setMessageType("error");
        return;
      }
      if (password.length < 6) {
        setMessage("Password must be at least 6 characters");
        setMessageType("error");
        return;
      }
      if (password !== confirmPassword) {
        setMessage("Passwords do not match");
        setMessageType("error");
        return;
      }

      setLoading(true);
      try {
        await signup({ name: name.trim(), email: email.trim(), password });
        setMessage("Account created successfully! Redirecting...");
        setMessageType("success");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } catch (error) {
        setMessage(error.response?.data?.message || "Registration failed!");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        await login({ email: email.trim(), password });
        setMessage("Login Successful! Redirecting...");
        setMessageType("success");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } catch (error) {
        setMessage(error.response?.data?.message || "Login Failed! Invalid credentials.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="login-page min-h-screen bg-butter-50">
      <section className="login-showcase-panel" aria-label="Tutor management introduction">
        <div className="login-showcase-content">
          <div className="login-logo-row">
            <img
              src={logoImage}
              alt="TutorDesk logo"
              className="login-logo-image"
            />
            <div>
              <p className="login-logo-name">
                Tutor<span>Desk</span>
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
        <form className="login-card w-full" onSubmit={handleSubmit}>
          <div className="login-user-icon" aria-hidden="true">
            {mode === "signup" ? <FiUserPlus /> : <FiUser />}
          </div>

          <div className="login-form-heading">
            <h2>{mode === "signup" ? "Create an Account" : "Welcome Back!"}</h2>
            <p>
              {mode === "signup"
                ? "Register your tutor account to get started"
                : "Sign in to your account to continue"}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="auth-tab-group" role="tablist">
            <button
              type="button"
              className={`auth-tab-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => handleModeSwitch("login")}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${mode === "signup" ? "active" : ""}`}
              onClick={() => handleModeSwitch("signup")}
            >
              Register
            </button>
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

          {mode === "signup" && (
            <label className="login-field">
              <span>Full Name</span>
              <span className="login-input-wrap">
                <FiUser aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  autoComplete="name"
                  required
                  onChange={(event) => setName(event.target.value)}
                />
              </span>
            </label>
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
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
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

          {mode === "signup" && (
            <label className="login-field">
              <span>Confirm Password</span>
              <span className="login-input-wrap">
                <FiLock aria-hidden="true" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  autoComplete="new-password"
                  required
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </span>
            </label>
          )}

          {mode === "login" && (
            <label className="login-remember">
              <input type="checkbox" defaultChecked />
              <span>Remember me on this device</span>
            </label>
          )}

          <button
            type="submit"
            className="login-submit-button"
            disabled={loading}
            style={{ marginTop: mode === "signup" ? "24px" : "0" }}
          >
            {loading
              ? "Please wait..."
              : mode === "signup"
              ? "Create Account"
              : "Sign In"}
          </button>

          <button
            type="button"
            className="auth-toggle-link"
            onClick={() => handleModeSwitch(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? (
              <>
                Don&apos;t have an account? <span>Sign Up</span>
              </>
            ) : (
              <>
                Already have an account? <span>Sign In</span>
              </>
            )}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
