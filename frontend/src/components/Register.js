import { useState } from "react";
import axios from "axios";

function Register({ onRegisterSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // Handles the registration request
    const register = async () => {
      try {
        await axios.post("http://localhost:5000/api/register", { email, password });

        // On successful registration, immediately login user
        onRegisterSuccess(email);
      } catch (err) {
        console.error("Registration error:", err.response?.data || err.message);
        alert("Registration failed");
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
        <button onClick={register}>Register</button>
      </>
    );
  }
  
export default Register;
