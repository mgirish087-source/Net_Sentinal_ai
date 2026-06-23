"""
packet_capture/prediction_engine.py — Net Sentinel AI

Centralized AI prediction engine.

Handles:
- ML prediction
- confidence scoring
- attack classification
- MongoDB logging
- automatic alert creation
- live SocketIO updates
"""

import logging

from datetime import datetime, timezone

from typing import Dict, Any, Optional

import app as app_module

from app.predict import predict_attack

logger = logging.getLogger(__name__)


# =========================================================
# RUN PREDICTION PIPELINE
# =========================================================

def run_prediction_pipeline(
    metadata: Dict[str, Any],
    flow_stats: Dict[str, Any],
    features: list,
) -> Optional[Dict[str, Any]]:
    """
    Execute complete AI prediction workflow.
    """

    try:

        # -------------------------------------------------
        # RUN ML INFERENCE
        # -------------------------------------------------

        prediction = predict_attack(features)

        if prediction is None:

            logger.warning(
                "Prediction engine returned None."
            )

            return None

        # -------------------------------------------------
        # BUILD RESULT OBJECT
        # -------------------------------------------------

        result = {

            # ---------------------------------------------
            # NETWORK INFO
            # ---------------------------------------------

            "source_ip": metadata.get(
                "src_ip",
                "unknown",
            ),

            "destination_ip": metadata.get(
                "dst_ip",
                "unknown",
            ),

            "protocol": metadata.get(
                "protocol",
                "UNKNOWN",
            ),

            "source_port": metadata.get(
                "src_port",
                0,
            ),

            "destination_port": metadata.get(
                "dst_port",
                0,
            ),

            "packet_length": metadata.get(
                "packet_length",
                0,
            ),

            # ---------------------------------------------
            # AI PREDICTION
            # ---------------------------------------------

            "attack_type": prediction.get(
                "attack_label",
                "UNKNOWN",
            ),

            "confidence": float(
                prediction.get(
                    "confidence",
                    0.0,
                )
            ),

            "is_attack": bool(
                prediction.get(
                    "is_attack",
                    False,
                )
            ),

            "all_probabilities": prediction.get(
                "all_probs",
                {},
            ),

            # ---------------------------------------------
            # FLOW STATISTICS
            # ---------------------------------------------

            "flow_duration": flow_stats.get(
                "flow_duration",
                0,
            ),

            "total_packets": flow_stats.get(
                "total_packets",
                0,
            ),

            "total_bytes": flow_stats.get(
                "total_bytes",
                0,
            ),

            "bytes_per_second": flow_stats.get(
                "bytes_per_second",
                0,
            ),

            "packets_per_second": flow_stats.get(
                "packets_per_second",
                0,
            ),

            # ---------------------------------------------
            # TIMESTAMP
            # ---------------------------------------------

            "timestamp": datetime.now(
                timezone.utc
            ).isoformat(),
        }

        # -------------------------------------------------
        # STORE PREDICTION
        # -------------------------------------------------

        _store_prediction(result)

        # -------------------------------------------------
        # SOCKETIO LIVE EVENT
        # -------------------------------------------------

        _emit_prediction_event(result)

        # -------------------------------------------------
        # CREATE ALERT IF ATTACK DETECTED
        # -------------------------------------------------

        if result["is_attack"]:

            alert = _create_alert(result)

            if alert is not None:

                _emit_alert_event(alert)

            logger.warning(
                f"ATTACK DETECTED | "
                f"{result['attack_type']} | "
                f"{result['source_ip']} "
                f"→ "
                f"{result['destination_ip']}"
            )

        return result

    except Exception as exc:

        logger.exception(
            f"Prediction pipeline failed: {exc}"
        )

        return None


# =========================================================
# STORE PREDICTION
# =========================================================

def _store_prediction(
    result: Dict[str, Any],
) -> None:
    """
    Store prediction in MongoDB.
    """

    try:

        if app_module.db is None:

            logger.warning(
                "MongoDB not initialized."
            )

            return

        app_module.db[
            "predictions"
        ].insert_one(result)

    except Exception as exc:

        logger.exception(
            f"Prediction storage failed: {exc}"
        )


# =========================================================
# CREATE ALERT
# =========================================================

def _create_alert(
    result: Dict[str, Any],
) -> Optional[Dict[str, Any]]:
    """
    Create security alert document.
    """

    try:

        if app_module.db is None:

            logger.warning(
                "MongoDB not initialized."
            )

            return None

        confidence = result["confidence"]

        alert = {

            "severity": _calculate_severity(
                confidence
            ),

            "attack_type": result[
                "attack_type"
            ],

            "confidence": confidence,

            "source_ip": result[
                "source_ip"
            ],

            "destination_ip": result[
                "destination_ip"
            ],

            "protocol": result[
                "protocol"
            ],

            "message": (
                f"{result['attack_type']} detected "
                f"from {result['source_ip']} "
                f"to {result['destination_ip']}"
            ),

            "status": "OPEN",

            "timestamp": datetime.now(
                timezone.utc
            ).isoformat(),
        }

        app_module.db[
            "alerts"
        ].insert_one(alert)

        logger.warning(
            f"ALERT CREATED | "
            f"{alert['attack_type']} | "
            f"{alert['severity']}"
        )

        return alert

    except Exception as exc:

        logger.exception(
            f"Alert creation failed: {exc}"
        )

        return None


# =========================================================
# SOCKETIO PREDICTION EVENT
# =========================================================

def _emit_prediction_event(
    result: Dict[str, Any],
) -> None:
    """
    Emit live prediction event.
    """

    try:

        if hasattr(app_module, "socketio"):

            app_module.socketio.emit(
                "new_prediction",
                result,
            )

    except Exception as exc:

        logger.debug(
            f"SocketIO prediction emit failed: {exc}"
        )


# =========================================================
# SOCKETIO ALERT EVENT
# =========================================================

def _emit_alert_event(
    alert: Dict[str, Any],
) -> None:
    """
    Emit live alert event.
    """

    try:

        if hasattr(app_module, "socketio"):

            app_module.socketio.emit(
                "new_alert",
                alert,
            )

    except Exception as exc:

        logger.debug(
            f"SocketIO alert emit failed: {exc}"
        )


# =========================================================
# ALERT SEVERITY
# =========================================================

def _calculate_severity(
    confidence: float,
) -> str:
    """
    Calculate alert severity level.
    """

    if confidence >= 0.90:

        return "CRITICAL"

    elif confidence >= 0.75:

        return "HIGH"

    elif confidence >= 0.50:

        return "MEDIUM"

    return "LOW"