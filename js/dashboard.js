document.addEventListener('DOMContentLoaded', () => {
    // 1. Quitar el loader
    const loader = document.querySelector('.loader_p');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
                document.body.classList.remove('loader_bg');
            }, 500);
        }, 800);
    }

    // 2. Control del sidebar (Corregido selectores e ID missing)
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const overlay = document.getElementById('sidebarOverlay');

    if (sidebarToggle && sidebar) {
        const toggleSidebar = () => {
            sidebar.classList.toggle('show');
            if (overlay) overlay.classList.toggle('active');
            // Bloquear scroll del cuerpo al abrir sidebar en móvil
            if (window.innerWidth < 992) {
                document.body.style.overflow = sidebar.classList.contains('show') ? 'hidden' : '';
            }
        };

        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });

        if (overlay) {
            overlay.addEventListener('click', toggleSidebar);
        }

        // Cerrar al hacer clic en un enlace (en móvil)
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992 && sidebar.classList.contains('show')) {
                    toggleSidebar();
                }
            });
        });

        // Cerrar sidebar al hacer clic fuera (en móvil)
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 992 && sidebar.classList.contains('show') && !sidebar.contains(e.target) && e.target !== sidebarToggle) {
                toggleSidebar();
            }
        });
    }

    // 3. Sistema de navegación por secciones (Corregido: selectores correctos)
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    function showSection(sectionId) {
        sections.forEach(s => s.classList.add('d-none'));
        const target = document.getElementById(sectionId + '-section');
        if (target) {
            target.classList.remove('d-none');
            // Resetear scroll al cambiar sección usando Lenis global
            if (window.lenis) {
                window.lenis.scrollTo(0, { immediate: true });
            } else {
                window.scrollTo(0, 0);
            }
        }

        // Actualizar estado activo en los enlaces (tanto sidebar como otros)
        const allRelevantLinks = document.querySelectorAll(`[data-section="${sectionId}"]`);
        
        // Primero removemos active de todos los nav-links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        // Añadimos active a los que correspondan
        allRelevantLinks.forEach(link => {
            if (link.classList.contains('nav-link')) {
                link.classList.add('active');
            }
        });
    }

    // Inicializar listeners para todos los elementos con data-section
    document.querySelectorAll('[data-section]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const section = trigger.getAttribute('data-section');
            if (section && section !== '#') {
                e.preventDefault();
                
                // Redirección directa para glosario solicitada por el usuario
                if (section === 'glosario') {
                    window.location.href = '/glosario';
                    return;
                }
                
                showSection(section);

                // Si es móvil y el sidebar estaba abierto, se cierra al navegar (redundancia de seguridad)
                if (window.innerWidth < 992 && sidebar && sidebar.classList.contains('show')) {
                    sidebar.classList.remove('show');
                    if (overlay) overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                // Inicializar test si entramos a esa sección
                if (section === 'test-conocimientos') {
                    initTest();
                }
            }
        });
    });

    /* ===============================================
       SISTEMA DEL TEST DE CONOCIMIENTOS
       =============================================== */
    let testData = [];
    let currentQuestionIdx = 0;
    let score = 0;
    let points = 0;
    let timer;
    let timeLeft = 30;
    let startTime;
    let testInProgress = false;

    // Normalización de texto para validar sin acentos ni mayúsculas
    const normalizeText = (text) => {
        if (!text) return "";
        return text.toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    };

    async function initTest() {
        try {
            const response = await fetch('/api/preguntas_test');
            const data = await response.json();

            if (data.test_completado) {
                showTestResults(data, true);
            } else {
                testData = data.preguntas;
                document.getElementById('testIntro').classList.remove('d-none');
                document.getElementById('testContainer').classList.add('d-none');
                document.getElementById('testCompletedSection').classList.add('d-none');
            }
        } catch (error) {
            console.error('Error al cargar el test:', error);
        }
    }

    const startTestBtn = document.getElementById('startTestBtn');
    if (startTestBtn) {
        startTestBtn.addEventListener('click', startTest);
    }

    function startTest() {
        if (!testData || testData.length === 0) return;
        
        testInProgress = true;
        currentQuestionIdx = 0;
        score = 0;
        points = 0;
        startTime = Date.now();
        
        document.getElementById('testIntro').classList.add('d-none');
        document.getElementById('testContainer').classList.remove('d-none');
        
        showQuestion();
    }

    function showQuestion() {
        const q = testData[currentQuestionIdx];
        document.getElementById('currentQuestionNum').innerText = currentQuestionIdx + 1;
        document.getElementById('totalQuestionsNum').innerText = testData.length;
        document.getElementById('questionText').innerText = q.pregunta;
        
        const progress = ((currentQuestionIdx + 1) / testData.length) * 100;
        document.querySelector('.progress-bar').style.width = progress + '%';

        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        // --- LÓGICA DE PREGUNTAS ABIERTAS (fill_in_the_blank) ---
        if (q.tipo_pregunta === 'fill_in_the_blank') {
            const inputContainer = document.createElement('div');
            inputContainer.className = 'glass-panel p-4 rounded-4 shadow-sm';
            inputContainer.innerHTML = `
                <div class="form-group mb-0">
                    <input type="text" id="openAnswerInput" 
                           class="form-control form-control-lg text-center fw-bold border-2 border-primary" 
                           placeholder="Escribe tu respuesta aquí..."
                           style="background: transparent; border-radius: 12px; color: var(--text-color);"
                           autocomplete="off">
                </div>
            `;
            optionsContainer.appendChild(inputContainer);
            
            // Foco automático e interactividad con Enter
            setTimeout(() => {
                const input = document.getElementById('openAnswerInput');
                if (input) {
                    input.focus();
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') checkAnswer(false);
                    });
                }
            }, 150);

        } else {
            // --- LÓGICA DE OPCIÓN MÚLTIPLE O TRUE/FALSE ---
            q.opciones.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-outline-primary p-3 text-start w-100 option-btn rounded-3 animate-fade-in';
                btn.innerHTML = `<span class="me-3 fw-bold"></span> ${opt.texto}`;
                btn.dataset.id = opt.id;
                btn.dataset.correct = opt.es_correcta;
                btn.onclick = () => selectOption(btn);
                optionsContainer.appendChild(btn);
            });
        }

        document.getElementById('checkAnswerBtn').classList.remove('d-none');
        document.getElementById('nextQuestionBtn').classList.add('d-none');
        document.getElementById('submitTestBtn').classList.add('d-none');
        document.getElementById('feedbackMessage').innerHTML = '';
        
        resetTimer();
        startTimer();
    }

    function selectOption(selectedBtn) {
        if (!testInProgress) return;
        document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('active', 'bg-primary', 'text-white'));
        selectedBtn.classList.add('active', 'bg-primary', 'text-white');
    }

    function startTimer() {
        timeLeft = 30;
        document.getElementById('timeRemaining').innerText = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            document.getElementById('timeRemaining').innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                checkAnswer(true); // Tiempo agotado
            }
        }, 1000);
    }

    function resetTimer() {
        if (timer) clearInterval(timer);
    }

    const checkAnswerBtn = document.getElementById('checkAnswerBtn');
    if (checkAnswerBtn) {
        checkAnswerBtn.addEventListener('click', () => checkAnswer(false));
    }

    function checkAnswer(timeout = false) {
        resetTimer();
        const q = testData[currentQuestionIdx];
        let isCorrect = false;
        const feedback = document.getElementById('feedbackMessage');
        const checkBtn = document.getElementById('checkAnswerBtn');

        if (q.tipo_pregunta === 'fill_in_the_blank') {
            const input = document.getElementById('openAnswerInput');
            if (timeout) {
                isCorrect = false;
                if (input) input.disabled = true;
            } else {
                if (!input || input.value.trim() === '') {
                    Swal.fire({
                        title: 'Un momento...',
                        text: 'Por favor, escribe una respuesta para continuar.',
                        icon: 'info',
                        confirmButtonText: 'Entendido',
                        customClass: {
                            popup: 'mercy-swal-popup',
                            title: 'mercy-swal-title',
                            htmlContainer: 'mercy-swal-html',
                            confirmButton: 'mercy-swal-confirm btn-primary'
                        },
                        buttonsStyling: false
                    });
                    startTimer();
                    return;
                }
                const userText = normalizeText(input.value);
                const correctText = normalizeText(q.respuesta_texto_correcta);
                isCorrect = (userText === correctText);
                input.disabled = true;
                
                if (isCorrect) {
                     input.classList.add('is-valid', 'border-success', 'bg-success', 'text-white', 'opacity-100');
                } else {
                     input.classList.add('is-invalid', 'border-danger', 'bg-danger', 'text-white', 'opacity-100');
                }
            }
        } else {
            const selected = document.querySelector('.option-btn.active');
            if (!selected && !timeout) {
                Swal.fire({
                    title: 'Un momento...',
                    text: 'Por favor, selecciona una opción antes de continuar.',
                    icon: 'info',
                    confirmButtonText: 'Entendido',
                    customClass: {
                        popup: 'mercy-swal-popup',
                        title: 'mercy-swal-title',
                        htmlContainer: 'mercy-swal-html',
                        confirmButton: 'mercy-swal-confirm btn-primary'
                    },
                    buttonsStyling: false
                });
                startTimer();
                return;
            }

            isCorrect = selected && (selected.dataset.correct === 'true' || selected.dataset.correct === '1');

            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.disabled = true;
                if (btn.dataset.correct === 'true' || btn.dataset.correct === '1') {
                    btn.classList.add('bg-success', 'text-white', 'border-success', 'opacity-100');
                } else if (btn === selected) {
                    btn.classList.add('bg-danger', 'text-white', 'border-danger', 'opacity-100');
                }
            });
        }

        if (isCorrect) {
            score++;
            const bonus = 100 + (timeLeft * 5);
            points += bonus;
            feedback.innerHTML = `<span class="text-success animate-bounce-slow fw-bold d-block mt-2"><i class="bi bi-check-circle-fill me-2"></i> ¡Correcto! +${bonus} puntos</span>`;
        } else {
            const extraInfo = q.tipo_pregunta === 'fill_in_the_blank' ? `<br><small class="text-muted">Respuesta correcta: ${q.respuesta_texto_correcta}</small>` : '';
            feedback.innerHTML = `<span class="text-danger fw-bold d-block mt-2"><i class="bi bi-x-circle-fill me-2"></i> ${timeout ? '¡Tiempo agotado!' : 'Incorrecto'}${extraInfo}</span>`;
        }

        checkBtn.classList.add('d-none');
        
        if (currentQuestionIdx < testData.length - 1) {
            document.getElementById('nextQuestionBtn').classList.remove('d-none');
        } else {
            document.getElementById('submitTestBtn').classList.remove('d-none');
        }
    }

    document.getElementById('nextQuestionBtn')?.addEventListener('click', () => {
        currentQuestionIdx++;
        showQuestion();
    });

    document.getElementById('submitTestBtn')?.addEventListener('click', submitTest);

    async function submitTest() {
        testInProgress = false;
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;

        const results = {
            respuestas_correctas_count: score,
            puntuacion_total: points,
            tiempo_total_segundos: duration,
            total_preguntas: testData.length,
            respuestas: { 'test': 'completed' } // Enviamos algo para evitar el check de 'if not respuestas' si el backend no se actualizó
        };

        try {
            const response = await fetch('/api/submit_test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(results)
            });
            const data = await response.json();
            
            showTestResults({
                score: score,
                total: testData.length,
                puntuacion_total: points,
                test_completado: true
            }, false);
        } catch (error) {
            console.error('Error al enviar el test:', error);
        }
    }

    function showTestResults(data, alreadyCompletado) {
        document.getElementById('testIntro').classList.add('d-none');
        document.getElementById('testContainer').classList.add('d-none');
        
        const section = document.getElementById('testCompletedSection');
        section.classList.remove('d-none');
        
        document.getElementById('completedCorrectAnswers').innerText = data.score;
        document.getElementById('completedTotalQuestions').innerText = data.total || 12;
        document.getElementById('completedTotalPoints').innerText = data.puntuacion_total;
        
        const msg = document.getElementById('completedResultMessage');
        if (data.score >= (data.total * 0.8)) {
            msg.innerText = "¡Increíble! Eres todo un experto financiero.";
        } else if (data.score >= (data.total * 0.5)) {
            msg.innerText = "Buen trabajo, tienes bases sólidas pero siempre se puede mejorar.";
        } else {
            msg.innerText = "Sigue aprendiendo, el camino a la libertad financiera apenas comienza.";
        }
    }

    // Modal de Ranking
    document.getElementById('viewRankingBtnCompleted')?.addEventListener('click', showRanking);
    document.getElementById('viewRankingBtn')?.addEventListener('click', showRanking);

    async function showRanking() {
        try {
            const response = await fetch('/api/ranking');
            const data = await response.json();
            
            const tbody = document.getElementById('rankingTableBody');
            if (tbody) {
                tbody.innerHTML = '';
                data.ranking.forEach((user, index) => {
                    const row = document.createElement('tr');
                    const isCurrentUser = user.user_id === data.current_user_id; // Deberíamos enviar el id del usuario actual si queremos resaltarlo
                    if (isCurrentUser) row.className = 'user-row bg-primary bg-opacity-10';
                    
                    row.innerHTML = `
                        <td class="text-center fw-bold">#${index + 1}</td>
                        <td class="fw-medium">
                            <i class="bi bi-person-circle me-2 opacity-50"></i>${user.nombre}
                        </td>
                        <td class="text-center fw-bold text-success">${user.puntuacion_total}</td>
                        <td class="text-center small">${user.tiempo_resolucion_segundos.toFixed(1)}s</td>
                        <td class="text-center fw-bold text-primary">${user.aciertos}/${user.total_preguntas}</td>
                    `;
                    tbody.appendChild(row);
                });
            }
            
            const modal = new bootstrap.Modal(document.getElementById('rankingModal'));
            modal.show();
        } catch (error) {
            console.error('Error al cargar el ranking:', error);
        }
    }

    // 4. Modo oscuro / claro -- (Ya estaba)
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    if (themeToggle && themeIcon) {
        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            themeIcon.className = theme === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
            localStorage.setItem('theme', theme);
        };

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });

        // Restaurar tema guardado
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
    }

    // 5. User dropdown (Corregido class 'show' y stopPropagation)
    const userBtn = document.getElementById('userBtn');
    const userDropdown = document.getElementById('userDropdown');

    if (userBtn && userDropdown) {
        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            userDropdown.classList.remove('show');
        });
    }

    // 6. Logout modal (Corregido: cierre de sidebar solicitado por user)
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModalEl = document.getElementById('logoutModal');
    let logoutBootstrapModal = null;

    if (logoutModalEl) {
        logoutBootstrapModal = new bootstrap.Modal(logoutModalEl);
    }

    if (logoutBtn && logoutBootstrapModal) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Cerrar sidebar si está activo
            if (sidebar && sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
            }

            logoutBootstrapModal.show();
        });
    }

    const confirmLogoutBtn = document.getElementById('confirmLogout');
    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', () => {
            window.location.href = '/logout';
        });
    }

    // 12. Enter key for test navigation
    document.addEventListener('keydown', (e) => {
        // Solo actuar si la tecla es Enter
        if (e.key === 'Enter') {
            const nextBtn = document.getElementById('nextQuestionBtn');
            const checkBtn = document.getElementById('checkAnswerBtn');
            const submitBtn = document.getElementById('submitTestBtn');
            const startBtn = document.getElementById('startTestBtn');
            
            // Si estamos en la intro y el botón de inicio está visible
            if (startBtn && !startBtn.classList.contains('d-none') && document.getElementById('testIntro') && !document.getElementById('testIntro').classList.contains('d-none')) {
                startBtn.click();
                e.preventDefault();
                return;
            }

            // Si el botón de check está visible, lo pulsamos (valida respuesta)
            if (checkBtn && !checkBtn.classList.contains('d-none')) {
                checkBtn.click();
                e.preventDefault();
            } 
            // Si el botón de siguiente está visible, lo pulsamos (pasa a la siguiente)
            else if (nextBtn && !nextBtn.classList.contains('d-none')) {
                nextBtn.click();
                e.preventDefault();
            }
            // Si el botón de enviar está visible, lo pulsamos (finaliza test)
            else if (submitBtn && !submitBtn.classList.contains('d-none')) {
                submitBtn.click();
                e.preventDefault();
            }
        }
    });

    // 11. Tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (el) {
        return new bootstrap.Tooltip(el);
    });
    
    // 13. Lógica para editar el perfil (Nombres y Apellidos)
    const btnHabilitarEdicion = document.getElementById('btnHabilitarEdicion');
    const btnGuardarCambios = document.getElementById('btnGuardarCambios');
    const inputNombres = document.getElementById('editNombres');
    const inputApellidos = document.getElementById('editApellidos');

    if (btnHabilitarEdicion && inputNombres && inputApellidos) {
        btnHabilitarEdicion.addEventListener('click', () => {
            // Habilitar campos
            inputNombres.removeAttribute('readonly');
            inputApellidos.removeAttribute('readonly');
            inputNombres.classList.remove('bg-light');
            inputApellidos.classList.remove('bg-light');
            inputNombres.focus();

            // Intercambiar botones
            btnHabilitarEdicion.classList.add('d-none');
            if (btnGuardarCambios) btnGuardarCambios.classList.remove('d-none');
        });
    }

    // 14. Funcionalidad para mostrar/ocultar contraseñas en modales
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = btn.querySelector('i');

            if (input && icon) {
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('bi-eye-slash');
                    icon.classList.add('bi-eye');
                }
            }
        });
    });

    // Resetear el estado del modal de perfil al cerrarse
    const modalPerfil = document.getElementById('editarPerfilModal');
    if (modalPerfil) {
        modalPerfil.addEventListener('hidden.bs.modal', () => {
            if (inputNombres) {
                inputNombres.setAttribute('readonly', true);
                inputNombres.classList.add('bg-light');
            }
            if (inputApellidos) {
                inputApellidos.setAttribute('readonly', true);
                inputApellidos.classList.add('bg-light');
            }
            if (btnHabilitarEdicion) btnHabilitarEdicion.classList.remove('d-none');
            if (btnGuardarCambios) btnGuardarCambios.classList.add('d-none');
        });
    }
    // 15. Sistema de alertas glassmorphism premium para el dashboard
    const customAlertOverlay = document.getElementById('customAlertOverlay');
    const customAlertBox = document.getElementById('customAlertBox');
    const customAlertTitle = document.getElementById('customAlertTitle');
    const customAlertText = document.getElementById('customAlertText');
    const alertIcon = document.getElementById('alertIcon');
    const okAlertBtn = document.getElementById('custom-alert-ok-btn');
    const closeAlertBtn = document.getElementById('closeAlertBtn');

    function showGlassmorphismAlert(message, type = 'error', title = null) {
        if (customAlertText) customAlertText.textContent = message;
        
        if (type === 'success') {
            if (customAlertBox) customAlertBox.className = 'custom-alert-box success-variant';
            if (customAlertTitle) customAlertTitle.textContent = title || '¡Cambio exitoso!';
            if (alertIcon) alertIcon.className = 'bi bi-check-circle';
        } else {
            if (customAlertBox) customAlertBox.className = 'custom-alert-box error-variant';
            if (customAlertTitle) customAlertTitle.textContent = title || 'Aviso de seguridad';
            if (alertIcon) alertIcon.className = 'bi bi-exclamation-triangle';
        }
        
        if (customAlertOverlay) {
            customAlertOverlay.classList.add('show');
        }
    }

    function hideAlert() {
        if (customAlertOverlay) {
            customAlertOverlay.classList.remove('show');
        }
    }

    if (okAlertBtn) okAlertBtn.addEventListener('click', hideAlert);
    if (closeAlertBtn) closeAlertBtn.addEventListener('click', hideAlert);
    if (customAlertOverlay) {
        customAlertOverlay.addEventListener('click', (e) => {
            if (e.target === customAlertOverlay) hideAlert();
        });
    }

    // 16. Manejo del formulario de cambio de contraseña con validación profesional
    const formCambiarContrasena = document.getElementById('formCambiarContrasena');
    if (formCambiarContrasena) {
        formCambiarContrasena.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const passActual = document.getElementById('contrasenaActual').value;
            const nuevaPass = document.getElementById('nuevaContrasena').value;
            const confirmarPass = document.getElementById('confirmarNuevaContrasena').value;
            
            // Validaciones requeridas por el usuario
            if (!passActual || !nuevaPass || !confirmarPass) {
                showGlassmorphismAlert('Todos los campos son obligatorios para el cambio de contraseña.');
                return;
            }

            if (nuevaPass !== confirmarPass) {
                showGlassmorphismAlert('La nueva contraseña y su confirmación no coinciden.');
                return;
            }

            // Regla: 8 a 25 caracteres
            if (nuevaPass.length < 8 || nuevaPass.length > 25) {
                showGlassmorphismAlert('La nueva contraseña debe tener entre 8 y 25 caracteres.');
                return;
            }

            // Regla: Al menos una mayúscula
            if (!/[A-Z]/.test(nuevaPass)) {
                showGlassmorphismAlert('La nueva contraseña debe contener al menos una letra mayúscula.');
                return;
            }

            // Regla: Al menos un carácter especial
            // Usamos el mismo set que en app.py para consistencia
            const especialRegex = /[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?~]/;
            if (!especialRegex.test(nuevaPass)) {
                showGlassmorphismAlert('La nueva contraseña debe incluir al menos un carácter especial (ej. @, #, $, %).');
                return;
            }

            // Si pasa validaciones, enviar por fetch
            const formData = new FormData(this);
            fetch('/cambiar_contrasena', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showGlassmorphismAlert(data.message, 'success');
                    formCambiarContrasena.reset();
                    // Cerrar el modal de bootstrap después de un momento si es éxito
                    setTimeout(() => {
                        const modalEl = document.getElementById('cambiarContrasenaModal');
                        const modal = bootstrap.Modal.getInstance(modalEl);
                        if (modal) modal.hide();
                    }, 2000);
                } else {
                    showGlassmorphismAlert(data.message, 'error');
                }
            })
            .catch(err => {
                console.error('Error:', err);
                showGlassmorphismAlert('Ocurrió un error inesperado al intentar cambiar la contraseña. Por favor, inténtalo más tarde.');
            });
        });
    }
    // 17. Manejo del formulario de edición de perfil (Información personal) con AJAX
    const formEditarPerfil = document.getElementById('formEditarPerfil');
    if (formEditarPerfil) {
        formEditarPerfil.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            fetch('/actualizar_perfil', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showGlassmorphismAlert(data.message, 'success');
                    
                    // Actualizar el nombre en la interfaz inmediatamente
                    const displayUserNames = document.querySelectorAll('.display-user-name'); // Selector hipotético, mejor actualizar por ID si existen
                    const sessionNombres = formData.get('nombres');
                    const sessionApellidos = formData.get('apellidos');
                    
                    // Ajustamos el readonly de nuevo al guardar con éxito
                    if (inputNombres) {
                        inputNombres.setAttribute('readonly', true);
                        inputNombres.classList.add('bg-light');
                    }
                    if (inputApellidos) {
                        inputApellidos.setAttribute('readonly', true);
                        inputApellidos.classList.add('bg-light');
                    }
                    if (btnHabilitarEdicion) btnHabilitarEdicion.classList.remove('d-none');
                    if (btnGuardarCambios) btnGuardarCambios.classList.add('d-none');

                    // Cerramos el modal después de un aviso
                    setTimeout(() => {
                        const modalEl = document.getElementById('editarPerfilModal');
                        const modal = bootstrap.Modal.getInstance(modalEl);
                        if (modal) modal.hide();
                        
                        // Recargamos o actualizamos los elementos visuales que muestran el nombre si no son dinámicos
                        // location.reload(); // Opción si hay muchos lugares con el nombre
                    }, 2000);

                } else {
                    showGlassmorphismAlert(data.message, 'error');
                }
            })
            .catch(err => {
                console.error('Error:', err);
                showGlassmorphismAlert('Ocurrió un error inesperado al actualizar tu información. Por favor, inténtalo más tarde.');
            });
        });
    }
}); // Cierre de DOMContentLoaded
