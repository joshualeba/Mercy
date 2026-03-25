import sqlite3
import os

db_path = 'instance/mercy.db'
# Check if it's in the root or instance folder
if not os.path.exists(db_path):
    db_path = 'mercy.db'

print(f"Connecting to {db_path}")
try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("ALTER TABLE usuarios ADD COLUMN role VARCHAR(20) DEFAULT 'cliente';")
    conn.commit()
    print("Column 'role' added successfully.")
except sqlite3.OperationalError as e:
    if "duplicate column name: role" in str(e):
        print("Column 'role' already exists.")
    else:
        print(f"Error: {e}")
except Exception as e:
    print(f"Error: {e}")
finally:
    if conn:
        conn.close()
