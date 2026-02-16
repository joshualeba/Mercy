
import os

file_path = r"c:\Users\joxel\OneDrive\Escritorio\MPro\Mercy\css\dashboard.css"
enc = 'latin1'

with open(file_path, "r", encoding=enc) as f:
    content = f.read()
    lines = content.splitlines()
    
    queries = [".sidebar", ".glass-sidebar", "--navbar-height"]
    
    for q in queries:
        print(f"--- Searching for '{q}' ---")
        for i, line in enumerate(lines):
             if q in line and "{" in line: # look for rule definitions
                 print(f"Match Line {i+1}: {line.strip()}")
                 # print context
                 for j in range(1, 10):
                     if i+j < len(lines):
                         print(f"  {lines[i+j].strip()}")
                         if "}" in lines[i+j]:
                             break
             elif q == "--navbar-height" and q in line: # variable definition
                 print(f"Var Match Line {i+1}: {line.strip()}")
