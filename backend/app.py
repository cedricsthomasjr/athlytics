from flask import Flask, request, jsonify
from flask_cors import CORS
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.static import players
from nba_api.stats.endpoints import PlayerGameLog
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import pandas as pd
import json
from bs4 import BeautifulSoup, Comment

app = Flask(__name__)
CORS(app)

all_players = players.get_players()


@app.route("/api/search", methods=["GET"])
def search_players():
    query = request.args.get("q", "").lower()

    if not query:
        return jsonify(all_players)

    matches = []
    for player in all_players:
        if query in player["full_name"].lower() or query in str(player["id"]):
            matches.append(player)

    return jsonify(matches)


@app.route("/api/player/<player_id>", methods=["GET"])
def player_stats(player_id):
    player = playercareerstats.PlayerCareerStats(player_id=player_id)
    player_stats = player.get_data_frames()[0]
    return jsonify(player_stats.to_dict(orient="records"))


@app.route("/api/player-name/<int:player_id>", methods=["GET"])
def get_player_name(player_id):
    player = next((p for p in all_players if p["id"] == player_id), None)

    if player:
        return jsonify({"name": player["full_name"]})
    else:
        return jsonify({"error": "Player not found"}), 404


@app.route("/api/player/<bbref_id>/awards", methods=["GET"])
def get_player_awards(bbref_id):
    url = f"https://www.basketball-reference.com/players/{bbref_id[0]}/{bbref_id}.html"

    try:
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        driver = webdriver.Chrome(options=chrome_options)
        driver.get(url)
        driver.implicitly_wait(5)

        awards_elements = driver.find_elements(By.CSS_SELECTOR, "#bling li")
        awards = [el.text.strip() for el in awards_elements if el.text.strip()]

        driver.quit()

        return jsonify({"awards": awards})

    except Exception as e:
        print(f"Error scraping awards for {bbref_id}: {e}")
        return jsonify({"error": "Failed to fetch awards", "awards": []}), 500


# 🔥 New route for Advanced Stats + EFFS
@app.route("/api/player/<bbref_id>/advanced", methods=["GET"])
def get_advanced_stats(bbref_id):
    from bs4 import BeautifulSoup, Comment
    import pandas as pd

    url = f"https://www.basketball-reference.com/players/{bbref_id[0]}/{bbref_id}.html"

    try:
        # Launch headless browser
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        driver = webdriver.Chrome(options=chrome_options)
        driver.get(url)
        driver.implicitly_wait(5)

        html = driver.page_source
        driver.quit()

        soup = BeautifulSoup(html, "html.parser")
        comments = soup.find_all(string=lambda text: isinstance(text, Comment))
        print(f"🧠 Found {len(comments)} comment blocks in HTML")

        advanced_table = None

        for i, comment in enumerate(comments):
            if "advanced" in comment and "table" in comment:
                print(f"\n🧪 Checking comment #{i}...")
                try:
                    inner = BeautifulSoup(comment, "html.parser")
                    table = inner.find("table", id="advanced")
                    if table:
                        print(f"✅ Found advanced stats table in comment #{i}")
                        advanced_table = table
                        break
                    else:
                        print(f"⚠️ Comment #{i} mentions 'advanced' but no matching <table id='advanced'>")
                except Exception as parse_err:
                    print(f"❌ Error parsing comment #{i}: {parse_err}")

        if not advanced_table:
            print("❌ No valid advanced stats table found in any comment block")
            return jsonify({"error": "Advanced stats table not found"}), 404

        # Parse table into DataFrame
        df = pd.read_html(str(advanced_table))[0]
        df = df[df["Season"] != "Career"]
        df = df.dropna(subset=["PER", "BPM", "WS/48", "VORP"])
        df = df[["Season", "PER", "BPM", "WS/48", "VORP"]].copy()
        df["NetRating"] = 0  # Optional: scrape separately later

        # EFFS calculation
        def normalize(val, avg, std):
            try:
                return (val - avg) / std
            except:
                return 0

        effs_list = []
        for _, row in df.iterrows():
            effs = (
                normalize(row["PER"], 15, 5) * 0.25 +
                normalize(row["BPM"], 0, 5) * 0.25 +
                normalize(row["WS/48"], 0.1, 0.05) * 0.2 +
                normalize(row["VORP"], 2.0, 2.0) * 0.2 +
                normalize(row["NetRating"], 0, 10) * 0.1
            )
            effs_list.append(round(effs, 2))

        df["EFFS"] = effs_list
        return jsonify(df.to_dict(orient="records"))

    except Exception as e:
        print(f"❌ Fatal error scraping advanced stats: {e}")
        return jsonify({"error": "Failed to fetch advanced stats"}), 500

@app.route("/api/player/<player_id>/games/<season>", methods=["GET"])
def get_player_games(player_id, season):
    try:
        log = PlayerGameLog(player_id=player_id, season=season)
        df = log.get_data_frames()[0]

        # Only include relevant fields to keep frontend light
        df = df[[
            "GAME_DATE", "MATCHUP", "WL", "MIN", "PTS", "REB", "AST",
            "STL", "BLK", "FGA", "FGM", "FG3A", "FG3M", "FTA", "FTM", "TOV"
        ]].copy()

        df["GAME_DATE"] = pd.to_datetime(df["GAME_DATE"]).dt.strftime("%b %d")

        return jsonify(df.to_dict(orient="records"))

    except Exception as e:
        print(f"Error fetching game log for {player_id} in {season}: {e}")
        return jsonify({"error": "Failed to fetch game data"}), 500
@app.route("/api/player/<int:player_id>/image", methods=["GET"])
def get_player_image(player_id):
    image_url = f"https://cdn.nba.com/headshots/nba/latest/1040x760/{player_id}.png"
    return jsonify({"image_url": image_url})
from nba_api.stats.endpoints import commonplayerinfo
from datetime import datetime

@app.route("/api/player/<int:player_id>/meta", methods=["GET"])
def get_player_metadata(player_id):
    try:
        info = commonplayerinfo.CommonPlayerInfo(player_id=player_id)
        df = info.get_data_frames()[0]

        player_data = df.iloc[0]
        birth_date = player_data["BIRTHDATE"]
        team_name = player_data["TEAM_NAME"]
        position = player_data["POSITION"]
        to_year = int(player_data["TO_YEAR"])
        current_year = datetime.today().year
        is_active = (current_year - to_year) <= 1

        # Calculate age
        birth_date = datetime.strptime(birth_date, "%Y-%m-%dT%H:%M:%S")
        today = datetime.today()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

        return jsonify({
            "team": team_name,
            "position": position,
            "age": age,
            "status": "Active" if is_active else "Retired"
        })
    except Exception as e:
        print(f"Error fetching metadata for player {player_id}: {e}")
        return jsonify({"error": "Metadata not available"}), 500


if __name__ == "__main__":
    app.run(debug=True)
