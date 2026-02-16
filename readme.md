<p align="center">
  <img src="https://res.cloudinary.com/dpvm2gro2/image/upload/v1769711039/logo_qp8c8w.png" width="200" alt="Mercy Logo">
</p>

<h1 align="center">
  Mercy
</h1>

<p align="center">
<p align="center">
  <strong>Una plataforma web de simulación financiera desarrollada con Flask y SQLite.</strong>
  <br>
  <br>
  <img src="https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python" alt="Python Version">
  <img src="https://img.shields.io/badge/Flask-2.x-000000?style=for-the-badge&logo=flask" alt="Flask Version">
  <img src="https://img.shields.io/badge/Database-SQLite-07405E?style=for-the-badge&logo=sqlite" alt="Database">
</p>

---

## Acerca del proyecto

**Mercy** es una aplicación web educativa e interactiva diseñada para ayudar a los usuarios a mejorar su salud financiera. El sistema permite a los usuarios registrarse, gestionar su perfil y utilizar un conjunto de simuladores para tomar decisiones informadas sobre créditos, ahorros, inversiones y jubilación, todo en un entorno seguro y sin riesgo.

El proyecto está construido con **Flask** en el backend, utiliza **SQLAlchemy** como ORM para la gestión de la base de datos y presenta una interfaz de usuario moderna con **Bootstrap 5** y efectos "Glassmorphism".

### Características principales

* **Sistema de autenticación completo**: Registro, inicio de sesión y cierre de sesión seguro.
* **Gestión de perfiles (CRUD)**: Los usuarios pueden ver, actualizar su información personal (nombre, apellido) y cambiar su contraseña.
* **Dashboard interactivo**: Un panel central para navegar por todas las herramientas y un selector de tema (modo claro/oscuro).
* **Múltiples simuladores financieros**:
    * Simulador de ahorro
    * Simulador de crédito
    * Simulador de inversión
    * Presupuesto personal
    * Retiro/Jubilación
    * Calculadora de deuda
* **Test de conocimientos**: Un cuestionario interactivo con temporizador, puntuación y un ranking de usuarios.
* **Glosario financiero**: Una página dedicada con un buscador para definir términos financieros clave.

---

## Guía de instalación y despliegue

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno de desarrollo local.

### **1. Prerrequisitos**

Asegúrate de tener instalado lo siguiente en tu sistema:
* [Python](https://www.python.org/downloads/) (versión 3.10 o superior)
* [Git](https://git-scm.com/downloads/)

### **2. Pasos de instalación**

1.  **Clona el repositorio**
    Abre tu terminal y ejecuta el siguiente comando para descargar el proyecto:
    ```sh
    git clone https://github.com/joshualeba/bankario-simulaciones.git
    ```
    *(Nota: Reemplaza la URL si tu repositorio está en otra ubicación).*

2.  **Navega al directorio del proyecto**
    ```sh
    cd bankario-simulaciones
    ```

3.  **Crea y activa un entorno virtual**
    Es una buena práctica para aislar las dependencias del proyecto.
    ```sh
    # Crear el entorno virtual
    python -m venv venv

    # Activar el entorno (Windows)
    .\venv\Scripts\activate
    ```
    *(Si estás en macOS/Linux, usa: `source venv/bin/activate`)*

4.  **Crea el archivo `requirements.txt`**
    Crea un archivo llamado `requirements.txt` en la raíz del proyecto y pega el siguiente contenido:
    ```
    Flask
    Flask-SQLAlchemy
    werkzeug
    email_validator
    urllib3
    re
    Authlib
    requests
    ```

5.  **Instala las dependencias de Python**
    ```sh
    pip install -r requirements.txt
    ```

6.  **Inicializa la base de datos**
    Ejecuta el script de semilla para crear las tablas y cargar los datos iniciales:
    ```sh
    python semilla.py
    ```

7.  **Inicia el servidor de desarrollo**
    ```sh
    flask run --debug
    ```

¡Y listo! La aplicación estará corriendo en `http://127.0.0.1:5000`.

### Datos de prueba

El script de la base de datos **no** crea usuarios de prueba. Deberás crear tu primera cuenta usando el formulario de **"Registro"** en la aplicación.

---

## Licencia

Este proyecto está bajo la Licencia MIT.