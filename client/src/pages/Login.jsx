import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api"; // ✅ correct import
import "./Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData); // ✅ Call API only ONCE

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", formData.email); // ✅ Save the email from response
        navigate("/profile"); // or wherever you want to redirect after login
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Failed to login. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          value={formData.email}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          value={formData.password}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
