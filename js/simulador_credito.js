document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // LÓGICA COMÚN (LOADER, THEME, NARVAR, ETC)
    // =========================================================

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

    // =========================================================
    // LÓGICA ESPECÍFICA DEL SIMULADOR DE CRÉDITO
    // =========================================================

    // --- VARIABLES GLOBAL ---
    const creditTypeSection = document.getElementById('credit-type-section');
    const simulationFormSection = document.getElementById('simulation-form-section');
    const backToCreditTypeBtn = document.getElementById('backToCreditType');
    const creditSimulationForm = document.getElementById('creditSimulationForm');
    const formTitle = document.getElementById('form-title');
    const dynamicDetailsContainer = document.getElementById('dynamic-details-container');

    let selectedCreditType = '';

    // --- SELECCIÓN DE TIPO DE CRÉDITO ---
    const creditCards = document.querySelectorAll('.credit-card');

    if (creditCards.length > 0) {
        creditCards.forEach(card => {
            card.addEventListener('click', () => {
                // Visual feedback
                creditCards.forEach(c => {
                    c.classList.remove('selected', 'border-primary', 'shadow-lg');
                    const check = c.querySelector('.check-indicator');
                    if (check) c.classList.remove('opacity-100');
                });

                card.classList.add('selected', 'border-primary', 'shadow-lg');
                const activeCheck = card.querySelector('.check-indicator');
                if (activeCheck) activeCheck.classList.add('opacity-100');

                // Set type
                selectedCreditType = card.dataset.credittype;
                updateDynamicDetails(selectedCreditType);

                // Change Section
                setTimeout(() => {
                    if (creditTypeSection) creditTypeSection.classList.add('d-none');
                    if (simulationFormSection) {
                        simulationFormSection.classList.remove('d-none');
                        showStep('step-amount');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }, 300);
            });
        });
    }

    if (backToCreditTypeBtn) {
        backToCreditTypeBtn.addEventListener('click', () => {
            if (simulationFormSection) simulationFormSection.classList.add('d-none');
            if (creditTypeSection) creditTypeSection.classList.remove('d-none');
            resetForm();
        });
    }

    // --- WIZARD LOGIC ---
    const stepSections = document.querySelectorAll('.step-section');
    const nextBtns = document.querySelectorAll('.next-step-btn');
    const prevBtns = document.querySelectorAll('.prev-step-btn');

    function showStep(stepId) {
        stepSections.forEach(section => {
            section.classList.add('d-none');
            section.classList.remove('fade-in'); // Reset animation hook if needed
        });
        const target = document.getElementById(stepId);
        if (target) {
            target.classList.remove('d-none');
            target.classList.add('fade-in');
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
                const val = parseFloat(input.value.replace(/[^0-9.]/g, ''));
                if (!input.value || isNaN(val) || val <= 0) {
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

    // Enter key navigation
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

    // --- FORMATEO DE INPUTS ---
    const moneyInputs = ['loanAmount'];
    moneyInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function (e) {
                let value = this.value.replace(/\D/g, '');
                if (value === "") {
                    this.value = "";
                } else {
                    this.value = new Intl.NumberFormat('en-US').format(value);
                }
            });
        }
    });

    // --- CÁLCULO Y RESULTADOS ---
    if (creditSimulationForm) {
        creditSimulationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get values
            const amountInput = document.getElementById('loanAmount');
            const monthsInput = document.getElementById('loanTerm');
            const rateInput = document.getElementById('interestRate');

            if (!amountInput || !monthsInput || !rateInput) return;

            const amount = parseFloat(amountInput.value.replace(/,/g, ''));
            const months = parseInt(monthsInput.value);
            const annualRate = parseFloat(rateInput.value);

            if (!amount || !months || !annualRate) return;

            // Calculate
            const monthlyRate = annualRate / 100 / 12;
            let monthlyPayment = 0;

            if (monthlyRate === 0) {
                monthlyPayment = amount / months;
            } else {
                monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
            }

            const totalPayment = monthlyPayment * months;
            const totalInterest = totalPayment - amount;

            // Display Results
            document.getElementById('modalMonthlyPayment').textContent = formatCurrency(monthlyPayment);
            document.getElementById('modalTotalPayment').textContent = formatCurrency(totalPayment);
            document.getElementById('modalLoanAmount').textContent = formatCurrency(amount);
            document.getElementById('modalInterestRate').textContent = annualRate + '%';
            document.getElementById('modalTermDisplay').textContent = months;

            // Bar Chart
            const percentPrincipal = (amount / totalPayment) * 100;
            const percentInterest = (totalInterest / totalPayment) * 100;

            const barPrincipal = document.getElementById('barPrincipal');
            const barInterest = document.getElementById('barInterest');
            if (barPrincipal) barPrincipal.style.width = percentPrincipal + '%';
            if (barInterest) barInterest.style.width = percentInterest + '%';

            document.getElementById('modalPrincipalBarText').textContent = formatCurrency(amount);
            document.getElementById('modalInterestBarText').textContent = formatCurrency(totalInterest);

            // Show Modal
            const resultsModalEl = document.getElementById('resultsModal');
            if (resultsModalEl) {
                const resultsModal = new bootstrap.Modal(resultsModalEl);
                resultsModal.show();
            }
        });
    }

    // --- FUNCIONES AUXILIARES ---
    function updateDynamicDetails(type) {
        if (!formTitle) return;

        let title = "Calculadora de crédito";

        let texts = {
            amountLabel: "¿Cuánto dinero necesitas?",
            amountHelper: "El monto total que deseas solicitar.",
            termLabel: "¿En cuántos meses deseas pagar?",
            termHelper: "Ingresa el plazo en meses (Ej: 12, 24, 60).",
            rateLabel: "¿Qué tasa de interés anual te ofrecen?",
            rateHelper: "Consulta el CAT promedio (aprox. 20%-45%).",
            detailLabel: "¿Cuál es tu ingreso mensual neto?",
            detailPlaceholder: "Ej: 15,000",
            detailIcon: "bi-cash-stack"
        };

        switch (type) {
            case 'personal':
                title = "Crédito personal";
                // Uses defaults (Ingreso mensual)
                break;

            case 'hipotecario':
                title = "Crédito hipotecario";
                texts = {
                    amountLabel: "¿De cuánto será el préstamo hipotecario?",
                    amountHelper: "Generalmente es el valor de la casa menos el enganche.",
                    termLabel: "¿En cuántos meses pagarás tu casa?",
                    termHelper: "Tip: 15 años = 180 meses, 20 años = 240 meses.",
                    rateLabel: "¿Cuál es la tasa anual fija?",
                    rateHelper: "Normalmente ronda entre 9% y 12% anual.",
                    detailLabel: "¿Cuál es el valor estimado de la propiedad?",
                    detailPlaceholder: "Ej: 2,500,000",
                    detailIcon: "bi-house-fill"
                };
                break;

            case 'automotriz':
                title = "Crédito automotriz";
                texts = {
                    amountLabel: "¿Cuánto necesitas financiar del auto?",
                    amountHelper: "El precio del vehículo menos tu enganche.",
                    termLabel: "¿En cuántos meses lo terminarás de pagar?",
                    termHelper: "Plazos comunes: 24, 36, 48 o 60 meses.",
                    rateLabel: "¿Cuál es la tasa de interés anual?",
                    rateHelper: "Varía según la agencia o banco (aprox. 11%-17%).",
                    detailLabel: "¿Cuál es el valor total del vehículo?",
                    detailPlaceholder: "Ej: 350,000",
                    detailIcon: "bi-car-front-fill"
                };
                break;

            case 'educativo':
                title = "Crédito educativo";
                texts = {
                    amountLabel: "¿Cuál es el monto del financiamiento?",
                    amountHelper: "Lo que la institución pagará por ti.",
                    termLabel: "¿En cuánto tiempo planeas liquidarlo?",
                    termHelper: "Recuerda considerar el periodo de gracia si aplica.",
                    rateLabel: "¿Cuál es la tasa de interés anual?",
                    rateHelper: "Suele ser preferencial (aprox. 10%-18%).",
                    detailLabel: "¿Cuál es el costo total del programa educativo?",
                    detailPlaceholder: "Ej: 500,000",
                    detailIcon: "bi-mortarboard-fill"
                };
                break;
        }

        // Update Title
        formTitle.textContent = title;

        // Update Labels and Helpers safely
        const setHtml = (id, iconClass, text) => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = `<i class="${iconClass} me-2"></i>${text}`;
        };
        const setText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = `<i class="bi bi-info-circle me-1"></i>${text}`;
        };

        // Step 1: Amount
        setHtml('label-amount', 'bi bi-cash-coin text-primary', texts.amountLabel);
        setText('helper-amount', texts.amountHelper);

        // Step 2: Term
        setHtml('label-term', 'bi bi-calendar-check text-success', texts.termLabel);
        setText('helper-term', texts.termHelper);

        // Step 3: Rate
        setHtml('label-interest', 'bi bi-percent text-warning', texts.rateLabel);
        setText('helper-interest', texts.rateHelper);

        // Step 4: Details (Input Field)
        if (dynamicDetailsContainer) {
            dynamicDetailsContainer.innerHTML = `
                <label class="form-label-premium text-muted mb-2"><i class="bi ${texts.detailIcon} me-2"></i>${texts.detailLabel}</label>
                <div class="input-glass-wrapper">
                    <span class="input-group-text text-info">$</span>
                    <input type="text" class="form-control glass-input" id="dynamicDetailInput" placeholder="${texts.detailPlaceholder}" autocomplete="off" maxlength="15">
                </div>
            `;

            // Attach formatter to the new input
            const newInput = document.getElementById('dynamicDetailInput');
            if (newInput) {
                newInput.addEventListener('input', function (e) {
                    let value = this.value.replace(/\D/g, '');
                    if (value === "") {
                        this.value = "";
                    } else {
                        // Limit size to avoid overflow
                        if (value.length > 12) value = value.substring(0, 12);
                        this.value = new Intl.NumberFormat('en-US').format(value);
                    }
                });

                // Also add enter key support for this new input
                newInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const currentSection = newInput.closest('.step-section');
                        const submitBtn = currentSection.querySelector('button[type="submit"]');
                        if (submitBtn) submitBtn.click();
                    }
                });
            }
        }
    }

    function resetForm() {
        if (creditSimulationForm) creditSimulationForm.reset();
        document.querySelectorAll('.step-section').forEach(s => s.classList.add('d-none'));
        // Reset visually
        if (creditCards) {
            creditCards.forEach(c => c.classList.remove('selected', 'border-primary', 'shadow-lg'));
        }
    }

    function formatCurrency(val) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
        }).format(val);
    }

    // Browser back button support
    const browserBackBtn = document.getElementById('browserBackBtn');
    if (browserBackBtn) {
        browserBackBtn.addEventListener('click', () => {
            window.history.back();
        });
    }

});