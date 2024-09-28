import tkinter as tk
from tkinter import messagebox
from tasks_db import init_tasks_db, add_task_to_db

def submit_task():
    profileid = profileid_entry.get()  # Get the profile ID
    category = category_entry.get()
    name = name_entry.get()
    difficulty = difficulty_entry.get()
    description = description_entry.get("1.0", tk.END).strip()

    if not (profileid.isdigit() and category and name and difficulty and description):
        messagebox.showwarning("Input Error", "All fields must be filled out correctly!")
        return

    # Create the task dictionary
    task = {
        'category': category,
        'name': name,
        'difficulty': difficulty,
        'description': description,
    }

    try:
        # Add task to the database with the provided profile ID
        add_task_to_db(int(profileid), task)
        messagebox.showinfo("Success", "Task added successfully!")
        clear_fields()
    except Exception as e:
        messagebox.showerror("Database Error", f"Could not add task: {e}")

def clear_fields():
    profileid_entry.delete(0, tk.END)
    category_entry.delete(0, tk.END)
    name_entry.delete(0, tk.END)
    difficulty_entry.delete(0, tk.END)
    description_entry.delete("1.0", tk.END)

# Initialize the database
init_tasks_db()

# Create the GUI
root = tk.Tk()
root.title("Add Task")

# GUI Elements for each field, including profile ID
tk.Label(root, text="Profile ID").grid(row=0, column=0)
profileid_entry = tk.Entry(root)
profileid_entry.grid(row=0, column=1)

tk.Label(root, text="Category").grid(row=1, column=0)
category_entry = tk.Entry(root)
category_entry.grid(row=1, column=1)

tk.Label(root, text="Name").grid(row=2, column=0)
name_entry = tk.Entry(root)
name_entry.grid(row=2, column=1)

tk.Label(root, text="Difficulty").grid(row=3, column=0)
difficulty_entry = tk.Entry(root)
difficulty_entry.grid(row=3, column=1)

tk.Label(root, text="Description").grid(row=4, column=0)
description_entry = tk.Text(root, height=5, width=20)
description_entry.grid(row=4, column=1)

submit_button = tk.Button(root, text="Add Task", command=submit_task)
submit_button.grid(row=5, columnspan=2)

root.mainloop()
