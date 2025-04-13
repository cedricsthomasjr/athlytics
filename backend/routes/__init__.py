# routes/__init__.py
from .search import search_bp
from .player_stats import player_bp
from .awards import awards_bp
from .game_logs import logs_bp
from .metadata import meta_bp
from .player_bios import player_bios_bp
from .advanced_stats import adv_bp
def register_blueprints(app):
    app.register_blueprint(search_bp)
    app.register_blueprint(player_bp)
    app.register_blueprint(awards_bp)
    app.register_blueprint(logs_bp)
    app.register_blueprint(meta_bp)
    app.register_blueprint(player_bios_bp)
    app.register_blueprint(adv_bp)