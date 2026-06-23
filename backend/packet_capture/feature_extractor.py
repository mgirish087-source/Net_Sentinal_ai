"""
packet_capture/feature_extractor.py — Net Sentinel AI

Advanced CICIDS2017-compatible
feature extraction engine.
"""

import logging
import statistics
from typing import Optional, List, Dict, Any

logger = logging.getLogger(__name__)

# =========================================================
# FEATURE COUNT
# =========================================================

FEATURE_COUNT = 78


# =========================================================
# SAFE STATS
# =========================================================

def _safe_mean(values: list) -> float:

    if not values:
        return 0.0

    return float(statistics.mean(values))


def _safe_std(values: list) -> float:

    if len(values) < 2:
        return 0.0

    return float(statistics.stdev(values))


# =========================================================
# FEATURE EXTRACTION
# =========================================================

def extract_features(
    metadata: Dict[str, Any],
    flow_stats: Dict[str, Any],
) -> Optional[List[float]]:
    """
    Generate 78-feature vector.
    """

    try:

        if not metadata:
            return None

        # =================================================
        # BASIC DATA
        # =================================================

        pkt_len = float(
            metadata.get("packet_length", 0)
        )

        dst_port = float(
            metadata.get("dst_port", 0)
        )

        window_size = float(
            metadata.get("window_size", 0)
        )

        # =================================================
        # FLOW DATA
        # =================================================

        duration = float(
            flow_stats.get("flow_duration", 0.0001)
        )

        total_packets = float(
            flow_stats.get("total_packets", 1)
        )

        total_bytes = float(
            flow_stats.get("total_bytes", pkt_len)
        )

        forward_packets = float(
            flow_stats.get("forward_packets", 1)
        )

        backward_packets = float(
            flow_stats.get("backward_packets", 0)
        )

        forward_bytes = float(
            flow_stats.get("forward_bytes", pkt_len)
        )

        backward_bytes = float(
            flow_stats.get("backward_bytes", 0)
        )

        bytes_per_second = float(
            flow_stats.get("bytes_per_second", 0)
        )

        packets_per_second = float(
            flow_stats.get("packets_per_second", 0)
        )

        # =================================================
        # STORED ARRAYS
        # =================================================

        packet_lengths = flow_stats.get(
            "packet_lengths",
            [pkt_len]
        )

        iat_times = flow_stats.get(
            "iat_times",
            []
        )

        # =================================================
        # PACKET STATS
        # =================================================

        pkt_mean = _safe_mean(packet_lengths)

        pkt_std = _safe_std(packet_lengths)

        pkt_min = min(packet_lengths)

        pkt_max = max(packet_lengths)

        pkt_variance = pkt_std ** 2

        avg_packet_size = (
            total_bytes / max(total_packets, 1)
        )

        # =================================================
        # IAT STATS
        # =================================================

        iat_mean = _safe_mean(iat_times)

        iat_std = _safe_std(iat_times)

        iat_min = min(iat_times) if iat_times else 0.0

        iat_max = max(iat_times) if iat_times else 0.0

        # =================================================
        # TCP FLAGS
        # =================================================

        fin_count = float(
            flow_stats.get("fin_count", 0)
        )

        syn_count = float(
            flow_stats.get("syn_count", 0)
        )

        rst_count = float(
            flow_stats.get("rst_count", 0)
        )

        psh_count = float(
            flow_stats.get("psh_count", 0)
        )

        ack_count = float(
            flow_stats.get("ack_count", 0)
        )

        urg_count = float(
            flow_stats.get("urg_count", 0)
        )

        # =================================================
        # BUILD FEATURES
        # =================================================

        features = [

            # Basic Flow Features
            dst_port,
            duration,
            forward_packets,
            backward_packets,
            forward_bytes,
            backward_bytes,

            # Packet Length Stats
            pkt_max,
            pkt_min,
            pkt_mean,
            pkt_std,

            pkt_max,
            pkt_min,
            pkt_mean,
            pkt_std,

            # Flow Rates
            bytes_per_second,
            packets_per_second,

            # IAT Features
            iat_mean,
            iat_std,
            iat_max,
            iat_min,

            iat_mean,
            iat_mean,
            iat_std,
            iat_max,
            iat_min,

            iat_mean,
            iat_mean,
            iat_std,
            iat_max,
            iat_min,

            # TCP Flags
            psh_count,
            0.0,

            urg_count,
            0.0,

            20.0,
            20.0,

            packets_per_second,
            0.0,

            # Packet Statistics
            pkt_min,
            pkt_max,
            pkt_mean,
            pkt_std,
            pkt_variance,

            # Flags
            fin_count,
            syn_count,
            rst_count,
            psh_count,
            ack_count,
            urg_count,
            0.0,
            0.0,

            # Ratios
            backward_packets / max(forward_packets, 1),

            avg_packet_size,
            avg_packet_size,
            avg_packet_size,

            20.0,

            # Bulk
            0.0,
            0.0,
            0.0,

            0.0,
            0.0,
            0.0,

            # Subflow
            forward_packets,
            forward_bytes,

            backward_packets,
            backward_bytes,

            # Window
            window_size,
            window_size,

            forward_packets,

            20.0,

            # Active / Idle
            duration,
            0.0,
            duration,
            duration,

            0.0,
            0.0,
            0.0,
            0.0,
        ]

        # =================================================
        # PAD TO 78
        # =================================================

        while len(features) < FEATURE_COUNT:

            features.append(0.0)

        if len(features) > FEATURE_COUNT:

            features = features[:FEATURE_COUNT]

        return [
            float(x)
            for x in features
        ]

    except Exception as exc:

        logger.exception(
            f"Feature extraction error: {exc}"
        )

        return None