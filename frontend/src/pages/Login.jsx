import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../api/auth";

export default function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("admin");

  const [password, setPassword] = useState("admin123");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      const res = await loginUser({
        username,
        password,
      });

      /* =====================================================
         BACKEND TOKEN FIX
      ===================================================== */

      const token =
        res.data.access_token ||
        res.data.token;

      if (!token) {
        throw new Error("Token not received");
      }

      localStorage.setItem("token", token);

      toast.success("Login successful");

      navigate("/");

    } catch (err) {

      console.error(err);

      setError("Invalid username or password");

      toast.error("Authentication failed");

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">

      {/* BACKGROUND GLOW */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-3xl rounded-full" />
      </div>

      {/* LOGIN CARD */}

      <div className="relative w-full max-w-md">

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">

          {/* HEADER */}

          <div className="p-10 text-center border-b border-slate-800">

            <div className="w-20 h-20 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/10">

              <svg
                className="w-10 h-10 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 3l7 4v5c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V7l7-4z"
                />
              </svg>

            </div>

            <h1 className="text-5xl font-bold text-white mb-3">
              Net Sentinel AI
            </h1>

            <p className="text-slate-400 text-lg">
              AI-Powered Intrusion Detection System
            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleLogin}
            className="p-8 space-y-6"
          >

            {/* USERNAME */}

            <div>

              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                required
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                required
              />

            </div>

            {/* ERROR */}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-4">
                {error}
              </div>
            )}

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-3 rounded-xl shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Login to Dashboard"}
            </button>

          </form>

          {/* FOOTER */}

          <div className="border-t border-slate-800 p-6 text-center text-sm text-slate-500">
            Net Sentinel AI © 2026
          </div>

        </div>
      </div>
    </div>
  );
}