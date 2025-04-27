# routes/__init__.py
from .search import search_bp
from .awards import awards_bp
from .game_logs import logs_bp
from .metadata import meta_bp
from .player_bios import player_bios_bp
from .advanced_stats import adv_bp
from .team_stats import team_bp
from .combined_stats import combined_bp
from .shot_chart import shot_bp
from .awards2 import player_awards_bp   
def register_blueprints(app):
    app.register_blueprint(search_bp)
    app.register_blueprint(awards_bp)
    app.register_blueprint(logs_bp)
    app.register_blueprint(meta_bp)
    app.register_blueprint(player_bios_bp)
    app.register_blueprint(adv_bp)
    app.register_blueprint(team_bp)
    app.register_blueprint(combined_bp)    
    app.register_blueprint(shot_bp)
    app.register_blueprint(player_awards_bp)
