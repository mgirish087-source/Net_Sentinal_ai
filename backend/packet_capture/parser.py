"""
packet_capture/parser.py — Net Sentinel AI
Parse a raw Scapy Packet into a structured metadata dict.
"""

import logging
from typing import Optional, Dict, Any

from scapy.layers.inet import IP, TCP, UDP, ICMP
from scapy.all import Packet, Raw

logger = logging.getLogger(__name__)


def parse_packet(packet: Packet) -> Optional[Dict[str, Any]]:
    """
    Parse a Scapy packet into a metadata dictionary.
    Returns None if the packet is not IPv4 (ARP, IPv6, etc. are skipped).
    """
    if not packet.haslayer(IP):
        return None

    ip_layer = packet[IP]

    if packet.haslayer(TCP):
        proto    = "TCP"
        src_port = packet[TCP].sport
        dst_port = packet[TCP].dport
        flags    = int(packet[TCP].flags)
        window   = packet[TCP].window
    elif packet.haslayer(UDP):
        proto    = "UDP"
        src_port = packet[UDP].sport
        dst_port = packet[UDP].dport
        flags    = 0
        window   = 0
    elif packet.haslayer(ICMP):
        proto    = "ICMP"
        src_port = 0
        dst_port = 0
        flags    = 0
        window   = 0
    else:
        proto    = "OTHER"
        src_port = 0
        dst_port = 0
        flags    = 0
        window   = 0

    payload_bytes = len(packet[Raw].load) if packet.haslayer(Raw) else 0

    return {
        "src_ip":        ip_layer.src,
        "dst_ip":        ip_layer.dst,
        "protocol":      proto,
        "src_port":      src_port,
        "dst_port":      dst_port,
        "packet_length": len(packet),
        "ttl":           ip_layer.ttl,
        "flags":         flags,
        "window_size":   window,
        "payload_bytes": payload_bytes,
        "timestamp":     float(packet.time),
        "raw_summary":   packet.summary(),
    }