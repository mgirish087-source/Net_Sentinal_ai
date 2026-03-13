import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_RAW = os.path.join(BASE_DIR, "dataset/raw/cicids2017.csv")
DATASET_PROCESSED = os.path.join(BASE_DIR, "dataset/processed/cleaned_dataset.csv")

MODEL_PATH = os.path.join(BASE_DIR, "models/saved/ids_model.pkl")

LOG_FILE = os.path.join(BASE_DIR, "logs/network_logs.json")