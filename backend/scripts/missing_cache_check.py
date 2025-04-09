import requests
import re

SOURCE_FILE = "cachedplayers.txt"

# Extract bbrefId before whitespace or "–"
def extract_id(line):
    match = re.match(r"^([a-z0-9]+)", line.strip())
    return match.group(1) if match else None

# Load all known players
with open(SOURCE_FILE) as f:
    all_ids = [extract_id(line) for line in f if extract_id(line)]

# Hit the debug cache route
res = requests.get("http://127.0.0.1:5000/api/player/debug/cached-awards")
cached_ids = res.json().get("cached_ids", [])

# Compare + collect
missing = [pid for pid in all_ids if pid not in cached_ids]

# Output
print(f"\n🧊 Missing Awards Cache ({len(missing)}):\n")
for pid in missing:
    print(f"- {pid}")

# Optional: Save curl commands to run later
with open("scripts/missing_curls.sh", "w") as f:
    for pid in missing:
        f.write(f"curl http://127.0.0.1:5000/api/player/{pid}/awards\n")

print(f"\n🚀 Generated 'missing_curls.sh' with {len(missing)} curl commands.")
