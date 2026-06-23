import axios from "axios";

// =====================================================
// AXIOS INSTANCE
// =====================================================

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error);
    return Promise.reject(error);
  }
);

// =====================================================
// LOGIN
// =====================================================

export const loginUser = async (username, password) => {
  const response = await API.post("/login", {
    username,
    password,
  });

  return response.data;
};

// =====================================================
// MODEL INFO
// =====================================================

export const getModelInfo = async () => {
  const response = await API.get("/model-info");

  return response.data;
};

// =====================================================
// SYSTEM HEALTH
// =====================================================

export const getSystemHealth = async () => {
  const response = await API.get("/system-health");

  return response.data;
};

// =====================================================
// GET PREDICTIONS
// =====================================================

export const getPredictions = async () => {
  const response = await API.get("/predictions");

  return response.data;
};

// =====================================================
// ALERTS
// =====================================================

export const getAlerts = async () => {
  const response = await API.get("/predictions");

  const predictions = response.data?.predictions || [];

  const alerts = predictions.filter(
    (item) => item.attack_type !== "BENIGN"
  );

  return {
    success: true,
    alerts,
  };
};

// =====================================================
// LIVE TRAFFIC
// =====================================================

export const getTraffic = async () => {
  const response = await API.get("/predictions");

  const predictions = response.data?.predictions || [];

  return {
    success: true,
    packets: predictions.length,
    traffic: predictions,
  };
};

// =====================================================
// LOGS
// =====================================================

export const getLogs = async () => {
  const response = await API.get("/predictions");

  return {
    success: true,
    logs: response.data?.predictions || [],
  };
};

// =====================================================
// CAPTURE STATUS
// =====================================================

export const getCaptureStatus = async () => {
  const response = await API.get("/capture/status");
  return response;
};

// =====================================================
// START CAPTURE
// =====================================================

export const startCapture = async (data) => {
  const response = await API.post("/capture/start", data || {});
  return response;
};

// =====================================================
// STOP CAPTURE
// =====================================================

export const stopCapture = async () => {
  const response = await API.post("/capture/stop");
  return response;
};

// =====================================================
// DASHBOARD STATS
// =====================================================

export const getDashboardStats = async () => {
  const response = await API.get("/predictions");

  const predictions = response.data?.predictions || [];

  const attacks = predictions.filter(
    (p) => p.attack_type !== "BENIGN"
  );

  return {
    success: true,
    total_packets: predictions.length,
    threats_detected: attacks.length,
    benign_packets: predictions.length - attacks.length,
    active_alerts: attacks.length,
  };
};

// =====================================================
// PREDICT ATTACK
// =====================================================

export const predictAttack = async (features, token) => {
  const response = await API.post(
    "/predict",
    {
      features,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =====================================================
// EXPORT
// =====================================================

export default API;