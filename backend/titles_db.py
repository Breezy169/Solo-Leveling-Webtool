import sqlite3

TITLES_DB = 'titles.db'

def init_titles_db():
    conn = sqlite3.connect(TITLES_DB)
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS titles (
        id INTEGER PRIMARY KEY,
        title TEXT
    )
    ''')
    conn.commit()
    conn.close()

def add_title_to_db(title):
    conn = sqlite3.connect(TITLES_DB)  # Move connection here
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO titles (title)
    VALUES (?) 
    ''', (title,))  # Pass title directly
    conn.commit()
    conn.close()

def get_titles():
    conn = sqlite3.connect(TITLES_DB)  # Move connection here
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM titles')
    titles = cursor.fetchall()
    conn.close()
    return titles


