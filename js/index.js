/* ===============================================
   SECCIÓN: DESPLAZAMIENTO AL CARGAR (ON LOAD)
   =============================================== */
// Manejo de desplazamiento al cargar la página si hay una ruta en la URL
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash) {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 600);
        }
    }
});

/* ===============================================
   SECCIÓN: LOADER
   =============================================== */
window.addEventListener("load", () => {
    const loader = document.getElementById("loader-screen");
    loader.style.opacity = "0";
    loader.style.visibility = "hidden";
    loader.style.transition = "all 0.5s ease";
});

/* ===============================================
   SECCIÓN: NAVBAR (EFECTO SCROLL)
   =============================================== */
window.addEventListener('load', function () {
    const navbar = document.querySelector('.navbar-custom');

    function updateNavbar() {
        if (window.innerWidth < 992) {
            navbar.classList.add('scrolled');
        } else {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }
    updateNavbar();
    window.addEventListener('scroll', updateNavbar);
    window.addEventListener('resize', updateNavbar);
});

/* ===============================================
   SECCIÓN: SMOOTH SCROLLING
   =============================================== */
// Mapa de IDs internos → rutas limpias en español
const seccionesLanding = {
    '#home': '/',
    '#features': '/porque-bankario',
    '#services': '/servicios',
    '#testimonios': '/testimonios',
    '#faq': '/preguntas-frecuentes'
};

// El desplazamiento fluido ya está manejado por CSS (scroll-behavior: smooth)
// Solo nos aseguramos de que el offset sea correcto por el navbar fijo
// Scroll Spy: Activa los enlaces del navbar según la sección visible
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const sections = document.querySelectorAll('section[id]');

const scrollSpyOptions = {
    threshold: 0.5,
    rootMargin: "-90px 0px 0px 0px"
};

const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, scrollSpyOptions);

sections.forEach(section => scrollSpyObserver.observe(section));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const navbar = document.querySelector('.navbar-custom');
            const offset = navbar ? navbar.offsetHeight + 10 : 90;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = target.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Actualizar URL sin hash
            // history.pushState(null, null, href); // Comentado según solicitud anterior
        }
    });
});

/* ===============================================
   SECCIÓN: MENÚ MÓVIL (BLUR Y CIERRE)
   =============================================== */
const navbarCollapse = document.querySelector('.navbar-collapse');
const contentToBlur = document.querySelectorAll('#home, #features, #services, #testimonios, #faq, .section-padding, .footer, .quote-banner');

function setContentBlur(isBlurred) {
    contentToBlur.forEach(el => {
        if (isBlurred) {
            el.classList.add('content-blur');
        } else {
            el.classList.remove('content-blur');
        }
    });
}

if (navbarCollapse) {
    navbarCollapse.addEventListener('show.bs.collapse', () => {
        setContentBlur(true);
    });
    navbarCollapse.addEventListener('hide.bs.collapse', () => {
        setContentBlur(false);
    });

    // cerrar el navbar en móviles al hacer clic en un enlace
    document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .btn-accent, .navbar-nav .btn-accent-outline').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

/* ===============================================
   SECCIÓN: CARRUSEL DE TESTIMONIOS (SWIPER)
   =============================================== */
const swiper = new Swiper('.mySwiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    grabCursor: true,
    centeredSlides: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: true,
        pauseOnMouseEnter: true
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
            centeredSlides: false
        },
        992: {
            slidesPerView: 3,
            centeredSlides: false
        }
    }
});

/* ===============================================
   SECCIÓN: CARRUSEL "¿POR QUÉ ELEGIR BANKARIO?"
   =============================================== */
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('whyTrack');
    const dotsContainer = document.getElementById('whyDots');
    const prevBtn = document.getElementById('whyPrev');
    const nextBtn = document.getElementById('whyNext');

    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.why-slide'));
    let currentIndex = 0;
    let slidesVisible = getSlidesVisible();
    const totalPages = Math.ceil(slides.length / slidesVisible);

    function getSlidesVisible() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 992) return 2;
        return 3;
    }

    function buildDots() {
        dotsContainer.innerHTML = '';
        const pages = Math.ceil(slides.length / getSlidesVisible());
        for (let i = 0; i < pages; i++) {
            const dot = document.createElement('button');
            dot.className = 'why-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Ir a página ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const sv = getSlidesVisible();
        const pageIndex = Math.floor(currentIndex / sv);
        document.querySelectorAll('.why-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === pageIndex);
        });
    }

    function goTo(pageIndex) {
        const sv = getSlidesVisible();
        const maxIndex = slides.length - sv;
        currentIndex = Math.min(pageIndex * sv, maxIndex);
        const slideWidth = slides[0].offsetWidth + 24; // gap = 24px
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateDots();
    }

    function goNext() {
        const sv = getSlidesVisible();
        const maxIndex = slides.length - sv;
        if (currentIndex < maxIndex) {
            currentIndex = currentIndex + 1;
        } else {
            currentIndex = 0; // loop
        }
        const slideWidth = slides[0].offsetWidth + 24;
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateDots();
    }

    function goPrev() {
        const sv = getSlidesVisible();
        const maxIndex = slides.length - sv;
        if (currentIndex > 0) {
            currentIndex = currentIndex - 1;
        } else {
            currentIndex = maxIndex; // loop al final
        }
        const slideWidth = slides[0].offsetWidth + 24;
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateDots();
    }

    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);

    // Auto-play del carrusel
    let autoPlayInterval = setInterval(goNext, 3500);

    // Pausar auto-play on hover
    track.closest('.why-carousel-wrapper').addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    track.closest('.why-carousel-wrapper').addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(goNext, 3500);
    });

    // Modal Logic for "Ver más"
    const featureModal = document.getElementById('feature-detail-modal');
    const featureTitle = document.getElementById('feature-modal-title');
    const featureDesc = document.getElementById('feature-modal-desc');
    const closeFeatureModalBtn = document.getElementById('close-feature-modal');
    const closeFeatureModalBtn2 = document.getElementById('close-feature-modal-btn');

    document.querySelectorAll('.feature-more-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            clearInterval(autoPlayInterval); // pausar auto scroll
            featureTitle.textContent = btn.getAttribute('data-title');
            featureDesc.textContent = btn.getAttribute('data-desc');
            featureModal.style.display = 'flex';
        });
    });

    const closeFeatureModal = () => {
        featureModal.style.display = 'none';
        autoPlayInterval = setInterval(goNext, 3500); // reanudar auto scroll
    }

    if (closeFeatureModalBtn) closeFeatureModalBtn.addEventListener('click', closeFeatureModal);
    if (closeFeatureModalBtn2) closeFeatureModalBtn2.addEventListener('click', closeFeatureModal);

    window.addEventListener('click', (e) => {
        if (e.target === featureModal) {
            closeFeatureModal();
        }
    });


    // Reconstruir al redimensionar
    window.addEventListener('resize', () => {
        currentIndex = 0;
        track.style.transform = 'translateX(0)';
        buildDots();
        updateDots();
    });

    buildDots();
});

/* ===============================================
   SECCIÓN: FAQ ACORDEÓN
   =============================================== */
document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            // Cerrar todos
            faqQuestions.forEach(otherBtn => {
                otherBtn.setAttribute('aria-expanded', 'false');
                const answer = otherBtn.nextElementSibling;
                if (answer) answer.classList.remove('open');
            });

            // Abrir el clickeado si estaba cerrado
            if (!isOpen) {
                btn.setAttribute('aria-expanded', 'true');
                const answer = btn.nextElementSibling;
                if (answer) answer.classList.add('open');
            }
        });
    });
});

/* ===============================================
   SECCIÓN: MODAL "MÁS INFORMACIÓN"
   =============================================== */
const modal = document.getElementById('info-modal');
const btnInfo = document.getElementById('btn-info');
const btnOk = document.getElementById('btn-ok');

if (modal && btnInfo && btnOk) {
    btnInfo.addEventListener('click', () => {
        modal.style.display = 'flex';
    });
    btnOk.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

/* ===============================================
   SECCIÓN: MODAL "TÉRMINOS Y CONDICIONES"
   =============================================== */
const termsModal = document.getElementById('terms-modal');
const termsLink = document.getElementById('termsLink');
const termsBtnOk = document.getElementById('btn-terms-ok');

if (termsModal && termsLink && termsBtnOk) {

    termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        termsModal.style.display = 'flex';
    });

    termsBtnOk.addEventListener('click', () => {
        termsModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === termsModal) {
            termsModal.style.display = 'none';
        }
    });
}

/* ===============================================
   SECCIÓN: EFECTO LAZY LOAD
   =============================================== */
document.addEventListener("DOMContentLoaded", () => {
    const lazyElements = document.querySelectorAll(".lazy-load");
    const sectionTitles = document.querySelectorAll(".section-title");

    const observerOptions = {
        threshold: 0.1
    };

    const lazyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    lazyElements.forEach(el => lazyObserver.observe(el));
    sectionTitles.forEach(el => lazyObserver.observe(el));
});

/* ===============================================
   SECCIÓN: EFECTO TYPED (TÍTULO)
   =============================================== */
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('typed-text')) {
        var options = {
            strings: [
                'simular tu futuro financiero',
                'planificar tus ahorros',
                'entender tus créditos',
                'alcanzar tus metas financieras',
                'invertir con confianza',
                'dominar tus finanzas personales'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1500,
            startDelay: 500,
            loop: true,
            smartBackspace: true
        };
        var typed = new Typed('#typed-text', options);
    }
});

/* ===============================================
   SECCIÓN: CHATBOT LANDING PAGE
   =============================================== */
document.addEventListener('DOMContentLoaded', () => {
    const triggerBtn = document.getElementById('landingChatbotTriggerBtn');
    const container = document.getElementById('landingChatbotContainer');
    const closeBtn = document.getElementById('closeLandingChatbotBtn');
    const input = document.getElementById('landingChatbotInput');
    const sendBtn = document.getElementById('landingChatbotSendBtn');
    const messagesEl = document.getElementById('landingChatbotMessages');
    const quickActionsEl = document.getElementById('landingQuickActions');
    const stopContainer = document.getElementById('landingChatbotStopContainer');
    const stopBtn = document.getElementById('landingChatbotStopBtn');

    if (!triggerBtn || !container) return;

    let isConnecting = false;
    let isTyping = false;
    let sessionHistory = [];
    let currentAbortController = null;
    let currentTyped = null;

    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            if (currentAbortController) {
                currentAbortController.abort();
                currentAbortController = null;
            }
            if (currentTyped) {
                // stop() pausa la animación pero mantiene el texto ya escrito visible
                currentTyped.stop();
                // Extraer el texto visible hasta donde llegó y fijarlo en el elemento
                const typedEl = currentTyped.el;
                if (typedEl) {
                    const visibleText = typedEl.innerHTML;
                    currentTyped.destroy();
                    typedEl.innerHTML = visibleText;
                } else {
                    currentTyped.destroy();
                }
                currentTyped = null;
            }
            stopGenerationActions();
        });
    }

    function stopGenerationActions() {
        isConnecting = false;
        isTyping = false;
        if (stopContainer) stopContainer.classList.add('d-none');
        setSendLoading(false);
        removeTypingIndicators();
    }

    // Abrir / cerrar chatbot
    triggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const callToAction = document.getElementById('chatbotCta');
        if (callToAction) callToAction.style.display = 'none'; // ocultar el globito al abrir

        if (container.classList.contains('d-none')) {
            container.classList.remove('d-none');

            // Typed effect para el primer mensaje
            const firstMsg = messagesEl.querySelector('.chat-bubble.ai-bubble');
            if (firstMsg && !firstMsg.classList.contains('typed-done')) {
                firstMsg.classList.add('typed-done');
                firstMsg.innerHTML = '<span id="chatbot-typed-landing"></span>';
                new Typed('#chatbot-typed-landing', {
                    strings: ['¡Hola! Soy BANK IA. Estoy aquí para resolver tus dudas sobre la plataforma. ¿En qué puedo ayudarte?'],
                    typeSpeed: 20,
                    showCursor: false
                });
            }

            input.focus();
        } else {
            container.classList.add('d-none');
        }
    });

    closeBtn.addEventListener('click', () => {
        container.classList.add('d-none');
    });

    // Cerrar al hacer clic afuera
    document.addEventListener('click', (e) => {
        if (!container.classList.contains('d-none') &&
            !container.contains(e.target) &&
            e.target !== triggerBtn &&
            !triggerBtn.contains(e.target)) {
            container.classList.add('d-none');
        }
    });

    // Quick actions
    if (quickActionsEl) {
        quickActionsEl.querySelectorAll('.landing-quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.getAttribute('data-query');
                if (query) {
                    input.value = query;
                    sendMessage();
                }
            });
        });
    }

    // Enviar mensaje
    async function sendMessage() {
        const text = input.value.trim();
        if (!text || isConnecting || isTyping) return;

        isConnecting = true;
        input.value = '';

        // Mensaje del usuario
        addBubble(text, 'user');

        // Ocultar quick actions
        if (quickActionsEl) quickActionsEl.style.display = 'none';

        // Indicador de escritura
        const typingId = showTyping();

        // Historia de sesión
        sessionHistory.push({ role: 'user', content: text });
        if (sessionHistory.length > 6) sessionHistory.shift();

        // Deshabilitar botón
        setSendLoading(true);
        if (stopContainer) stopContainer.classList.remove('d-none');
        currentAbortController = new AbortController();

        try {
            const response = await fetch('/api/copiloto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mensaje: text,
                    contexto: `Página de inicio de BANKario. El usuario está explorando la plataforma y NO tiene sesión iniciada. IMPORTANTE: Sé extremadamente breve y directo (máximo 1-2 oraciones). Responde solo preguntas generales sobre la plataforma: simuladores, glosario, diagnóstico 360°, ranking SOFIPOs, IA financiera. Para cualquier consulta de datos personales o financieros muy específicos, indícales que creen una cuenta gratis.`,
                    historial: sessionHistory.slice(0, -1)
                }),
                signal: currentAbortController.signal
            });

            const data = await response.json();
            removeTyping(typingId);

            if (!isConnecting && !isTyping) return;

            if (data.success && data.respuesta) {
                sessionHistory.push({ role: 'assistant', content: data.respuesta });

                isConnecting = false;
                isTyping = true;

                // Convertir markdown negritas a HTML
                let cleanResponse = data.respuesta
                    .replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                // Mostrar con tipeado
                const bubbleId = addBubbleAiEmpty();
                currentTyped = new Typed(`#${bubbleId}`, {
                    strings: [cleanResponse],
                    typeSpeed: 10,
                    showCursor: false,
                    onComplete: () => {
                        stopGenerationActions();
                        messagesEl.scrollTop = messagesEl.scrollHeight;
                        // Agregar CTA si no hay sesión
                        if (sessionHistory.length >= 4 && !document.getElementById('landingChatCta')) {
                            addCtaBubble();
                        }
                    }
                });

            } else {
                addBubble('Lo siento, tuve un problema. Por favor intenta de nuevo.', 'ai');
                stopGenerationActions();
            }

        } catch (err) {
            removeTyping(typingId);
            if (err.name === 'AbortError') {
                console.log('Generación detenida por el usuario.');
            } else {
                addBubble('No pude conectarme al servidor. Intenta más tarde.', 'ai');
            }
            stopGenerationActions();
        }
    }

    sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        sendMessage();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            sendMessage();
        }
    });

    function addBubble(html, sender) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}-bubble`;
        bubble.innerHTML = html;
        messagesEl.appendChild(bubble);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function addBubbleAiEmpty() {
        const id = 'lc-ai-' + Date.now();
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ai-bubble`;
        bubble.innerHTML = `<span id="${id}"></span>`;
        messagesEl.appendChild(bubble);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return id;
    }

    function addCtaBubble() {
        const bubble = document.createElement('div');
        bubble.id = 'landingChatCta';
        bubble.className = 'chat-bubble ai-bubble';
        bubble.innerHTML = `
            <strong>¿Listo para empezar?</strong> 🚀<br>
            Crea tu cuenta gratis en BANKario y accede a todos los simuladores y herramientas ahora mismo.<br><br>
            <a href="/registro" class="btn btn-primary btn-sm rounded-pill mt-2" style="font-weight: 600;">Crear cuenta gratis →</a>
        `;
        messagesEl.appendChild(bubble);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
        const id = 'lc-typing-' + Date.now();
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble ai-bubble typing-indicator';
        bubble.id = id;
        bubble.innerHTML = '<span></span><span></span><span></span>';
        messagesEl.appendChild(bubble);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return id;
    }

    function removeTyping(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function removeTypingIndicators() {
        const indicators = messagesEl.querySelectorAll('.typing-indicator');
        indicators.forEach(el => el.remove());
    }

    function setSendLoading(loading) {
        sendBtn.disabled = loading;
        sendBtn.innerHTML = loading
            ? '<span class="spinner-border spinner-border-sm" role="status" style="width: 1rem; height: 1rem;"></span>'
            : '<i class="bi bi-send-fill" style="margin-left: -2px;"></i>';
    }
});
