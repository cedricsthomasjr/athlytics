# backend/routes/player_awards_api.py

from flask import Blueprint, jsonify
from nba_api.stats.endpoints import playerawards

player_awards_bp = Blueprint("player_awards_bp", __name__)

@player_awards_bp.route("/api/player/<int:player_id>/awards-api", methods=["GET"])
def get_player_awards_api(player_id):
    try:
        response = playerawards.PlayerAwards(player_id=player_id)
        awards_data = response.get_normalized_dict()

        return jsonify(awards_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
