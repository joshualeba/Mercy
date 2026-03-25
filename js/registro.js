/* ===============================================
   SECCIÓN: ELEMENTOS GLOBALES Y LOADER
   =============================================== */
const loaderP = document.querySelector('.loader_p');
const bgVideo = document.querySelector('.bg-video');
const logoBankario = document.querySelector('.logo-bankario');

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    if (loaderP) {
        loaderP.style.display = 'none';
    }
});

/* ===============================================
   SECCIÓN: VIDEO Y NAVEGACIÓN
   =============================================== */
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && bgVideo && bgVideo.paused) {
        bgVideo.play().catch((e) => {
            console.warn('no se pudo reproducir el video automáticamente:', e);
        });
    }
});

if (logoBankario) {
    logoBankario.addEventListener('click', function () {
        window.location.href = 'index.html';
    });
}

/* ===============================================
   SECCIÓN: VALIDACIÓN DE CONTRASEÑA
   =============================================== */
function togglePasswordVisibility(inputId) {
    var passwordField = document.getElementById(inputId);
    var eyeIcon = document.getElementById('eye-icon-' + inputId);

    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
}

function mostrarRequisitos() {
    const requisitos = document.getElementById("password-requisitos");
    if (requisitos) {
        requisitos.style.display = "block";
    }
}

function ocultarRequisitos() {
    const requisitos = document.getElementById("password-requisitos");
    if (requisitos) {
        requisitos.style.display = "none";
    }
}

function validarRequisitos(password) {
    const mayuscula = /[A-Z]/.test(password);
    const especial = /[^A-Za-z0-9]/.test(password);
    const minimo = password.length >= 8;
    const maximo = password.length <= 25;

    document.getElementById("regla-mayuscula").textContent = (mayuscula ? "✅" : "❌") + " una mayúscula";
    document.getElementById("regla-especial").textContent = (especial ? "✅" : "❌") + " un carácter especial";
    document.getElementById("regla-minimo").textContent = (minimo ? "✅" : "❌") + " 8 caracteres";
    document.getElementById("regla-maximo").textContent = (maximo ? "✅" : "❌") + " menos de 25 caracteres";

    return mayuscula && especial && minimo && maximo;
}

function checkPasswords() {
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm-password").value;
    const message = document.getElementById("password-message");

    validarRequisitos(password);

    if (password.length > 0 && confirm.length > 0) {
        if (password !== confirm) {
            message.textContent = "Las contraseñas no coinciden.";
        } else {
            message.textContent = "";
        }
    } else {
        message.textContent = "";
    }
}

document.getElementById("password").addEventListener("input", checkPasswords);
document.getElementById("confirm-password").addEventListener("input", checkPasswords);

/* ===============================================
   SECCIÓN: MODAL DE ALERTA GENÉRICO
   =============================================== */
// Elementos del modal glassmorphism premium
const customAlertOverlay = document.getElementById('customAlertOverlay');
const customAlertBox = document.getElementById('customAlertBox');
const customAlertTitle = document.getElementById('customAlertTitle');
const customAlertText = document.getElementById('customAlertText');
const alertIcon = document.getElementById('alertIcon');
const closeAlertBtn = document.getElementById('closeAlertBtn');
const okAlertBtn = document.getElementById('custom-alert-ok-btn');

function showGlassmorphismAlert(message, type = 'error', title = null) {
    if (customAlertText) customAlertText.textContent = message;
    
    if (type === 'success') {
        if (customAlertBox) customAlertBox.className = 'custom-alert-box success-variant';
        if (customAlertTitle) customAlertTitle.textContent = title || '¡Registro exitoso!';
        if (alertIcon) alertIcon.className = 'fas fa-check-circle';
    } else {
        if (customAlertBox) customAlertBox.className = 'custom-alert-box error-variant';
        if (customAlertTitle) customAlertTitle.textContent = title || 'Aviso del sistema';
        if (alertIcon) alertIcon.className = 'fas fa-exclamation-triangle';
    }
    
    if (customAlertOverlay) {
        customAlertOverlay.classList.add('show');
        document.body.classList.add('blur-active');
    }
}

function showAlert(message) {
    showGlassmorphismAlert(message, 'error', 'Error en el formulario');
}

// Exponer globalmente para que el script en HTML pueda usarlo
window.showGlassmorphismError = showAlert;


function hideAlert() {
    if (customAlertOverlay) {
        customAlertOverlay.classList.remove('show');
        document.body.classList.remove('blur-active');
    }
}

if (okAlertBtn) okAlertBtn.addEventListener('click', hideAlert);
if (closeAlertBtn) closeAlertBtn.addEventListener('click', hideAlert);

if (customAlertOverlay) {
    customAlertOverlay.addEventListener('click', (event) => {
        if (event.target === customAlertOverlay) {
            hideAlert();
        }
    });
}

/* ===============================================
   SECCIÓN: MODAL DE TÉRMINOS Y CONDICIONES
   =============================================== */
const termsLink = document.getElementById('termsLink');
const termsModalOverlay = document.getElementById('termsModalOverlay');
const closeTermsBtn = document.getElementById('closeTermsBtn');
const acceptTermsBtn = document.getElementById('acceptTermsBtn');

function showTermsModal(event) {
    event.preventDefault();
    if (termsModalOverlay) {
        termsModalOverlay.classList.add('show');
        document.body.classList.add('blur-active');
    }
}

function hideTermsModal() {
    if (termsModalOverlay) {
        termsModalOverlay.classList.remove('show');
        document.body.classList.remove('blur-active');
    }
}

if (termsLink) {
    termsLink.addEventListener('click', showTermsModal);
}
if (closeTermsBtn) {
    closeTermsBtn.addEventListener('click', hideTermsModal);
}
if (acceptTermsBtn) {
    acceptTermsBtn.addEventListener('click', hideTermsModal);
}
if (termsModalOverlay) {
    termsModalOverlay.addEventListener('click', (event) => {
        if (event.target === termsModalOverlay) {
            hideTermsModal();
        }
    });
}

/* ===============================================
   SECCIÓN: LÓGICA DE ENVÍO DE FORMULARIO
   =============================================== */
document.getElementById('registroForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombresInput = this.querySelector('input[name="nombres"]');
    const apellidosInput = this.querySelector('input[name="apellidos"]');
    const correoInput = document.getElementById('correo');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // T&C se acepta implícitamente al enviar


    const terminosCheckbox = this.querySelector('input[type="checkbox"]');

    const nombres = nombresInput.value.trim();
    const apellidos = apellidosInput.value.trim();
    const correo = correoInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    const correoValidoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!nombres) {
        showAlert('Por favor, ingresa tu nombre.');
        nombresInput.focus();
        return;
    }
    if (nombres.length < 2 || nombres.length > 30 || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombres)) {
        showAlert('El nombre debe contener solo letras y espacios (entre 2 y 30 caracteres).');
        nombresInput.focus();
        return;
    }
    if (!apellidos) {
        showAlert('Por favor, ingresa tus apellidos.');
        apellidosInput.focus();
        return;
    }
    if (apellidos.length < 2 || apellidos.length > 30 || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(apellidos)) {
        showAlert('Los apellidos deben contener solo letras y espacios (entre 2 y 30 caracteres).');
        apellidosInput.focus();
        return;
    }
    if (!correo) {
        showAlert('Por favor, ingresa tu correo electrónico.');
        correoInput.focus();
        return;
    }
    if (!correoValidoRegex.test(correo)) {
        showAlert('Por favor, ingresa un formato de correo electrónico válido.');
        correoInput.focus();
        return;
    }
    if (!password) {
        showAlert('Por favor, ingresa una contraseña.');
        passwordInput.focus();
        return;
    }
    if (!validarRequisitos(password)) {
        showAlert('La contraseña no cumple con todos los requisitos mínimos.');
        passwordInput.focus();
        mostrarRequisitos();
        return;
    }
    if (!confirmPassword) {
        showAlert('Por favor, confirma tu contraseña.');
        confirmPasswordInput.focus();
        return;
    }
    if (password !== confirmPassword) {
        showAlert('Las contraseñas no coinciden. Por favor, revísalas.');
        confirmPasswordInput.focus();
        return;
    }
    if (!terminosCheckbox.checked) {
        showAlert('Es necesario aceptar los Términos y Condiciones para continuar.');
        return;
    }


    loaderP.style.display = 'grid';
    document.body.classList.remove('loaded');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        this.submit();
    }, 500);
});
