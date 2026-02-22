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

    // --- LÓGICA ESPECÍFICA DEL SIMULADOR DE INVERSIÓN ---

    const investmentSimulationForm = document.getElementById('investmentSimulationForm');

    // Check if modal exists before init
    const resultsModalEl = document.getElementById('resultsModal');
    let resultsModal;
    if (resultsModalEl) {
        resultsModal = new bootstrap.Modal(resultsModalEl);
    }

    const initialAmountInput = document.getElementById('initialAmount');
    const monthlyContributionInput = document.getElementById('monthlyContribution');
    const annualReturnRateInput = document.getElementById('annualReturnRate');
    const investmentTermInput = document.getElementById('investmentTerm');

    // Wizard Logic (Step Navigation)
    const stepSections = document.querySelectorAll('.step-section');
    const nextBtns = document.querySelectorAll('.next-step-btn');
    const prevBtns = document.querySelectorAll('.prev-step-btn');

    function showStep(stepId) {
        stepSections.forEach(section => {
            section.classList.add('d-none');
        });
        const target = document.getElementById(stepId);
        if (target) {
            target.classList.remove('d-none');
            // Auto-focus logic
            const input = target.querySelector('input');
            if (input) {
                setTimeout(() => input.focus(), 100);
            }
        }
    }

    // Inicializar en paso 1
    // showStep('step-initial'); // Ya está en HTML con d-none correctos, pero podemos forzar

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStepId = btn.dataset.next;
            const currentSection = btn.closest('.step-section');
            const input = currentSection.querySelector('input');

            let isValid = true;
            if (input && input.hasAttribute('required')) {
                // If it's a money input with commas, replace them.
                const valStr = input.value.replace(/,/g, '');
                if (!valStr || parseFloat(valStr) < 0 || (input.type === 'number' && !input.checkValidity())) {
                    input.classList.add('border-danger');
                    input.focus();
                    isValid = false;
                } else {
                    input.classList.remove('border-danger');
                }
            }

            if (isValid) {
                showStep(nextStepId);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStepId = btn.dataset.prev;
            showStep(prevStepId);
        });
    });

    // Enter Key Navigation
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

    // Formatting Inputs (Currency with Commas)
    const moneyInputs = ['initialAmount', 'monthlyContribution'];
    moneyInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function () {
                let value = this.value.replace(/\D/g, '');
                if (value === "") {
                    this.value = "";
                } else {
                    this.value = new Intl.NumberFormat('en-US').format(value);
                }
            });
        }
    });

    // Handle Form Submit
    investmentSimulationForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Parse values
        const parseCurrency = (val) => parseFloat(val.replace(/,/g, '')) || 0;

        const initialAmount = parseCurrency(initialAmountInput.value);
        const monthlyContribution = parseCurrency(monthlyContributionInput.value);
        const annualRate = parseFloat(annualReturnRateInput.value);
        const years = parseInt(investmentTermInput.value);

        // Validation final
        if (isNaN(annualRate) || isNaN(years) || years <= 0) {
            return; // Should be handled by UI required
        }

        // --- CALCULATIONS ---
        const monthlyRate = (annualRate / 100) / 12;
        const totalMonths = years * 12;

        let futureValue = initialAmount;
        let totalInvested = initialAmount;

        for (let i = 0; i < totalMonths; i++) {
            futureValue = (futureValue + monthlyContribution) * (1 + monthlyRate);
            totalInvested += monthlyContribution;
        }

        // If monthlyRate is 0 loop works, if logic is correct.
        if (annualRate === 0) {
            futureValue = initialAmount + (monthlyContribution * totalMonths);
        }

        const totalInterest = futureValue - totalInvested;

        // --- UI UPDATES ---
        document.getElementById('displayTotalInvested').textContent = formatCurrency(totalInvested);
        document.getElementById('displayTotalInterest').textContent = `+${formatCurrency(totalInterest)}`;
        document.getElementById('displayFinalAmount').textContent = formatCurrency(futureValue);

        // Progress Bar Update
        let percentInvested = 100;
        let percentInterest = 0;
        if (futureValue > 0) {
            percentInvested = (totalInvested / futureValue) * 100;
            percentInterest = (totalInterest / futureValue) * 100;
        }

        const barInvested = document.getElementById('barInvested');
        const barInterest = document.getElementById('barInterest');

        if (barInvested && barInterest) {
            barInvested.style.width = `${percentInvested}%`;
            barInterest.style.width = `${percentInterest}%`;
            barInvested.textContent = percentInvested > 15 ? 'Tu capital' : '';
            barInterest.textContent = percentInterest > 15 ? 'Intereses' : '';
        }

        // Recommendation Logic
        const recElement = document.getElementById('investmentRecommendation');
        let recommendation = "";

        if (annualRate < 5) {
            recommendation = "Tu tasa de rendimiento es conservadora. Es segura, pero podrías buscar instrumentos que, al menos, superen la inflación anual.";
        } else if (annualRate >= 5 && annualRate <= 12) {
            recommendation = "Utilizaste una tasa realista para instrumentos de renta fija como CETES o SOFIPOs. Es un excelente balance entre riesgo y seguridad.";
        } else {
            recommendation = "Una tasa superior al 12% sugiere renta variable (acciones, cripto). Recuerda que a mayor rendimiento posible, mayor es el riesgo de volatilidad.";
        }

        if (years >= 10) {
            recommendation += " Al invertir a largo plazo, el interés compuesto tiene un efecto multiplicador masivo.";
        }

        recElement.textContent = recommendation;


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

    document.getElementById('simulacion-inversion-section').classList.remove('d-none');

    // sección: lógica del botón de regresar del navegador
    const browserBackBtn = document.getElementById('browserBackBtn');
    if (browserBackBtn) {
        browserBackBtn.addEventListener('click', () => {
            window.history.back();
        });
    }
});

// Función para descargar PDF de Inversión
window.descargarPDFInversion = function (event) {
    if (event) event.preventDefault();
    if (typeof window.jsPDF !== 'undefined') {
        const doc = new window.jsPDF();
        if (typeof aplicarEstiloPDFMercy === 'function') {
            aplicarEstiloPDFMercy(doc, 'Proyección de Inversión');
        } else {
            doc.setFontSize(18);
            doc.text("Proyección de Inversión", 14, 20);
        }

        let yPos = 60;
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);

        // Extraer valores actuales
        const totalInvertido = document.getElementById('displayTotalInvested').innerText;
        const gananciaInteres = document.getElementById('displayTotalInterest').innerText;
        const montoFinal = document.getElementById('displayFinalAmount').innerText;
        const recomendacion = document.getElementById('investmentRecommendation').innerText;

        doc.setFont('helvetica', 'normal');

        doc.autoTable({
            startY: yPos,
            head: [['Concepto', 'Monto']],
            body: [
                ['Total invertido por ti', totalInvertido],
                ['Ganancia obtenida por intereses', gananciaInteres],
                ['Monto Final Estimado', montoFinal]
            ],
            theme: 'striped',
            headStyles: { fillColor: [13, 110, 253] }
        });

        yPos = doc.lastAutoTable.finalY + 15;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Análisis Inteligente", 15, yPos);
        yPos += 10;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const textLines = doc.splitTextToSize(recomendacion, doc.internal.pageSize.getWidth() - 30);
        doc.text(textLines, 15, yPos);

        doc.save('Mercy_Proyeccion_Inversion.pdf');
    } else {
        alert("La biblioteca de PDF no pudo cargar. Por favor recarga la página.");
    }
};