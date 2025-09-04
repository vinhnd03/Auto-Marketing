import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import ListUsers from "./components/admin/ListUsers";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#363636",
            color: "#fff",
            zIndex: 999999,
          },
          success: {
            duration: 2500,
            style: {
              background: "#10B981",
              color: "#fff",
              zIndex: 999999,
            },
          },
          error: {
            duration: 2500,
            style: {
              background: "#EF4444",
              color: "#fff",
              zIndex: 999999,
            },
          },
        }}
      />
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
