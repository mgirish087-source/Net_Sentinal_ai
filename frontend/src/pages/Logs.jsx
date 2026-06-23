import { useMemo, useState } from "react";
import useLogs from "../features/hooks/useLogs";
import Table from "../components/Table";
import Badge from "../components/Badge";

export default function Logs() {
  const { logs = [] } = useLogs();

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // =========================
  // Dynamic Attack Types
  // =========================

  const attackTypes = useMemo(() => {
    const unique = new Set();

    logs.forEach((log) => {
      if (log.attack) {
        unique.add(log.attack);
      }
    });

    return ["All", "Attacks", ...Array.from(unique)];
  }, [logs]);

  // =========================
  // Filter + Search
  // =========================

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const attack = log.attack || "BENIGN";

      // Filter logic
      const filterMatch =
        filter === "All"
          ? true
          : filter === "Attacks"
          ? attack !== "BENIGN" && attack !== "Normal"
          : attack === filter;

      // Search logic
      const q = search.toLowerCase();

      const searchMatch =
        log.src_ip?.toLowerCase().includes(q) ||
        log.dst_ip?.toLowerCase().includes(q) ||
        log.protocol?.toLowerCase().includes(q) ||
        attack.toLowerCase().includes(q);

      return filterMatch && searchMatch;
    });
  }, [logs, filter, search]);

  // =========================
  // Statistics
  // =========================

  const attackCount = logs.filter(
    (l) => l.attack !== "BENIGN" && l.attack !== "Normal"
  ).length;

  const benignCount = logs.length - attackCount;

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-6 pb-10">

      {/* ========================= */}
      {/* Header */}
      {/* ========================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>
          <h1 className="text-2xl font-bold text-white">
            Network Traffic Logs
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Real-time packet analysis and AI detection events
          </p>
        </div>

        {/* Search */}
        <div className="w-full lg:w-[320px]">
          <input
            type="text"
            placeholder="Search IP, protocol, attack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-lg
              px-4
              py-2.5
              text-sm
              text-white
              outline-none
              focus:border-cyan-500
              transition
            "
          />
        </div>
      </div>

      {/* ========================= */}
      {/* Stats */}
      {/* ========================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400 text-sm">
            Total Logs
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {logs.length}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400 text-sm">
            Threat Detections
          </p>

          <h2 className="text-3xl font-bold text-red-400 mt-2">
            {attackCount}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400 text-sm">
            Benign Traffic
          </p>

          <h2 className="text-3xl font-bold text-emerald-400 mt-2">
            {benignCount}
          </h2>
        </div>

      </div>

      {/* ========================= */}
      {/* Filters */}
      {/* ========================= */}

      <div className="flex flex-wrap gap-2">

        {attackTypes.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all

              ${
                filter === f
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }
            `}
          >
            {f}
          </button>
        ))}

      </div>

      {/* ========================= */}
      {/* Table */}
      {/* ========================= */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

        <Table
          columns={[
            "Time",
            "Source IP",
            "Destination IP",
            "Protocol",
            "Classification",
          ]}
          data={filteredLogs}
          emptyMessage="No logs found"
          renderRow={(log, i) => (
            <tr
              key={i}
              className="
                border-b border-slate-800
                hover:bg-slate-800/40
                transition
              "
            >
              <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                {log.timestamp}
              </td>

              <td className="px-6 py-4 whitespace-nowrap font-mono text-cyan-400 text-xs">
                {log.src_ip}
              </td>

              <td className="px-6 py-4 whitespace-nowrap font-mono text-purple-400 text-xs">
                {log.dst_ip}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span className="
                  bg-slate-800
                  border border-slate-700
                  px-3 py-1
                  rounded-full
                  text-xs
                  text-slate-300
                ">
                  {log.protocol}
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <Badge type={log.attack} />
              </td>
            </tr>
          )}
        />

        {/* Footer */}

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-3
          px-6
          py-4
          border-t
          border-slate-800
          bg-slate-950/40
        ">

          <div className="flex items-center gap-3 text-xs text-slate-500">

            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>

            Live monitoring enabled

          </div>

          <div className="text-xs text-slate-500">
            Showing {filteredLogs.length} records
          </div>

        </div>

      </div>
    </div>
  );
}