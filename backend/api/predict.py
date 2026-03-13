from models.model import load_model

model = load_model()

def predict_attack(features):

    prediction = model.predict([features])

    return prediction[0]