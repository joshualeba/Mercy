document.addEventListener('DOMContentLoaded', () => {

    // Sección: LOADER
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

    // Sección: TOGGLE PARA MODO OSCURO
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

    // Sección: LÓGICA PARA DROPDOWNS Y EFECTO BORROSO
    const userBtn = document.getElementById('userBtn');
    const userDropdown = document.getElementById('userDropdown');
    const mainContent = document.querySelector('.main-content');
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
        const isShown = dropdown.classList.toggle('show');
        button.setAttribute('aria-expanded', isShown);
        applyBlurEffect(isShown);
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
    });

    // Sección: LÓGICA DEL MODAL DE CERRAR SESIÓN
    const logoutBtn = document.getElementById('logoutBtn');
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

    if (logoutBtn && logoutModal) {
        logoutBtn.addEventListener('click', () => {
            if (userDropdown) {
                userDropdown.classList.remove('show');
                userBtn.setAttribute('aria-expanded', 'false');
            }
            applyBlurEffect(false);
            logoutModal.show();
        });
    }

    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', () => {
            window.location.href = "/logout";
            logoutModal.hide();
        });
    }

    // --- LÓGICA ESPECÍFICA DEL SIMULADOR DE AHORRO ---

    const metaCards = document.querySelectorAll('.meta-card');
    const metaSelectionSection = document.getElementById('meta-selection-section');
    const simulationFormSection = document.getElementById('simulation-form-section');
    const formTitle = document.getElementById('form-title'); // Note: This ID might not exist in HTML, checking... it's just 'Calculadora de objetivos' in HTML but I'll check if I need to add ID or select by class. HTML line 107 has h4 but no ID. I added IDs to labels.
    // Wait, I didn't add ID to the title in HTML. Let me check the HTML again.
    // Line 107: <h4 class="fw-bold text-muted mb-0">Calculadora de objetivos</h4>
    // It doesn't have an ID. I will use a selector or valid ID if I added it. I didn't add it.
    // I will skip updating the main title if I can't target it easily, or just target it via querySelector.
    const backToMetaSelectionBtn = document.getElementById('backToMetaSelection');
    const savingSimulationForm = document.getElementById('savingSimulationForm');

    // Check if modal exists before init
    const resultsModalEl = document.getElementById('resultsModal');
    let resultsModal;
    if (resultsModalEl) {
        resultsModal = new bootstrap.Modal(resultsModalEl);
    }

    let selectedMeta = '';

    // Textos dinámicos por tipo de meta
    const dynamicTexts = {
        'fiestas': {
            goalLabel: '¿Cuál es el presupuesto para la celebración?',
            goalHelper: 'Incluye salón, música, comida y extras.',
            currentLabel: '¿Ya tienes algo reservado o ahorrado?',
            currentHelper: 'Dinero ya asignado al evento.',
            monthlyLabel: '¿Cuánto puedes destinar al mes?',
            monthlyHelper: 'Considera tus ingresos menos gastos fijos.',
            recommendation: 'Planificar con tiempo te permite reservar mejores lugares y precios. ¡Considera invertir tu ahorro a corto plazo!'
        },
        'viajes': {
            goalLabel: '¿Cuánto costará el viaje de tus sueños?',
            goalHelper: 'Vuelos, hospedaje, comidas y tours.',
            currentLabel: '¿Tienes algún ahorro previo para esto?',
            currentHelper: 'Millas, puntos o efectivo guardado.',
            monthlyLabel: '¿Cuánto puedes ahorrar mensualmente?',
            monthlyHelper: 'Intenta reducir gastos hormiga para aumentar este monto.',
            recommendation: 'Para viajes internacionales, considera una cuenta en dólares o inversiones líquidas.'
        },
        'educacion': {
            goalLabel: '¿Cuál es el costo total de la educación?',
            goalHelper: 'Matrícula, libros, estancia y manutención.',
            currentLabel: '¿Dispones de un fondo educativo actual?',
            currentHelper: 'Ahorros previos o becas parciales.',
            monthlyLabel: '¿Cuánto puedes aportar mensualmente?',
            monthlyHelper: 'La constancia es clave para metas a largo plazo.',
            recommendation: 'La educación es la mejor inversión. Revisa instrumentos que protejan tu dinero contra la inflación.'
        },
        'personal': {
            goalLabel: '¿Cuánto necesitas para tu meta personal?',
            goalHelper: 'El precio total del bien o servicio.',
            currentLabel: '¿Cuánto tienes ahorrado hasta hoy?',
            currentHelper: 'Tu capital inicial disponible.',
            monthlyLabel: '¿Cuánto separarás de tu sueldo al mes?',
            monthlyHelper: 'Un 10-20% de tus ingresos es un excelente hábito.',
            recommendation: 'Define plazos claros. Si es a largo plazo, el interés compuesto será tu mejor aliado.'
        }
    };

    function updateDynamicContent(type) {
        const texts = dynamicTexts[type];
        if (!texts) return;

        // Helper to update HTML content with icon preservation if needed involved replacing text only
        // But here we replace the text node.
        const setHtml = (id, iconClass, text) => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = `<i class="${iconClass} me-2"></i>${text}`;
        };
        const setText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = `<i class="bi bi-info-circle me-1"></i>${text}`; // Restore icon
        };

        // Goal
        setHtml('label-goal', 'bi bi-flag-fill text-success', texts.goalLabel);
        setText('helper-goal', texts.goalHelper);

        // Current
        setHtml('label-current', 'bi bi-wallet2 text-primary', texts.currentLabel);
        setText('helper-current', texts.currentHelper);

        // Monthly
        setHtml('label-monthly', 'bi bi-calendar-plus text-info', texts.monthlyLabel);
        setText('helper-monthly', texts.monthlyHelper);
    }

    metaCards.forEach(card => {
        card.addEventListener('click', () => {
            // Visual Feedback
            metaCards.forEach(mc => {
                mc.classList.remove('selected', 'border-primary', 'shadow-lg');
                const check = mc.querySelector('.check-indicator');
                if (check) {
                    check.classList.remove('opacity-100');
                    check.classList.add('opacity-0');
                }
            });

            card.classList.add('selected', 'border-primary', 'shadow-lg');
            const activeCheck = card.querySelector('.check-indicator');
            if (activeCheck) {
                activeCheck.classList.remove('opacity-0');
                activeCheck.classList.add('opacity-100');
            }

            // Logic
            selectedMeta = card.dataset.meta;
            updateDynamicContent(selectedMeta);

            // Scroll to form smoothly
            setTimeout(() => {
                simulationFormSection.classList.remove('d-none');

                // Reset to first step
                showStep('step-goal');

                simulationFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        });
    });

    // Validar y Formatear Inputs en tiempo real
    const moneyInputs = ['currentAmount', 'goalAmount', 'monthlyContribution'];
    moneyInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.type = 'text'; // Cambiar a texto para permitir comas
            input.addEventListener('input', function (e) {
                // 1. Get raw numbers
                let value = this.value.replace(/\D/g, '');
                // 2. Format
                if (value === "") {
                    this.value = "";
                } else {
                    this.value = new Intl.NumberFormat('en-US').format(value);
                }
            });
        }
    });

    // Wizard Logic
    const nextBtns = document.querySelectorAll('.next-step-btn');
    const prevBtns = document.querySelectorAll('.prev-step-btn');
    const stepSections = document.querySelectorAll('.step-section');

    function showStep(stepId) {
        stepSections.forEach(section => {
            section.classList.add('d-none');
            // Remove animation class to restart it if needed, or just leave it
        });
        const target = document.getElementById(stepId);
        if (target) {
            target.classList.remove('d-none');
            const input = target.querySelector('input');
            if (input) setTimeout(() => input.focus(), 100);
        }
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStepId = btn.dataset.next;
            const currentSection = btn.closest('.step-section');
            const input = currentSection.querySelector('input');

            // Validation
            if (input && input.hasAttribute('required')) {
                const val = parseFloat(input.value.replace(/,/g, '')) || 0;
                if (!input.value || val <= 0) {
                    input.classList.add('border-danger');
                    input.focus();
                    return;
                }
                input.classList.remove('border-danger');
            }

            showStep(nextStepId);
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStepId = btn.dataset.prev;
            showStep(prevStepId);
        });
    });

    // Enter key support
    document.querySelectorAll('.step-section input').forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const currentSection = input.closest('.step-section');
                const nextBtn = currentSection.querySelector('.next-step-btn');
                const submitBtn = currentSection.querySelector('button[type="submit"]');

                if (nextBtn) nextBtn.click();
                else if (submitBtn) submitBtn.click();
            }
        });
    });

    backToMetaSelectionBtn.addEventListener('click', () => {
        // Just scroll top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    savingSimulationForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const currentAmountInput = document.getElementById('currentAmount');
        const goalAmountInput = document.getElementById('goalAmount');
        const monthlyContributionInput = document.getElementById('monthlyContribution');

        // Helpers into number
        const parseCurrency = (val) => parseFloat(val.replace(/,/g, '')) || 0;

        const currentAmount = parseCurrency(currentAmountInput.value);
        const goalAmount = parseCurrency(goalAmountInput.value);
        const monthlyContribution = parseCurrency(monthlyContributionInput.value);

        let isValid = true;

        if (goalAmount <= 0) {
            goalAmountInput.classList.add('border-danger');
            isValid = false;
        } else {
            goalAmountInput.classList.remove('border-danger');
        }

        // Validate that we can actually reach the goal
        if (monthlyContribution <= 0 && currentAmount < goalAmount) {
            // If no monthly contribution and current is less than goal, impossible (unless assuming high interest, but let's be strict)
            monthlyContributionInput.classList.add('border-danger');
            // Show tooltip or alert? simplifying
            // Force focus
            monthlyContributionInput.focus();
            isValid = false;
        } else {
            monthlyContributionInput.classList.remove('border-danger');
        }

        if (!isValid) return;

        // --- CALCULATIONS ---

        // 1. Time Calculation
        const remaining = goalAmount - currentAmount;
        let monthsNeeded = 0;

        if (remaining <= 0) {
            monthsNeeded = 0;
        } else {
            // Avoid division by zero
            if (monthlyContribution > 0) {
                monthsNeeded = Math.ceil(remaining / monthlyContribution);
            } else {
                // Should be caught by validation, but safety net
                monthsNeeded = 999;
            }
        }

        // 2. Date Calculation
        const today = new Date();
        const targetDate = new Date(today.setMonth(today.getMonth() + monthsNeeded));
        const dateString = targetDate.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

        // 3. Investment Calculation (SOFIPO ~ 10% Annual -> 0.83% Monthly)
        const monthlyRate = 0.10 / 12; // 10% anual
        let futureValue = currentAmount;
        let totalInvestedPrincipal = currentAmount;

        // Simple future value loop
        // If monthsNeeded is huge, we might want to cap it visually or logic wise, but for standard inputs it's fine.
        for (let i = 0; i < monthsNeeded; i++) {
            futureValue = (futureValue + monthlyContribution) * (1 + monthlyRate);
            totalInvestedPrincipal += monthlyContribution;
        }

        if (monthsNeeded === 0) futureValue = currentAmount;


        const simpleSavings = currentAmount + (monthlyContribution * monthsNeeded);
        const interestEarned = futureValue - simpleSavings;

        // --- UI UPDATES ---

        document.getElementById('resultMonths').textContent = monthsNeeded;
        document.getElementById('resultDate').textContent = dateString;

        document.getElementById('resultTotalSaved').textContent = formatCurrency(simpleSavings);
        document.getElementById('resultTotalInvested').textContent = formatCurrency(futureValue);
        document.getElementById('resultInterest').textContent = `+${formatCurrency(interestEarned)}`;

        // Timeline Animation
        const maxMonths = 60; // 5 years baseline for bar
        const progress = Math.min(100, Math.max(5, (monthsNeeded / maxMonths) * 100));
        // Logic: if monthsNeeded is small, bar is short? Or opposite?
        // Usually timeline progress shows "how far along are you".
        // But here it seems to be a visual indicator of "Time Duration".
        // Let's set it to always full for "Goal Achieved" visualization, or keep relevant logic.
        // The original code had: (1 - (monthsNeeded / 60)) * 100.
        // If 0 months needed, 100%. If 60 months needed, 0%.
        // So it represents "How close you are".
        const closeness = Math.max(0, Math.min(100, (1 - (monthsNeeded / 120)) * 100)); // Cap at 10 years
        document.getElementById('timelineProgress').style.width = `${closeness}%`;


        // Recommendation Text
        const recContainer = document.getElementById('recommendation-container');
        const recText = document.getElementById('recommendation-text');

        let specificAdvice = "";
        if (monthsNeeded > 60) {
            specificAdvice = "Es un plazo largo. Considera aumentar ligeramente tu aportación mensual para reducir el tiempo significativamente.";
        } else if (monthsNeeded < 6) {
            specificAdvice = "¡Estás muy cerca! Mantén tu dinero líquido en opciones de disponibilidad diaria.";
        } else {
            specificAdvice = "Un plazo saludable. Las SOFIPOS o CETES son excelentes opciones para este horizonte de tiempo.";
        }

        const metaAdvice = dynamicTexts[selectedMeta]?.recommendation || "";

        recText.textContent = `${metaAdvice} ${specificAdvice}`;
        recContainer.classList.remove('d-none');


        // Show Modal
        if (resultsModal) {
            resultsModal.show();
        }
    });

    function formatCurrency(amount) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    document.getElementById('simulacion-ahorro-section').classList.remove('d-none');

    // sección: lógica del botón de regresar del navegador
    const browserBackBtn = document.getElementById('browserBackBtn');
    if (browserBackBtn) {
        browserBackBtn.addEventListener('click', () => {
            window.history.back();
        });
    }
});

// Función para descargar PDF de Ahorro
window.descargarPDFAhorro = function (event) {
    if (event) event.preventDefault();
    if (typeof window.jsPDF !== 'undefined') {
        const doc = new window.jsPDF();
        if (typeof aplicarEstiloPDFMercy === 'function') {
            aplicarEstiloPDFMercy(doc, 'Proyección de Ahorro');
        } else {
            doc.setFontSize(18);
            doc.text("Proyección de Ahorro", 14, 20);
        }

        let yPos = 60;
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);

        // Extraer valores actuales
        const meses = document.getElementById('resultMonths').innerText;
        const fecha = document.getElementById('resultDate').innerText;
        const ahorroAcumulado = document.getElementById('resultTotalSaved').innerText;
        const proyeccionInversion = document.getElementById('resultTotalInvested').innerText;
        const interesGanado = document.getElementById('resultInterest').innerText;
        const recomendacion = document.getElementById('recommendation-text').innerText;

        doc.setFont('helvetica', 'normal');

        doc.autoTable({
            startY: yPos,
            head: [['Concepto', 'Valor']],
            body: [
                ['Tiempo estimado', `${meses} meses`],
                ['Fecha meta', fecha],
                ['Ahorro acumulado (sin invertir)', ahorroAcumulado],
                ['Proyección con Inversión (~10%)', proyeccionInversion],
                ['Interés Ganado Estimado', interesGanado]
            ],
            theme: 'striped',
            headStyles: { fillColor: [25, 135, 84] } // Verde success para ahorro
        });

        yPos = doc.lastAutoTable.finalY + 15;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Recomendación", 15, yPos);
        yPos += 10;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const textLines = doc.splitTextToSize(recomendacion, doc.internal.pageSize.getWidth() - 30);
        doc.text(textLines, 15, yPos);

        doc.save('Mercy_Proyeccion_Ahorro.pdf');
    } else {
        alert("La biblioteca de PDF no pudo cargar. Por favor recarga la página.");
    }
};