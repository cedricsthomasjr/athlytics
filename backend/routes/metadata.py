from flask import Blueprint, jsonify
from nba_api.stats.endpoints import commonplayerinfo
from datetime import datetime
from cache import cache
import pandas as pd

meta_bp = Blueprint("metadata", __name__, url_prefix="/api/player")

@meta_bp.route("/<int:player_id>/meta", methods=["GET"])
@cache.cached()
def get_metadata(player_id):
    try:
        info = commonplayerinfo.CommonPlayerInfo(player_id=player_id)
        df = info.get_data_frames()[0]
        player_data = df.iloc[0]

        # Safe field fallback
        def safe(val):
            return val if pd.notna(val) and val != "" else "—"

        # Age calculation
        birth_date = datetime.strptime(player_data["BIRTHDATE"], "%Y-%m-%dT%H:%M:%S")
        today = datetime.today()
        age = today.year - birth_date.year - (
            (today.month, today.day) < (birth_date.month, birth_date.day)
        )

        player_info = {
            "name": safe(player_data["DISPLAY_FIRST_LAST"]),
            "player_id": int(player_data["PERSON_ID"]),
            "team": safe(player_data["TEAM_NAME"]),
            "team_id": int(player_data["TEAM_ID"]),
            "team_abbreviation": safe(player_data["TEAM_ABBREVIATION"]),
            "team_city": safe(player_data["TEAM_CITY"]),
            "position": safe(player_data["POSITION"]),
            "age": age,
            "status": "Active" if player_data["ROSTERSTATUS"] == "Active" else "Retired",
            "height": safe(player_data["HEIGHT"]),
            "weight": safe(player_data["WEIGHT"]),
            "college": safe(player_data["COLLEGE"]),
            "country": safe(player_data["COUNTRY"]),
            "last_affiliation": safe(player_data["LAST_AFFILIATION"]),
            "jersey": safe(player_data["JERSEY"]),
            "draft_team": safe(player_data["DRAFT_TEAM"]),
            "draft_year": safe(player_data["DRAFT_YEAR"]),
            "draft_round": safe(player_data["DRAFT_ROUND"]),
            "draft_number": safe(player_data["DRAFT_NUMBER"]),
            "nba_debut_year": safe(player_data["FROM_YEAR"]),
            "last_active_year": safe(player_data["TO_YEAR"]),
            "season_experience": safe(player_data["SEASON_EXP"]),
            "player_slug": safe(player_data["PLAYER_SLUG"]),
            "greatest_75_flag": "Yes" if player_data["GREATEST_75_FLAG"] == "Y" else "No"
        }

        return jsonify(player_info)

    except Exception as e:
        print(f"Error fetching metadata for player {player_id}: {e}")
        return jsonify({"error": "Metadata not available"}), 500
