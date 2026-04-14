import { useState } from "react";
import { API } from "./api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await API.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("startDate", res.data.createdAt); 
        window.location.reload();
      } else {
        await API.post("/auth/register", { email, password });
        alert("Registered successfully! Now login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert("Error: " + err.response?.data || "Something went wrong");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{isLogin ? "Login" : "Register"}</h2>

      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <br /><br />

      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <br /><br />

      <button onClick={handleSubmit}>
        {isLogin ? "Login" : "Register"}
      </button>

      <p style={{ marginTop: "10px", cursor: "pointer", color: "blue" }}
         onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "New user? Register" : "Already have account? Login"}
      </p>
    </div>
  );
}