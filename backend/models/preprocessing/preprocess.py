import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import pandas as pd
import numpy as np
from config import DATASET_RAW, DATASET_PROCESSED


def preprocess_dataset():

    print("Loading dataset...")
    df = pd.read_csv(DATASET_RAW)

    print("Cleaning dataset...")

    df = df.drop_duplicates()

    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.dropna()

    df.to_csv(DATASET_PROCESSED, index=False)

    print("Dataset cleaned and saved")


if __name__ == "__main__":
    preprocess_dataset()