import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROFILES_DB = os.path.join(BASE_DIR, 'profiles.db')


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
        strength INTEGER DEFAULT 10,
        agility INTEGER DEFAULT 10,
        stamina INTEGER DEFAULT 10,
        intelligence INTEGER DEFAULT 10,
        perception INTEGER DEFAULT 10,
        ap INTEGER DEFAULT 0,           
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
    INSERT INTO profiles (name, age, level, xp, rank, title, strength, agility, stamina, intelligence, perception, ap, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
    ''', (
        profile['name'],
        profile['age'],
        1,              # Default value for level
        0,              # Default value for xp
        'E-Rank',       # Default value for rank
        'Beginner',     # Default value for title
        10,             # Default value for strength
        10,             # Default value for agility
        10,             # Default value for stamina
        10,             # Default value for intelligence
        10,             # Default value for perception
        0,              # Default value for ap
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

def update_profile_level_and_xp(profile_id, new_level, new_xp, new_title, new_rank):
    """
    Update the level and experience points (XP) for a given profile in the database.
    """
    try:
        conn = sqlite3.connect(PROFILES_DB)
        cursor = conn.cursor()
        
        # Update the profile's level and XP
        cursor.execute('''
            UPDATE profiles
            SET level = ?, xp = ?, title = ?, rank = ?
            WHERE id = ?
        ''', (new_level, new_xp, new_title, new_rank, profile_id))
        
        conn.commit()
        return True
    except Exception as e:
        print(f"Error updating profile: {e}")
        return False
    finally:
        conn.close()

def update_profile_status_values(profile_id, new_str, new_dex, new_sta, new_int, new_perc, new_ap):
    """
    Update the level and experience points (XP) for a given profile in the database.
    """
    try:
        conn = sqlite3.connect(PROFILES_DB)
        cursor = conn.cursor()
        
        # Update the profile's level and XP
        cursor.execute('''
            UPDATE profiles
            SET strength = ?, agility = ?, stamina = ?, intelligence = ?, perception = ?, ap = ?
            WHERE id = ?
        ''', (new_str, new_dex, new_sta, new_int, new_perc, new_ap, profile_id))
        
        conn.commit()
        return True
    except Exception as e:
        print(f"Error updating profile: {e}")
        return False
    finally:
        conn.close()

def get_profile_by_id(profile_id):
    """
    Retrieve a profile by its ID from the database.
    """
    conn = sqlite3.connect(PROFILES_DB)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM profiles WHERE id = ?', (profile_id,))
    profile = cursor.fetchone()  # Fetch the profile
    conn.close()
    return profile  # Return the profile data or None if not found

# def verify_user(username, password):
#     conn = sqlite3.connect(PROFILES_DB)  # Assume a database named users.db
#     cursor = conn.cursor()
#     cursor.execute("SELECT * FROM profiles WHERE name = ? AND password = ?", (username, password))
#     user = cursor.fetchone()
#     conn.close()
#     return user is not None

