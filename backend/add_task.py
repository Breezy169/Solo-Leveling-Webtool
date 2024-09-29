# Create the main window
import tkinter as tk
from tkinter import messagebox
from tasks_db import add_task_to_db, init_tasks_db

def get_xp_for_difficulty(difficulty):
    """Return the XP associated with the given difficulty level."""
    if difficulty.lower() == 'easy':
        return 200
    elif difficulty.lower() == 'medium':
        return 450
    elif difficulty.lower() == 'hard':
        return 925
    elif difficulty.lower() == 'extreme':
        return 1900

    return 0  # Default if difficulty level is not recognized

def submit_task():
    init_tasks_db()
    task = {
        'category': category_var.get(),
        'name': name_entry.get(),
        'difficulty': difficulty_var.get(),
        'description': 'Description: ' + description_entry.get("1.0", tk.END).strip(),
    }

    # Check if all fields are filled
    if all(task.values()):
        # Check if the difficulty is valid
        difficulty = task['difficulty'].lower()
        if difficulty in ['easy', 'medium', 'hard', 'extreme']:
            add_task_to_db(task)
            xp = get_xp_for_difficulty(difficulty)
            messagebox.showinfo("Success", f"Task added successfully! XP: {xp}")
            # Clear input fields
            category_var.set('')  # Reset category selection
            name_entry.delete(0, tk.END)
            difficulty_var.set('')  # Reset difficulty selection
            description_entry.delete("1.0", tk.END)
        else:
            messagebox.showwarning("Input Error", "Difficulty must be 'easy', 'medium', 'hard' or 'extreme.")
    else:
        messagebox.showwarning("Input Error", "Please fill in all fields.")

root = tk.Tk()
root.title("Task Manager")
root.geometry("500x500")

# Available options for categories and difficulty
categories = ['Intelligence', 'Strength', 'Agility', 'Durability', 'Skills', 'Projects']
difficulties = ["easy", "medium", "hard", "extreme"]

tk.Label(root, text="Category:").pack(pady=5)
category_var = tk.StringVar(root)
category_menu = tk.OptionMenu(root, category_var, *categories)
category_menu.pack(pady=5)

tk.Label(root, text="Task Name:").pack(pady=5)
name_entry = tk.Entry(root, width=40)
name_entry.pack(pady=5)

tk.Label(root, text="Difficulty:").pack(pady=5)
difficulty_var = tk.StringVar(root)
difficulty_menu = tk.OptionMenu(root, difficulty_var, *difficulties)
difficulty_menu.pack(pady=5)

tk.Label(root, text="Description:").pack(pady=5)
description_entry = tk.Text(root, width=40, height=10)
description_entry.pack(pady=5)

# Submit button
submit_button = tk.Button(root, text="Add Task", command=submit_task)
submit_button.pack(pady=20)
# Start the main loop
root.mainloop()
