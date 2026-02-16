import os
from dotenv import load_dotenv

# Forzar recarga desde el archivo .env actual
load_dotenv(override=True)

client_id = os.environ.get('GOOGLE_CLIENT_ID')
client_secret = os.environ.get('GOOGLE_CLIENT_SECRET')

print("--- DIAGNÓSTICO DE CREDENCIALES ---")
if not client_id:
    print("ERROR: No se encontró GOOGLE_CLIENT_ID en las variables de entorno.")
elif client_id == "pon_aqui_tu_nuevo_client_id":
    print("ERROR: El GOOGLE_CLIENT_ID sigue teniendo el valor por defecto del ejemplo. Debes pegar tu ID real.")
else:
    print(f"GOOGLE_CLIENT_ID encontrado. Longitud: {len(client_id)}")
    print(f"Comienza con: {client_id[:10]}...")
    
if not client_secret:
    print("ERROR: No se encontró GOOGLE_CLIENT_SECRET en las variables de entorno.")
elif client_secret == "pon_aqui_tu_nuevo_client_secret":
    print("ERROR: El GOOGLE_CLIENT_SECRET sigue teniendo el valor por defecto del ejemplo. Debes pegar tu secreto real.")
else:
    print(f"GOOGLE_CLIENT_SECRET encontrado. Longitud: {len(client_secret)}")
    print(f"Comienza con: {client_secret[:5]}...")

try:
    with open('.env', 'r') as f:
        content = f.read()
        if "googleusercontent.com" not in content and "pon_aqui" not in content:
            print("ADVERTENCIA: El archivo .env no parece contener un ID de cliente típico de Google (que suele terminar en googleusercontent.com).")
except:
    pass
