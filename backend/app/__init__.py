"""
app/__init__.py
Net Sentinel AI - Enterprise Flask Application Factory

Features:
- Flask Application Factory
- MongoDB Integration
- SocketIO Support
- Production Logging
- Error Handling
- Health Monitoring
- Startup Validation
- Background Sniffer Engine
"""

import os
import logging
from logging.handlers import RotatingFileHandler

from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO

from pymongo import MongoClient
from pymongo.errors import (
    ConnectionFailure,
    ServerSelectionTimeoutError
)

from config import Config

# =========================================================
# GLOBAL DATABASE OBJECTS
# =========================================================

mongo_client = None

db = None

# =========================================================
# SOCKETIO INSTANCE
# =========================================================

socketio = SocketIO(
    cors_allowed_origins="*",
    async_mode="eventlet",
    logger=False,
    engineio_logger=False,
)

# =========================================================
# CREATE APPLICATION
# =========================================================

def create_app() -> Flask:

    """
    Flask Application Factory
    """

    # =====================================================
    # CREATE FLASK APP
    # =====================================================

    app = Flask(__name__)

    app.config.from_object(Config)

    app.config[
        "MAX_CONTENT_LENGTH"
    ] = Config.MAX_REQUEST_SIZE_MB * 1024 * 1024

    # =====================================================
    # VALIDATE CONFIG
    # =====================================================

    Config.validate()

    # =====================================================
    # SETUP LOGGING
    # =====================================================

    _setup_logging(app)

    app.logger.info(
        "=" * 60
    )

    app.logger.info(
        f"Starting {Config.APP_NAME}"
    )

    app.logger.info(
        f"Version: {Config.VERSION}"
    )

    app.logger.info(
        f"Environment: {Config.ENVIRONMENT}"
    )

    app.logger.info(
        "=" * 60
    )

    # =====================================================
    # ENABLE CORS
    # =====================================================

    CORS(

        app,

        resources={

            r"/api/*": {

                "origins":
                    Config.CORS_ORIGINS
            }
        }
    )

    app.logger.info(
        "CORS initialized."
    )

    # =====================================================
    # INITIALIZE SOCKETIO
    # =====================================================

    socketio.init_app(app)

    app.logger.info(
        "SocketIO initialized."
    )

    # =====================================================
    # CONNECT DATABASE
    # =====================================================

    _connect_mongo(app)

    # =====================================================
    # REGISTER ROUTES
    # =====================================================

    from app.routes import register_routes

    register_routes(app)

    app.logger.info(
        "Routes registered successfully."
    )

    # =====================================================
    # START SNIFFER
    # =====================================================

    if Config.ENABLE_PACKET_CAPTURE:

        try:

            from app.sniffer import (
                start_sniffer_thread
            )

            start_sniffer_thread()

            app.logger.info(
                "Packet sniffer started."
            )

        except Exception as exc:

            app.logger.exception(
                f"Failed starting sniffer: {exc}"
            )

    else:

        app.logger.warning(
            "Packet capture disabled."
        )

    # =====================================================
    # HEALTH ROUTE
    # =====================================================

    @app.route(
        Config.HEALTH_CHECK_ROUTE,
        methods=["GET"]
    )
    def health_check():

        return jsonify({

            "status":
                "online",

            "service":
                Config.APP_NAME,

            "version":
                Config.VERSION,

            "environment":
                Config.ENVIRONMENT,

            "mongodb":
                db is not None,

            "socketio":
                True,

            "packet_capture":
                Config.ENABLE_PACKET_CAPTURE
        }), 200

    # =====================================================
    # SOCKET TEST
    # =====================================================

    @app.route(
        "/socket-test",
        methods=["GET"]
    )
    def socket_test():

        socketio.emit(

            "server_message",

            {
                "message":
                    "SocketIO working successfully"
            }
        )

        return jsonify({

            "success":
                True,

            "message":
                "SocketIO test emitted."
        })

    # =====================================================
    # ERROR HANDLERS
    # =====================================================

    _register_error_handlers(app)

    # =====================================================
    # STARTUP COMPLETE
    # =====================================================

    app.logger.info(
        "=" * 60
    )

    app.logger.info(
        "Net Sentinel AI backend started successfully."
    )

    app.logger.info(
        "=" * 60
    )

    return app

# =========================================================
# LOGGING SETUP
# =========================================================

def _setup_logging(app: Flask) -> None:

    """
    Configure logging system.
    """

    os.makedirs(
        Config.LOG_PATH,
        exist_ok=True
    )

    formatter = logging.Formatter(

        "[%(asctime)s] "

        "%(levelname)s "

        "in %(module)s: "

        "%(message)s"
    )

    # =====================================================
    # BACKEND LOG
    # =====================================================

    backend_handler = RotatingFileHandler(

        Config.BACKEND_LOG,

        maxBytes=5_000_000,

        backupCount=5
    )

    backend_handler.setLevel(
        logging.INFO
    )

    backend_handler.setFormatter(
        formatter
    )

    # =====================================================
    # ERROR LOG
    # =====================================================

    error_handler = RotatingFileHandler(

        Config.ERROR_LOG,

        maxBytes=5_000_000,

        backupCount=5
    )

    error_handler.setLevel(
        logging.ERROR
    )

    error_handler.setFormatter(
        formatter
    )

    # =====================================================
    # CONSOLE LOG
    # =====================================================

    console_handler = logging.StreamHandler()

    console_handler.setLevel(

        logging.DEBUG
        if Config.DEBUG
        else logging.INFO
    )

    console_handler.setFormatter(
        formatter
    )

    # =====================================================
    # ATTACH HANDLERS
    # =====================================================

    app.logger.setLevel(
        logging.DEBUG
    )

    if not app.logger.handlers:

        app.logger.addHandler(
            backend_handler
        )

        app.logger.addHandler(
            error_handler
        )

        app.logger.addHandler(
            console_handler
        )

# =========================================================
# DATABASE CONNECTION
# =========================================================

def _connect_mongo(app: Flask) -> None:

    """
    Connect to MongoDB.
    """

    global mongo_client
    global db

    try:

        mongo_client = MongoClient(

            Config.MONGO_URI,

            serverSelectionTimeoutMS=5000
        )

        mongo_client.admin.command(
            "ping"
        )

        db = mongo_client[
            Config.DB_NAME
        ]

        app.logger.info(

            f"Connected to MongoDB "

            f"-> {Config.DB_NAME}"
        )

    except (

        ConnectionFailure,
        ServerSelectionTimeoutError

    ) as exc:

        app.logger.error(
            f"MongoDB connection failed: {exc}"
        )

        raise SystemExit(
            "MongoDB unreachable."
        ) from exc

# =========================================================
# ERROR HANDLERS
# =========================================================

def _register_error_handlers(
    app: Flask
) -> None:

    """
    Register Flask error handlers.
    """

    @app.errorhandler(400)
    def bad_request(error):

        return jsonify({

            "success":
                False,

            "error":
                "Bad Request",

            "message":
                str(error)
        }), 400

    @app.errorhandler(401)
    def unauthorized(error):

        return jsonify({

            "success":
                False,

            "error":
                "Unauthorized",

            "message":
                "Authentication required."
        }), 401

    @app.errorhandler(403)
    def forbidden(error):

        return jsonify({

            "success":
                False,

            "error":
                "Forbidden",

            "message":
                "Access denied."
        }), 403

    @app.errorhandler(404)
    def not_found(error):

        return jsonify({

            "success":
                False,

            "error":
                "Not Found",

            "message":
                str(error)
        }), 404

    @app.errorhandler(405)
    def method_not_allowed(error):

        return jsonify({

            "success":
                False,

            "error":
                "Method Not Allowed"
        }), 405

    @app.errorhandler(500)
    def internal_server_error(error):

        app.logger.exception(
            f"Internal Server Error: {error}"
        )

        return jsonify({

            "success":
                False,

            "error":
                "Internal Server Error",

            "message":
                "Something went wrong."
        }), 500