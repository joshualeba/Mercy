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
        return parseFloat(val.toString().replace(/[^0-9.]/g, '')) || 0;
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
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            themeIcon.classList.toggle('bi-moon-fill');
            themeIcon.classList.toggle('bi-sun-fill');
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- WIZARD LOGIC ---
    const form = document.getElementById('retirementWizardForm');

    if (form) {
        // Handle Currency Inputs (comma separation)
        document.querySelectorAll('.currency-input').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9.]/g, '');
                if (value) {
                    const number = parseFloat(value);
                    // Prevent multiple dots
                    const parts = value.split('.');
                    if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');

                    // Just format visualization?
                    // Simple approach: unformat -> format
                    e.target.value = new Intl.NumberFormat('en-US').format(number);
                }
            });
            input.addEventListener('blur', (e) => {
                // On blur maybe standard format?
            });
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    // Try to go next
                    const btn = input.closest('.step-section').querySelector('.next-step-btn');
                    if (btn) btn.click();
                    else if (input.id === 'desiredMonthlyIncome') form.dispatchEvent(new Event('submit'));
                }
            });
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
                const input = target.querySelector('input');
                if (input) input.focus();
            }
        }

        document.querySelectorAll('.next-step-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const currentStep = btn.closest('.step-section');
                const inputs = currentStep.querySelectorAll('input[required]');
                let valid = true;
                inputs.forEach(inp => {
                    if (!inp.value) {
                        inp.classList.add('is-invalid');
                        setTimeout(() => inp.classList.remove('is-invalid'), 2000);
                        valid = false;
                    } else if (inp.type === 'number' && (inp.min && parseFloat(inp.value) < parseFloat(inp.min))) {
                        inp.classList.add('is-invalid');
                        setTimeout(() => inp.classList.remove('is-invalid'), 2000);
                        valid = false;
                    }
                });

                if (valid) {
                    // Check logic: Retirement Age > Current Age
                    if (currentStep.id === 'step-ages') {
                        const currentAge = parseFloat(document.getElementById('currentAge').value);
                        const retAge = parseFloat(document.getElementById('retirementAge').value);
                        if (retAge <= currentAge) {
                            alert("La edad de retiro debe ser mayor a tu edad actual.");
                            return;
                        }
                    }
                    showStep(btn.dataset.next);
                }
            });
        });

        document.querySelectorAll('.prev-step-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                showStep(btn.dataset.prev);
            });
        });

        // --- CALCULATION LOGIC ---
        const resultsModalElement = document.getElementById('resultsModal');
        let resultsModal;
        if (resultsModalElement) resultsModal = new bootstrap.Modal(resultsModalElement);

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Inputs
            const currentAge = parseFloat(document.getElementById('currentAge').value);
            const retirementAge = parseFloat(document.getElementById('retirementAge').value);
            const currentSavings = parseCurrency(document.getElementById('currentSavings').value);
            const monthlyContribution = parseCurrency(document.getElementById('monthlyContribution').value);
            const annualReturnRate = parseFloat(document.getElementById('annualReturnRate').value) || 0;
            const desiredIncome = parseCurrency(document.getElementById('desiredMonthlyIncome').value);

            // Time horizon
            const yearsToGrow = retirementAge - currentAge;
            const monthsToGrow = yearsToGrow * 12;
            const monthlyRate = (annualReturnRate / 100) / 12;

            // Future Value Calculation (Compound Interest)
            // FV = PV * (1+r)^n + PMT * [ ((1+r)^n - 1) / r ]

            let fvSavings = 0;
            let fvContributions = 0;

            if (monthlyRate > 0) {
                fvSavings = currentSavings * Math.pow(1 + monthlyRate, monthsToGrow);
                fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, monthsToGrow) - 1) / monthlyRate);
            } else {
                fvSavings = currentSavings;
                fvContributions = monthlyContribution * monthsToGrow;
            }

            const totalAccumulated = fvSavings + fvContributions;

            // Sustainable Withdrawal Rule (4% Rule)
            // Annual Safe Withdrawal = Total * 0.04
            // Monthly Safe Withdrawal = Total * 0.04 / 12
            const monthlySafeWithdrawal = (totalAccumulated * 0.04) / 12;

            // Coverage Percentage
            let coveragePct = 0;
            if (desiredIncome > 0) {
                coveragePct = (monthlySafeWithdrawal / desiredIncome) * 100;
            }

            // --- DISPLAY RESULTS ---
            document.getElementById('resRetirementAge').textContent = retirementAge;
            document.getElementById('resTotalAccumulated').textContent = formatCurrency(totalAccumulated);
            document.getElementById('resMonthlyIncome').textContent = formatCurrency(monthlySafeWithdrawal);
            document.getElementById('resDesiredIncome').textContent = formatCurrency(desiredIncome);

            document.getElementById('resCoveragePct').textContent = coveragePct.toFixed(1) + '%';
            document.getElementById('resProgressBar').style.width = Math.min(coveragePct, 100) + '%';

            // Progress Bar Color
            const progBar = document.getElementById('resProgressBar');
            if (coveragePct < 50) progBar.className = 'progress-bar bg-danger';
            else if (coveragePct < 80) progBar.className = 'progress-bar bg-warning';
            else progBar.className = 'progress-bar bg-success';

            // Diagnosis Text
            const diagEl = document.getElementById('resDiagnosis');
            const progressText = document.getElementById('resProgressText');

            progressText.textContent = `Con tu plan actual, cubrirías el ${coveragePct.toFixed(1)}% de tu meta mensual deseada.`;

            let diagnosis = "";
            const yearsText = yearsToGrow + " años";

            if (coveragePct >= 100) {
                diagnosis = `¡Excelente! Estás en camino a un retiro dorado. Tu ahorro proyectado te permitirá vivir con más de lo que planeas (${formatCurrency(monthlySafeWithdrawal)}/mes). Sigue así.`;
            } else if (coveragePct >= 80) {
                diagnosis = `¡Muy bien! Estás cerca de tu meta. Con algunos ajustes pequeños (ahorrar un poco más o mejorar tu rendimiento) podrás cubrir el 100% de tus necesidades.`;
            } else if (coveragePct >= 50) {
                diagnosis = `Vas a medio camino. Tienes ${yearsText} para mejorar. Considera aumentar tu aportación mensual o buscar instrumentos de inversión con mejor rendimiento.`;
            } else {
                diagnosis = `Atención requerida. Tu plan actual solo cubriría una pequeña parte de tus gastos. Necesitas aumentar drásticamente tu ahorro mensual o reducir tus expectativas de gasto al retiro.`;
                // Add calculation of needed Monthly Contribution? (Optional complex feature)
                // diagnosis += " Para llegar a tu meta, deberías ahorrar...";
            }

            diagEl.textContent = diagnosis;

            if (resultsModal) resultsModal.show();
        });

        // Initial Focus
        const firstInput = document.getElementById('currentAge');
        if (firstInput) firstInput.focus();
    }

    // Browser Back
    const backBtn = document.getElementById('browserBackBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => window.history.back());
    }

    // UI Standard (Navbar user dropdown) - Keeping consistent with other files
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

    // Logout logic if present in base template
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