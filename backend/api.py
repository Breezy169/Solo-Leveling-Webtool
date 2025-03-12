import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from tasks_db import (
    init_tasks_db, get_tasks, update_task_in_db, add_task_to_db, get_xp_for_difficulty
)
from profiles_db import (
    init_profiles_db, get_all_profiles, update_profile_level_and_xp, get_profile_by_id
)
from titles_db import (
    init_titles_db, get_titles
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

init_tasks_db()
init_profiles_db()
init_titles_db()
ranks = ['Knight', 'Elite', 'General', 'Marshal', 'Grand Marshal']
rank_levels = [5, 20, 50, 75, 100]

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
        'status': task[6]
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
        'title': profile[6]
    } for profile in profiles]
    return jsonify(profile_list)

@app.route('/api/profile/update', methods=['PUT'])
def update_profile():
    data = request.get_json()
    logger.info(f"Update profile data: {data}")  # Zum Debuggen
    profile_id = 1  # Annahme: Es gibt nur ein Profil

    # Versuche, Level und XP in Integer umzuwandeln
    try:
        new_level = int(data.get('level'))
        new_xp = int(data.get('xp'))
    except (ValueError, TypeError):
        return jsonify({"message": "Level and XP must be integers"}), 400

    # Falls kein Title übermittelt wird, benutze einen leeren String als Standard
    new_title = data.get('title') or ""

    # Berechne den Rang basierend auf dem Level
    new_rank = ranks[0] if new_level < rank_levels[0] else None
    for i in range(0, len(rank_levels) - 1):
        if new_level >= rank_levels[i] and new_level < rank_levels[i+1]:
            new_rank = ranks[i]
    if new_level >= rank_levels[-1]:
        new_rank = ranks[-1]

    if new_level is None or new_xp is None:
        return jsonify({"message": "Level and XP must be provided"}), 400

    # Aktualisiere das Profil in der Datenbank
    if update_profile_level_and_xp(profile_id, new_level, new_xp, new_title, new_rank):
        logger.info(f'Profile {profile_id} updated successfully.')
        updated_profile = get_profile_by_id(profile_id)
        return jsonify(updated_profile), 200
    else:
        logger.error(f'Failed to update profile {profile_id}.')
        return jsonify({"message": "Failed to update profile"}), 500



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


@app.route('/api/addTask', methods=['POST'])
def add_task():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input provided"}), 400

    required_fields = ['category', 'name', 'difficulty', 'description']
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Missing fields"}), 400

    difficulty = data.get('difficulty', '')
    if difficulty not in ['Easy', 'Medium', 'Hard', 'Extreme', 'Special']:
        return jsonify({"message": "Invalid difficulty value"}), 400

    try:
        add_task_to_db(data)
        xp = get_xp_for_difficulty(data['difficulty'])
        logger.info("Task added successfully.")
        return jsonify({"message": "Task added successfully", "xp": xp}), 200
    except Exception as e:
        logger.error(f"Error adding task: {e}")
        return jsonify({"message": "Error adding task"}), 500
    

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
