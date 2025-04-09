# routes/game_logs.py
from flask import Blueprint, jsonify
from nba_api.stats.endpoints import PlayerGameLog
import pandas as pd
from cache import cache

logs_bp = Blueprint("gamelogs", __name__, url_prefix="/api/player")

@logs_bp.route("/<int:player_id>/games/<season>", methods=["GET"])
@cache.cached()
def get_game_log(player_id, season):
    try:
        log = PlayerGameLog(player_id=player_id, season=season)
        df = log.get_data_frames()[0]

        df = df[[
            "GAME_DATE", "MATCHUP", "WL", "MIN", "PTS", "REB", "AST",
            "STL", "BLK", "FGA", "FGM", "FG3A", "FG3M", "FTA", "FTM", "TOV"
        ]].copy()

        df["GAME_DATE"] = pd.to_datetime(df["GAME_DATE"]).dt.strftime("%b %d")

        return jsonify(df.to_dict(orient="records"))

    except Exception as e:
        print(f"Error fetching game log for {player_id} in {season}: {e}")
        return jsonify({"error": "Failed to fetch game data"}), 500
