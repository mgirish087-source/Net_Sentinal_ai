"""
app.py — Net Sentinel AI
Production Entry Point
"""

import sys
import os

sys.path.insert(
    0,
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

from app import create_app, socketio

flask_app = create_app()

if __name__ == "__main__":

    socketio.run(

        flask_app,

        host="0.0.0.0",

        port=5000,

        debug=False,

        allow_unsafe_werkzeug=True
    )