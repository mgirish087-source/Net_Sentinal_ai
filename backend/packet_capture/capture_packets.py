from scapy.all import sniff
from packet_capture.parser import parse_packet

def capture():

    print("Capturing packets...")

    sniff(prn=parse_packet, count=10)