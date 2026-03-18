import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("https://instaclonebackend-1.onrender.com/api/v1/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      // this updates App state so navbar shows and redirect works
      setIsLoggedIn(true);

      toast.success("Login successful!");
      navigate("/");

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="auth-card">
        <h2
          className="text-center mb-4"
          style={{ fontFamily: "cursive", fontSize: "2.2rem", color: "var(--text)" }}
        >
          InstaClone
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control auth-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control auth-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <hr style={{ borderColor: "var(--border)", margin: "20px 0" }} />

        <p
          className="text-center mb-0"
          style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "#0095f6", textDecoration: "none", fontWeight: 600 }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
