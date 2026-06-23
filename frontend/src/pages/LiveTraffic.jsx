import { useState, useEffect, useMemo } from "react";

import {
  startCapture,
  stopCapture,
  getCaptureStatus
} from "../api/api";

import useLogs from "../features/hooks/useLogs";

import Table from "../components/Table";
import Badge from "../components/Badge";

// ======================================================
// COMPONENT
// ======================================================

export default function LiveTraffic() {

  const { logs = [] } = useLogs();

  // ======================================================
  // STATE
  // ======================================================

  const [capturing, setCapturing] = useState(false);

  const [interfaceName, setInterfaceName] = useState("Wi-Fi");

  const [loading, setLoading] = useState(false);

  // ======================================================
  // CHECK CAPTURE STATUS
  // ======================================================

  useEffect(() => {

    const checkStatus = async () => {

      try {

        const res = await getCaptureStatus();

        if (res?.data) {

          setCapturing(
            res.data.is_capturing
          );
        }

      } catch (err) {

        console.error(
          "Capture status error:",
          err
        );
      }
    };

    checkStatus();

    const interval = setInterval(
      checkStatus,
      3000
    );

    return () => clearInterval(interval);

  }, []);

  // ======================================================
  // START CAPTURE
  // ======================================================

  const handleStart = async () => {

    try {

      setLoading(true);

      await startCapture({
        interface: interfaceName,
        packet_count: 500
      });

      setCapturing(true);

    } catch (err) {

      console.error(
        "Failed to start capture",
        err
      );

      alert(
        "Failed to start capture.\n\nRun backend as Administrator."
      );

    } finally {

      setLoading(false);
    }
  };

  // ======================================================
  // STOP CAPTURE
  // ======================================================

  const handleStop = async () => {

    try {

      setLoading(true);

      await stopCapture();

      setCapturing(false);

    } catch (err) {

      console.error(
        "Failed to stop capture",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  // ======================================================
  // STATS
  // ======================================================

  const stats = useMemo(() => {

    const total = logs.length;

    const attacks = logs.filter(log => {

      const attack =
        log.attack_type ||
        log.attack ||
        "BENIGN";

      return attack !== "BENIGN";

    }).length;

    const tcp = logs.filter(
      l => l.protocol === "TCP"
    ).length;

    const udp = logs.filter(
      l => l.protocol === "UDP"
    ).length;

    return {
      total,
      attacks,
      tcp,
      udp
    };

  }, [logs]);

  // ======================================================
  // PROTOCOL COLORS
  // ======================================================

  const protocolColor = (protocol) => {

    switch (protocol) {

      case "TCP":
        return "text-cyan-400";

      case "UDP":
        return "text-yellow-400";

      case "ICMP":
        return "text-purple-400";

      default:
        return "text-slate-400";
    }
  };

  // ======================================================
  // NORMALIZE ATTACK LABEL
  // ======================================================

  const getAttackType = (log) => {

    return (
      log.attack_type ||
      log.attack ||
      "BENIGN"
    );
  };

  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="space-y-6 text-white p-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

        <div>

          <h1 className="text-3xl font-bold">
            Live Packet Monitoring
          </h1>

          <p className="text-slate-400 mt-1">
            Real-time network intrusion monitoring
          </p>

        </div>

        {/* ============================================= */}
        {/* CAPTURE CONTROLS */}
        {/* ============================================= */}

        <div className="flex flex-wrap gap-3 items-center">

          <input
            type="text"
            value={interfaceName}
            onChange={(e) =>
              setInterfaceName(e.target.value)
            }
            disabled={capturing || loading}
            placeholder="Wi-Fi / Ethernet"

            className="
              bg-slate-900
              border
              border-slate-700
              rounded-lg
              px-4
              py-2
              focus:outline-none
              focus:border-cyan-500
            "
          />

          {capturing ? (

            <button
              onClick={handleStop}

              disabled={loading}

              className="
                bg-red-500
                hover:bg-red-600
                px-4
                py-2
                rounded-lg
                font-medium
                transition
                flex
                items-center
                gap-2
              "
            >

              <span className="
                w-2
                h-2
                rounded-full
                bg-white
                animate-pulse
              " />

              Stop Capture

            </button>

          ) : (

            <button
              onClick={handleStart}

              disabled={loading}

              className="
                bg-cyan-500
                hover:bg-cyan-600
                px-4
                py-2
                rounded-lg
                font-medium
                transition
                flex
                items-center
                gap-2
              "
            >

              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"

                  d="
                    M14.752 11.168
                    l-3.197-2.132
                    A1 1 0 0010 9.87
                    v4.263
                    a1 1 0 001.555.832
                    l3.197-2.132
                    a1 1 0 000-1.664z
                  "
                />

              </svg>

              Start Capture

            </button>

          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* LIVE STATUS */}
      {/* ================================================= */}

      <div className="
        bg-slate-900
        rounded-xl
        p-5
        border
        border-slate-800
      ">

        <div className="
          flex
          flex-wrap
          gap-6
          justify-between
        ">

          <div>
            <p className="text-slate-400 text-sm">
              Capture Status
            </p>

            <div className="flex items-center gap-2 mt-1">

              <span
                className={`
                  w-3 h-3 rounded-full
                  ${capturing
                    ? "bg-green-400 animate-pulse"
                    : "bg-red-400"
                  }
                `}
              />

              <span className="font-semibold">

                {capturing
                  ? "ACTIVE"
                  : "STOPPED"
                }

              </span>

            </div>
          </div>

          <div>
            <p className="text-slate-400 text-sm">
              Total Packets
            </p>

            <p className="text-2xl font-bold">
              {stats.total}
            </p>
          </div>

          <div>
            <p className="text-slate-400 text-sm">
              Attacks
            </p>

            <p className="text-2xl font-bold text-red-400">
              {stats.attacks}
            </p>
          </div>

          <div>
            <p className="text-slate-400 text-sm">
              TCP
            </p>

            <p className="text-2xl font-bold text-cyan-400">
              {stats.tcp}
            </p>
          </div>

          <div>
            <p className="text-slate-400 text-sm">
              UDP
            </p>

            <p className="text-2xl font-bold text-yellow-400">
              {stats.udp}
            </p>
          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* TRAFFIC TABLE */}
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

          <h2 className="text-lg font-semibold">
            Live Network Traffic
          </h2>

        </div>

        <Table

          columns={[
            "Time",
            "Source IP",
            "Destination IP",
            "Protocol",
            "Detection"
          ]}

          data={logs.slice(0, 100)}

          emptyMessage="
            No live traffic detected.
            Start packet capture.
          "

          renderRow={(log, i) => {

            const attack =
              getAttackType(log);

            const isAttack =
              attack !== "BENIGN";

            return (

              <tr
                key={i}

                className={`
                  border-b
                  border-slate-800
                  hover:bg-slate-800/50
                  transition

                  ${isAttack
                    ? "bg-red-500/5"
                    : ""
                  }
                `}
              >

                <td className="p-3 text-slate-300">
                  {log.timestamp || "-"}
                </td>

                <td className="p-3 font-mono text-sm">
                  {log.src_ip || "-"}
                </td>

                <td className="p-3 font-mono text-sm">
                  {log.dst_ip || "-"}
                </td>

                <td className={`
                  p-3
                  font-semibold
                  ${protocolColor(log.protocol)}
                `}>
                  {log.protocol || "-"}
                </td>

                <td className="p-3">

                  <Badge type={attack} />

                </td>

              </tr>
            );
          }}

        />

      </div>

    </div>
  );
}