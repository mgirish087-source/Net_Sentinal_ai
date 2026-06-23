"""
run.py — Net Sentinel AI
Enterprise backend launcher.
"""

import os
import sys

# =========================================================
# PROJECT ROOT
# =========================================================

PROJECT_ROOT = os.path.dirname(
    os.path.abspath(__file__)
)

sys.path.insert(0, PROJECT_ROOT)

# =========================================================
# IMPORT APP
# =========================================================

from app import (
    create_app,
    socketio,
)

from config import Config

# =========================================================
# CREATE APPLICATION
# =========================================================

flask_app = create_app()

# =========================================================
# PRINT ROUTES
# =========================================================

def print_routes(app) -> None:
    """
    Print all registered routes.
    """

    print(
        "\n========== REGISTERED ROUTES =========="
    )

    for rule in app.url_map.iter_rules():

        methods = ",".join(
            sorted(
                rule.methods - {
                    "HEAD",
                    "OPTIONS"
                }
            )
        )

        print(
            f"{rule.endpoint:30s} "
            f"{methods:15s} "
            f"{rule}"
        )

    print(
        "=======================================\n"
    )

# =========================================================
# START SERVER
# =========================================================

if __name__ == "__main__":

    print(f"""
    ========================================
           Net Sentinel AI Backend
      Real-Time AI Intrusion Detection
    ========================================

    Host        : {Config.HOST}
    Port        : {Config.PORT}
    Debug       : {Config.DEBUG}

    Database    : {Config.DB_NAME}

    SocketIO    : ENABLED

    Model       : {Config.MODEL_PATH}

    ========================================
    """)

    print_routes(flask_app)

    # -----------------------------------------------------
    # START SOCKETIO SERVER
    # -----------------------------------------------------

    socketio.run(
        flask_app,
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG,
        allow_unsafe_werkzeug=True,
    )