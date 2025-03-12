from profiles_db import add_profile_to_db

def main():
    profile = {
        'name': input("Enter profile name: "),
        'age': int(input("Enter profile age: ")),
        'level': 1,  # Standardwert für Level
        'xp': 0,     # Standardwert für XP
        'rank': "Iron",  # Standardwert für Rank
        'title': "Beginner",  # Standardwert für Title
        'password': input("Enter a password: "),
    }

    add_profile_to_db(profile)
    print("Profile added successfully.")

if __name__ == "__main__":
    main()
