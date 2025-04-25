from nba_api.stats.static import players

def get_player_id_by_name(player_name):
    """
    Given a player's full name, return their NBA player ID.
    """
    # Normalize input
    player_name = player_name.strip().lower()

    # Get all players
    all_players = players.get_players()

    # Match by name (case-insensitive)
    for player in all_players:
        if player['full_name'].lower() == player_name:
            return player['id']

    # Not found
    return None
