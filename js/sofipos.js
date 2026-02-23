document.addEventListener('DOMContentLoaded', () => {

    // --- Loader Logic (CRITICAL) ---
    const loader = document.querySelector('.loader_p');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.classList.remove('loader_bg');
            }, 500);
        }, 800);
    }

    // --- State ---
    let sofiposData = [];
    let currentSort = 'rate_desc';
    let currentInvestment = 10000;
    let currentSearch = '';
    let isGridView = true;

    // --- DOM Elements ---
    const cardsContainer = document.getElementById('sofipos-cards-container');
    const searchInput = document.getElementById('searchInput'); // Fix ID
    const investInput = document.getElementById('investInput');
    const sortSelect = document.getElementById('sortSelect');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const noResults = document.getElementById('noResults');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const chartCanvas = document.getElementById('sofiposChart');
    const themeIcon = document.getElementById('themeIcon');
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // --- Theme Logic ---
    if (themeToggle && themeIcon && htmlElement) {
        const updateThemeIcon = () => {
            const isDark = htmlElement.getAttribute('data-theme') === 'dark';
            themeIcon.className = isDark ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
        };
        updateThemeIcon();

        themeToggle.addEventListener('click', () => {
            const newTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon();
            renderApp(); // Re-render chart
        });
    }

    // --- 1. Load Data ---
    async function loadData() {
        try {
            const response = await fetch('/api/sofipos_data');
            const result = await response.json();
            if (result.success) {
                console.log(`Datos recibidos: ${result.data.length} SOFIPOs`);
                sofiposData = result.data;
                renderApp();
            } else {
                cardsContainer.innerHTML = `<div class="alert alert-danger w-100">Error al cargar datos: ${result.message}</div>`;
            }
        } catch (e) {
            console.error(e);
            cardsContainer.innerHTML = `<div class="alert alert-danger w-100">Error de conexión con el servidor.</div>`;
        }
    }

    // --- 2. Render Logic ---
    function renderApp() {
        // Filter
        let filtered = sofiposData.filter(s => s.nombre.toLowerCase().includes(currentSearch.toLowerCase()));

        // Sort
        filtered.sort((a, b) => {
            if (currentSort === 'rate_desc') return b.tasa - a.tasa;
            if (currentSort === 'rate_asc') return a.tasa - b.tasa;
            if (currentSort === 'nicap_asc') return b.nicap - a.nicap; // Porcentaje mayor es mejor
            return 0;
        });

        // Update Chart
        try {
            updateChart(filtered.slice(0, 10));
        } catch (e) {
            console.error("Error al actualizar gráfico:", e);
        }

        // Render Cards
        cardsContainer.innerHTML = '';

        if (filtered.length === 0) {
            console.warn("No se encontraron SOFIPOs tras filtrar.");
            if (noResults) noResults.classList.remove('d-none');
        } else {
            console.log(`Renderizando ${filtered.length} tarjetas.`);
            if (noResults) noResults.classList.add('d-none');
        }

        filtered.forEach((s, index) => {
            try {
                // Ensure values are numbers
                const tasaVal = parseFloat(s.tasa) || 0;
                const plazoVal = parseInt(s.plazo) || 360;
                const nicapVal = parseFloat(s.nicap) || 0;

                // Calculate Logic
                const earning = (currentInvestment * (tasaVal / 100) * (plazoVal / 360));
                const total = currentInvestment + earning;

                // Format
                const rateClass = tasaVal >= 13 ? 'text-success' : (tasaVal >= 10 ? 'text-primary' : 'text-muted');

                // Nicap Display
                let nicapDisplay = `NICAP: ${nicapVal.toFixed(1)}%`;
                let nicapBadgeClass = 'bg-success bg-opacity-10 text-success border-success';

                if (nicapVal >= 900) {
                    nicapDisplay = 'Respaldo Gubernamental Directo';
                    nicapBadgeClass = 'bg-primary bg-opacity-10 text-primary border-primary';
                } else if (nicapVal < 131) {
                    nicapBadgeClass = 'bg-warning bg-opacity-10 text-warning border-warning';
                }

                // --- Feature Injection ---
                const getFeatures = (name) => {
                    if (!name) return ['Ahorro seguro'];
                    const n = name.toLowerCase();
                    if (n.includes('nu')) return ['Disponibilidad 24/7', 'Sin monto mínimo', 'Pago diario'];
                    if (n.includes('finsus')) return ['Pago mensual', 'Plazos flexibles', 'App intuitiva'];
                    if (n.includes('super')) return ['Seguridad alta', 'Sin comisiones', 'Atención personalizada'];
                    if (n.includes('klar')) return ['Disponibilidad diaria', 'Tarjeta crédito', 'Cashback'];
                    if (n.includes('stori')) return ['Cuenta masiva', 'Gana diario', 'Sin anualidad'];
                    if (n.includes('uala')) return ['Rendimiento diario', 'Tarjeta débito', 'Sin comisiones'];
                    return ['Rendimiento fijo', 'Regulado CNBV', 'Ahorro seguro'];
                };

                const features = getFeatures(s.nombre);
                const featuresHTML = features.map(f => `<span class="badge bg-light text-dark border fw-normal me-1 mb-1" style="font-size: 0.7rem;">${f}</span>`).join('');

                const insuranceTooltip = "Tu dinero está protegido por el Fondo de Protección hasta por 25,000 UDIS (~$200,000 MXN).";

                const cardHTML = `
                    <div class="${isGridView ? 'col-md-6 col-lg-4' : 'col-12'} fade-in card-item">
                        <div class="glass-card has-bubbles p-4 h-100 d-flex flex-column hover-scale sofipo-card shadow-sm" style="border-radius: 20px;">
                            
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="fw-bold mb-0 text-primary" style="font-size: 1.1rem;">${s.nombre || 'Entidad Financiera'}</h5>
                                <i class="bi bi-shield-check-fill text-success fs-5" data-bs-toggle="tooltip" title="${insuranceTooltip}"></i>
                            </div>

                            <div class="mb-3 d-flex align-items-center">
                                <span class="badge ${nicapBadgeClass} border me-2" data-bs-toggle="tooltip" title="Nivel de Capitalización: Un % alto significa mayor fortaleza para proteger tus ahorros.">
                                    <i class="bi bi-bar-chart-fill me-1"></i> ${nicapDisplay}
                                </span>
                            </div>

                            <!-- Features Tags -->
                            <div class="mb-3 d-flex flex-wrap">
                                ${featuresHTML}
                            </div>
                            
                            <div class="text-center my-2 p-3 bg-white bg-opacity-50 rounded-4 border border-white">
                                <span class="display-5 fw-bold ${rateClass}">${tasaVal.toFixed(2)}%</span>
                                <span class="d-block text-muted small fw-bold text-uppercase mt-1">Anual a ${plazoVal} días</span>
                            </div>

                            <!-- Simulator Result -->
                            <div class="mt-3 mb-4 text-center">
                                <div class="d-flex justify-content-between align-items-center mb-1 px-2">
                                    <small class="text-muted">Ganancia:</small>
                                    <span class="fw-bold text-success">+${formatCurrency(earning)}</span>
                                </div>
                                <div class="d-flex justify-content-between align-items-center px-2">
                                    <small class="text-muted">Total final:</small>
                                    <span class="fw-bold text-dark">${formatCurrency(total)}</span>
                                </div>
                                <div class="progress mt-2" style="height: 6px; border-radius: 10px;">
                                    <div class="progress-bar bg-primary" role="progressbar" style="width: ${Math.min(tasaVal * 5, 100)}%"></div>
                                </div>
                            </div>

                            <a href="${s.url || '#'}" target="_blank" class="btn btn-primary rounded-pill w-100 mt-auto fw-bold shadow-sm py-2">
                                Visitar sitio oficial <i class="bi bi-box-arrow-up-right ms-2"></i>
                            </a>
                        </div>
                    </div>
                `;
                cardsContainer.insertAdjacentHTML('beforeend', cardHTML);
            } catch (err) {
                console.error(`Error al renderizar SOFIPO en índice ${index}:`, err);
            }
        });
    }

    // --- Chart Logic ---
    let myChart = null;
    function updateChart(data) {
        if (!chartCanvas) return;
        const ctx = chartCanvas.getContext('2d');
        const labels = data.map(d => d.nombre);
        const values = data.map(d => d.tasa);

        const isDark = htmlElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#fff' : '#666';

        if (myChart) myChart.destroy();

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tasa Anual (%)',
                    data: values,
                    backgroundColor: values.map(v => v >= 13 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(59, 130, 246, 0.7)'),
                    borderRadius: 8,
                    borderWidth: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                        ticks: { color: textColor }
                    },
                    x: { display: false } // Hide X labels for cleaner look on small charts
                }
            }
        });
    }

    // --- Utils ---
    function formatCurrency(val) {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);
    }

    // --- Listeners ---
    if (searchInput) searchInput.addEventListener('keyup', (e) => { currentSearch = e.target.value; renderApp(); });
    if (investInput) investInput.addEventListener('input', (e) => { currentInvestment = parseFloat(e.target.value) || 0; renderApp(); });
    if (sortSelect) sortSelect.addEventListener('change', (e) => { currentSort = e.target.value; renderApp(); });

    if (gridViewBtn) gridViewBtn.addEventListener('change', () => { isGridView = true; renderApp(); });
    if (listViewBtn) listViewBtn.addEventListener('change', () => { isGridView = false; renderApp(); });
    if (clearSearchBtn) clearSearchBtn.addEventListener('click', () => {
        currentSearch = '';
        searchInput.value = '';
        renderApp();
    });

    // --- Navbar Back Button ---
    const browserBackBtn = document.getElementById('browserBackBtn');
    if (browserBackBtn) browserBackBtn.addEventListener('click', () => window.history.back());

    // --- Init ---
    loadData();
});