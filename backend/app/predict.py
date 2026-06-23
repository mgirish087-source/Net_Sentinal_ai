"""
app/predict.py
Net Sentinel AI - Production Inference Engine

Features:
- Thread-Safe Model Loading
- Robust Validation
- Production Logging
- Fast Inference Pipeline
- Confidence Scoring
- Probability Mapping
- Model Health Monitoring
"""

import logging
import os
from threading import Lock
from typing import List, Dict, Any

import joblib
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

# =====================================================
# GLOBAL ARTIFACTS
# =====================================================

_model = None
_scaler = None
_imputer = None
_label_encoder = None
_feature_columns = None

_model_lock = Lock()

# =====================================================
# BASE PATHS
# =====================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

MODELS_DIR = os.path.join(
    BASE_DIR,
    "models"
)

MODEL_DIR = os.path.join(
    MODELS_DIR,
    "saved"
)

PREPROCESSING_DIR = os.path.join(
    MODELS_DIR,
    "preprocessing"
)

# =====================================================
# MODEL FILES
# =====================================================

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "random_forest.pkl"
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
# REQUIRED FILES
# =====================================================

REQUIRED_FILES = {
    "Model": MODEL_PATH,
    "Scaler": SCALER_PATH,
    "Imputer": IMPUTER_PATH,
    "Encoder": ENCODER_PATH,
    "Feature Columns": FEATURE_COLUMNS_PATH
}

# =====================================================
# LOAD MODEL
# =====================================================

def load_model() -> bool:

    global _model
    global _scaler
    global _imputer
    global _label_encoder
    global _feature_columns

    with _model_lock:

        try:

            logger.info(
                "Starting ML artifact loading..."
            )

            # =====================================
            # VALIDATE FILES
            # =====================================

            missing_files = []

            for name, path in REQUIRED_FILES.items():

                if not os.path.exists(path):

                    missing_files.append(
                        f"{name}: {path}"
                    )

            if missing_files:

                logger.error(
                    "Missing ML files detected."
                )

                for missing in missing_files:

                    logger.error(missing)

                return False

            # =====================================
            # LOAD ARTIFACTS
            # =====================================

            _model = joblib.load(
                MODEL_PATH
            )

            _scaler = joblib.load(
                SCALER_PATH
            )

            _imputer = joblib.load(
                IMPUTER_PATH
            )

            _label_encoder = joblib.load(
                ENCODER_PATH
            )

            _feature_columns = joblib.load(
                FEATURE_COLUMNS_PATH
            )

            # =====================================
            # DISABLE VERBOSE MODELS
            # =====================================

            if hasattr(_model, "verbose"):

                _model.verbose = 0

            logger.info(
                "ML artifacts loaded successfully."
            )

            logger.info(
                f"Model Type: "
                f"{type(_model).__name__}"
            )

            logger.info(
                f"Feature Count: "
                f"{len(_feature_columns)}"
            )

            logger.info(
                f"Classes: "
                f"{list(_label_encoder.classes_)}"
            )

            return True

        except Exception as exc:

            logger.exception(
                f"Failed to load model artifacts: {exc}"
            )

            return False

# =====================================================
# MODEL STATUS
# =====================================================

def is_model_ready() -> bool:

    return all([

        _model is not None,
        _scaler is not None,
        _imputer is not None,
        _label_encoder is not None,
        _feature_columns is not None
    ])

# =====================================================
# FEATURE VALIDATION
# =====================================================

def _validate_features(
    features: List[float]
) -> None:

    if not isinstance(features, list):

        raise ValueError(
            "Features must be a list."
        )

    if len(features) == 0:

        raise ValueError(
            "Empty feature list received."
        )

    expected = len(
        _feature_columns
    )

    received = len(
        features
    )

    if received != expected:

        raise ValueError(
            f"Expected {expected} features "
            f"but received {received}."
        )

    cleaned_features = []

    for index, value in enumerate(features):

        try:

            numeric_value = float(value)

        except Exception:

            raise ValueError(
                f"Feature at index {index} "
                f"is not numeric."
            )

        if np.isnan(numeric_value):

            raise ValueError(
                f"NaN detected at feature "
                f"index {index}."
            )

        if np.isinf(numeric_value):

            raise ValueError(
                f"Infinite value detected at "
                f"feature index {index}."
            )

        cleaned_features.append(
            numeric_value
        )

# =====================================================
# PREPARE INPUT
# =====================================================

def _prepare_input_dataframe(
    features: List[float]
) -> pd.DataFrame:

    return pd.DataFrame(
        [features],
        columns=_feature_columns
    )

# =====================================================
# PREDICT ATTACK
# =====================================================

def predict_attack(
    features: List[float]
) -> Dict[str, Any]:

    if not is_model_ready():

        raise RuntimeError(
            "Model not loaded."
        )

    try:

        # =====================================
        # VALIDATE FEATURES
        # =====================================

        _validate_features(
            features
        )

        # =====================================
        # CREATE DATAFRAME
        # =====================================

        input_df = _prepare_input_dataframe(
            features
        )

        # =====================================
        # IMPUTE MISSING VALUES
        # =====================================

        input_imputed = (
            _imputer.transform(
                input_df
            )
        )

        # =====================================
        # SCALE FEATURES
        # =====================================

        input_scaled = (
            _scaler.transform(
                input_imputed
            )
        )

        # =====================================
        # MODEL PREDICTION
        # =====================================

        predicted_encoded = int(
            _model.predict(
                input_scaled
            )[0]
        )

        # =====================================
        # PREDICTION PROBABILITIES
        # =====================================

        probabilities = (
            _model.predict_proba(
                input_scaled
            )[0]
        )

        # =====================================
        # VALIDATE PREDICTION INDEX
        # =====================================

        if predicted_encoded >= len(
            _label_encoder.classes_
        ):

            raise ValueError(
                "Prediction index outside "
                "label encoder range."
            )

        # =====================================
        # DECODE LABEL
        # =====================================

        attack_label = (
            _label_encoder.classes_[
                predicted_encoded
            ]
        )

        # =====================================
        # CONFIDENCE SCORE
        # =====================================

        confidence = round(
            float(np.max(probabilities)),
            4
        )

        # =====================================
        # BUILD PROBABILITY MAP
        # =====================================

        probability_map = {}

        for index, probability in enumerate(
            probabilities
        ):

            if index < len(
                _label_encoder.classes_
            ):

                class_name = (
                    _label_encoder.classes_[
                        index
                    ]
                )

                probability_map[
                    class_name
                ] = round(
                    float(probability),
                    4
                )

        # =====================================
        # ATTACK FLAG
        # =====================================

        is_attack = (
            attack_label.upper()
            != "BENIGN"
        )

        # =====================================
        # LOGGING
        # =====================================

        if is_attack:

            logger.warning(

                f"ATTACK DETECTED | "

                f"Label: {attack_label} | "

                f"Confidence: {confidence}"
            )
        # =====================================
        # RESPONSE
        # =====================================

        return {

            "attack_label":
                attack_label,

            "confidence":
                confidence,

            "is_attack":
                is_attack,

            "all_probabilities":
                probability_map
        }

    except Exception as exc:

        logger.exception(
            f"Inference failed: {exc}"
        )

        raise RuntimeError(
            "Prediction engine failure."
        ) from exc

# =====================================================
# MODEL INFO
# =====================================================

def get_model_info() -> Dict[str, Any]:

    return {

        "ready":
            is_model_ready(),

        "model_type":
            type(_model).__name__
            if _model else None,

        "feature_count":
            len(_feature_columns)
            if _feature_columns else 0,

        "classes":
            list(_label_encoder.classes_)
            if _label_encoder else [],

        "model_path":
            MODEL_PATH,

        "scaler_loaded":
            _scaler is not None,

        "imputer_loaded":
            _imputer is not None,

        "encoder_loaded":
            _label_encoder is not None
    }