import sqlite3
import logging
import os
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ACHIEVEMENTS_DB = os.path.join(BASE_DIR, 'achievements.db')

def init_ACHIEVEMENTS_DB():
    conn = sqlite3.connect(ACHIEVEMENTS_DB)
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY,
        name TEXT,
        reward_type TEXT,     -- 'EXP', 'Title' oder 'Skill'
        reward_text TEXT,     -- Für Titel-Belohnungen oder Skill-Daten (als JSON)
        reward_int INTEGER,   -- Für EXP-Belohnungen
        description TEXT,
        status TEXT,
        increase_level TEXT   -- "ja" oder "nein"
    )
    ''')
    conn.commit()
    conn.close()

def add_achievement_to_db(achievement):
    conn = sqlite3.connect(ACHIEVEMENTS_DB)
    cursor = conn.cursor()
    # Bestimme den Reward-Typ und speichere den Wert in der entsprechenden Spalte
    reward_type = achievement.get('rewardType')
    if reward_type == 'EXP':
        reward_int = int(achievement.get('reward'))
        reward_text = None
    elif reward_type == 'Title':
        reward_int = None
        reward_text = achievement.get('reward')
    elif reward_type == 'Skill':
        reward_int = None
        # Konvertiere das Skill-Dictionary in einen JSON-String
        reward_text = json.dumps(achievement.get('reward'))
    else:
        # Falls rewardType nicht gesetzt ist, automatisch erkennen:
        try:
            reward_int = int(achievement.get('reward'))
            reward_text = None
            reward_type = 'EXP'
        except (ValueError, TypeError):
            reward_int = None
            reward_text = achievement.get('reward')
            reward_type = 'Title'
    # Hole den Wert für increase_level, standardmäßig "nein"
    increase_level = achievement.get('increaseLevel', 'nein')
    cursor.execute('''
    INSERT INTO achievements (name, reward_type, reward_text, reward_int, description, status, increase_level)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        achievement['name'],
        reward_type,
        reward_text,
        reward_int,
        achievement['description'],
        achievement.get('status', 'pending'),
        increase_level
    ))
    conn.commit()
    conn.close()

def get_achievements():
    conn = sqlite3.connect(ACHIEVEMENTS_DB)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM achievements')
    achievements = cursor.fetchall()
    conn.close()
    return achievements

def update_achievements_in_db(achievement_id, new_status):
    try:
        conn = sqlite3.connect(ACHIEVEMENTS_DB)
        cursor = conn.cursor()
        cursor.execute("UPDATE achievements SET status = ? WHERE id = ?", (new_status, achievement_id))
        conn.commit()
        if cursor.rowcount == 0:
            return False  # Achievement nicht gefunden
        return True  # Update erfolgreich
    except Exception as e:
        logger.error(f"Database error: {e}")
        return False
    finally:
        conn.close()
