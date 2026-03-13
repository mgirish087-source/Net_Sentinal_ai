from flask import Flask
from api.routes import routes

app = Flask(__name__)

app.register_blueprint(routes)

@app.route("/")
def home():
    return {"message": "NetSentinel AI Backend Running"}

if __name__ == "__main__":
    app.run(debug=True)