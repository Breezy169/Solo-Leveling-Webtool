import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from tasks_db import (
    init_tasks_db, get_tasks, update_task_in_db
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
    profile_id = 1  # Assuming there's only one profile
    new_level = data.get('level')
    new_xp = data.get('xp')
    new_title = data.get('title')

    if new_level is None or new_xp is None:
        return jsonify({"message": "Level and XP must be provided"}), 400

    # Update the profile in the database
    if update_profile_level_and_xp(profile_id, new_level, new_xp, new_title):
        logger.info(f'Profile {profile_id} updated successfully.')

        # Fetch the updated profile details from the database
        updated_profile = get_profile_by_id(profile_id)  # Function to fetch the updated profile
        return jsonify(updated_profile), 200  # Return the updated profile details
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



# # Login API route
# @app.route('/api/login', methods=['POST'])
# def login():
#     data = request.json
#     username = data.get('username')
#     password = data.get('password')
    
#     # Verify the user from the database
#     if verify_user(username, password):
#         return jsonify({'message': 'Login successful', 'status': 'success'}), 200
#     else:
#         return jsonify({'message': 'Invalid credentials', 'status': 'fail'}), 401
    

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
