"""
packet_capture/flow_tracker.py
Net Sentinel AI

Tracks live network flows for
CICIDS2017-style feature extraction.
"""

import time
import logging
from collections import defaultdict
from typing import Dict, Tuple, Any

logger = logging.getLogger(__name__)

# =========================================================
# ACTIVE FLOWS
# =========================================================

flows: Dict[Tuple, Dict[str, Any]] = defaultdict(dict)

FLOW_TIMEOUT = 60  # seconds


# =========================================================
# FLOW KEY
# =========================================================

def create_flow_key(metadata: dict) -> Tuple:
    """
    Create unique flow identifier.
    """

    return (
        metadata.get("src_ip"),
        metadata.get("dst_ip"),
        metadata.get("src_port"),
        metadata.get("dst_port"),
        metadata.get("protocol"),
    )


# =========================================================
# UPDATE FLOW
# =========================================================

def update_flow(metadata: dict) -> Dict[str, Any]:
    """
    Update flow statistics using packet metadata.
    """

    key = create_flow_key(metadata)

    current_time = metadata.get(
        "timestamp",
        time.time()
    )

    packet_length = float(
        metadata.get("packet_length", 0)
    )

    tcp_flags = int(
        metadata.get("flags", 0)
    )

    # =====================================================
    # CREATE FLOW
    # =====================================================

    if key not in flows:

        flows[key] = {

            "start_time": current_time,
            "last_seen": current_time,

            "forward_packets": 0,
            "backward_packets": 0,

            "forward_bytes": 0,
            "backward_bytes": 0,

            "total_packets": 0,
            "total_bytes": 0,

            "syn_count": 0,
            "ack_count": 0,
            "psh_count": 0,
            "rst_count": 0,
            "fin_count": 0,
            "urg_count": 0,

            "packet_lengths": [],
            "iat_times": [],
        }

    flow = flows[key]

    # =====================================================
    # INTER-ARRIVAL TIME
    # =====================================================

    iat = current_time - flow["last_seen"]

    if iat > 0:
        flow["iat_times"].append(iat)

    # =====================================================
    # UPDATE TIMES
    # =====================================================

    flow["last_seen"] = current_time

    # =====================================================
    # UPDATE PACKET COUNTS
    # =====================================================

    flow["forward_packets"] += 1

    flow["forward_bytes"] += packet_length

    flow["total_packets"] += 1

    flow["total_bytes"] += packet_length

    # =====================================================
    # TRACK PACKET LENGTHS
    # =====================================================

    flow["packet_lengths"].append(packet_length)

    # =====================================================
    # TCP FLAGS
    # =====================================================

    if tcp_flags & 0x01:
        flow["fin_count"] += 1

    if tcp_flags & 0x02:
        flow["syn_count"] += 1

    if tcp_flags & 0x04:
        flow["rst_count"] += 1

    if tcp_flags & 0x08:
        flow["psh_count"] += 1

    if tcp_flags & 0x10:
        flow["ack_count"] += 1

    if tcp_flags & 0x20:
        flow["urg_count"] += 1

    # =====================================================
    # FLOW METRICS
    # =====================================================

    duration = max(
        current_time - flow["start_time"],
        0.0001
    )

    flow["flow_duration"] = duration

    flow["bytes_per_second"] = (
        flow["total_bytes"] / duration
    )

    flow["packets_per_second"] = (
        flow["total_packets"] / duration
    )

    return flow


# =========================================================
# CLEANUP FLOWS
# =========================================================

def cleanup_old_flows() -> None:
    """
    Remove expired flows.
    """

    current_time = time.time()

    expired = []

    for key, flow in flows.items():

        if (
            current_time - flow["last_seen"]
            > FLOW_TIMEOUT
        ):
            expired.append(key)

    for key in expired:

        del flows[key]

    if expired:

        logger.info(
            f"Cleaned {len(expired)} expired flows."
        )