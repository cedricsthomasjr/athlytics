from flask import Flask, request, jsonify
from flask_cors import CORS
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.static import players
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import json

app = Flask(__name__)
CORS(app)

# Fetch a list of all NBA players
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

# 🏆 Selenium-based Awards Scraper Route
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

        awards_elements = driver.find_elements("css selector", "#bling li")
        awards = [el.text.strip() for el in awards_elements if el.text.strip()]

        driver.quit()

        return jsonify({"awards": awards})

    except Exception as e:
        print(f"Error scraping awards for {bbref_id}: {e}")
        return jsonify({"error": "Failed to fetch awards", "awards": []}), 500

if __name__ == "__main__":
    app.run(debug=True)
