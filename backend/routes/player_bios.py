from flask import Blueprint, jsonify
from nba_api.stats.endpoints import CommonPlayerInfo
from datetime import datetime

player_bios_bp = Blueprint('player_bios', __name__, url_prefix='/api')

@player_bios_bp.route('/player-bio/<int:player_id>', methods=['GET'])
def get_single_player_bio(player_id):
    try:
        info = CommonPlayerInfo(player_id=player_id).get_normalized_dict()
        bio_data = info['CommonPlayerInfo'][0]

        # Calculate age from birthdate
        birthdate = datetime.strptime(bio_data["BIRTHDATE"], "%Y-%m-%dT%H:%M:%S")
        today = datetime.today()
        age = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))

        # ✅ Inject AGE into response
        bio_data["AGE"] = age

        return jsonify(bio_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
