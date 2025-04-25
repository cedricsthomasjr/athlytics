from flask import Blueprint, jsonify
from nba_api.stats.endpoints import playerdashboardbyyearoveryear

combined_bp = Blueprint("combined_bp", __name__)

@combined_bp.route("/api/player/<int:player_id>/combined", methods=["GET"])
def get_combined_stats(player_id):
    try:
        # Get base stats
        base_res = playerdashboardbyyearoveryear.PlayerDashboardByYearOverYear(
            player_id=player_id,
            measure_type_detailed="Base",
            per_mode_detailed="PerGame",
            season_type_playoffs="Regular Season"
        ).get_normalized_dict()
        base_stats = base_res.get("ByYearPlayerDashboard", [])

        # Get advanced stats
        adv_res = playerdashboardbyyearoveryear.PlayerDashboardByYearOverYear(
            player_id=player_id,
            measure_type_detailed="Advanced",
            per_mode_detailed="PerGame",
            season_type_playoffs="Regular Season"
        ).get_normalized_dict()
        adv_stats = adv_res.get("ByYearPlayerDashboard", [])

        # Merge stats on GROUP_VALUE (season string like "2022-23")
        merged_stats = []
        for base in base_stats:
            season = base.get("GROUP_VALUE")
            matching_adv = next((a for a in adv_stats if a.get("GROUP_VALUE") == season), {})
            merged = {**base, **matching_adv}
            merged_stats.append(merged)

        return jsonify(merged_stats)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
