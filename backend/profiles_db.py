import sqlite3

PROFILES_DB = 'profiles.db'

def init_profiles_db():
    conn = sqlite3.connect(PROFILES_DB)
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY,
        name TEXT,
        age INTEGER,
        level INTEGER,
        xp INTEGER DEFAULT 0,  -- Add XP column with a default value
        rank TEXT,
        title TEXT,
        password TEXT
    )
    ''')
    conn.commit()
    conn.close()


def add_profile_to_db(profile):
    conn = sqlite3.connect(PROFILES_DB)
    cursor = conn.cursor()
    
    # Check if the name already exists
    cursor.execute('SELECT * FROM profiles WHERE name = ?', (profile['name'],))
    existing_profile = cursor.fetchone()
    
    if existing_profile:
        print(f"Error: Profile with name '{profile['name']}' already exists.")
        return None  # Or handle this case as needed
    
    # Proceed to insert the new profile if the name is unique
    cursor.execute('''
    INSERT INTO profiles (name, age, level, xp, rank, title, password)
    VALUES (?, ?, ?, ?, ?, ?, ?) 
    ''', (
        profile['name'],
        profile['age'],
        1,              # Default value for level
        0,              # Default value for xp
        'iron',         # Default value for rank
        'beginner',     # Default value for title
        profile['password']
    ))
    conn.commit()
    conn.close()


def get_all_profiles():
    conn = sqlite3.connect(PROFILES_DB)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM profiles')
    profiles = cursor.fetchall()
    conn.close()
    return profiles

def update_profile_level_and_xp(profile_id, new_level, new_xp):
    """
    Update the level and experience points (XP) for a given profile in the database.
    """
    try:
        conn = sqlite3.connect(PROFILES_DB)
        cursor = conn.cursor()
        
        # Update the profile's level and XP
        cursor.execute('''
            UPDATE profiles
            SET level = ?, xp = ?
            WHERE id = ?
        ''', (new_level, new_xp, profile_id))
        
        conn.commit()
        return True
    except Exception as e:
        print(f"Error updating profile: {e}")
        return False
    finally:
        conn.close()

# def verify_user(username, password):
#     conn = sqlite3.connect(PROFILES_DB)  # Assume a database named users.db
#     cursor = conn.cursor()
#     cursor.execute("SELECT * FROM profiles WHERE name = ? AND password = ?", (username, password))
#     user = cursor.fetchone()
#     conn.close()
#     return user is not None

