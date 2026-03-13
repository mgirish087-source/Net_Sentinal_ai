import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
from config import DATASET_PROCESSED, MODEL_PATH

def train():

    print("Loading cleaned dataset...")

    df = pd.read_csv(DATASET_PROCESSED)

    X = df.drop("Label", axis=1)
    y = df["Label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("Training model...")

    model = RandomForestClassifier(n_estimators=100)

    model.fit(X_train, y_train)

    joblib.dump(model, MODEL_PATH)

    print("Model saved:", MODEL_PATH)

if __name__ == "__main__":
    train()