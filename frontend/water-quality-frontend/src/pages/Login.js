import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.accessToken);
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Login failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card glass-card">
        <div className="login-brand">
          <img src="/logo192.png" alt="Logo" className="brand-logo" />
          <h1>Water Quality Monitor</h1>
          <p className="brand-tagline">Environmental Intelligence</p>
        </div>
        
        <form className="login-form" onSubmit={handleLogin}>
          <h3>Login</h3>
          <div className="form-group">
            <label>Your email</label>
            <input 
              type="email" 
              placeholder="admin@123" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Your password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
          <button type="submit" className="blue-submit-btn">Submit</button>
          <p style={{marginTop: '1rem'}}>
            Don't have an account? <a href="/signup" style={{color: '#00bfff'}}>Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;