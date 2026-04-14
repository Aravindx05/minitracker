import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Login from "./Login.jsx";

const token = localStorage.getItem("token");

ReactDOM.createRoot(document.getElementById("root")).render(
  token ? <App /> : <Login />
);