import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

// ======================================================
// LAYOUT
// ======================================================

import Layout from "./layout/Layout";

// ======================================================
// PAGES
// ======================================================

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Logs from "./pages/Logs";
import Prediction from "./pages/Prediction";
import Alerts from "./pages/Alerts";
import SystemHealth from "./pages/SystemHealth";
import LiveTraffic from "./pages/LiveTraffic";

// ======================================================
// COMPONENTS
// ======================================================

import ProtectedRoute from "./components/ProtectedRoute";

// ======================================================
// APP
// ======================================================

function App() {

  return (

    <BrowserRouter>

      {/* ================================================= */}
      {/* GLOBAL BACKGROUND */}
      {/* ================================================= */}

      <div className="min-h-screen bg-[#070B14] text-white">

        {/* ============================================= */}
        {/* TOAST SYSTEM */}
        {/* ============================================= */}

        <Toaster

          position="top-right"

          toastOptions={{

            duration: 4000,

            style: {

              background: "#0f172a",
              color: "#ffffff",
              border: "1px solid #1e293b",
              borderRadius: "12px",
              padding: "14px",
              fontSize: "14px"
            },

            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#ffffff"
              }
            },

            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff"
              }
            }
          }}
        />

        {/* ============================================= */}
        {/* ROUTES */}
        {/* ============================================= */}

        <Routes>

          {/* ========================================= */}
          {/* PUBLIC */}
          {/* ========================================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/* ========================================= */}
          {/* PROTECTED */}
          {/* ========================================= */}

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >

            {/* DASHBOARD */}

            <Route
              index
              element={<Dashboard />}
            />

            {/* LIVE TRAFFIC */}

            <Route
              path="live-traffic"
              element={<LiveTraffic />}
            />

            {/* LOGS */}

            <Route
              path="logs"
              element={<Logs />}
            />

            {/* ALERTS */}

            <Route
              path="alerts"
              element={<Alerts />}
            />

            {/* PREDICTION */}

            <Route
              path="prediction"
              element={<Prediction />}
            />

            {/* SYSTEM HEALTH */}

            <Route
              path="system-health"
              element={<SystemHealth />}
            />

          </Route>

          {/* ========================================= */}
          {/* FALLBACK */}
          {/* ========================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;