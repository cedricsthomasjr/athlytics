from nba_api.stats.static import teams as nba_teams

def get_team_id_by_name(team_name):
    team_name = team_name.lower()
    for team in nba_teams.get_teams():
        if team_name in team['full_name'].lower() or team_name in team['nickname'].lower():
            return team['id']
    return None

def format_team_stats(team_info, stats):
    return {
        "team_info": team_info,
        "stats": stats
    }

