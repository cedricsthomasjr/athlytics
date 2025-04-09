from flask import Blueprint, jsonify
from nba_api.stats.endpoints import playercareerstats, commonplayerinfo
from nba_api.stats.static import players
from cache import cache

player_bp = Blueprint("player", __name__, url_prefix="/api/player")

@player_bp.route("/<int:player_id>", methods=["GET"])
@cache.cached()
def get_player_career(player_id):
    stats = playercareerstats.PlayerCareerStats(player_id=player_id)
    df = stats.get_data_frames()[0]
    return jsonify(df.to_dict(orient="records"))

@player_bp.route("/<int:player_id>/image", methods=["GET"])
@cache.cached()
def get_image(player_id):
    return jsonify({
        "image_url": f"https://cdn.nba.com/headshots/nba/latest/1040x760/{player_id}.png"
    })

@player_bp.route("/<int:player_id>/name", methods=["GET"])
@cache.cached()
def get_name(player_id):
    all_players = players.get_players()
    player = next((p for p in all_players if p["id"] == player_id), None)

    if player:
        return jsonify({"name": player["full_name"]})
    else:
        return jsonify({"error": "Player not found"}), 404
