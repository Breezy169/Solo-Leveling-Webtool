import logging
import json
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
from titles_db import add_title_to_db, init_titles_db, get_titles
from tasks_db import (
    init_tasks_db, get_tasks, update_task_in_db, add_task_to_db, get_xp_for_difficulty, increase_task_progress, get_task_by_id
)
from profiles_db import (
    init_profiles_db, get_all_profiles, update_profile_level_and_xp, get_profile_by_id, update_profile_status_values
)
# --- Neu: Import von achievements_db ---
from achievements_db import init_ACHIEVEMENTS_DB, add_achievement_to_db, get_achievements, update_achievements_in_db
from skills_db import init_SKILLS_DB, add_skill_to_db, get_skills, update_skill_level

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

init_tasks_db()
init_profiles_db()
init_titles_db()
init_ACHIEVEMENTS_DB() 
init_SKILLS_DB()

ranks = ['E-Rank', 'D-Rank', 'C-Rank', 'B-Rank', 'A-Rank', 'S-Rank']
rank_levels = [5, 20, 50, 75, 125, 200]

def get_status_bonus(difficulty):
    if difficulty == 'E-Rank':
        return random.randint(0, 3)
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

# --- Achievement-Endpunkte ---
@app.route('/api/addtitle', methods=['PUT'])
def addtitle():
    data = request.get_json()
    new_title = data.get('title')
    try:
        add_title_to_db(new_title)
        logger.info(f'Title {new_title} has been added to the collection.')
        return jsonify({'message': 'Title added successfully'}), 200
    except Exception as e:
        logger.error(f'Error adding title: {e}')
        return jsonify({'message': 'Failed to add title'}), 500
    
@app.route('/api/achievements', methods=['GET'])
def get_all_achievements():
    achievements_data = get_achievements()
    # Annahme: Die Spaltenreihenfolge in der Tabelle lautet: 
    # 0: id, 1: name, 2: reward_type, 3: reward_text, 4: reward_int, 5: description, 6: status, 7: increase_level
    achievement_list = [{
        'id': row[0],
        'name': row[1],
        'rewardType': row[2],
        'reward': row[4] if row[2] == 'EXP' else row[3],
        'description': row[5],
        'status': row[6],
        'increaseLevel': row[7]
    } for row in achievements_data]
    return jsonify(achievement_list)

@app.route('/api/addachievements', methods=['POST'])
def add_achievement():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input provided"}), 400

    # Pflichtfelder prüfen
    required_fields = ['name', 'reward', 'description', 'rewardType']
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Missing fields"}), 400

    # Für Reward-Typ "Skill" wird das komplette Reward-Objekt übergeben (inklusive increaseLevel),
    # damit im Backend auch der Skill als JSON gespeichert wird.
    try:
        add_achievement_to_db(data)
        logger.info("Achievement added successfully.")
        return jsonify({"message": "Achievement added successfully"}), 200
    except Exception as e:
        logger.error(f"Error adding achievement: {e}")
        return jsonify({"message": "Error adding achievement"}), 500

@app.route('/api/achievements/<int:achievement_id>', methods=['PUT'])
def update_achievement(achievement_id):
    data = request.get_json()
    new_status = data.get('status')
    if update_achievements_in_db(achievement_id, new_status):
        logger.info(f'Achievement {achievement_id} updated successfully.')
        return jsonify({'message': 'Achievement updated successfully'}), 200
    else:
        logger.error(f'Achievement {achievement_id} not found or failed to update.')
        return jsonify({'message': 'Achievement not found'}), 404

# --- Die übrigen Endpunkte (Tasks, Profile, Titles etc.) bleiben unverändert ---

@app.route('/api/tasks', methods=['GET'])
def get_all_tasks():
    tasks = get_tasks()
    task_list = [{
        'id': task[0],
        'category': task[1],
        'name': task[2],
        'difficulty': task[3],
        'description': task[4],
        'xp': task[5],
        'value': task[6],
        'status': task[7],
        'progress': task[8],
        'max_progress': task[9]
    } for task in tasks]
    return jsonify(task_list)

@app.route('/api/titles', methods=['GET'])
def get_all_titles():
    titles = get_titles()
    title_list = [{
        'id': title[0],
        'title': title[1],
    } for title in titles]
    return jsonify(title_list)

@app.route('/api/profile', methods=['GET'])
def get_profiles():
    profiles = get_all_profiles()
    profile_list = [{
        'id': profile[0],
        'name': profile[1],
        'age': profile[2],
        'level': profile[3],
        'xp': profile[4],
        'rank': profile[5],
        'title': profile[6],
        # Assuming additional status fields follow (default to 0 if not set)
        'strength': profile[7] if len(profile) > 7 else 0,
        'agility': profile[8] if len(profile) > 8 else 0,
        'stamina': profile[9] if len(profile) > 9 else 0,
        'intelligence': profile[10] if len(profile) > 10 else 0,
        'perception': profile[11] if len(profile) > 11 else 0,
        'ap': profile[12] if len(profile) > 12 else 0,
    } for profile in profiles]
    return jsonify(profile_list)

@app.route('/api/profile/update', methods=['PUT'])
def update_profile_xp():
    data = request.get_json()
    logger.info(f"Update profile data: {data}")  # Zum Debuggen
    profile_id = 1  # Annahme: Es gibt nur ein Profil

    try:
        new_level = int(data.get('level'))
        new_xp = int(data.get('xp'))
    except (ValueError, TypeError):
        return jsonify({"message": "Level and XP must be integers"}), 400

    new_title = data.get('title') or ""

    # Determine new rank based on level:
    new_rank = ranks[0] if new_level < rank_levels[0] else None
    for i in range(0, len(rank_levels) - 1):
        if new_level >= rank_levels[i] and new_level < rank_levels[i+1]:
            new_rank = ranks[i]
    if new_level >= rank_levels[-1]:
        new_rank = ranks[-1]

    # Retrieve the current profile to get the existing status values:
    profile = get_profile_by_id(profile_id)
    if not profile:
        return jsonify({"message": "Profile not found"}), 404

    current_status = {
        'strength': profile[7] if len(profile) > 7 else 0,
        'agility': profile[8] if len(profile) > 8 else 0,
        'stamina': profile[9] if len(profile) > 9 else 0,
        'intelligence': profile[10] if len(profile) > 10 else 0,
        'perception': profile[11] if len(profile) > 11 else 0,
        'ap': profile[12] if len(profile) > 12 else 0,
    }

    # Now call the update function with all required arguments.
    levelUpdated = update_profile_level_and_xp(
        profile_id,
        new_level,
        new_xp,
        new_title,
        new_rank
    )
    statusUpdated = update_profile_status_values(
        profile_id,
        current_status['strength'],
        current_status['agility'],
        current_status['stamina'],
        current_status['intelligence'],
        current_status['perception'],
        current_status['ap']
    )
    
    if levelUpdated and statusUpdated:
        logger.info(f'Profile {profile_id} updated successfully.')
        updated_profile = get_profile_by_id(profile_id)
        return jsonify(updated_profile), 200
    else:
        logger.error(f'Failed to update profile {profile_id}.')
        return jsonify({"message": "Failed to update profile"}), 500

@app.route('/api/profile/update_status', methods=['PUT'])
def update_profile_status():
    data = request.get_json()
    logger.info(f"Update profile status data: {data}")  # Zum Debuggen
    profile_id = 1  # Annahme: Es gibt nur ein Profil

    try:
        new_str = int(data.get('strength'))
        new_dex = int(data.get('agility'))
        new_sta = int(data.get('stamina'))
        new_int = int(data.get('intelligence'))
        new_perc = int(data.get('perception'))
        new_ap = int(data.get('ap'))
    except (ValueError, TypeError):
        return jsonify({"message": "Status values must be integers"}), 400

    if update_profile_status_values(profile_id, new_str, new_dex, new_sta, new_int, new_perc, new_ap):
        logger.info(f'Profile {profile_id} status updated successfully.')
        updated_profile = get_profile_by_id(profile_id)
        return jsonify(updated_profile), 200
    else:
        logger.error(f'Failed to update profile status for {profile_id}.')
        return jsonify({"message": "Failed to update profile status"}), 500

@app.route('/api/addTask', methods=['POST'])
def add_task():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input provided"}), 400

    required_fields = ['category', 'name', 'difficulty', 'description']
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Missing fields"}), 400

    difficulty = data.get('difficulty', '')
    if difficulty not in ['E-Rank', 'D-Rank', 'C-Rank', 'B-Rank', 'A-Rank', 'S-Rank']:
        return jsonify({"message": "Invalid difficulty value"}), 400

    try:
        add_task_to_db(data)
        xp = get_xp_for_difficulty(data['difficulty'])
        logger.info("Task added successfully.")
        return jsonify({"message": "Task added successfully", "xp": xp}), 200
    except Exception as e:
        logger.error(f"Error adding task: {e}")
        return jsonify({"message": "Error adding task"}), 500

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    new_status = data.get('status')
    if update_task_in_db(task_id, new_status):
        logger.info(f'Task {task_id} updated successfully.')
        return jsonify({'message': 'Task updated successfully'}), 200
    else:
        logger.error(f'Task {task_id} not found or failed to update.')
        return jsonify({'message': 'Task not found'}), 404


@app.route('/api/update_task_progress', methods=['PUT'])
def update_task_progress():
    data = request.get_json()
    task_id = data["task_id"]
    # Aktuellen Fortschritt und den Inkrementwert aus den Daten lesen
    current_progress = int(data.get('progress', 0))
    increment = int(data.get('increment', 1))
    new_progress = current_progress + increment

    # Task aus der DB abrufen, um den max_progress zu ermitteln
    task = get_task_by_id(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    # Annahme: Im tasks-Table ist max_progress an Position 9 (Index 9)
    max_progress = task[9]

    # Wenn der neue Fortschritt den Maximalwert erreicht oder überschreitet,
    # wird er auf max_progress gesetzt und der Task als "done" markiert.
    if new_progress >= max_progress:
        new_progress = max_progress
        if increase_task_progress(task_id, new_progress) and update_task_in_db(task_id, "done"):
            return jsonify({"message": "Task completed", "progress": new_progress}), 200
        else:
            return jsonify({"error": "Failed to update task progress"}), 400
    else:
        if increase_task_progress(task_id, new_progress):
            return jsonify({"message": "Task progress updated successfully", "progress": new_progress}), 200
        else:
            return jsonify({"error": "Failed to update task progress"}), 400


@app.route('/api/skills', methods=['POST'])
def create_skill():
    skill_data = request.get_json()
    try:
        add_skill_to_db(skill_data)
        return jsonify({"message": "Skill added successfully."}), 201
    except Exception as e:
        logger.error("Error adding skill: %s", e)
        return jsonify({"error": str(e)}), 500

@app.route('/api/skills', methods=['GET'])
def get_all_skills():
    try:
        skills = get_skills()
        # Erzeuge für jedes Skill-Tupel ein Dictionary mit allen benötigten Feldern:
        skills_list = [
            {
                "id": skill[0],
                "name": skill[1],
                "level": skill[2],
                "cost": skill[3],
                "description": skill[4]
            }
            for skill in skills
        ]
        return jsonify(skills_list), 200
    except Exception as e:
        logger.error("Error retrieving skills: %s", e)
        return jsonify({"error": str(e)}), 500


@app.route('/api/update_skill_level', methods=['PUT'])
def update_skill_level_endpoint():
    data = request.get_json()
    if not data or "skill_id" not in data:
        return jsonify({"error": "Missing skill_id"}), 400

    skill_id = data["skill_id"]
    new_level = int(data.get('level')) + 1
    if update_skill_level(skill_id, new_level):
        return jsonify({"message": "Skill level updated successfully", "new_level": new_level}), 200
    else:
        return jsonify({"error": "Failed to update skill level"}), 400

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
