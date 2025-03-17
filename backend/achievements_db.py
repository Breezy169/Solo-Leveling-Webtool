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
        reward_type TEXT,
        reward_text TEXT,
        reward_int INTEGER,
        description TEXT,
        status TEXT,
        increase_level INTEGER,
        progress INTEGER,
        max_progress INTEGER
    )
    ''')
    conn.commit()
    conn.close()

def add_achievement_to_db(achievement):
    conn = sqlite3.connect(ACHIEVEMENTS_DB)
    cursor = conn.cursor()
    # Use provided progress or default values
    progress = achievement.get('progress', 0)
    max_progress = achievement.get('max_progress', 100)
    
    # If the reward type is "Skill" and the reward is a dict, serialize it to JSON.
    reward = achievement.get('reward', 0)
    if achievement.get('rewardType') == 'Skill' and isinstance(reward, dict):
        reward = json.dumps(reward)

    cursor.execute('''
    INSERT INTO achievements (name, reward_type, reward_text, reward_int, description, status, increase_level, progress, max_progress)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        achievement['name'],
        achievement['rewardType'],
        reward if achievement.get('rewardType') != 'EXP' else "",
        reward if achievement.get('rewardType') == 'EXP' else 0,
        achievement['description'],
        achievement.get('status', 'pending'),
        achievement.get('increaseLevel', 0),
        progress,
        max_progress
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

def get_achievement_by_id(achievement_id):
    conn = sqlite3.connect(ACHIEVEMENTS_DB)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM achievements WHERE id = ?", (achievement_id,))
    achievement = cursor.fetchone()
    conn.close()
    return achievement

def update_achievements_in_db(achievement_id, new_status):
    try:
        conn = sqlite3.connect(ACHIEVEMENTS_DB)
        cursor = conn.cursor()
        cursor.execute("UPDATE achievements SET status = ? WHERE id = ?", (new_status, achievement_id))
        conn.commit()
        if cursor.rowcount == 0:
            return False
        return True
    except Exception as e:
        logger.error(f"Database error: {e}")
        return False
    finally:
        conn.close()

def update_achievement_progress_and_status(achievement_id, new_progress, new_status):
    try:
        conn = sqlite3.connect(ACHIEVEMENTS_DB)
        cursor = conn.cursor()
        cursor.execute("UPDATE achievements SET progress = ?, status = ? WHERE id = ?", (new_progress, new_status, achievement_id))
        conn.commit()
        if cursor.rowcount == 0:
            return False
        return True
    except Exception as e:
        logger.error(f"Database error: {e}")
        return False
    finally:
        conn.close()

def update_achievement_progress(achievement_id, new_progress):
    try:
        conn = sqlite3.connect(ACHIEVEMENTS_DB)
        cursor = conn.cursor()
        cursor.execute("UPDATE achievements SET progress = ? WHERE id = ?", (new_progress, achievement_id))
        conn.commit()
        if cursor.rowcount == 0:
            return False
        return True
    except Exception as e:
        logger.error(f"Database error: {e}")
        return False
    finally:
        conn.close()
