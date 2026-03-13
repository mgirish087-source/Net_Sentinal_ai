import json
import datetime
from config import LOG_FILE

def log_attack(attack_type):

    log_entry = {
        "attack": attack_type,
        "time": str(datetime.datetime.now())
    }

    try:
        with open(LOG_FILE, "r") as f:
            data = json.load(f)
    except:
        data = []

    data.append(log_entry)

    with open(LOG_FILE, "w") as f:
        json.dump(data, f, indent=4)