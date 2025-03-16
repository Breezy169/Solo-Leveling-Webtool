import sqlite3
import logging
import os
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("skills_db")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SKILLS_DB = os.path.join(BASE_DIR, 'skills.db')

def init_SKILLS_DB():
    conn = sqlite3.connect(SKILLS_DB)
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY,
        name TEXT,
        level INTEGER,
        cost INTEGER,
        description TEXT
    )
    ''')
    conn.commit()
    conn.close()

def add_skill_to_db(skill):
    # Falls skill ein JSON-String ist, in ein Dictionary umwandeln
    if isinstance(skill, str):
        try:
            skill = json.loads(skill)
        except Exception as e:
            logger.error("Error parsing skill JSON: %s", e)
            raise e
    conn = sqlite3.connect(SKILLS_DB)
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO skills (name, level, cost, description)
            VALUES (?, ?, ?, ?)
        ''', (skill['name'], skill['level'], skill['cost'], skill['description']))
        conn.commit()
        logger.info("Skill added successfully: %s", skill)
    except Exception as e:
        logger.error("Error adding skill: %s", e)
    finally:
        conn.close()

def get_skills():
    conn = sqlite3.connect(SKILLS_DB)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM skills')
    skills = cursor.fetchall()
    conn.close()
    return skills

def update_skill_level(skill_id, new_level):
    try:
        conn = sqlite3.connect(SKILLS_DB)
        cursor = conn.cursor()
        cursor.execute("UPDATE skills SET level = ? WHERE id = ?", (new_level, skill_id))
        conn.commit()
        if cursor.rowcount == 0:
            return False  # Skill nicht gefunden
        return True  # Update erfolgreich
    except Exception as e:
        logger.error(f"Database error: {e}")
        return False
    finally:
        conn.close()

