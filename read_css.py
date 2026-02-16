
import os

file_path = r"c:\Users\joxel\OneDrive\Escritorio\MPro\Mercy\css\dashboard.css"
encodings = ['utf-8', 'utf-16', 'utf-16le', 'latin1']

for enc in encodings:
    try:
        with open(file_path, "r", encoding=enc) as f:
            content = f.read()
            print(f"--- Success with {enc} ---")
            
            # search for .sidebar styles
            lines = content.splitlines()
            for i, line in enumerate(lines):
                if ".sidebar {" in line or ".sidebar" in line:
                     print(f"Line {i+1}: {line.strip()}")
                     # print up to 10 lines of context
                     for j in range(1, 10):
                         if i+j < len(lines):
                             print(f"{lines[i+j].strip()}")
                             if "}" in lines[i+j]:
                                 break
            break
    except Exception as e:
        # print(f"Failed with {enc}: {e}")
        pass
