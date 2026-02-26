<p align="center">
  <img src="https://res.cloudinary.com/dpvm2gro2/image/upload/v1769711039/logo_qp8c8w.png" width="200" alt="Mercy logo">
</p>

<h1 align="center">Mercy v3</h1>

<p align="center">
  <strong>Plataforma web de educación y simulación financiera desarrollada con Flask y SQLite.</strong>
  <br><br>
  <img src="https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python" alt="Python version">
  <img src="https://img.shields.io/badge/Flask-3.x-000000?style=for-the-badge&logo=flask" alt="Flask version">
  <img src="https://img.shields.io/badge/Database-SQLite-07405E?style=for-the-badge&logo=sqlite" alt="Database">
  <img src="https://img.shields.io/badge/IA-Groq%20API-F55036?style=for-the-badge&logo=openai" alt="IA">
</p>

---

## Acerca del proyecto

**Mercy** es una aplicación web educativa e interactiva diseñada para ayudar a los usuarios a mejorar su salud financiera. El sistema permite registrarse, gestionar el perfil y utilizar una suite completa de herramientas financieras: simuladores, diagnóstico, glosario, chatbot con IA y más, todo en un entorno seguro y sin riesgo.

### Características principales

- **Sistema de autenticación completo** — Registro, inicio de sesión y cierre de sesión seguro con contraseñas encriptadas.
- **Dashboard interactivo** — Panel central con selector de tema (modo claro/oscuro) y navegación limpia.
- **Gestión de perfiles (CRUD)** — Los usuarios pueden actualizar su información personal y cambiar su contraseña.
- **Múltiples simuladores financieros:**
  - Simulador de ahorro
  - Simulador de crédito
  - Simulador de inversión
  - Presupuesto personal
  - Retiro/jubilación
  - Calculadora de deuda
- **Diagnóstico financiero** — Evaluación personalizada con resultados y recomendaciones.
- **Chatbot con IA** — Asistente conversacional impulsado por la API de Groq.
- **Glosario financiero** — Página con buscador para definir términos clave.
- **Test de conocimientos** — Cuestionario con temporizador, puntuación y ranking de usuarios.
- **Sección SOFIPOs** — Información y comparativas de SOFIPOs disponibles.

---

## Guía de instalación

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:

| Herramienta | Versión mínima | Enlace |
|---|---|---|
| Python | 3.10 o superior | [python.org](https://www.python.org/downloads/) |
| Git | Cualquier versión reciente | [git-scm.com](https://git-scm.com/downloads/) |

---

### 🪟 Instalación en Windows

**1. Clona el repositorio**

```sh
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd TU_REPO
```

**2. Crea y activa el entorno virtual**

```sh
python -m venv .venv
.venv\Scripts\activate
```

> Verás `(.venv)` al inicio de la línea cuando el entorno esté activo.

**3. Instala las dependencias**

```sh
pip install -r requirements.txt
```

> ⚠️ Algunas librerías como `torch`, `easyocr` y `opencv` son pesadas. La instalación puede tardar varios minutos.

**4. Crea el archivo `.env`**

Crea un archivo llamado `.env` en la raíz del proyecto con el siguiente contenido (ajusta los valores):

```env
SECRET_KEY=tu_clave_secreta_aqui
GROQ_API_KEY=tu_api_key_de_groq_aqui
```

> El `.gitignore` excluye este archivo por seguridad. Nunca lo subas a GitHub.

**5. Inicializa la base de datos**

```sh
python semilla.py
```

**6. Ejecuta la aplicación**

```sh
python app.py
```

**7. Abre en el navegador**

```
http://127.0.0.1:5000
```

---

### 🐧 Instalación en Linux (Kali / Ubuntu / Debian)

**1. Actualiza el sistema e instala las dependencias base**

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git python3 python3-pip python3-venv
```

**2. Clona el repositorio**

```bash
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd TU_REPO
```

**3. Crea y activa el entorno virtual**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

> Verás `(.venv)` al inicio de la línea cuando el entorno esté activo.

**4. Instala las dependencias**

```bash
pip install -r requirements.txt
```

> ⚠️ Algunas librerías como `torch`, `easyocr` y `opencv` son pesadas. La instalación puede tardar varios minutos.

**5. Crea el archivo `.env`**

```bash
nano .env
```

Escribe dentro del archivo:

```env
SECRET_KEY=tu_clave_secreta_aqui
GROQ_API_KEY=tu_api_key_de_groq_aqui
```

Guarda con `Ctrl+O`, `Enter` y sal con `Ctrl+X`.

**6. Inicializa la base de datos**

```bash
python3 semilla.py
```

**7. Ejecuta la aplicación**

```bash
python3 app.py
```

**8. Abre en el navegador**

```
http://127.0.0.1:5000
```

---

## Subir cambios a GitHub

Una vez que hayas hecho modificaciones al proyecto, puedes subirlas con:

```sh
git add .
git commit -m "descripción de los cambios"
git push origin main
```

---

## Estructura del proyecto

```
mercy/
├── app.py                  # Servidor principal Flask y rutas de la API
├── semilla.py              # Script para inicializar y poblar la base de datos
├── requirements.txt        # Dependencias de Python
├── .env                    # Variables de entorno (no se sube a GitHub)
├── .gitignore              # Archivos excluidos del control de versiones
├── mercy_db_v2.sql         # Esquema SQL de respaldo
├── index.html              # Landing page principal
├── dashboard.html          # Panel principal del usuario
├── iniciar_sesion.html     # Página de inicio de sesión
├── registro.html           # Página de registro
├── glosario.html           # Glosario financiero
├── diagnostico.html        # Diagnóstico financiero
├── sofipos.html            # Sección de SOFIPOs
├── simulador_ahorro.html
├── simulador_credito.html
├── simulador_inversion.html
├── simulador_presupuesto_personal.html
├── simulador_retiro_jubilacion.html
├── calculadora_deuda.html
├── css/                    # Hojas de estilo por módulo
└── js/                     # Lógica JavaScript por módulo
```

---

## Notas importantes

- El script `semilla.py` **no** crea usuarios de prueba. Deberás crear tu primera cuenta usando el formulario de **registro** en la aplicación.
- La carpeta `instance/` y los archivos `.db` están excluidos del repositorio para evitar subir datos locales. La base de datos se genera automáticamente al ejecutar `semilla.py`.
- Para obtener tu API key de Groq (chatbot con IA), regístrate en [console.groq.com](https://console.groq.com).

---

## Licencia

Este proyecto está bajo la licencia MIT.