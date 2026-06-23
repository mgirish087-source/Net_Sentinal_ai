import { useMemo } from "react";
import useLogs from "../features/hooks/useLogs";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend 
} from "recharts";

// =====================================================
// SOC DASHBOARD - PREMIUM REDESIGN
// =====================================================

export default function Dashboard() {

  // ===================================================
  // HOOK & STATE
  // ===================================================

  const { logs, loading } = useLogs();
  const safeLogs = useMemo(() => Array.isArray(logs) ? logs : [], [logs]);

  // ===================================================
  // STATS & CALCULATIONS
  // ===================================================

  const totalTraffic = safeLogs.length;
  const attacksDetected = safeLogs.filter((log) => log.attack !== "BENIGN").length;
  const normalTraffic = totalTraffic - attacksDetected;

  // Data for Donut Chart
  const attackData = [
    { name: "Threats", value: attacksDetected, color: "#ef4444" }, // Red
    { name: "Normal", value: normalTraffic, color: "#10b981" },    // Emerald
  ];

  // Data for Line Chart (Time Series)
  const timeSeriesData = useMemo(() => {
    const grouped = {};
    [...safeLogs].reverse().forEach(log => {
      const t = log.timestamp;
      // Extract just HH:MM:SS if possible for cleaner x-axis
      const shortTime = t ? (t.split(" ")[1] || t) : "Unknown";
      
      if (!grouped[shortTime]) grouped[shortTime] = { time: shortTime, traffic: 0, attacks: 0 };
      grouped[shortTime].traffic += 1;
      if (log.attack !== "BENIGN") {
        grouped[shortTime].attacks += 1;
      }
    });
    // Show last 12 points for a smooth curve
    return Object.values(grouped).slice(-12);
  }, [safeLogs]);

  // Data for New Bar Chart (Protocol Distribution)
  const protocolData = useMemo(() => {
    const counts = {};
    safeLogs.forEach(log => {
      const p = log.protocol === "OTHER" ? "Ether" : (log.protocol || "Unknown");
      counts[p] = (counts[p] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5 protocols
  }, [safeLogs]);

  // ===================================================
  // LOADING STATE
  // ===================================================

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-[#020617] text-cyan-400">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-r-2 border-blue-500 animate-spin opacity-75" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="font-mono text-sm tracking-widest animate-pulse">INITIALIZING TELEMETRY...</p>
        </div>
      </div>
    );
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#020617] text-slate-200 p-6 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">

        {/* ========================================== */}
        {/* HEADER & ALERT BANNER */}
        {/* ========================================== */}
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              SOC Overview
            </h1>
            <p className="text-slate-400 text-sm font-medium">Real-time network traffic & threat telemetry</p>
          </div>
          
          {attacksDetected > 0 && (
            <div className="bg-red-950/40 border border-red-500/50 rounded-xl px-5 py-3 flex items-center gap-3 shadow-[0_0_20px_rgba(239,68,68,0.15)] animate-pulse">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              <div>
                <p className="text-red-400 font-bold leading-tight uppercase tracking-wider text-sm">Threats Detected</p>
                <p className="text-red-300 text-xs font-mono">{attacksDetected} active alerts in current session</p>
              </div>
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* KPI GRID */}
        {/* ========================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-800 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-16 h-16 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Packets</h2>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl lg:text-5xl font-black text-white">{totalTraffic.toLocaleString()}</p>
              <span className="text-cyan-400 text-sm font-mono">+12%</span>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-800 relative overflow-hidden group hover:border-red-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"></path></svg>
            </div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Malicious</h2>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl lg:text-5xl font-black text-red-400">{attacksDetected.toLocaleString()}</p>
              {attacksDetected > 0 && <span className="text-red-500 text-sm font-mono animate-pulse">Active</span>}
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-800 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-16 h-16 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Benign</h2>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl lg:text-5xl font-black text-emerald-400">{normalTraffic.toLocaleString()}</p>
              <span className="text-emerald-500 text-sm font-mono">Safe</span>
            </div>
          </div>

        </div>

        {/* ========================================== */}
        {/* CHARTS GRID */}
        {/* ========================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Traffic Area Chart */}
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-slate-800/80">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-slate-100 flex items-center">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 shadow-[0_0_8px_#22d3ee]"></span>
                Live Traffic Velocity
              </h2>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid #334155", borderRadius: "8px", backdropFilter: "blur(4px)" }}
                    itemStyle={{ fontSize: "13px", fontWeight: "600" }}
                    labelStyle={{ color: "#94a3b8", marginBottom: "6px", fontSize: "12px" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }}/>
                  <Area 
                    name="Total Traffic"
                    type="monotone" 
                    dataKey="traffic" 
                    stroke="#06b6d4" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorTraffic)" 
                    activeDot={{ r: 6, fill: "#06b6d4", stroke: "#020617", strokeWidth: 2 }}
                  />
                  <Area 
                    name="Attacks"
                    type="monotone" 
                    dataKey="attacks" 
                    stroke="#ef4444" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorAttacks)" 
                    activeDot={{ r: 5, fill: "#ef4444", stroke: "#020617", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column Charts */}
          <div className="flex flex-col gap-6">
            
            {/* Donut Chart - Threat Ratio */}
            <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-slate-800/80 flex-1 flex flex-col">
              <h2 className="text-base font-bold text-slate-100 flex items-center mb-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 shadow-[0_0_8px_#3b82f6]"></span>
                Threat Ratio
              </h2>
              <div className="flex-1 min-h-[200px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={attackData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60} 
                      outerRadius={85} 
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {attackData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid #334155", borderRadius: "8px" }} 
                      itemStyle={{ color: "#FFF", fontWeight: "bold" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Label for Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-white">{totalTraffic}</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================== */}
        {/* ROW 3: NEW BAR CHART & RECENT LOGS */}
        {/* ========================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Protocol Distribution Bar Chart */}
          <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-slate-800/80">
            <h2 className="text-base font-bold text-slate-100 flex items-center mb-6">
              <span className="w-2 h-2 rounded-full bg-purple-500 mr-2 shadow-[0_0_8px_#a855f7]"></span>
              Top Protocols
            </h2>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={protocolData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} fontWeight={600} axisLine={false} tickLine={false} width={60} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(30, 41, 59, 0.5)' }}
                    contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid #334155", borderRadius: "8px" }}
                    itemStyle={{ color: "#a855f7", fontWeight: "bold" }}
                  />
                  <Bar dataKey="count" name="Packets" fill="#a855f7" radius={[0, 4, 4, 0]}>
                    {protocolData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#a855f7" : index === 1 ? "#8b5cf6" : "#6366f1"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Logs Table */}
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 flex flex-col">
            <div className="p-5 border-b border-slate-800/80 flex justify-between items-center bg-slate-900/60">
              <h2 className="text-base font-bold text-slate-100 flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_#34d399]"></span>
                Recent Connection Logs
              </h2>
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">Live Stream</span>
            </div>

            <div className="overflow-x-auto flex-1 max-h-[280px] custom-scrollbar">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-slate-900/80 text-slate-400 sticky top-0 z-10 backdrop-blur-xl">
                  <tr>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">Time</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">Source</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">Destination</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">Protocol</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {safeLogs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-slate-500 text-sm">
                        <div className="flex flex-col items-center gap-2">
                          <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                          No recent logs available.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    safeLogs.slice(0, 20).map((log, index) => {
                      const isAttack = log.attack !== "BENIGN";
                      return (
                        <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-5 py-3 text-slate-400 font-mono">{log.timestamp?.split(" ")[1] || log.timestamp}</td>
                          <td className="px-5 py-3 text-slate-300 font-mono">{log.src_ip}</td>
                          <td className="px-5 py-3 text-slate-300 font-mono">{log.dst_ip}</td>
                          <td className="px-5 py-3 text-slate-300 font-semibold text-[11px]">{log.protocol === "OTHER" ? "ETHER" : log.protocol}</td>
                          <td className="px-5 py-3 text-right">
                            <span className={`px-2.5 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider border ${isAttack ? 'bg-red-950/50 text-red-400 border-red-500/30' : 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30'}`}>
                              {log.attack}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(51, 65, 85, 0.8); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(71, 85, 105, 0.8); }
      `}</style>
    </div>
  );
}