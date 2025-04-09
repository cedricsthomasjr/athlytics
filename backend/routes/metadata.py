# routes/metadata.py
from flask import Blueprint, jsonify
from nba_api.stats.endpoints import commonplayerinfo
from datetime import datetime
from cache import cache

meta_bp = Blueprint("metadata", __name__, url_prefix="/api/player")

@meta_bp.route("/<int:player_id>/meta", methods=["GET"])
@cache.cached()
def get_metadata(player_id):
    try:
        info = commonplayerinfo.CommonPlayerInfo(player_id=player_id)
        df = info.get_data_frames()[0]
        player_data = df.iloc[0]

        birth_date = datetime.strptime(player_data["BIRTHDATE"], "%Y-%m-%dT%H:%M:%S")
        today = datetime.today()
        age = today.year - birth_date.year - (
            (today.month, today.day) < (birth_date.month, birth_date.day)
        )

        return jsonify({
            "team": player_data["TEAM_NAME"],
            "position": player_data["POSITION"],
            "age": age,
            "status": "Active" if (datetime.today().year - int(player_data["TO_YEAR"]) <= 1) else "Retired"
        })

    except Exception as e:
        print(f"Error fetching metadata for player {player_id}: {e}")
        return jsonify({"error": "Metadata not available"}), 500
