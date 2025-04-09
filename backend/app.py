# app.py
from flask import Flask
from flask_cors import CORS
from config import Config
from cache import cache
from routes import register_blueprints

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

cache.init_app(app)
register_blueprints(app)

if __name__ == "__main__":
    app.run(debug=True)
