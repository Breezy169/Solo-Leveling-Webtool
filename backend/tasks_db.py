import sqlite3
import logging
import os

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
        status TEXT
    )
    ''')
    conn.commit()
    conn.close()

def get_xp_for_difficulty(difficulty):
    """Return the XP associated with the given difficulty level."""
  # Umwandlung in Kleinbuchstaben
    if difficulty == 'Easy':
        return 200
    elif difficulty == 'Medium':
        return 450
    elif difficulty == 'Hard':
        return 925
    elif difficulty == 'Extreme':
        return 1900
    elif difficulty == 'Special':
        return 25000
    return 0  # Default if difficulty level is not recognized

def add_task_to_db(task):
    conn = sqlite3.connect(TASKS_DB)
    cursor = conn.cursor()
    
    # Get the XP based on the difficulty level
    xp = get_xp_for_difficulty(task['difficulty'])
    
    cursor.execute('''
    INSERT INTO tasks (category, name, difficulty, description, xp, status)
    VALUES (?, ?, ?, ?, ?, ?) 
    ''', (
        task['category'],
        task['name'],
        task['difficulty'],
        task['description'],
        xp,  # Assign calculated XP
        task.get('status', 'pending')  # Default status if not provided
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

def update_task_in_db(task_id, new_status):
    try:
        conn = sqlite3.connect(TASKS_DB)
        cursor = conn.cursor()
        cursor.execute("UPDATE tasks SET status = ? WHERE id = ?", (new_status, task_id))
        conn.commit()
        if cursor.rowcount == 0:
            return False  # Task not found
        return True  # Update successful
    except Exception as e:
        logger.error(f"Database error: {e}")
        return False
    finally:
        conn.close()
