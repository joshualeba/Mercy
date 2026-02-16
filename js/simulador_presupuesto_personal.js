document.addEventListener('DOMContentLoaded', () => {

    // --- UTILITY: Currency Formatters ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const parseCurrency = (val) => {
        if (!val) return 0;
        return parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
    };

    // --- LOADER & THEME (Standard) ---
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

    // --- WIZARD LOGIC ---
    const form = document.getElementById('budgetWizardForm');

    // Only run if the form exists
    if (form) {
        // Inputs with currency formatting
        const inputs = ['monthlyIncome', 'fixedExpenses', 'variableExpenses', 'desiredSavings'];

        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (e) => {
                    let value = e.target.value.replace(/[^0-9.]/g, '');
                    if (value) {
                        const number = parseFloat(value);
                        e.target.value = new Intl.NumberFormat('en-US').format(number);
                    }
                });

                // Navigation on Enter
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const currentStep = input.closest('.step-section');
                        const nextBtn = currentStep.querySelector('.next-step-btn');
                        if (nextBtn) nextBtn.click();
                        else if (input.id === 'desiredSavings') {
                            form.dispatchEvent(new Event('submit'));
                        }
                    }
                });
            }
        });


        // Step Navigation
        function showStep(stepId) {
            document.querySelectorAll('.step-section').forEach(el => {
                el.classList.add('d-none');
                el.classList.remove('fade-in');
            });
            const target = document.getElementById(stepId);
            if (target) {
                target.classList.remove('d-none');
                setTimeout(() => target.classList.add('fade-in'), 10);

                // Auto focus input
                const input = target.querySelector('input');
                if (input) input.focus();
            }
        }

        document.querySelectorAll('.next-step-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const currentStep = btn.closest('.step-section');
                const input = currentStep.querySelector('input');

                if (input && input.hasAttribute('required') && !input.value) {
                    input.classList.add('is-invalid');
                    setTimeout(() => input.classList.remove('is-invalid'), 2000);
                    return;
                }

                const nextStepId = btn.dataset.next;
                showStep(nextStepId);
            });
        });

        document.querySelectorAll('.prev-step-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const prevStepId = btn.dataset.prev;
                showStep(prevStepId);
            });
        });

        // --- CALCULATION & RESULTS ---
        const resultsModalElement = document.getElementById('resultsModal');
        let resultsModal;
        if (resultsModalElement) {
            resultsModal = new bootstrap.Modal(resultsModalElement);
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get values
            const income = parseCurrency(document.getElementById('monthlyIncome').value);
            const fixed = parseCurrency(document.getElementById('fixedExpenses').value);
            const variable = parseCurrency(document.getElementById('variableExpenses').value);
            const savingsGoal = parseCurrency(document.getElementById('desiredSavings').value);

            if (income === 0) {
                alert("Por favor ingresa un ingreso válido.");
                return;
            }

            const totalExpenses = fixed + variable;
            const balance = income - totalExpenses;

            // Ratios (50/30/20)
            const needsPct = (fixed / income) * 100;
            const wantsPct = (variable / income) * 100;
            const savingsPotential = balance > 0 ? balance : 0;

            // DOM Elements
            document.getElementById('resIncome').textContent = formatCurrency(income);
            document.getElementById('resExpenses').textContent = formatCurrency(totalExpenses);
            document.getElementById('resBalance').textContent = formatCurrency(balance);

            const balanceText = document.getElementById('resBalanceText');
            if (balance < 0) {
                document.getElementById('resBalance').classList.remove('text-primary', 'text-success');
                document.getElementById('resBalance').classList.add('text-danger');
                balanceText.textContent = "¡Estás gastando más de lo que ganas!";
            } else {
                document.getElementById('resBalance').classList.remove('text-danger');
                document.getElementById('resBalance').classList.add('text-primary');
                balanceText.textContent = "Dinero disponible real";
            }

            // Bars
            const setBar = (idVal, idBar, idTxt, pct) => {
                const displayPct = Math.min(pct, 100);
                document.getElementById(idVal).textContent = pct.toFixed(1) + '%';
                document.getElementById(idBar).style.width = displayPct + '%';

                let note = "";
                if (idBar === 'barNeeds') { // Ideal 50
                    if (pct > 60) note = "Alto";
                    else if (pct < 40) note = "Bajo";
                    else note = "Óptimo";
                } else if (idBar === 'barWants') { // Ideal 30
                    if (pct > 40) note = "Alto";
                    else note = "Bien";
                }
                if (idTxt) document.getElementById(idTxt).textContent = note;
            };

            setBar('valNeeds', 'barNeeds', 'txtNeeds', needsPct);
            setBar('valWants', 'barWants', 'txtWants', wantsPct);

            // Savings Logic bar
            const realSavingsPct = (savingsPotential / income) * 100;
            document.getElementById('valSavings').textContent = realSavingsPct.toFixed(1) + '%';
            document.getElementById('barSavings').style.width = Math.min(realSavingsPct, 100) + '%';
            document.getElementById('txtSavingsGoal').textContent = formatCurrency(savingsGoal);

            // --- DIAGNOSIS ---
            const diagnosisEl = document.getElementById('budgetDiagnosis');
            let diagnosis = "";

            if (balance < 0) {
                diagnosis = "Tus gastos superan tus ingresos. Es urgente reducir gastos variables o buscar ingresos extra. No es momento de ahorrar, sino de sanear finanzas.";
            } else if (needsPct > 60) {
                diagnosis = "Tus gastos fijos son muy altos (>60%). Esto te deja poco margen. Revisa si puedes reducir costos fijos (renta, servicios).";
            } else if (wantsPct > 40) {
                diagnosis = "Estás gastando mucho en deseos (>40%). Modera esos gastos variables para aumentar tu capacidad de ahorro.";
            } else if (realSavingsPct < 10) {
                diagnosis = "Tienes balance positivo, pero ahorras menos del 10%. Intenta ajustarte un poco más para llegar al ideal del 20%.";
            } else {
                diagnosis = "¡Excelente salud financiera! Tus proporciones son muy saludables (cercanas al 50/30/20). ¡Sigue así!";
            }

            if (savingsPotential >= savingsGoal && balance > 0) {
                diagnosis += " Además, ¡cubres tu meta de ahorro soñada sin problemas!";
            } else if (balance > 0) {
                diagnosis += " Aún te falta un poco para cubrir tu meta de ahorro ideal (" + formatCurrency(savingsGoal) + ").";
            }

            diagnosisEl.textContent = diagnosis;

            if (resultsModal) resultsModal.show();
        });

        // Initial focus
        const firstInput = document.getElementById('monthlyIncome');
        if (firstInput) firstInput.focus();
    }

    // Back Button Browser
    const browserBackBtn = document.getElementById('browserBackBtn');
    if (browserBackBtn) {
        browserBackBtn.addEventListener('click', () => {
            window.history.back();
        });
    }

    // Shared UI logic (Dropdowns/Blurs) - Keeping simplified or reusing generic if available. 
    // Since this file replaces the old one which had logout logic, I should include the basic UI logic or rely on a commons file?
    // The previous file had Logout logic. I must preserve it if it's not in a common file.
    // Based on previous file, it seemed to duplicate logic found in other files.
    // However, I should probably check if layout or base template handles this. 
    // The previous file had ~130 lines of UI logic (toggleDropdown, etc).
    // I will include the standard UI logic just in case to avoid breaking the navbar.

    // ... UI Logic Integration ...
    const userBtn = document.getElementById('userBtn');
    const userDropdown = document.getElementById('userDropdown');
    const mainContent = document.querySelector('.main-content');
    const body = document.body;

    function applyBlurEffect(isActive) {
        if (mainContent) {
            isActive ? mainContent.classList.add('blurred-content') : mainContent.classList.remove('blurred-content');
            isActive ? body.classList.add('overlay-active') : body.classList.remove('overlay-active');
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
        if (!dropdownOpen) applyBlurEffect(false);
    });

    // Logout Modal Logic
    const logoutBtn = document.getElementById('logoutBtn');
    const confirmLogoutBtn = document.getElementById('confirmLogout');
    let logoutModal = document.getElementById('logoutModal') ? new bootstrap.Modal(document.getElementById('logoutModal')) : null;

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

    if (confirmLogoutBtn && logoutModal) {
        confirmLogoutBtn.addEventListener('click', () => {
            window.location.href = "/logout";
            logoutModal.hide();
        });
    }
});