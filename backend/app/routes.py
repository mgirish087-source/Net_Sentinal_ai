from flask import Blueprint, request, jsonify
from app.predict import predict_attack

routes = Blueprint("routes", __name__)

@routes.route("/predict", methods=["POST"])
def predict():
    data = request.json
    result = predict_attack(data)
    return jsonify({"attack": str(result)})