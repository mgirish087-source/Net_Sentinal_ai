import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import "./styles/global.css";

/* =========================================================
   ROOT RENDER
========================================================= */

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);