import joblib
import os

# Correct path to model
model_path = os.path.join(os.path.dirname(__file__), "../models/saved/model.pkl")

model = joblib.load(model_path)

def predict_attack(data):
    prediction = model.predict([data])
    return prediction[0]