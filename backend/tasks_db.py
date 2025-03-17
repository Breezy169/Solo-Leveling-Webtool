import sqlite3
import logging
import os
import random
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TASKS_DB = os.path.join(BASE_DIR, 'tasks.db')

def init_tasks_db():
    conn = sqlite3.connect(TASKS_DB)
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY,
        category TEXT,
        name TEXT,
        difficulty TEXT,                   
        description TEXT,
        xp INTEGER,           
        value INTEGER,   
        status TEXT,
        progress INTEGER,
        max_progress INTEGER
    )
    ''')
    conn.commit()
    conn.close()


def get_status_bonus(difficulty):
    if difficulty == 'E-Rank':
        return random.randint(1, 3)
    elif difficulty == 'D-Rank':
        return random.randint(4, 6)
    elif difficulty == 'C-Rank':
        return random.randint(6, 9)
    elif difficulty == 'B-Rank':
        return random.randint(10, 14)
    elif difficulty == 'A-Rank':
        return random.randint(15, 20)
    elif difficulty == 'S-Rank':
        return random.randint(20, 30)
    return 0


def get_xp_for_difficulty(difficulty):
    """Return the XP associated with the given difficulty level."""
  # Umwandlung in Kleinbuchstaben
    if difficulty == 'E-Rank':
        return 200
    elif difficulty == 'D-Rank':
        return 450
    elif difficulty == 'C-Rank':
        return 925
    elif difficulty == 'B-Rank':
        return 2500
    elif difficulty == 'A-Rank':
        return 10000
    elif difficulty == 'S-Rank':
        return 25000
    return 0  # Default if difficulty level is not recognized

def add_task_to_db(task):
    conn = sqlite3.connect(TASKS_DB)
    cursor = conn.cursor()
    
    # Get the XP based on the difficulty level
    xp = get_xp_for_difficulty(task['difficulty'])
    value = get_status_bonus(task['difficulty'])

    cursor.execute('''
    INSERT INTO tasks (category, name, difficulty, description, xp, value, status, progress, max_progress)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
    ''', (
        task['category'],
        task['name'],
        task['difficulty'],
        task['description'],
        xp,  # Assign calculated XP
        value, # Assign calculated value
        task.get('status', 'pending'),  # Default status if not provided
        task['progress'],
        task['max_progress']
    ))
    conn.commit()
    conn.close()

def get_tasks():
    conn = sqlite3.connect(TASKS_DB)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM tasks')
    tasks = cursor.fetchall()
    conn.close()
    return tasks

def get_task_by_id(task_id):
    """
    Ruft einen Task aus der Datenbank ab.
    Schema: (id, category, name, difficulty, description, xp, value, status, progress, max_progress)
    """
    conn = sqlite3.connect(TASKS_DB)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    task = cursor.fetchone()
    conn.close()
    return task

def update_task_in_db(task_id, new_status):
    """
    Aktualisiert den Status eines Tasks.
    """
    try:
        conn = sqlite3.connect(TASKS_DB)
        cursor = conn.cursor()
        cursor.execute("UPDATE tasks SET status = ? WHERE id = ?", (new_status, task_id))
        conn.commit()
        if cursor.rowcount == 0:
            return False  # Task nicht gefunden
        return True
    except Exception as e:
        logger.error(f"Database error: {e}")
        return False
    finally:
        conn.close()

def increase_task_progress(task_id, new_progress):
    """
    Aktualisiert den Fortschritt eines Tasks.
    """
    try:
        conn = sqlite3.connect(TASKS_DB)
        cursor = conn.cursor()
        cursor.execute("UPDATE tasks SET progress = ? WHERE id = ?", (new_progress, task_id))
        conn.commit()
        if cursor.rowcount == 0:
            return False  # Task nicht gefunden
        return True
    except Exception as e:
        logger.error(f"Database error: {e}")
        return False
    finally:
        conn.close()