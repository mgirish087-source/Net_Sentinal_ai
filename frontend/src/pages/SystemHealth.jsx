import { useEffect, useState } from "react";
import { getSystemHealth } from "../api/api";

export default function SystemHealth() {
  const [health, setHealth] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let interval;

    const fetchHealth = async () => {
      try {
        const res = await getSystemHealth();

        setHealth(res);

        setError("");
      } catch (err) {
        console.error("System health error:", err);

        setError(
          err?.response?.data?.error ||
            "Failed to fetch system health data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();

    interval = setInterval(fetchHealth, 5000);

    return () => clearInterval(interval);
  }, []);

  const getUsageColor = (value) => {
    if (value >= 85) {
      return "bg-red-500";
    }

    if (value >= 60) {
      return "bg-yellow-500";
    }

    return "bg-cyan-500";
  };

  const getStatusStyle = (status) => {
    if (
      status === "Online" ||
      status === "Loaded" ||
      status === "Running"
    ) {
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }

    return "bg-red-500/10 text-red-400 border border-red-500/20";
  };

  return (
    <div className="space-y-8 pb-10">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold text-white">
          System Health Monitor
        </h1>

        <p className="text-slate-400 mt-2">
          Real-time monitoring of backend resources,
          database connectivity, and AI engine status.
        </p>

      </div>

      {/* LOADING */}

      {loading && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex items-center gap-4 text-cyan-400">
          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          Loading system metrics...
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-5">
          {error}
        </div>
      )}

      {/* CONTENT */}

      {!loading && health && (

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CPU */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">

            <div className="flex items-center justify-between mb-5">

              <div>

                <p className="text-slate-400 text-sm uppercase tracking-wider">
                  CPU Usage
                </p>

                <h2 className="text-4xl font-bold text-white mt-2">
                  {health.cpu_usage || 0}%
                </h2>

              </div>

              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <svg
                  className="w-7 h-7 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 3v2.25m4.5-2.25v2.25M9.75 18.75V21m4.5-2.25V21M3 9.75h2.25m13.5 0H21M3 14.25h2.25m13.5 0H21M6.75 6.75h10.5v10.5H6.75V6.75z"
                  />
                </svg>
              </div>

            </div>

            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">

              <div
                className={`h-full transition-all duration-500 ${getUsageColor(
                  health.cpu_usage || 0
                )}`}
                style={{
                  width: `${health.cpu_usage || 0}%`,
                }}
              ></div>

            </div>

            <div className="mt-4 text-sm text-slate-400">
              CPU load across backend processes and AI inference engine.
            </div>

          </div>

          {/* RAM */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">

            <div className="flex items-center justify-between mb-5">

              <div>

                <p className="text-slate-400 text-sm uppercase tracking-wider">
                  RAM Usage
                </p>

                <h2 className="text-4xl font-bold text-white mt-2">
                  {health.ram_usage || 0}%
                </h2>

              </div>

              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <svg
                  className="w-7 h-7 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

            </div>

            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">

              <div
                className={`h-full transition-all duration-500 ${getUsageColor(
                  health.ram_usage || 0
                )}`}
                style={{
                  width: `${health.ram_usage || 0}%`,
                }}
              ></div>

            </div>

            <div className="mt-4 text-sm text-slate-400">
              {health.ram_used || 0} GB used of{" "}
              {health.ram_total || 0} GB total memory.
            </div>

          </div>

          {/* SERVICES */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">

            <div className="flex items-center justify-between mb-6">

              <div>

                <p className="text-slate-400 text-sm uppercase tracking-wider">
                  Services Status
                </p>

                <h2 className="text-2xl font-bold text-white mt-2">
                  Infrastructure
                </h2>

              </div>

              <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <svg
                  className="w-7 h-7 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

            </div>

            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <span className="text-slate-300">
                  MongoDB
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    health.db_status
                  )}`}
                >
                  {health.db_status || "Unknown"}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-slate-300">
                  AI Model
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    health.model_status
                  )}`}
                >
                  {health.model_status || "Unknown"}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-slate-300">
                  Packet Capture
                </span>

                <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Active
                </span>

              </div>

              <div className="pt-4 border-t border-slate-800">

                <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">
                  System Uptime
                </div>

                <div className="text-lg font-semibold text-white">
                  {health.uptime || "Unavailable"}
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}