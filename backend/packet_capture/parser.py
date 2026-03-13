def parse_packet(packet):

    try:
        src = packet[0][1].src
        dst = packet[0][1].dst

        print("Packet:", src, "→", dst)

    except:
        pass