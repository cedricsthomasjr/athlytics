# routes/__init__.py
from .search import search_bp
from .player_stats import player_bp
from .advanced_stats import advanced_bp
from .game_logs import logs_bp
from .metadata import meta_bp

def register_blueprints(app):
    app.register_blueprint(search_bp)
    app.register_blueprint(player_bp)
    app.register_blueprint(advanced_bp)
    app.register_blueprint(logs_bp)
    app.register_blueprint(meta_bp)
