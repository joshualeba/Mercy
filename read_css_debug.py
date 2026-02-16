
import os

file_path = r"c:\Users\joxel\OneDrive\Escritorio\MPro\Mercy\css\dashboard.css"
encodings = ['utf-16', 'utf-16le', 'utf-8'] 

for enc in encodings:
    try:
        with open(file_path, "r", encoding=enc) as f:
            content = f.read()
            print(f"--- Success with {enc} --- len: {len(content)}")
            
            lines = content.splitlines()
            # print first 5 lines
            for i, line in enumerate(lines[:5]):
                print(f"{i+1}: {line}")

            # search for sidebar
            found = False
            for i, line in enumerate(lines):
                if "sidebar" in line:
                     print(f"Match Line {i+1}: {line.strip()}")
                     found = True
                     # print context
                     for j in range(1, 4):
                         if i+j < len(lines):
                             print(f"  {lines[i+j].strip()}")
            if not found:
                print("No 'sidebar' found in file.")
            break
    except Exception as e:
        print(f"Failed with {enc}: {e}")
