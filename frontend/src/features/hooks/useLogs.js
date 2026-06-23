import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getPredictions } from "../../api/api";
import toast from "react-hot-toast";

// =====================================================
// SOCKET
// =====================================================

const socket = io("http://127.0.0.1:5000", {
  transports: ["websocket"],
});

// =====================================================
// CUSTOM HOOK
// =====================================================

export default function useLogs() {

  const [logs, setLogs] = useState([]);

  const [connected, setConnected] = useState(false);

  const [loading, setLoading] = useState(true);

  // ===================================================
  // INITIAL FETCH
  // ===================================================

  useEffect(() => {

    fetchLogs();

    // ================================================
    // SOCKET CONNECT
    // ================================================

    socket.on("connect", () => {

      console.log("Socket Connected");

      setConnected(true);
    });

    // ================================================
    // SOCKET DISCONNECT
    // ================================================

    socket.on("disconnect", () => {

      console.log("Socket Disconnected");

      setConnected(false);
    });

    // ================================================
    // REALTIME PREDICTIONS
    // ================================================

    socket.on("new_prediction", (data) => {

      console.log("Realtime Packet:", data);

      if (data.attack_type && data.attack_type !== "BENIGN") {
        toast.error(`Threat Detected: ${data.attack_type} from ${data.source_ip}`);
      }

      setLogs((prev) => [

        {
          timestamp:
            new Date(data.timestamp)
              .toLocaleTimeString(),

          src_ip:
            data.source_ip,

          dst_ip:
            data.destination_ip,

          protocol:
            data.protocol,

          attack:
            data.attack_type,

          confidence:
            data.confidence,
        },

        ...prev,
      ]);
    });

    // ================================================
    // CLEANUP
    // ================================================

    return () => {

      socket.off("connect");

      socket.off("disconnect");

      socket.off("new_prediction");
    };

  }, []);

  // ===================================================
  // FETCH EXISTING LOGS
  // ===================================================

  const fetchLogs = async () => {

    try {

      const response = await getPredictions();

      const predictions =
        response?.predictions || [];

      const formatted = predictions.map((item) => ({

        timestamp:
          item.shortTime ||
          item.timestamp,

        src_ip:
          item.src_ip,

        dst_ip:
          item.dst_ip,

        protocol:
          item.protocol,

        attack:
          item.attack_type,

        confidence:
          item.confidence,
      }));

      setLogs(formatted);

    } catch (error) {

      console.error(
        "Failed fetching predictions:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  // ===================================================
  // RETURN
  // ===================================================

  return {

    logs,

    connected,

    loading,
  };
}