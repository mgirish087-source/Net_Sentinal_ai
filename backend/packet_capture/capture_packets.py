"""
packet_capture/capture_packets.py — Net Sentinel AI

Handles:
- live packet capture
- threaded sniffing
- capture lifecycle management
"""

import logging
import threading
from typing import Optional

from scapy.all import sniff, Packet

from packet_capture.packet_worker import process_packet

logger = logging.getLogger(__name__)

# =========================================================
# GLOBAL CAPTURE STATE
# =========================================================

_capture_thread: Optional[threading.Thread] = None

_stop_event = threading.Event()

_is_capturing = False


# =========================================================
# START CAPTURE
# =========================================================

def start_capture(
    interface: str = "eth0",
    packet_count: int = 0,
) -> None:
    """
    Start background packet capture.

    packet_count=0 means unlimited capture.
    """

    global _capture_thread, _is_capturing

    if _is_capturing:

        logger.warning("Packet capture already running.")

        return

    _stop_event.clear()

    _is_capturing = True

    _capture_thread = threading.Thread(
        target=_capture_loop,
        args=(interface, packet_count),
        daemon=True,
        name="PacketCaptureThread",
    )

    _capture_thread.start()

    logger.info(
        f"Packet capture started | "
        f"interface={interface} | "
        f"packet_count={packet_count}"
    )


# =========================================================
# STOP CAPTURE
# =========================================================

def stop_capture() -> None:
    """
    Stop active packet capture.
    """

    global _is_capturing

    _stop_event.set()

    _is_capturing = False

    logger.info("Packet capture stop signal sent.")


# =========================================================
# CAPTURE STATUS
# =========================================================

def is_capturing() -> bool:
    """
    Return current capture state.
    """

    return _is_capturing


# =========================================================
# CAPTURE LOOP
# =========================================================

def _capture_loop(
    interface: str,
    packet_count: int,
) -> None:
    """
    Main Scapy sniff loop.
    """

    global _is_capturing

    try:

        logger.info(
            f"Sniffing packets on interface: {interface}"
        )

        sniff(
            iface=interface,
            prn=_handle_packet,
            store=False,
            count=packet_count if packet_count > 0 else 0,
            stop_filter=lambda _: _stop_event.is_set(),
        )

    except PermissionError:

        logger.error(
            "Permission denied while capturing packets. "
            "Run terminal as Administrator/root."
        )

    except Exception as exc:

        logger.exception(
            f"Packet capture error: {exc}"
        )

    finally:

        _is_capturing = False

        logger.info(
            "Packet capture session ended."
        )


# =========================================================
# HANDLE PACKET
# =========================================================

def _handle_packet(packet: Packet) -> None:
    """
    Delegate packet processing to worker pipeline.
    """

    try:

        process_packet(packet)

    except Exception as exc:

        logger.debug(
            f"Packet handling error: {exc}"
        )