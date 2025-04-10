from flask import Blueprint, jsonify
from nba_api.stats.endpoints import CommonPlayerInfo

player_bios_bp = Blueprint('player_bios', __name__, url_prefix='/api')

@player_bios_bp.route('/player-bio/<int:player_id>', methods=['GET'])
def get_single_player_bio(player_id):
    try:
        info = CommonPlayerInfo(player_id=player_id).get_normalized_dict()
        bio_data = info['CommonPlayerInfo'][0]

        # Calculate age from birthdate
        from datetime import datetime
        birthdate = datetime.strptime(bio_data["BIRTHDATE"], "%Y-%m-%dT%H:%M:%S")
        today = datetime.today()
        age = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))

        return jsonify({
            "name": bio_data.get("DISPLAY_FIRST_LAST"),
            "team": bio_data.get("TEAM_NAME"),
            "position": bio_data.get("POSITION"),
            "status": "Active" if bio_data.get("ROSTERSTATUS") == "Active" else "Inactive",
            "height": bio_data.get("HEIGHT"),
            "weight": bio_data.get("WEIGHT"),
            "college": bio_data.get("SCHOOL") or "N/A",
            "age": age
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

