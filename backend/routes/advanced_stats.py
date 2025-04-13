from flask import Blueprint, jsonify
from nba_api.stats.endpoints import playerdashboardbyyearoveryear
from cache import cache

adv_bp = Blueprint("advanced_stats", __name__, url_prefix="/api")

@adv_bp.route("/player/<int:player_id>/advanced", methods=["GET"])
@cache.cached()
def get_advanced_stats(player_id):
    try:
        data = playerdashboardbyyearoveryear.PlayerDashboardByYearOverYear(
            player_id=player_id,
            per_mode_detailed="Per100Possessions"
        )

        df = data.get_data_frames()[0]

        # Keep only relevant advanced metrics
        selected = df[
            [
                "GROUP_VALUE",     # Season
                "USG_PCT",         # Usage %
                "TS_PCT",          # True Shooting %
                "EFG_PCT",         # Effective FG %
                "OFF_RATING",      # Offensive Rating
                "DEF_RATING",      # Defensive Rating
                "NET_RATING",      # Net Rating
                "PACE",            # Team Pace
                "AST_PCT",         # Assist %
                "REB_PCT",         # Rebound %
                "TO_PCT",          # Turnover %
            ]
        ].fillna(0)

        return jsonify(selected.to_dict(orient="records"))

    except Exception as e:
        return jsonify({"error": str(e)}), 500
