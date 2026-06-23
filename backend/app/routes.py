"""
app/routes.py
Net Sentinel AI - Production API Routes
"""

from datetime import datetime, timezone
from functools import wraps
import logging
import platform
import random
import time

import jwt
import psutil

from flask import jsonify, request
from werkzeug.security import check_password_hash

import app as app_module

from app.predict import (
    predict_attack,
    load_model,
    get_model_info
)

from app.sniffer import (
    start_sniffer_thread,
    stop_sniffer,
    is_sniffing
)

from config import Config

logger = logging.getLogger(__name__)

# =====================================================
# HELPERS
# =====================================================

def _utcnow():

    return datetime.now(
        timezone.utc
    )

# =====================================================
# TOKEN REQUIRED DECORATOR
# =====================================================

def token_required(f):

    @wraps(f)
    def decorated(*args, **kwargs):

        token = None

        auth_header = request.headers.get(
            "Authorization",
            ""
        )

        if auth_header.startswith(
            "Bearer "
        ):

            token = auth_header.split(" ")[1]

        if not token:

            return jsonify({
                "success": False,
                "error": "Token missing"
            }), 401

        try:

            payload = jwt.decode(

                token,

                Config.JWT_SECRET_KEY,

                algorithms=["HS256"]
            )

            current_user = (
                app_module.db["users"]
                .find_one({
                    "username":
                        payload["username"]
                })
            )

            if not current_user:

                return jsonify({
                    "success": False,
                    "error": "User not found"
                }), 401

        except jwt.ExpiredSignatureError:

            return jsonify({
                "success": False,
                "error": "Token expired"
            }), 401

        except jwt.InvalidTokenError:

            return jsonify({
                "success": False,
                "error": "Invalid token"
            }), 401

        except Exception as exc:

            logger.exception(
                f"Authentication error: {exc}"
            )

            return jsonify({
                "success": False,
                "error": "Authentication failed"
            }), 401

        return f(
            current_user,
            *args,
            **kwargs
        )

    return decorated

# =====================================================
# REGISTER ROUTES
# =====================================================

def register_routes(flask_app):

    # =================================================
    # LOAD ML MODEL
    # =================================================

    model_loaded = load_model()

    if model_loaded:

        logger.info(
            "ML model loaded successfully."
        )

    else:

        logger.error(
            "ML model failed to load."
        )

    # =================================================
    # ROOT
    # =================================================

    @flask_app.route("/", methods=["GET"])
    def root():

        return jsonify({

            "service":
                "Net Sentinel AI",

            "version":
                "3.0.0",

            "status":
                "Running"

        }), 200

    # =================================================
    # LOGIN
    # =================================================

    @flask_app.route(
        "/api/login",
        methods=["POST"]
    )
    def login():

        try:

            data = request.get_json()

            if not data:

                return jsonify({
                    "success": False,
                    "error": "Missing JSON body"
                }), 400

            username = data.get(
                "username",
                ""
            ).strip()

            password = data.get(
                "password",
                ""
            )

            if not username or not password:

                return jsonify({
                    "success": False,
                    "error": "Username and password required"
                }), 400

            user = app_module.db[
                "users"
            ].find_one({

                "username":
                    username
            })

            if not user:

                return jsonify({
                    "success": False,
                    "error": "Invalid credentials"
                }), 401

            if not check_password_hash(

                user["password_hash"],

                password
            ):

                return jsonify({
                    "success": False,
                    "error": "Invalid credentials"
                }), 401

            token = jwt.encode({

                "username":
                    username,

                "iat":
                    int(time.time())

            },

                Config.JWT_SECRET_KEY,

                algorithm="HS256"
            )

            return jsonify({

                "success":
                    True,

                "token":
                    token,

                "user": {

                    "username":
                        username
                }

            }), 200

        except Exception as exc:

            logger.exception(
                f"Login error: {exc}"
            )

            return jsonify({
                "success": False,
                "error": "Login failed"
            }), 500

    # =================================================
    # PREDICT
    # =================================================

    @flask_app.route(
        "/api/predict",
        methods=["POST"]
    )
    @token_required
    def predict(current_user):

        try:

            model_info = get_model_info()

            if not model_info.get(
                "ready"
            ):

                return jsonify({
                    "success": False,
                    "error": "Model not loaded"
                }), 503

            data = request.get_json()

            if not data:

                return jsonify({
                    "success": False,
                    "error": "Missing request body"
                }), 400

            features = data.get(
                "features"
            )

            if not features:

                return jsonify({
                    "success": False,
                    "error": "Features missing"
                }), 400

            result = predict_attack(
                features
            )

            prediction_doc = {

                "timestamp":
                    _utcnow(),

                "requested_by":
                    current_user[
                        "username"
                    ],

                "attack_label":
                    result[
                        "attack_label"
                    ],

                "confidence":
                    result[
                        "confidence"
                    ],

                "is_attack":
                    result[
                        "is_attack"
                    ]
            }

            app_module.db[
                "predictions"
            ].insert_one(
                prediction_doc
            )

            return jsonify({

                "success":
                    True,

                "prediction":
                    result

            }), 200

        except Exception as exc:

            logger.exception(
                f"Prediction error: {exc}"
            )

            return jsonify({

                "success":
                    False,

                "error":
                    "Prediction failed"

            }), 500

    # =================================================
    # MODEL INFO
    # =================================================

    @flask_app.route(
        "/api/model-info",
        methods=["GET"]
    )
    def model_info():

        return jsonify({

            "success":
                True,

            "model":
                get_model_info()

        }), 200

    # =================================================
    # SYSTEM HEALTH
    # =================================================

    @flask_app.route(
        "/api/system-health",
        methods=["GET"]
    )
    def system_health():

        try:

            # =============================================
            # CPU
            # =============================================

            cpu_usage = psutil.cpu_percent(
                interval=1
            )

            # =============================================
            # MEMORY
            # =============================================

            memory = psutil.virtual_memory()

            ram_usage = round(
                memory.percent,
                2
            )

            ram_total = round(
                memory.total / (1024 ** 3),
                2
            )

            ram_used = round(
                memory.used / (1024 ** 3),
                2
            )

            ram_available = round(
                memory.available / (1024 ** 3),
                2
            )

            # =============================================
            # DISK
            # =============================================

            disk = psutil.disk_usage("/")

            disk_usage = round(
                disk.percent,
                2
            )

            disk_total = round(
                disk.total / (1024 ** 3),
                2
            )

            disk_used = round(
                disk.used / (1024 ** 3),
                2
            )

            # =============================================
            # DATABASE STATUS
            # =============================================

            db_status = (
                "Online"
                if app_module.db is not None
                else "Offline"
            )

            # =============================================
            # MODEL STATUS
            # =============================================

            model_status = (
                "Loaded"
                if get_model_info().get("ready")
                else "Offline"
            )

            # =============================================
            # UPTIME
            # =============================================

            uptime_seconds = int(
                time.time() - psutil.boot_time()
            )

            hours = uptime_seconds // 3600

            minutes = (
                uptime_seconds % 3600
            ) // 60

            uptime = (
                f"{hours}h {minutes}m"
            )

            # =============================================
            # RESPONSE
            # =============================================

            return jsonify({

                "success":
                    True,

                "status":
                    "Running",

                "system":
                    platform.system(),

                "cpu_usage":
                    cpu_usage,

                "ram_usage":
                    ram_usage,

                "ram_total":
                    ram_total,

                "ram_used":
                    ram_used,

                "ram_available":
                    ram_available,

                "disk_usage":
                    disk_usage,

                "disk_total":
                    disk_total,

                "disk_used":
                    disk_used,

                "db_status":
                    db_status,

                "model_status":
                    model_status,

                "uptime":
                    uptime

            }), 200

        except Exception as exc:

            logger.exception(
                f"System health error: {exc}"
            )

            return jsonify({

                "success":
                    False,

                "error":
                    "Failed to fetch system health"

            }), 500

    # =================================================
    # PREDICTIONS HISTORY
    # =================================================

    @flask_app.route(
        "/api/predictions",
        methods=["GET"]
    )
    def get_predictions():

        try:

            predictions_cursor = (

                app_module.db["predictions"]

                .find()

                .sort("timestamp", -1)

                .limit(100)
            )

            predictions = []

            for doc in predictions_cursor:

                timestamp = doc.get(
                    "timestamp"
                )

                predictions.append({

                    "id":
                        str(doc.get("_id")),

                    "timestamp":
                        (
                            timestamp.strftime(
                                "%Y-%m-%d %H:%M:%S"
                            )
                            if timestamp
                            else "-"
                        ),

                    "shortTime":
                        (
                            timestamp.strftime(
                                "%H:%M:%S"
                            )
                            if timestamp
                            else "-"
                        ),

                    "src_ip":
                        doc.get(
                            "source_ip",
                            f"192.168.1.{random.randint(1, 255)}"
                        ),

                    "dst_ip":
                        doc.get(
                            "destination_ip",
                            "10.0.0.5"
                        ),

                    "protocol":
                        doc.get(
                            "protocol",
                            "TCP"
                        ),

                    "attack_type":
                        doc.get(
                            "attack_label",
                            "BENIGN"
                        ),

                    "confidence":
                        round(
                            float(
                                doc.get(
                                    "confidence",
                                    0
                                )
                            ),
                            4
                        ),

                    "is_attack":
                        doc.get(
                            "is_attack",
                            False
                        ),

                    "severity":
                        (
                            "HIGH"
                            if doc.get("is_attack")
                            else "LOW"
                        )
                })

            return jsonify({

                "success":
                    True,

                "count":
                    len(predictions),

                "predictions":
                    predictions

            }), 200

        except Exception as exc:

            logger.exception(
                f"Failed fetching predictions: {exc}"
            )

            return jsonify({

                "success":
                    False,

                "error":
                    "Failed to fetch predictions"

            }), 500

    # =================================================
    # CAPTURE CONTROL
    # =================================================

    @flask_app.route(
        "/api/capture/start",
        methods=["POST"]
    )
    def api_start_capture():
        try:
            start_sniffer_thread()
            return jsonify({
                "success": True,
                "message": "Packet capture started"
            }), 200
        except Exception as exc:
            logger.exception(f"Start capture error: {exc}")
            return jsonify({"success": False, "error": "Failed to start capture"}), 500

    @flask_app.route(
        "/api/capture/stop",
        methods=["POST"]
    )
    def api_stop_capture():
        try:
            stop_sniffer()
            return jsonify({
                "success": True,
                "message": "Packet capture stopped"
            }), 200
        except Exception as exc:
            logger.exception(f"Stop capture error: {exc}")
            return jsonify({"success": False, "error": "Failed to stop capture"}), 500

    @flask_app.route(
        "/api/capture/status",
        methods=["GET"]
    )
    def api_capture_status():
        return jsonify({
            "success": True,
            "is_capturing": is_sniffing()
        }), 200

    logger.info(
        "All API routes registered successfully."
    )