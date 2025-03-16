from profiles_db import add_profile_to_db

def main():
    profile = {
        'name': input("Enter profile name: "),
        'age': int(input("Enter profile age: ")),
        'level': 1,  # Standardwert für Level
        'xp': 0,     # Standardwert für XP
        'rank': "E-Rank",  # Standardwert für Rank
        'title': "Beginner",  # Standardwert für Title
        'strength': 10,
        'agility': 10,
        'stamina': 10,
        'intelligence': 10,
        'perception': 10,
        'ap': 0,
        'password': input("Enter a password: "),
    }

    add_profile_to_db(profile)
    print("Profile added successfully.")

if __name__ == "__main__":
    main()
