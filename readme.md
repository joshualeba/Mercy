<p align="center">
  <img src="https://res.cloudinary.com/dpvm2gro2/image/upload/v1769711039/logo_qp8c8w.png" width="200" alt="logo de Mercy">
</p>

<h1 align="center">Mercy v1</h1>

<p align="center">
  <strong>Plataforma web de educación y simulación financiera desarrollada con Flask y PostgreSQL/SQLite.</strong>
  <br><br>
  <img src="https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python" alt="versión de Python">
  <img src="https://img.shields.io/badge/Flask-3.x-000000?style=for-the-badge&logo=flask" alt="versión de Flask">
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql" alt="base de datos">
  <img src="https://img.shields.io/badge/IA-Groq%20API-F55036?style=for-the-badge&logo=openai" alt="IA">
</p>

---

## Acerca del proyecto

**Mercy** es una aplicación web educativa e interactiva diseñada para ayudar a los usuarios a mejorar su salud financiera. El sistema permite registrarse, gestionar el perfil y utilizar una suite completa de herramientas financieras: simuladores, diagnóstico, glosario, chatbot con IA y más, todo en un entorno seguro y profesional bajo una estética de diseño moderno.

### Experiencia premium de usuario

- **Interfaz estética** — Diseño basado en **glassmorphism** con efectos de desenfoque y profundidad.
- **Navegación fluida** — Integración de la librería **Lenis** para un scroll suave y profesional.
- **Interacciones modernas** — Modales dinámicos con **SweetAlert2** sustituyendo las alertas nativas del navegador.
- **Gestión inteligente de scroll** — Bloqueo de desplazamiento de fondo al abrir modales y barras de navegación inteligentes.

### Características principales

- **Sistema de autenticación completo** — Registro, inicio de sesión y cierre de sesión seguro con contraseñas encriptadas.
- **Dashboard interactivo** — Panel central con selector de tema (modo claro/oscuro) y navegación limpia.
- **Múltiples simuladores financieros:**
  - Simulador de ahorro
  - Simulador de crédito
  - Simulador de inversión
  - Presupuesto personal
  - Retiro y jubilación
  - Calculadora de deuda
- **Diagnóstico financiero** — Evaluación personalizada con resultados y recomendaciones automáticas.
- **Chatbot con IA (Mercy IA)** — Asistente conversacional impulsado por la API de **Groq** para dudas financieras.
- **Test de conocimientos** — Cuestionario interactivo con temporizador, puntuación y **ranking global de usuarios**.
- **Sección de SOFIPOs** — Comparativa en tiempo real de tasas, plazos y niveles de capitalización (NICAP).
- **Panel administrativo** — Gestión total de SOFIPOs, usuarios y logs de actividad del sistema.

---

## Guía de instalación

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:

| Herramienta | Versión mínima | Enlace |
|---|---|---|
| Python | 3.10 o superior | [python.org](https://www.python.org/downloads/) |
| Git | Cualquier versión reciente | [git-scm.com](https://git-scm.com/downloads/) |

---

### Instalación rápida

**1. Clona el repositorio e ingresa a la carpeta**

```sh
git clone [URL-DE-TU-NUEVO-REPO]
cd Mercy
```

**2. Crea y activa el entorno virtual**

```sh
python -m venv .venv
# En Windows:
.venv\Scripts\activate
# En Linux/Mac:
source .venv/bin/activate
```

**3. Instala las dependencias**

```sh
pip install -r requirements.txt
```

**4. Configura el entorno**

Crea un archivo `.env` en la raíz con lo siguiente:
```env
FLASK_SECRET_KEY=tu_clave_secreta
DATABASE_URL=sqlite:///mercy.db
GROQ_API_KEY=tu_api_key_de_groq
```

**5. Inicializa la base de datos**

Este comando creará las tablas y poblará las preguntas, SOFIPOs y el glosario automáticamente:
```sh
python semilla.py
```

**6. Ejecuta la aplicación**

```sh
python app.py
```

---

## Estructura del proyecto

```
mercy/
├── app.py                  # servidor principal Flask y rutas
├── semilla.py              # script de inicialización y poblado (seed)
├── requirements.txt        # dependencias de Python
├── .env                    # variables de entorno (no incluido en git)
├── .gitignore              # exclusiones de git
├── templates/              # archivos HTML base
├── css/                    # hojas de estilo (dashboard, simuladores, etc)
├── js/                     # lógica de cliente (chatbot, test, ranking)
└── dashboard.html          # dashboard principal del usuario
```

---

## Licencia

Este proyecto está bajo la licencia MIT.