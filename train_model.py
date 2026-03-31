import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load processed dataset
data = pd.read_csv("../../dataset/processed/cleaned_dataset.csv")

# 🔥 IMPORTANT FIX
data.columns = data.columns.str.strip()

print(data.columns)

# Split features and label
X = data.drop("Label", axis=1)
y = data["Label"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "../saved/model.pkl")
print(X.iloc[0].tolist())

print("✅ Model trained successfully!")