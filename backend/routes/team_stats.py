from flask import Blueprint, jsonify
from nba_api.stats.static import teams as nba_teams
from nba_api.stats.endpoints import teamdashboardbygeneralsplits
from utils.team_utils import get_team_id_by_name, format_team_stats

team_bp = Blueprint("team", __name__)

@team_bp.route("/api/team/<string:team_name>", methods=["GET"])
def get_team_data(team_name):
    try:
        # Lookup ID
        team_id = get_team_id_by_name(team_name)
        if team_id is None:
            return jsonify({"error": "Team not found"}), 404

        # Basic info
        team_info = next((team for team in nba_teams.get_teams() if team["id"] == team_id), None)

        # Season stats
        stats = teamdashboardbygeneralsplits.TeamDashboardByGeneralSplits(
            team_id=team_id,
            season='2023-24',  # Optional: make this dynamic
            season_type_all_star='Regular Season'
        ).get_normalized_dict()

        # Format
        formatted = format_team_stats(team_info, stats)
        return jsonify(formatted)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
