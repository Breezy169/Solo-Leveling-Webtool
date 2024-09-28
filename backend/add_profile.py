from profiles_db import add_profile_to_db

def main():
    profile = {
        'name': input("Enter profile name: "),
        'age': int(input("Enter profile age: ")),
        'level': 1,  # Default level
        'xp': 0,     # Default XP
        'rank': 'iron',  # Default rank
        'title': 'beginner'  # Default title
    }

    result = add_profile_to_db(profile)
    if result:
        print("Profile added successfully.")
    else:
        print("Failed to add profile.")

if __name__ == "__main__":
    main()
