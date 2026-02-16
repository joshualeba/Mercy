
import os

file_path = r"c:\Users\joxel\OneDrive\Escritorio\MPro\Mercy\css\dashboard.css"
enc = 'latin1'

with open(file_path, "r", encoding=enc) as f:
    content = f.read()
    lines = content.splitlines()
    
    queries = [".sidebar {", "#sidebar {", "body {", ".main-content {", "padding-top"]
    
    for q in queries:
        print(f"--- Searching for '{q}' ---")
        for i, line in enumerate(lines):
             if q in line:
                 print(f"Match Line {i+1}: {line.strip()}")
                 # print context
                 for j in range(1, 15):
                     if i+j < len(lines):
                         print(f"  {lines[i+j].strip()}")
                         if "}" in lines[i+j]:
                             break
