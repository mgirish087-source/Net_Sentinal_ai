import { Link, useLocation } from "react-router-dom";

// ======================================================
// COMPONENT
// ======================================================

export default function Sidebar() {
  const location = useLocation();

  // ====================================================
  // NAVIGATION
  // ====================================================
  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Live Traffic", path: "/live-traffic" },
    { name: "Logs", path: "/logs" },
    { name: "Alerts", path: "/alerts" },
    { name: "Prediction", path: "/prediction" },
    { name: "System Health", path: "/system-health" }
  ];

  // ====================================================
  // UI
  // ====================================================
  return (
    <div className="w-[260px] bg-[#070B14] border-r border-slate-800/70 hidden md:flex flex-col min-h-screen">
      
      {/* ============================================= */}
      {/* TOP */}
      {/* ============================================= */}
      <div className="p-6">
        {/* BRAND */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-[#00E5FF]">
              <path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11l-3 3h6l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            NetSentinel AI
          </h1>
        </div>

        {/* MENU */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4 px-3">
            OVERVIEW
          </p>
          <ul className="space-y-1">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`
                      block px-4 py-2.5 rounded text-sm font-medium transition-all
                      ${isActive
                        ? "bg-[#091F33] text-[#00E5FF] border-l-2 border-[#00E5FF]"
                        : "text-slate-400 hover:text-white border-l-2 border-transparent"
                      }
                    `}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}