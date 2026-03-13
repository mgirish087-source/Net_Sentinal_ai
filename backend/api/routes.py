from flask import Blueprint, request, jsonify
from api.predict import predict_attack
from utils.helpers import log_attack

routes = Blueprint("routes", __name__)

@routes.route("/predict", methods=["POST"])
def predict():

    data = request.json

    features = list(data.values())

    result = predict_attack(features)

    log_attack(result)

    return jsonify({
        "prediction": str(result)
    })