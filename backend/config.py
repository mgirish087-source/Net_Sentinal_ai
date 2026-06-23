"""
config.py
Net Sentinel AI - Production Configuration

Features:
- Environment Variable Support
- Production-Safe Defaults
- Centralized Configuration
- Secure Secret Handling
- Cross-Platform Paths
- Logging Configuration
"""

import os
from dotenv import load_dotenv

# =========================================================
# LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()

# =========================================================
# BASE DIRECTORY
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

# =========================================================
# CONFIG CLASS
# =========================================================

class Config:

    # =====================================================
    # APPLICATION
    # =====================================================

    APP_NAME = "Net Sentinel AI"

    VERSION = "3.0.0"

    ENVIRONMENT = os.getenv(
        "ENVIRONMENT",
        "development"
    )

    DEBUG = os.getenv(
        "DEBUG",
        "False"
    ).lower() == "true"

    HOST = os.getenv(
        "HOST",
        "0.0.0.0"
    )

    PORT = int(
        os.getenv(
            "PORT",
            5000
        )
    )

    # =====================================================
    # SECURITY
    # =====================================================

    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "CHANGE_THIS_SECRET_KEY"
    )

    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "CHANGE_THIS_JWT_SECRET"
    )

    JWT_ACCESS_TOKEN_EXPIRES = int(
        os.getenv(
            "JWT_ACCESS_TOKEN_EXPIRES",
            3600
        )
    )

    # =====================================================
    # DATABASE
    # =====================================================

    MONGO_URI = os.getenv(
        "MONGO_URI",
        "mongodb://localhost:27017/"
    )

    DB_NAME = os.getenv(
        "DB_NAME",
        "net_sentinel_ai"
    )

    # =====================================================
    # LOGGING
    # =====================================================

    LOG_PATH = os.path.join(
        BASE_DIR,
        os.getenv(
            "LOG_PATH",
            "logs"
        )
    )

    BACKEND_LOG = os.path.join(
        LOG_PATH,
        "backend.log"
    )

    ERROR_LOG = os.path.join(
        LOG_PATH,
        "error.log"
    )

    SNIFFER_LOG = os.path.join(
        LOG_PATH,
        "sniffer.log"
    )

    PREDICTION_LOG = os.path.join(
        LOG_PATH,
        "prediction.log"
    )

    # =====================================================
    # MODEL PATHS
    # =====================================================

    MODELS_DIR = os.path.join(
        BASE_DIR,
        "models"
    )

    MODEL_SAVE_DIR = os.path.join(
        MODELS_DIR,
        "saved"
    )

    PREPROCESSING_DIR = os.path.join(
        MODELS_DIR,
        "preprocessing"
    )

    MODEL_PATH = os.path.join(
        MODEL_SAVE_DIR,
        os.getenv(
            "MODEL_FILE",
            "random_forest.pkl"
        )
    )

    SCALER_PATH = os.path.join(
        PREPROCESSING_DIR,
        "scaler.pkl"
    )

    IMPUTER_PATH = os.path.join(
        PREPROCESSING_DIR,
        "imputer.pkl"
    )

    ENCODER_PATH = os.path.join(
        PREPROCESSING_DIR,
        "label_encoder.pkl"
    )

    FEATURE_COLUMNS_PATH = os.path.join(
        PREPROCESSING_DIR,
        "feature_columns.pkl"
    )

    # =====================================================
    # PACKET CAPTURE
    # =====================================================

    CAPTURE_INTERFACE = os.getenv(
        "CAPTURE_INTERFACE",
        "eth0"
    )

    CAPTURE_PACKET_COUNT = int(
        os.getenv(
            "CAPTURE_PACKET_COUNT",
            100
        )
    )

    PACKET_TIMEOUT = int(
        os.getenv(
            "PACKET_TIMEOUT",
            30
        )
    )

    ENABLE_PACKET_CAPTURE = os.getenv(
        "ENABLE_PACKET_CAPTURE",
        "True"
    ).lower() == "true"

    # =====================================================
    # SOCKETIO
    # =====================================================

    SOCKETIO_ASYNC_MODE = os.getenv(
        "SOCKETIO_ASYNC_MODE",
        "threading"
    )

    # =====================================================
    # API SETTINGS
    # =====================================================

    API_PREFIX = "/api"

    API_VERSION = "v1"

    MAX_REQUEST_SIZE_MB = int(
        os.getenv(
            "MAX_REQUEST_SIZE_MB",
            16
        )
    )

    # =====================================================
    # CORS
    # =====================================================

    CORS_ORIGINS = os.getenv(
        "CORS_ORIGINS",
        "*"
    )

    # =====================================================
    # HEALTH CHECK
    # =====================================================

    HEALTH_CHECK_ROUTE = "/health"

    # =====================================================
    # RATE LIMITING
    # =====================================================

    ENABLE_RATE_LIMIT = os.getenv(
        "ENABLE_RATE_LIMIT",
        "False"
    ).lower() == "true"

    RATE_LIMIT = os.getenv(
        "RATE_LIMIT",
        "100/minute"
    )

    # =====================================================
    # STATIC METHODS
    # =====================================================

    @staticmethod
    def validate():

        required_dirs = [

            Config.LOG_PATH,
            Config.MODEL_SAVE_DIR,
            Config.PREPROCESSING_DIR
        ]

        for directory in required_dirs:

            os.makedirs(
                directory,
                exist_ok=True
            )

    @staticmethod
    def print_config():

        print("\n========== CONFIGURATION ==========")

        print(f"APP_NAME      : {Config.APP_NAME}")
        print(f"VERSION       : {Config.VERSION}")
        print(f"ENVIRONMENT   : {Config.ENVIRONMENT}")
        print(f"DEBUG         : {Config.DEBUG}")
        print(f"MONGO_URI     : {Config.MONGO_URI}")
        print(f"DATABASE      : {Config.DB_NAME}")
        print(f"MODEL_PATH    : {Config.MODEL_PATH}")
        print(f"LOG_PATH      : {Config.LOG_PATH}")
        print(f"HOST          : {Config.HOST}")
        print(f"PORT          : {Config.PORT}")

        print("===================================\n")


# =========================================================
# VALIDATE DIRECTORIES ON IMPORT
# =========================================================

Config.validate()