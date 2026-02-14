import { useState } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BACKEND_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        setMessage("Signup successful! You can now login.");
      } else {
        const error = await response.json();
        setMessage(error.detail || "Signup failed");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card glass-card">
        <form onSubmit={handleSignup} className="login-form">
          <h3>Signup</h3>

          <div className="form-group">
            <label>Name</label>
            <input 
              placeholder="Enter your name" 
              value={name}
              onChange={(e) => setName(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email"
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="blue-submit-btn">Signup</button>
          
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default Signup;
