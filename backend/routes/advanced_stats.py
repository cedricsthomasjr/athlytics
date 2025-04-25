from flask import Blueprint, jsonify
from nba_api.stats.endpoints import playerdashboardbyyearoveryear

adv_bp = Blueprint("adv_bp", __name__)

@adv_bp.route("/api/player/<int:player_id>/advanced", methods=["GET"])
def get_advanced_stats(player_id):
    try:
        response = playerdashboardbyyearoveryear.PlayerDashboardByYearOverYear(
            player_id=player_id,
            measure_type_detailed="Advanced",
            per_mode_detailed="PerGame",
            season_type_playoffs="Regular Season"  # ✅ yes this is the correct param
        )

        data = response.get_normalized_dict()
        raw = data.get("ByYearPlayerDashboard", [])

        advanced = [
            {
                "season": r["GROUP_VALUE"],
                "team": r["TEAM_ABBREVIATION"],
                "gp": r["GP"],
                "usg_pct": r.get("USG_PCT"),
                "ts_pct": r.get("TS_PCT"),
                "efg_pct": r.get("EFG_PCT"),
                "off_rating": r.get("OFF_RATING"),
                "def_rating": r.get("DEF_RATING"),
                "net_rating": r.get("NET_RATING"),
                "pace": r.get("PACE"),
                "ast_pct": r.get("AST_PCT"),
                "reb_pct": r.get("REB_PCT"),
                "to_pct": r.get("TO_PCT")
            }
            for r in raw
        ]

        return jsonify(advanced)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
