import { useState } from "react";
import axios from "axios";

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // Function to handle login logic
    const login = async () => {
      try {
        const res = await axios.post("/api/login", { email, password });
        localStorage.setItem("userEmail", email);
        onLoginSuccess(email);
      } catch (err) {
        console.error("Login error:", err.response?.data || err.message);
        alert("Login failed");
      }
    };
  
    return (
      <>
        <input
          placeholder="Username"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
      </>
    );
  }
   
export default Login;
