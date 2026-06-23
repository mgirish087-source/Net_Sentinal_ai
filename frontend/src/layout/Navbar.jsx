import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ======================================================
// NAVBAR
// ======================================================

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // ====================================================
  // PAGE TITLES
  // ====================================================

  const titles = {
    "/": "Dashboard Overview",
    "/live-traffic": "Live Traffic",
    "/logs": "Logs",
    "/alerts": "Alerts",
    "/prediction": "Prediction",
    "/system-health": "System Health"
  };

  const pageTitle = titles[location.pathname] || "Net Sentinel AI";

  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <header className="h-[72px] border-b border-slate-800/70 bg-[#0B1120] px-6 lg:px-8 flex items-center justify-between relative z-50">
      {/* ============================================= */}
      {/* LEFT */}
      {/* ============================================= */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-white tracking-wide">
          {pageTitle}
        </h1>
      </div>

      {/* ============================================= */}
      {/* RIGHT */}
      {/* ============================================= */}
      <div className="flex items-center gap-5">
        {/* SYSTEM STATUS */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-900/50 bg-[#0f2922]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-500 tracking-widest">
            SYSTEM LIVE
          </span>
        </div>

        {/* AVATAR & LOGOUT */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-[#0088fe] flex items-center justify-center cursor-pointer">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}