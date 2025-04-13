# routes/advanced_stats.py
from flask import Blueprint, jsonify
from bs4 import BeautifulSoup, Comment
import pandas as pd
from utils.selenium_helpers import get_headless_driver
from cache import cache
import os
import json 
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

awards_bp = Blueprint("awards", __name__, url_prefix="/api/player")



@awards_bp.route("/<bbref_id>/awards", methods=["GET"])
@cache.cached()  # Cached *only* if we hit this route fresh
def get_awards(bbref_id):
    json_path = f"cached_awards_json/{bbref_id}.json"
    os.makedirs("cached_awards_json", exist_ok=True)

    # 💾 Step 1: Disk-first — if JSON exists, load it
    if os.path.exists(json_path):
        try:
            with open(json_path, "r") as f:
                data = json.load(f)
            print(f"[DISK LOAD] {bbref_id} served from disk.")
            return jsonify(data)
        except Exception as e:
            print(f"[DISK ERROR] Could not read {bbref_id}.json: {e}")

    # 🌐 Step 2: Scrape fresh data if not cached
    try:
        print(f"[SCRAPING] {bbref_id} from Basketball Reference...")
        url = f"https://www.basketball-reference.com/players/{bbref_id[0]}/{bbref_id}.html"
        driver = get_headless_driver()
        driver.get(url)
        driver.implicitly_wait(5)

        awards = [
            el.text.strip() for el in driver.find_elements("css selector", "#bling li")
            if el.text.strip()
        ]
        driver.quit()

        # Save fresh result to disk
        with open(json_path, "w") as f:
            json.dump({"awards": awards}, f, indent=2)

        print(f"[SCRAPE ✅] {bbref_id} scraped + written to disk.")
        return jsonify({"awards": awards})

    except Exception as e:
        print(f"[SCRAPE ERROR] Failed for {bbref_id}: {e}")
        return jsonify({"error": "Failed to fetch awards", "awards": []}), 500
from flask import current_app

@awards_bp.route("/debug/cached-awards", methods=["GET"])
def debug_cached_awards():
    try:
        cache_dir = current_app.config["CACHE_DIR"]
        files = os.listdir(cache_dir)

        # Only show .cache files (default Flask cache extension)
        cache_files = [
            {
                "filename": f,
                "size_kb": round(os.path.getsize(os.path.join(cache_dir, f)) / 1024, 2),
                "last_modified": os.path.getmtime(os.path.join(cache_dir, f))
            }
            for f in files if f.endswith(".cache")
        ]

        return jsonify({
            "cached_award_files": cache_files,
            "count": len(cache_files)
        })

    except Exception as e:
        print(f"[DEBUG ERROR] Could not list filesystem cache: {e}")
        return jsonify({"error": "Could not access cache keys"}), 500
