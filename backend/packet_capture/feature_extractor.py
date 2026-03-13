def extract_features(packet):

    features = {
        "packet_length": len(packet),
    }

    return list(features.values())