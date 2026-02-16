document.addEventListener('DOMContentLoaded', () => {

    // --- LOADER ---
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

    // --- THEME ---
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

    // --- LOGIC: GLOSSARY SEARCH + FILTERS ---
    const searchInput = document.getElementById('glossarySearchInput');
    const termsContainer = document.getElementById('glossaryTermsContainer');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const allTerms = document.querySelectorAll('.glossary-item');

    let currentFilter = 'all';
    let currentSearch = '';

    function filterTerms() {
        allTerms.forEach(item => {
            const termCategory = item.dataset.category || 'all';
            const termText = item.dataset.term.toLowerCase();
            const defText = item.querySelector('p').textContent.toLowerCase();
            const searchText = currentSearch.toLowerCase();

            const matchesCategory = currentFilter === 'all' || termCategory === currentFilter;
            const matchesSearch = termText.includes(searchText) || defText.includes(searchText);

            if (matchesCategory && matchesSearch) {
                item.style.display = ''; // Reset to grid/flex
                // Add fade-in animation
                item.style.opacity = '0';
                setTimeout(() => item.style.opacity = '1', 50);
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Filter Buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Logic
            currentFilter = btn.dataset.filter;
            filterTerms();
        });
    });

    // Search Input
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            currentSearch = e.target.value.trim();
            filterTerms();
        });

        // URL Params Logic (Smart Search from other pages)
        const urlParams = new URLSearchParams(window.location.search);
        const queryParam = urlParams.get('q') || urlParams.get('search');

        if (queryParam) {
            // Typing effect
            searchInput.focus();
            let i = 0;
            const typeWriter = setInterval(() => {
                if (i < queryParam.length) {
                    searchInput.value += queryParam.charAt(i);
                    i++;
                } else {
                    clearInterval(typeWriter);
                    currentSearch = queryParam;
                    filterTerms();
                }
            }, 50);
        }
    }

    // --- HERO: RANDOM TERM ---
    const heroTitle = document.getElementById('heroTermTitle');
    const heroDesc = document.getElementById('heroTermDesc');
    const randomBtn = document.getElementById('randomTermBtn');

    function showRandomTerm() {
        if (!allTerms.length) return;
        const randIndex = Math.floor(Math.random() * allTerms.length);
        const term = allTerms[randIndex];

        // Update Hero
        heroTitle.style.opacity = 0;
        heroDesc.style.opacity = 0;

        setTimeout(() => {
            heroTitle.textContent = term.querySelector('h5').textContent;
            heroDesc.textContent = term.querySelector('p').textContent;
            heroTitle.style.opacity = 1;
            heroDesc.style.opacity = 1;
        }, 300);
    }

    if (randomBtn) {
        randomBtn.addEventListener('click', showRandomTerm);
        // Also init on load if not searching
        if (!searchInput || !searchInput.value) {
            // Maybe random on load? 
            // showRandomTerm(); // Optional, let's keep hardcoded one for stability or call it
        }
    }

    // --- NAVBAR & UI UTILS ---
    const userBtn = document.getElementById('userBtn');
    const userDropdown = document.getElementById('userDropdown');
    const mainContent = document.querySelector('.main-content');
    const body = document.body;

    function toggleDropdown(button, dropdown) {
        const isShown = dropdown.classList.toggle('show');
        button.setAttribute('aria-expanded', isShown);
        if (mainContent) isShown ? mainContent.classList.add('blurred-content') : mainContent.classList.remove('blurred-content');
    }

    if (userBtn && userDropdown) {
        userBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleDropdown(userBtn, userDropdown);
        });
        document.addEventListener('click', (event) => {
            if (userDropdown.classList.contains('show')) {
                if (!userDropdown.contains(event.target) && !userBtn.contains(event.target)) {
                    userDropdown.classList.remove('show');
                    if (mainContent) mainContent.classList.remove('blurred-content');
                }
            }
        });
    }

    // Back Button
    const browserBackBtn = document.getElementById('browserBackBtn');
    if (browserBackBtn) {
        browserBackBtn.addEventListener('click', () => window.history.back());
    }

    // Recommendations Modal (if needed for quick tips)
    const recModalEl = document.getElementById('recommendationsModal');
    if (recModalEl) {
        const recModal = new bootstrap.Modal(recModalEl);
        const recBtn = document.getElementById('recommendationsBtn'); // If exists
        if (recBtn) recBtn.addEventListener('click', () => recModal.show());
    }
});