"""
packet_capture/packet_worker.py — Net Sentinel AI

Handles:
- packet parsing
- live traffic storage
- flow tracking
- feature extraction
- prediction pipeline
"""

import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any

from scapy.packet import Packet

import app as app_module

from packet_capture.parser import parse_packet

from packet_capture.flow_tracker import (
    update_flow,
    cleanup_old_flows,
)

from packet_capture.feature_extractor import extract_features

from packet_capture.prediction_engine import (
    run_prediction_pipeline,
)

logger = logging.getLogger(__name__)


# =========================================================
# PROCESS PACKET
# =========================================================

def process_packet(packet: Packet) -> Optional[Dict[str, Any]]:
    """
    Main packet processing pipeline.

    Flow:
        Packet
          ↓
        Parse
          ↓
        Store Live Traffic
          ↓
        Flow Tracking
          ↓
        Feature Extraction
          ↓
        Prediction Engine
    """

    try:

        # -------------------------------------------------
        # PARSE PACKET
        # -------------------------------------------------

        metadata = parse_packet(packet)

        if metadata is None:
            return None

        # -------------------------------------------------
        # STORE LIVE TRAFFIC
        # -------------------------------------------------

        _store_live_traffic(metadata)

        # -------------------------------------------------
        # UPDATE FLOW
        # -------------------------------------------------

        flow_stats = update_flow(metadata)

        # -------------------------------------------------
        # FEATURE EXTRACTION
        # -------------------------------------------------

        features = extract_features(
            metadata,
            flow_stats,
        )

        if features is None:

            logger.warning(
                "Feature extraction failed."
            )

            return None

        # -------------------------------------------------
        # RUN AI PREDICTION
        # -------------------------------------------------

        result = run_prediction_pipeline(
            metadata=metadata,
            flow_stats=flow_stats,
            features=features,
        )

        # -------------------------------------------------
        # CLEANUP OLD FLOWS
        # -------------------------------------------------

        cleanup_old_flows()

        return result

    except Exception as exc:

        logger.exception(
            f"Packet worker error: {exc}"
        )

        return None


# =========================================================
# STORE LIVE TRAFFIC
# =========================================================

def _store_live_traffic(
    metadata: Dict[str, Any],
) -> None:
    """
    Store raw live packet traffic into MongoDB.
    """

    try:

        if app_module.db is None:

            logger.warning(
                "MongoDB not initialized."
            )

            return

        traffic_doc = {

            # -----------------------------------------
            # NETWORK INFO
            # -----------------------------------------

            "source_ip": metadata.get(
                "src_ip",
                "unknown",
            ),

            "destination_ip": metadata.get(
                "dst_ip",
                "unknown",
            ),

            "source_port": metadata.get(
                "src_port",
                0,
            ),

            "destination_port": metadata.get(
                "dst_port",
                0,
            ),

            "protocol": metadata.get(
                "protocol",
                "UNKNOWN",
            ),

            "packet_length": metadata.get(
                "packet_length",
                0,
            ),

            "ttl": metadata.get(
                "ttl",
                0,
            ),

            # -----------------------------------------
            # PAYLOAD INFO
            # -----------------------------------------

            "payload_bytes": metadata.get(
                "payload_bytes",
                0,
            ),

            # -----------------------------------------
            # RAW PACKET SUMMARY
            # -----------------------------------------

            "packet_summary": metadata.get(
                "raw_summary",
                "",
            ),

            # -----------------------------------------
            # TIMESTAMP
            # -----------------------------------------

            "timestamp": datetime.now(
                timezone.utc
            ),

            # -----------------------------------------
            # SOURCE
            # -----------------------------------------

            "source": "live_capture",
        }

        # ---------------------------------------------
        # INSERT INTO traffic COLLECTION
        # ---------------------------------------------

        app_module.db["traffic"].insert_one(
            traffic_doc
        )

    except Exception as exc:

        logger.exception(
            f"Traffic storage error: {exc}"
        )