# routes/search.py
from flask import Blueprint, request, jsonify
from nba_api.stats.static import players
from cache import cache

search_bp = Blueprint("search", __name__, url_prefix="/api")

@cache.cached()
def get_all_players():
    return players.get_players()

@search_bp.route("/search", methods=["GET"])
def search_players():
    query = request.args.get("q", "").lower()
    all_players = get_all_players()

    if not query:
        return jsonify(all_players)

    matches = [
        p for p in all_players
        if query in p["full_name"].lower() or query in str(p["id"])
    ]
    return jsonify(matches)
@search_bp.route("/player-name/<int:player_id>", methods=["GET"])
def get_player_name(player_id):
    all_players = get_all_players()
    match = next((p for p in all_players if p["id"] == player_id), None)

    if match:
        return jsonify({ "name": match["full_name"] })
    else:
        return jsonify({ "error": "Player not found" }), 404
