document.addEventListener('DOMContentLoaded', () => {

    // Sección: Loader
    const loader = document.querySelector('.loader_p');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.classList.remove('loader_bg');
            }, 500);
        }, 1000);
    }

    // Sección: Toggle para modo oscuro
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;

    if (themeToggle && themeIcon && htmlElement) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            htmlElement.setAttribute('data-theme', savedTheme);
            if (savedTheme === 'dark') {
                themeIcon.classList.remove('bi-sun-fill');
                themeIcon.classList.add('bi-moon-fill');
            } else {
                themeIcon.classList.remove('bi-moon-fill');
                themeIcon.classList.add('bi-sun-fill');
            }
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            themeIcon.classList.add('bi-sun-fill');
        }

        themeToggle.addEventListener('click', () => {
            if (htmlElement.getAttribute('data-theme') === 'dark') {
                htmlElement.setAttribute('data-theme', 'light');
                themeIcon.classList.remove('bi-moon-fill');
                themeIcon.classList.add('bi-sun-fill');
            } else {
                htmlElement.setAttribute('data-theme', 'dark');
                themeIcon.classList.remove('bi-sun-fill');
                themeIcon.classList.add('bi-moon-fill');
            }
            localStorage.setItem('theme', htmlElement.getAttribute('data-theme'));
        });
    }

    // Sección: Lógica para dropdowns y efecto borroso
    const userBtn = document.getElementById('userBtn');
    const userDropdown = document.getElementById('userDropdown');
    const mainContent = document.querySelector('.main-content');
    const sidebar = document.getElementById('sidebar');
    const body = document.body;

    function applyBlurEffect(isActive) {
        if (mainContent) {
            if (isActive) {
                mainContent.classList.add('blurred-content');
                body.classList.add('overlay-active');
            } else {
                mainContent.classList.remove('blurred-content');
                body.classList.remove('overlay-active');
            }
        }
    }

    function toggleModalBlurEffect(show) {
        if (mainContent) {
            if (show) {
                mainContent.classList.add('blurred-content');
                body.classList.add('overlay-active');
            } else {
                mainContent.classList.remove('blurred-content');
                body.classList.remove('overlay-active');
            }
        }
    }

    function toggleDropdown(button, dropdown) {
        const isShown = dropdown.classList.contains('show');
        dropdown.classList.toggle('show');
        button.setAttribute('aria-expanded', !isShown);

        const anyDropdownOpen = userDropdown.classList.contains('show');
        applyBlurEffect(anyDropdownOpen);

        if (anyDropdownOpen && sidebar.classList.contains('show') && window.innerWidth < 992) {
            sidebar.classList.remove('show');
            body.classList.remove('sidebar-open');
        }
    }

    if (userBtn && userDropdown) {
        userBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleDropdown(userBtn, userDropdown);
        });
    }

    document.addEventListener('click', (event) => {
        let dropdownOpen = false;
        if (userDropdown && userDropdown.classList.contains('show')) {
            if (!userDropdown.contains(event.target) && !userBtn.contains(event.target)) {
                userDropdown.classList.remove('show');
                userBtn.setAttribute('aria-expanded', 'false');
            } else {
                dropdownOpen = true;
            }
        }

        if (!dropdownOpen) {
            applyBlurEffect(false);
        }

        if (sidebar.classList.contains('show') && window.innerWidth < 992) {
            if (!sidebar.contains(event.target) && !document.getElementById('sidebarToggle').contains(event.target)) {
                sidebar.classList.remove('show');
                body.classList.remove('sidebar-open');
            }
        }
    });

    // Sección: Lógica del sidebar responsivo
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
            body.classList.toggle('sidebar-open');
            userDropdown.classList.remove('show');
            userBtn.setAttribute('aria-expanded', 'false');
            applyBlurEffect(false);
        });
    }

    // NEW: Close sidebar on mobile when any link is clicked
    const allSidebarLinks = document.querySelectorAll('.sidebar a');
    allSidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992 && sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
                body.classList.remove('sidebar-open');
                applyBlurEffect(false);
            }
        });
    });

    // Sección: Lógica de navegación de secciones
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const allSectionLinks = document.querySelectorAll('[data-section]');
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');

    // Mapa de IDs internos → rutas en español para la URL
    const seccionesDashboard = {
        'inicio': '/inicio',
        'simulaciones': '/simulaciones',
        'test-conocimientos': '/test-de-conocimientos',
        'glosario': '/glosario',
        'perfil': '/mi-perfil'
    };

    function showSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.add('d-none');
        });
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.remove('d-none');
        }

        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        // Actualizar la URL con la ruta en español
        const rutaLimpia = seccionesDashboard[sectionId] || '/dashboard/' + sectionId;
        history.replaceState(null, '', rutaLimpia);

        if (sectionId === 'test-conocimientos') {
            loadTest();
        }
    }


    allSectionLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            const sectionId = this.getAttribute('data-section');
            if (sectionId === 'glosario') {
                event.preventDefault();
                window.location.href = "/glosario";
                return;
            }
            event.preventDefault();
            showSection(sectionId);
        });
    });

    const miPerfilBtn = document.getElementById('miPerfilBtn');
    if (miPerfilBtn) {
        miPerfilBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const sectionId = miPerfilBtn.getAttribute('data-section');
            showSection(sectionId);
            userDropdown.classList.remove('show');
            userBtn.setAttribute('aria-expanded', 'false');
            applyBlurEffect(false);
            if (window.innerWidth < 992) {
                sidebar.classList.remove('show');
                body.classList.remove('sidebar-open');
            }
        });
    }

    showSection('inicio');

    // Sección: Lógica de modales (Cerrar sesión y perfil)
    const logoutBtn = document.getElementById('logoutBtn'); // Botón escritorio
    const logoutBtnMobile = document.getElementById('logoutBtnMobile'); // Botón móvil (NUEVO)
    const confirmLogoutBtn = document.getElementById('confirmLogout');
    let logoutModal;

    if (document.getElementById('logoutModal')) {
        logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
        document.getElementById('logoutModal').addEventListener('show.bs.modal', () => {
            toggleModalBlurEffect(true);
        });
        document.getElementById('logoutModal').addEventListener('hide.bs.modal', () => {
            toggleModalBlurEffect(false);
        });
    }

    // Función para abrir el modal de logout
    function triggerLogout() {
        // Cerrar dropdowns y efectos si están abiertos
        if (userDropdown) {
            userDropdown.classList.remove('show');
            userBtn.setAttribute('aria-expanded', 'false');
        }
        applyBlurEffect(false);

        // Cerrar sidebar si está abierto en móvil
        if (sidebar.classList.contains('show') && window.innerWidth < 992) {
            sidebar.classList.remove('show');
            body.classList.remove('sidebar-open');
        }

        if (logoutModal) {
            logoutModal.show();
        }
    }

    // Event listener para escritorio
    if (logoutBtn) {
        logoutBtn.addEventListener('click', triggerLogout);
    }

    // Event listener para móvil (NUEVO)
    if (logoutBtnMobile) {
        logoutBtnMobile.addEventListener('click', (e) => {
            e.preventDefault(); // Evitar que el enlace recargue la página
            triggerLogout();
        });
    }

    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', () => {
            window.location.href = "/logout";
        });
    }

    const editarPerfilModalElement = document.getElementById('editarPerfilModal');
    const cambiarContrasenaModalElement = document.getElementById('cambiarContrasenaModal');

    if (editarPerfilModalElement) {
        editarPerfilModalElement.addEventListener('show.bs.modal', () => {
            toggleModalBlurEffect(true);
        });
        editarPerfilModalElement.addEventListener('hide.bs.modal', () => {
            toggleModalBlurEffect(false);
        });
    }

    if (cambiarContrasenaModalElement) {
        cambiarContrasenaModalElement.addEventListener('show.bs.modal', () => {
            toggleModalBlurEffect(true);
        });
        cambiarContrasenaModalElement.addEventListener('hide.bs.modal', () => {
            toggleModalBlurEffect(false);
        });
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992) {
            sidebar.classList.remove('show');
            body.classList.remove('sidebar-open');
        }
    });

    // Sección: Lógica de formulario (Contraseña y perfil)
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.dataset.target;
            const passwordInput = document.getElementById(targetId);
            const icon = this.querySelector('i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    });

    const formCambiarContrasena = document.getElementById('formCambiarContrasena');
    if (formCambiarContrasena) {
        formCambiarContrasena.addEventListener('submit', async function (event) {
            event.preventDefault();

            const nuevaContrasena = document.getElementById('nuevaContrasena').value;
            const confirmarNuevaContrasena = document.getElementById('confirmarNuevaContrasena').value;
            const nuevaContrasenaFeedback = document.getElementById('nuevaContrasenaFeedback');
            const confirmarNuevaContrasenaFeedback = document.getElementById('confirmarNuevaContrasenaFeedback');

            let isValid = true;

            const hasUpperCase = /[A-Z]/.test(nuevaContrasena);
            const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(nuevaContrasena);
            const isLengthValid = nuevaContrasena.length >= 8 && nuevaContrasena.length <= 25;

            nuevaContrasenaFeedback.textContent = '';
            if (!hasUpperCase) {
                nuevaContrasenaFeedback.textContent = 'La contraseña debe contener al menos una letra mayúscula.';
                isValid = false;
            } else if (!hasSpecialChar) {
                nuevaContrasenaFeedback.textContent = 'La contraseña debe contener al menos un carácter especial.';
                isValid = false;
            } else if (!isLengthValid) {
                nuevaContrasenaFeedback.textContent = 'La contraseña debe tener entre 8 y 25 caracteres.';
                isValid = false;
            }

            confirmarNuevaContrasenaFeedback.textContent = '';
            if (nuevaContrasena !== confirmarNuevaContrasena) {
                confirmarNuevaContrasenaFeedback.textContent = 'Las contraseñas no coinciden.';
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            const formData = new FormData(this);
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                const successModal = new bootstrap.Modal(document.getElementById('successMessageModal'));
                const successModalBody = document.getElementById('successMessageModalBody');
                successModalBody.textContent = 'Contraseña cambiada con éxito.';
                successModal.show();

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                const errorModal = new bootstrap.Modal(document.getElementById('errorMessageModal'));
                const errorMessageModalBody = document.getElementById('errorMessageModalBody');
                errorMessageModalBody.textContent = result.message || 'Ocurrió un error al cambiar la contraseña.';
                errorModal.show();
            }
        });
    }

    if (!document.getElementById('successMessageModal')) {
        const successModalHtml = `
            <div class="modal fade" id="successMessageModal" tabindex="-1" aria-labelledby="successMessageModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content glass-modal">
                        <div class="modal-header border-0">
                            <h5 class="modal-title" id="successMessageModalLabel">Éxito</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div class="modal-body">
                            <p id="successMessageModalBody"></p>
                        </div>
                        <div class="modal-footer border-0">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Aceptar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', successModalHtml);
    }

    if (!document.getElementById('errorMessageModal')) {
        const errorModalHtml = `
            <div class="modal fade" id="errorMessageModal" tabindex="-1" aria-labelledby="errorMessageModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content glass-modal">
                        <div class="modal-header border-0">
                            <h5 class="modal-title" id="errorMessageModalLabel">Error</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div class="modal-body">
                            <p id="errorMessageModalBody"></p>
                        </div>
                        <div class="modal-footer border-0">
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorModalHtml);
    }

    // Sección: Lógica del test de conocimientos financieros
    let questions = [];
    let currentQuestionIndex = 0;
    let userAnswers = {};
    let correctAnswersCount = 0;
    let totalPoints = 0;

    let testStartTime = 0;
    let questionStartTime = 0;
    let timerInterval;

    const MAX_TIME_PER_QUESTION = 30;
    const BASE_POINTS_PER_CORRECT_ANSWER = 5000;
    const TIME_BONUS_PER_SECOND = 100;

    const questionTextElement = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const checkAnswerBtn = document.getElementById('checkAnswerBtn');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const submitTestBtn = document.getElementById('submitTestBtn');
    const progressBar = document.querySelector('.progress-bar');
    const testContainer = document.getElementById('testContainer');
    const testIntro = document.getElementById('testIntro');
    const testHeader = document.getElementById('testHeader');
    const startTestBtn = document.getElementById('startTestBtn');
    const testResult = document.getElementById('testResult');
    const testCompletedSection = document.getElementById('testCompletedSection');

    let isTestInProgress = false;

    const scoreDisplay = document.getElementById('scoreDisplay');
    const totalQuestionsDisplay = document.getElementById('totalQuestionsDisplay');
    const totalPointsDisplay = document.getElementById('totalPointsDisplay');
    const resultMessage = document.getElementById('resultMessage');

    const completedCorrectAnswers = document.getElementById('completedCorrectAnswers');
    const completedTotalQuestions = document.getElementById('completedTotalQuestions');
    const completedTotalPoints = document.getElementById('completedTotalPoints');
    const completedResultMessage = document.getElementById('completedResultMessage');

    const timerDisplay = document.getElementById('timerDisplay');
    const timeRemainingSpan = document.getElementById('timeRemaining');

    const testResultModal = new bootstrap.Modal(document.getElementById('testResultModal'));
    const finalScoreModal = document.getElementById('finalScoreModal');
    const totalQuestionsModal = document.getElementById('totalQuestionsModal');
    const finalTotalPointsModal = document.getElementById('finalTotalPointsModal');
    const resultMessageModal = document.getElementById('resultMessageModal');

    const viewRankingBtn = document.getElementById('viewRankingBtn');
    const viewRankingBtnCompleted = document.getElementById('viewRankingBtnCompleted');
    const viewRankingBtnModal = document.getElementById('viewRankingBtnModal');

    const rankingModalElement = document.getElementById('rankingModal');
    const rankingModal = new bootstrap.Modal(rankingModalElement);
    const rankingTableBody = document.getElementById('rankingTableBody');
    const userRankingInfo = document.getElementById('userRankingInfo');
    const userPositionDisplay = document.getElementById('userPositionDisplay');
    const userScoreRanking = document.getElementById('userScoreRanking');
    const userTimeRanking = document.getElementById('userTimeRanking');
    const userCorrectRanking = document.getElementById('userCorrectRanking');

    if (rankingModalElement) {
        rankingModalElement.addEventListener('show.bs.modal', () => {
            toggleModalBlurEffect(true);
        });
        rankingModalElement.addEventListener('hide.bs.modal', () => {
            toggleModalBlurEffect(false);
        });
    }

    async function checkAndLoadTest() {
        try {
            const response = await fetch('/api/preguntas_test');
            if (!response.ok) {
                throw new Error(`Error HTTP! Estado: ${response.status}`);
            }
            const data = await response.json();

            if (data.test_completado) {
                testContainer.classList.add('d-none');
                testIntro.classList.add('d-none');
                testResult.classList.add('d-none');
                testCompletedSection.classList.remove('d-none');

                completedCorrectAnswers.textContent = data.score;
                completedTotalQuestions.textContent = data.total;
                completedTotalPoints.textContent = data.puntuacion_total;
                setResultMessage(data.puntuacion_total, data.total, completedResultMessage);

            } else {
                questions = data.preguntas;
                if (questions.length === 0) {
                    questionTextElement.textContent = 'No hay preguntas disponibles.';
                    return;
                }
                // Mostrar intro, ocultar otros secciones
                testCompletedSection.classList.add('d-none');
                testResult.classList.add('d-none');
                testContainer.classList.add('d-none');
                testIntro.classList.remove('d-none');
                isTestInProgress = false;
            }
        } catch (error) {
            console.error('Error al cargar las preguntas:', error);
            questionTextElement.textContent = 'Error al cargar las preguntas.';
            testContainer.classList.add('d-none');
            testResult.classList.add('d-none');
            testIntro.classList.add('d-none');
            testCompletedSection.classList.remove('d-none');
            completedResultMessage.textContent = 'Error al cargar el test. Por favor, inténtalo de nuevo más tarde.';
        }
    }

    if (startTestBtn) {
        startTestBtn.addEventListener('click', () => {
            if (questions.length === 0) return;

            testIntro.classList.add('d-none');
            testContainer.classList.remove('d-none');

            shuffleArray(questions);
            currentQuestionIndex = 0;
            userAnswers = {};
            correctAnswersCount = 0;
            totalPoints = 0;
            testStartTime = Date.now();
            isTestInProgress = true;

            renderQuestion();
            updateProgressBar();
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startQuestionTimer() {
        clearInterval(timerInterval);
        questionStartTime = Date.now();
        let timeLeft = MAX_TIME_PER_QUESTION;
        timeRemainingSpan.textContent = timeLeft;
        timerDisplay.classList.remove('d-none');

        // Update Enhanced timer style
        const timerBadge = document.querySelector('.timer-badge');
        if (timerBadge) timerBadge.classList.remove('warning');

        timerInterval = setInterval(() => {
            timeLeft--;
            timeRemainingSpan.textContent = timeLeft;

            // Visual warning when time is low
            if (timeLeft <= 10 && timerBadge) {
                timerBadge.classList.add('warning');
            }

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                feedbackMessage.textContent = '¡Tiempo agotado! La respuesta es: ' + getCorrectAnswerText(questions[currentQuestionIndex]);
                feedbackMessage.classList.remove('text-success');
                feedbackMessage.classList.add('text-danger');

                disableQuestionInteraction();
                checkAnswerBtn.classList.add('d-none');
                if (currentQuestionIndex < questions.length - 1) {
                    nextQuestionBtn.classList.remove('d-none');
                } else {
                    submitTestBtn.classList.remove('d-none');
                }
            }
        }, 1000);
    }

    function stopQuestionTimer() {
        clearInterval(timerInterval);
        timerDisplay.classList.add('d-none');
    }

    function renderQuestion() {
        if (questions.length === 0) return;

        const currentQuestion = questions[currentQuestionIndex];
        questionTextElement.textContent = currentQuestion.pregunta;
        optionsContainer.innerHTML = '';
        feedbackMessage.textContent = '';
        feedbackMessage.classList.remove('text-success', 'text-danger');

        // Remove animation classes if present to reset
        const premiumCard = document.querySelector('.question-card-premium');
        if (premiumCard) {
            premiumCard.classList.remove('question-slide-in', 'question-slide-out');
            void premiumCard.offsetWidth; // Trigger reflow
            premiumCard.classList.add('question-slide-in');
        }

        checkAnswerBtn.classList.remove('d-none');
        nextQuestionBtn.classList.add('d-none');
        submitTestBtn.classList.add('d-none');

        if (currentQuestion.tipo_pregunta === 'multiple_choice' || currentQuestion.tipo_pregunta === 'true_false') {
            currentQuestion.opciones.forEach(opcion => {
                const optionCard = document.createElement('div');
                optionCard.classList.add('option-card-enhanced');
                optionCard.dataset.optionId = opcion.id;

                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `question_${currentQuestion.id}`;
                input.id = `option_${opcion.id}`;
                input.value = opcion.id;
                input.classList.add('d-none'); // Hide actual radio

                // Create marker (A, B, C...)
                const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                const index = currentQuestion.opciones.indexOf(opcion);
                const marker = document.createElement('div');
                marker.classList.add('option-marker');
                marker.textContent = alphabet[index] || (index + 1);

                const label = document.createElement('div');
                label.classList.add('option-text-content');
                label.textContent = opcion.texto;

                optionCard.appendChild(input);
                optionCard.appendChild(marker);
                optionCard.appendChild(label);
                optionsContainer.appendChild(optionCard);

                if (userAnswers[currentQuestion.id] && String(userAnswers[currentQuestion.id].answer) === String(opcion.id)) {
                    input.checked = true;
                    optionCard.classList.add('selected');
                }

                optionCard.addEventListener('click', () => {
                    optionsContainer.querySelectorAll('.option-card-enhanced').forEach(card => {
                        card.classList.remove('selected');
                        const radio = card.querySelector('input[type="radio"]');
                        if (radio) radio.checked = false;
                    });
                    optionCard.classList.add('selected');
                    input.checked = true;
                });
            });
        } else if (currentQuestion.tipo_pregunta === 'fill_in_the_blank') {
            const inputContainer = document.createElement('div');
            inputContainer.classList.add('fancy-input-container');

            const input = document.createElement('input');
            input.type = 'text';
            input.id = `input_${currentQuestion.id}`;
            input.classList.add('fancy-input');
            input.placeholder = 'Escribe tu respuesta aquí...';

            inputContainer.appendChild(input);
            optionsContainer.appendChild(inputContainer);

            if (userAnswers[currentQuestion.id]) {
                input.value = userAnswers[currentQuestion.id].answer;
            }
        }
        startQuestionTimer();
    }

    function updateProgressBar() {
        if (!questions.length) return;
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);
        }

        const currentQNum = document.getElementById('currentQuestionNum');
        const totalQNum = document.getElementById('totalQuestionsNum');

        if (currentQNum) currentQNum.textContent = currentQuestionIndex + 1;
        if (totalQNum) totalQNum.textContent = questions.length;
    }

    function disableQuestionInteraction() {
        if (questions[currentQuestionIndex].tipo_pregunta === 'multiple_choice' || questions[currentQuestionIndex].tipo_pregunta === 'true_false') {
            optionsContainer.querySelectorAll('.option-card-enhanced').forEach(card => {
                card.style.pointerEvents = 'none';
                card.style.opacity = '0.8';
                // card.querySelector('input[type="radio"]').disabled = true; 
            });
        } else if (questions[currentQuestionIndex].tipo_pregunta === 'fill_in_the_blank') {
            const inputField = document.getElementById(`input_${questions[currentQuestionIndex].id}`);
            if (inputField) inputField.disabled = true;
        }
    }

    checkAnswerBtn.addEventListener('click', () => {
        stopQuestionTimer();
        const currentQuestion = questions[currentQuestionIndex];
        let userAnswer = null;
        let timeTakenForQuestion = (Date.now() - questionStartTime) / 1000;

        if (currentQuestion.tipo_pregunta === 'multiple_choice' || currentQuestion.tipo_pregunta === 'true_false') {
            const selectedOptionCard = optionsContainer.querySelector('.option-card-enhanced.selected');
            if (!selectedOptionCard) {
                feedbackMessage.textContent = 'Por favor, selecciona una opción.';
                feedbackMessage.classList.add('text-danger');
                startQuestionTimer();
                return;
            }
            userAnswer = selectedOptionCard.dataset.optionId;
        } else if (currentQuestion.tipo_pregunta === 'fill_in_the_blank') {
            const inputField = document.getElementById(`input_${currentQuestion.id}`);
            if (!inputField || inputField.value.trim() === '') {
                feedbackMessage.textContent = 'Por favor, escribe tu respuesta.';
                feedbackMessage.classList.add('text-danger');
                startQuestionTimer();
                return;
            }
            userAnswer = inputField.value.trim();
        }

        disableQuestionInteraction();

        const isCorrect = evaluateAnswer(currentQuestion, userAnswer);
        let currentQuestionPoints = 0;

        if (isCorrect) {
            feedbackMessage.textContent = '¡Correcto!';
            feedbackMessage.classList.remove('text-danger');
            feedbackMessage.classList.add('text-success');
            correctAnswersCount++;

            currentQuestionPoints += BASE_POINTS_PER_CORRECT_ANSWER;
            let timeSaved = MAX_TIME_PER_QUESTION - timeTakenForQuestion;
            if (timeSaved > 0) {
                currentQuestionPoints += Math.round(timeSaved * TIME_BONUS_PER_SECOND);
            }
        } else {
            feedbackMessage.textContent = 'Incorrecto. La respuesta correcta es: ' + getCorrectAnswerText(currentQuestion);
            feedbackMessage.classList.remove('text-success');
            feedbackMessage.classList.add('text-danger');
        }

        totalPoints += currentQuestionPoints;

        userAnswers[currentQuestion.id] = {
            answer: userAnswer,
            isCorrect: isCorrect,
            points: currentQuestionPoints,
            timeTaken: timeTakenForQuestion
        };

        checkAnswerBtn.classList.add('d-none');
        if (currentQuestionIndex < questions.length - 1) {
            nextQuestionBtn.classList.remove('d-none');
        } else {
            submitTestBtn.classList.remove('d-none');
        }
    });

    function evaluateAnswer(question, userAnswer) {
        if (question.tipo_pregunta === 'multiple_choice' || question.tipo_pregunta === 'true_false') {
            const correctAnswerOption = question.opciones.find(opt => opt.es_correcta);
            return correctAnswerOption && String(userAnswer) === String(correctAnswerOption.id);
        } else if (question.tipo_pregunta === 'fill_in_the_blank') {
            return normalizeString(userAnswer) === normalizeString(question.respuesta_texto_correcta);
        }
        return false;
    }

    function getCorrectAnswerText(question) {
        if (question.tipo_pregunta === 'multiple_choice' || question.tipo_pregunta === 'true_false') {
            const correctAnswerOption = question.opciones.find(opt => opt.es_correcta);
            return correctAnswerOption ? correctAnswerOption.texto : 'no disponible';
        } else if (question.tipo_pregunta === 'fill_in_the_blank') {
            return question.respuesta_texto_correcta || 'no disponible';
        }
        return 'no disponible';
    }

    nextQuestionBtn.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            const premiumCard = document.querySelector('.question-card-premium');
            if (premiumCard) {
                premiumCard.classList.add('question-slide-out');
                setTimeout(() => {
                    currentQuestionIndex++;
                    renderQuestion();
                    updateProgressBar();
                }, 300); // Wait for animation duration
            } else {
                currentQuestionIndex++;
                renderQuestion();
                updateProgressBar();
            }
        }
    });

    submitTestBtn.addEventListener('click', async () => {
        stopQuestionTimer();

        const confirmModal = new bootstrap.Modal(document.getElementById('confirmSubmitModal'));
        document.getElementById('confirmSubmitModalBody').textContent = '¿Estás seguro de que quieres finalizar el test?';
        document.getElementById('confirmSubmitBtn').onclick = async () => {
            confirmModal.hide();
            try {
                const totalTimeTaken = (Date.now() - testStartTime) / 1000;

                const response = await fetch('/api/submit_test', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        respuestas: userAnswers,
                        puntuacion_total: totalPoints,
                        tiempo_total_segundos: totalTimeTaken,
                        respuestas_correctas_count: correctAnswersCount
                    })
                });
                const result = await response.json();

                if (result.success) {
                    scoreDisplay.textContent = result.score;
                    totalQuestionsDisplay.textContent = result.total;
                    totalPointsDisplay.textContent = result.puntuacion_total;
                    setResultMessage(result.puntuacion_total, result.total, resultMessage);

                    testContainer.classList.add('d-none');
                    testIntro.classList.add('d-none');
                    if (testHeader) testHeader.classList.add('d-none');
                    testResult.classList.remove('d-none');

                    finalScoreModal.textContent = result.score;
                    totalQuestionsModal.textContent = result.total;
                    finalTotalPointsModal.textContent = result.puntuacion_total;
                    setResultMessage(result.puntuacion_total, result.total, resultMessageModal);

                    // Wait for any previous transitions
                    setTimeout(() => testResultModal.show(), 100);

                    testContainer.classList.add('d-none');
                    testResult.classList.add('d-none');
                    testCompletedSection.classList.remove('d-none');

                    completedCorrectAnswers.textContent = result.score;
                    completedTotalQuestions.textContent = result.total;
                    completedTotalPoints.textContent = result.puntuacion_total;
                    setResultMessage(result.puntuacion_total, result.total, completedResultMessage);

                } else {
                    const errorModal = new bootstrap.Modal(document.getElementById('errorMessageModal'));
                    document.getElementById('errorMessageModalBody').textContent = 'Error al enviar el test: ' + result.message;
                    errorModal.show();
                }
            } catch (error) {
                console.error('Error al enviar el test:', error);
                const errorModal = new bootstrap.Modal(document.getElementById('errorMessageModal'));
                document.getElementById('errorMessageModalBody').textContent = 'Error al enviar el test.';
                errorModal.show();
            }
        };
        confirmModal.show();
    });

    function setResultMessage(points, totalQuestions, element) {
        if (points >= (totalQuestions * BASE_POINTS_PER_CORRECT_ANSWER * 0.9)) {
            element.textContent = '¡Excelente! ¡Eres un/a experto/a financiero/a!';
        } else if (points >= (totalQuestions * BASE_POINTS_PER_CORRECT_ANSWER * 0.6)) {
            element.textContent = '¡Bien hecho! Tienes un buen conocimiento. Sigue practicando.';
        } else {
            element.textContent = 'Puedes mejorar. ¡No te rindas, sigue aprendiendo!';
        }
    }

    if (!document.getElementById('confirmSubmitModal')) {
        const confirmSubmitModalHtml = `
            <div class="modal fade" id="confirmSubmitModal" tabindex="-1" aria-labelledby="confirmSubmitModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content modal-premium-content border-0">
                        <div class="modal-header border-0 flex-column align-items-center justify-content-center pt-4 pb-0">
                            <div class="mb-3 p-3 rounded-circle bg-primary bg-opacity-10 text-primary">
                                <i class="bi bi-question-lg fs-2"></i>
                            </div>
                            <h4 class="modal-title fw-bold" id="confirmSubmitModalLabel">¿Finalizar el Test?</h4>
                        </div>
                        <div class="modal-body text-center py-3 px-4">
                            <p id="confirmSubmitModalBody" class="fs-5 text-muted mb-0">¿Estás seguro de que quieres terminar?</p>
                        </div>
                        <div class="modal-footer border-0 justify-content-center gap-3 pb-4">
                            <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary rounded-pill px-5 shadow-sm" id="confirmSubmitBtn">Finalizar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', confirmSubmitModalHtml);
    }

    // Sección: Lógica de Ranking
    if (viewRankingBtn) {
        viewRankingBtn.addEventListener('click', () => {
            testResultModal.hide();
            showRanking();
        });
    }
    if (viewRankingBtnCompleted) {
        viewRankingBtnCompleted.addEventListener('click', () => {
            showRanking();
        });
    }
    if (viewRankingBtnModal) {
        viewRankingBtnModal.addEventListener('click', () => {
            testResultModal.hide();
            showRanking();
        });
    }

    async function showRanking() {
        try {
            const response = await fetch('/api/ranking');
            if (!response.ok) {
                throw new Error(`Error HTTP! Estado: ${response.status}`);
            }
            const data = await response.json();

            rankingTableBody.innerHTML = '';
            userRankingInfo.classList.add('d-none');

            if (data.ranking && data.ranking.length > 0) {
                data.ranking.forEach(entry => {
                    const row = rankingTableBody.insertRow();
                    const sessionUserName = `{{ usuario.nombres }} {{ usuario.apellidos }}`;
                    const entryUserName = `${entry.nombres} ${entry.apellidos}`;

                    if (entryUserName === sessionUserName) {
                        row.classList.add('user-row');
                    }
                    row.innerHTML = `
                        <td class="fw-bold text-muted">#${entry.posicion}</td>
                        <td class="fw-bold" title="${entry.nombres} ${entry.apellidos}">${entry.nombres} ${entry.apellidos}</td>
                        <td class="text-primary fw-bold">${entry.puntuacion_total}</td>
                        <td class="text-muted"><small>${entry.tiempo_resolucion_segundos.toFixed(2)}s</small></td>
                        <td class="text-center"><span class="badge bg-light text-dark border">${entry.respuestas_correctas}</span></td>
                    `;
                });
            } else {
                const row = rankingTableBody.insertRow();
                row.innerHTML = `<td colspan="5" class="text-center py-4 text-muted">Aún no hay datos en el ranking.</td>`;
            }

            if (data.user_result && data.user_position !== -1) {
                userRankingInfo.classList.remove('d-none');
                userPositionDisplay.textContent = data.user_position;
                userScoreRanking.textContent = data.user_result.puntuacion_total;
                userTimeRanking.textContent = data.user_result.tiempo_resolucion_segundos.toFixed(2);
                userCorrectRanking.textContent = data.user_result.respuestas_correctas;
            }

            // Important: Show new modal BEFORE hiding the old one to maintain 'modal-open' class on body
            rankingModal.show();

            const resultModalEl = document.getElementById('testResultModal');
            if (resultModalEl && resultModalEl.classList.contains('show')) {
                testResultModal.hide();
            }

        } catch (error) {
            console.error('Error al cargar el ranking:', error);
            const errorModal = new bootstrap.Modal(document.getElementById('errorMessageModal'));
            document.getElementById('errorMessageModalBody').textContent = 'Error al cargar el ranking.';
            errorModal.show();
        }
    }

    // Sección: Carga inicial del test
    // Sección: Carga inicial del test
    function loadTest() {
        if (isTestInProgress) return;
        checkAndLoadTest();
        nextQuestionBtn.classList.add('d-none');
        submitTestBtn.classList.add('d-none');
        checkAnswerBtn.classList.remove('d-none');
    }
    // Global keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const isTestVisible = testContainer && !testContainer.classList.contains('d-none');
            const isIntroVisible = testIntro && !testIntro.classList.contains('d-none');
            const isAnyModalOpen = document.querySelector('.modal.show');

            if (isAnyModalOpen) {
                const confirmModal = document.getElementById('confirmSubmitModal');
                if (confirmModal && confirmModal.classList.contains('show')) {
                    event.preventDefault();
                    const confirmBtn = document.getElementById('confirmSubmitBtn');
                    if (confirmBtn) confirmBtn.click();
                }
                return;
            }

            if (isIntroVisible && startTestBtn && !startTestBtn.disabled) {
                event.preventDefault();
                startTestBtn.click();
            } else if (isTestVisible) {
                event.preventDefault();
                if (checkAnswerBtn && !checkAnswerBtn.classList.contains('d-none')) {
                    checkAnswerBtn.click();
                } else if (nextQuestionBtn && !nextQuestionBtn.classList.contains('d-none')) {
                    nextQuestionBtn.click();
                } else if (submitTestBtn && !submitTestBtn.classList.contains('d-none')) {
                    submitTestBtn.click();
                }
            }
        }
    });

});
function normalizeString(str) {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
