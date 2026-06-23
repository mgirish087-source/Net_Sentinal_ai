import { useMemo } from "react";
import useLogs from "../features/hooks/useLogs";
import Table from "../components/Table";
import Badge from "../components/Badge";

// ======================================================
// COMPONENT
// ======================================================

export default function Alerts() {
  const { logs, loading } = useLogs();
  
  const alerts = useMemo(() => {
    const safeLogs = Array.isArray(logs) ? logs : [];
    return safeLogs
      .filter((log) => log.attack && log.attack !== "BENIGN")
      .map((log) => ({
        ...log,
        severity: log.confidence > 0.9 ? "CRITICAL" : log.confidence > 0.7 ? "HIGH" : "MEDIUM",
        message: `Suspicious activity detected from ${log.src_ip} via ${log.protocol}`,
        status: "open"
      }));
  }, [logs]);

  // ======================================================
  // ALERT STATISTICS
  // ======================================================

  const stats = useMemo(() => {

    const critical = alerts.filter(
      a => a.severity === "CRITICAL"
    ).length;

    const high = alerts.filter(
      a => a.severity === "HIGH"
    ).length;

    const medium = alerts.filter(
      a => a.severity === "MEDIUM"
    ).length;

    const low = alerts.filter(
      a => a.severity === "LOW"
    ).length;

    return {
      total: alerts.length,
      critical,
      high,
      medium,
      low
    };

  }, [alerts]);

  // ======================================================
  // SEVERITY STYLE
  // ======================================================

  const severityStyle = (severity) => {

    switch (severity) {

      case "CRITICAL":
        return `
          bg-red-500/20
          text-red-400
          border-red-500/30
        `;

      case "HIGH":
        return `
          bg-orange-500/20
          text-orange-400
          border-orange-500/30
        `;

      case "MEDIUM":
        return `
          bg-yellow-500/20
          text-yellow-400
          border-yellow-500/30
        `;

      default:
        return `
          bg-blue-500/20
          text-blue-400
          border-blue-500/30
        `;
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="space-y-6 text-white p-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Threat Alerts
          </h1>

          <p className="text-slate-400 mt-1">
            Real-time intrusion detection alerts
          </p>

        </div>

        {/* ============================================= */}
        {/* LIVE STATUS */}
        {/* ============================================= */}

        <div className="
          flex
          items-center
          gap-2
          bg-slate-900
          border
          border-slate-800
          px-4
          py-2
          rounded-lg
        ">

          <span className="
            w-3
            h-3
            rounded-full
            bg-red-400
            animate-pulse
          " />

          <span className="text-sm font-medium">
            LIVE MONITORING
          </span>

        </div>

      </div>

      {/* ================================================= */}
      {/* CRITICAL ALERT BANNER */}
      {/* ================================================= */}

      {stats.critical > 0 && (

        <div className="
          bg-red-500/10
          border
          border-red-500/30
          rounded-xl
          p-4
          animate-pulse
        ">

          <div className="
            flex
            items-center
            gap-3
          ">

            <div className="
              text-red-400
              text-2xl
            ">
              ⚠
            </div>

            <div>

              <h2 className="
                text-red-400
                font-bold
                text-lg
              ">
                Critical Threats Detected
              </h2>

              <p className="text-red-300 text-sm">

                {stats.critical}
                {" "}
                critical attack(s)
                require immediate attention.

              </p>

            </div>

          </div>

        </div>

      )}

      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-5
        gap-4
      ">

        {/* TOTAL */}

        <div className="
          bg-slate-900
          border
          border-slate-800
          rounded-xl
          p-5
        ">

          <p className="text-slate-400 text-sm">
            Total Alerts
          </p>

          <h2 className="
            text-3xl
            font-bold
            mt-2
          ">
            {stats.total}
          </h2>

        </div>

        {/* CRITICAL */}

        <div className="
          bg-red-500/10
          border
          border-red-500/20
          rounded-xl
          p-5
        ">

          <p className="text-red-300 text-sm">
            Critical
          </p>

          <h2 className="
            text-3xl
            font-bold
            mt-2
            text-red-400
          ">
            {stats.critical}
          </h2>

        </div>

        {/* HIGH */}

        <div className="
          bg-orange-500/10
          border
          border-orange-500/20
          rounded-xl
          p-5
        ">

          <p className="text-orange-300 text-sm">
            High
          </p>

          <h2 className="
            text-3xl
            font-bold
            mt-2
            text-orange-400
          ">
            {stats.high}
          </h2>

        </div>

        {/* MEDIUM */}

        <div className="
          bg-yellow-500/10
          border
          border-yellow-500/20
          rounded-xl
          p-5
        ">

          <p className="text-yellow-300 text-sm">
            Medium
          </p>

          <h2 className="
            text-3xl
            font-bold
            mt-2
            text-yellow-400
          ">
            {stats.medium}
          </h2>

        </div>

        {/* LOW */}

        <div className="
          bg-blue-500/10
          border
          border-blue-500/20
          rounded-xl
          p-5
        ">

          <p className="text-blue-300 text-sm">
            Low
          </p>

          <h2 className="
            text-3xl
            font-bold
            mt-2
            text-blue-400
          ">
            {stats.low}
          </h2>

        </div>

      </div>

      {/* ================================================= */}
      {/* ALERT TABLE */}
      {/* ================================================= */}

      <div className="
        bg-slate-900
        rounded-xl
        overflow-hidden
        border
        border-slate-800
      ">

        <div className="
          p-4
          border-b
          border-slate-800
        ">

          <h2 className="
            text-lg
            font-semibold
          ">
            Security Alert Feed
          </h2>

        </div>

        {loading ? (

          <div className="
            p-10
            text-center
            text-slate-400
          ">

            Loading alerts...

          </div>

        ) : (

          <Table

            columns={[
              "Time",
              "Severity",
              "Attack Type",
              "Message",
              "Status"
            ]}

            data={alerts}

            emptyMessage="
              No security alerts detected.
            "

            renderRow={(alert, i) => (

              <tr
                key={i}

                className={`
                  border-b
                  border-slate-800
                  hover:bg-slate-800/50
                  transition

                  ${alert.severity === "CRITICAL"
                    ? "bg-red-500/5"
                    : ""
                  }
                `}
              >

                {/* TIME */}

                <td className="
                  p-3
                  text-slate-300
                  whitespace-nowrap
                ">

                  {alert.timestamp || "-"}

                </td>

                {/* SEVERITY */}

                <td className="p-3">

                  <span className={`
                    px-3
                    py-1
                    rounded-lg
                    text-xs
                    font-bold
                    border
                    ${severityStyle(alert.severity)}
                  `}>

                    {alert.severity || "LOW"}

                  </span>

                </td>

                {/* ATTACK TYPE */}

                <td className="p-3">

                  <Badge
                    type={
                      alert.attack_type ||
                      "UNKNOWN"
                    }
                  />

                </td>

                {/* MESSAGE */}

                <td className="
                  p-3
                  text-slate-300
                ">

                  {alert.message || "-"}

                </td>

                {/* STATUS */}

                <td className="
                  p-3
                  capitalize
                  text-slate-300
                ">

                  {alert.status || "open"}

                </td>

              </tr>
            )}

          />

        )}

      </div>

    </div>
  );
}