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

    // --- LOADER & THEME ---
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
    const form = document.getElementById('debtWizardForm');

    if (form) {
        // Handle Currency Inputs
        document.querySelectorAll('.currency-input').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9.]/g, '');
                if (value) {
                    const number = parseFloat(value);
                    const parts = value.split('.');
                    if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
                    e.target.value = new Intl.NumberFormat('en-US').format(number);
                }
            });
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const currentStep = input.closest('.step-section');
                    const nextBtn = currentStep.querySelector('.next-step-btn');
                    const submitBtn = currentStep.querySelector('button[type="submit"]');

                    if (nextBtn) {
                        nextBtn.click();
                    } else if (submitBtn) {
                        submitBtn.click();
                    }
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
                    }
                });

                if (valid) showStep(btn.dataset.next);
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
            const debtAmount = parseCurrency(document.getElementById('debtAmount').value);
            const annualInterestRate = parseFloat(document.getElementById('annualInterestRate').value);
            const monthlyPayment = parseCurrency(document.getElementById('monthlyPayment').value);

            if (debtAmount <= 0) return;

            // Monthly Interest
            const monthlyRate = (annualInterestRate / 100) / 12;
            const minInterestPayment = debtAmount * monthlyRate;

            // Check if payment covers interest
            if (monthlyPayment <= minInterestPayment) {
                alert(`Tu pago mensual ($${formatCurrency(monthlyPayment)}) es muy bajo. Ni siquiera cubre los intereses generados ($${formatCurrency(minInterestPayment)}). ¡Tu deuda crecerá infinitamente! Debes pagar más de ${formatCurrency(minInterestPayment)}.`);
                return;
            }

            // Calculate Months (NPER)
            // N = -log(1 - (i * PV) / PMT) / log(1 + i)
            let months = 0;
            if (monthlyRate > 0) {
                months = -Math.log(1 - (monthlyRate * debtAmount) / monthlyPayment) / Math.log(1 + monthlyRate);
            } else {
                months = debtAmount / monthlyPayment;
            }

            months = Math.ceil(months);

            // Calculate Total Paid
            // Roughly: Payment * Months. 
            // Note: Last month might be partial. But strict PMT * Months gives total cash needed (slightly over).
            // Better: Iterate to find exact interest? For Wizard simple display, Payment * Months is close enough estimate.

            const totalPaid = monthlyPayment * months; // Simple estimate
            const totalInterest = totalPaid - debtAmount;

            // Format Results
            const years = Math.floor(months / 12);
            const remainingMonths = months % 12;
            let timeString = "";
            if (years > 0) timeString += `${years} año${years > 1 ? 's' : ''}`;
            if (years > 0 && remainingMonths > 0) timeString += " y ";
            if (remainingMonths > 0 || years === 0) timeString += `${remainingMonths} mes${remainingMonths !== 1 ? 'es' : ''}`;

            // Estimated Date
            const finishDate = new Date();
            finishDate.setMonth(finishDate.getMonth() + months);
            const dateOptions = { month: 'long', year: 'numeric' };
            const formattedDate = finishDate.toLocaleDateString('es-ES', dateOptions);

            document.getElementById('resTime').textContent = timeString;
            document.getElementById('resDate').textContent = formattedDate;
            document.getElementById('resTotalInterest').textContent = formatCurrency(totalInterest);
            document.getElementById('resTotalPaid').textContent = formatCurrency(totalPaid);

            // Breakdown Bars
            const interestPct = (totalInterest / totalPaid) * 100;
            const principalPct = 100 - interestPct;

            document.getElementById('barPrincipal').style.width = principalPct + '%';
            document.getElementById('barInterest').style.width = interestPct + '%';
            document.getElementById('resInterestPer100').textContent = '$' + Math.round(interestPct).toFixed(0);

            // Smart Tip / Strategy
            const tipEl = document.getElementById('resSmartTip');

            // Scenario: Pay +20%
            const boostedPayment = monthlyPayment * 1.2;
            let boostedMonths = 0;
            if (monthlyRate > 0) {
                boostedMonths = -Math.log(1 - (monthlyRate * debtAmount) / boostedPayment) / Math.log(1 + monthlyRate);
            } else {
                boostedMonths = debtAmount / boostedPayment;
            }
            boostedMonths = Math.ceil(boostedMonths);
            const savedMonths = months - boostedMonths;
            const boostedTotalPaid = boostedPayment * boostedMonths;
            const savedMoney = totalPaid - boostedTotalPaid;

            if (savedMonths > 0) {
                tipEl.innerHTML = `Si aumentas tu pago a <strong>${formatCurrency(boostedPayment)}</strong> (+20%), terminarías <strong>${savedMonths} meses antes</strong> y te ahorrarías <strong>${formatCurrency(savedMoney)}</strong> en intereses.`;
            } else {
                tipEl.textContent = "Estás pagando muy rápido. ¡Sigue así!";
            }

            if (resultsModal) resultsModal.show();
        });

        const firstInput = document.getElementById('debtAmount');
        if (firstInput) firstInput.focus();
    }

    // Back Button
    const backBtn = document.getElementById('browserBackBtn');
    if (backBtn) backBtn.addEventListener('click', () => window.history.back());

    // Auth UI Logic
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