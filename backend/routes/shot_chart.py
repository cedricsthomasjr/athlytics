from flask import Blueprint, jsonify, request
from nba_api.stats.endpoints import shotchartdetail

shot_bp = Blueprint("shot_bp", __name__)

@shot_bp.route("/api/player/<int:player_id>/shots", methods=["GET"])
def get_shot_chart(player_id):
    try:
        playoffs = request.args.get("playoffs", "false").lower() == "true"

        response = shotchartdetail.ShotChartDetail(
            player_id=player_id,
            team_id=0,
            season_nullable=None,
            season_type_all_star="Playoffs" if playoffs else "Regular Season"
        )

        shots_data = response.get_normalized_dict().get("Shot_Chart_Detail", [])

        return jsonify({"shots": shots_data})

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500