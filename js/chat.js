document.addEventListener('DOMContentLoaded', () => {
    const chatbotContainer = document.getElementById('mercyChatbotContainer');
    const chatbotTriggerBtn = document.getElementById('chatbotTriggerBtn');
    const closeChatbotBtn = document.getElementById('closeChatbotBtn');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSendBtn = document.getElementById('chatbotSendBtn');
    const chatbotMessages = document.getElementById('chatbotMessages');

    if (!chatbotContainer || !chatbotTriggerBtn) return;

    let isConnecting = false;
    let isTyping = false;
    let abortTyping = false;
    let sessionChatHistory = [];
    const chatbotCta = document.getElementById('chatbotCta');

    const testContainer = document.getElementById('testContainer');
    if (testContainer) {
        const observer = new MutationObserver(() => {
            if (!testContainer.classList.contains('d-none')) {
                chatbotTriggerBtn.style.display = 'none';
                chatbotContainer.classList.add('d-none');
                if (chatbotCta) chatbotCta.style.display = 'none';
            } else {
                chatbotTriggerBtn.style.display = 'flex';
                // Solo mostrar CTA nuevamente si el chatbot no está abierto activamente
                if (chatbotContainer.classList.contains('d-none') && chatbotCta && !chatbotCta.dataset.closedForever) {
                    chatbotCta.style.display = 'flex';
                }
            }
        });
        observer.observe(testContainer, { attributes: true, attributeFilter: ['class'] });
    }

    // Toggle Chatbot
    chatbotTriggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (chatbotCta) {
            chatbotCta.style.display = 'none';
            chatbotCta.dataset.closedForever = "true";
        }

        if (chatbotContainer.classList.contains('d-none')) {
            chatbotContainer.classList.remove('d-none');
            chatbotTriggerBtn.innerHTML = '<i class="bi bi-x-lg fs-4"></i>';
            document.body.classList.add('chatbot-is-open');
            chatbotInput.focus();
        } else {
            chatbotContainer.classList.add('d-none');
            chatbotTriggerBtn.innerHTML = '<i class="bi bi-heart-pulse-fill fs-3"></i>';
            document.body.classList.remove('chatbot-is-open');
        }
    });

    closeChatbotBtn.addEventListener('click', () => {
        chatbotContainer.classList.add('d-none');
        chatbotTriggerBtn.innerHTML = '<i class="bi bi-heart-pulse-fill fs-3"></i>';
        document.body.classList.remove('chatbot-is-open');
    });

    // Cerrar al hacer click afuera
    document.addEventListener('click', (e) => {
        if (!chatbotContainer.classList.contains('d-none') &&
            document.body.contains(e.target) &&
            !chatbotContainer.contains(e.target) &&
            e.target !== chatbotTriggerBtn &&
            !chatbotTriggerBtn.contains(e.target)) {
            chatbotContainer.classList.add('d-none');
            chatbotTriggerBtn.innerHTML = '<i class="bi bi-heart-pulse-fill fs-3"></i>';
            document.body.classList.remove('chatbot-is-open');
        }
    });

    // Preguntas rápidas dinámicas
    const allQuestions = [
        { label: "¿Cómo empiezo a ahorrar?", query: "¿Cómo puedo empezar a ahorrar si gano poco y no me sobra dinero?" },
        { label: "Opciones de inversión", query: "¿Cuáles son las mejores opciones para invertir mi dinero de forma segura?" },
        { label: "¿Invertir o pagar deudas?", query: "¿Qué debería de hacer, invertir mi dinero o pagar mis deudas y por qué?" },
        { label: "Mejorar mi buró", query: "Dime 3 formas exactas de mejorar mi historial crediticio rápido." },
        { label: "¿Qué es una SOFIPO?", query: "¿Qué es una SOFIPO y qué tan seguro es invertir ahí?" },
        { label: "Fondo de emergencia", query: "¿De cuántos meses debe ser mi fondo de emergencia mínimo para estar tranquilo?" },
        { label: "Regla 50/30/20", query: "¿Me explicas súper rápido qué es la regla 50/30/20 y cómo se aplica?" },
        { label: "Evitar gastos hormiga", query: "¿Cómo puedo identificar y evitar los gastos hormiga diarios?" },
        { label: "Tarjetas sin interes", query: "¿Cuál es la mejor forma de usar mi tarjeta de crédito sin pagar un solo peso de intereses?" },
        { label: "CetesDirecto", query: "¿Qué son los CETES y conviene meter mi dinero ahí?" },
        { label: "Interés compuesto", query: "¿Dime de forma fácil cómo funciona el interés compuesto en las inversiones?" },
        { label: "Inflación Actual", query: "¿Cómo me afecta la inflación hoy en día y qué hacer para proteger mi dinero?" },
        { label: "Rendimientos Nu", query: "¿Cuál es el rendimiento actual que da la cajita de Nu?" },
        { label: "Impuestos al SAT", query: "¿A partir de cuánto dinero invertido tengo que pagar impuestos al SAT?" },
        { label: "Mejor tarjeta débito", query: "¿Qué banco en México me recomiendas para abrir mi primera cuenta de débito?" },
        { label: "¿Qué es el GAT?", query: "¿Qué significa GAT real y GAT nominal cuando voy a meter mi dinero a un banco?" },
        { label: "Pagar tarjeta", query: "¿Dime cuál es la fecha límite de pago y la fecha de corte en una tarjeta?" },
        { label: "¿Qué pasa si no pago?", query: "¿Qué me pasa legalmente si dejo de pagar un préstamo al banco en México?" },
        { label: "Comprar vs Rentar", query: "¿A mi edad y con un sueldo promedio, conviene más rentar una casa o sacarla en Infonavit?" },
        { label: "Finanzas en pareja", query: "¿Cuáles son los 3 mejores consejos para manejar el dinero con mi pareja sin pelear?" },
        { label: "¿Klar, Ualá o Nu?", query: "¿De entre Klar, Ualá y Nu, cuál banco da mejor porcentaje o más beneficios hoy?" },
        { label: "¿Qué es la Bolsa?", query: "¿Me explicas con manzanitas cómo funciona la bolsa y las acciones de empresas?" },
        { label: "Inhibir fraudes", query: "¿Cómo saber si me están haciendo un fraude tipo pirámide o esquema Ponzi?" },
        { label: "Crédito automotriz", query: "¿En qué me tengo que fijar al sacar un crédito para un carro de agencia?" },
        { label: "Negocio propio", query: "¿Qué debo tomar en cuenta o calcular antes de invertir todos mis ahorros en emprender?" }
    ];

    let usedQuestions = [];
    try {
        usedQuestions = JSON.parse(localStorage.getItem('mercy_used_questions') || '[]');
    } catch (e) { }

    let currentShownQuestions = [];

    function renderQuickActions() {
        const qaContainer = document.getElementById('chatQuickActions');
        if (!qaContainer) return;
        qaContainer.innerHTML = '';
        qaContainer.style.display = 'flex';

        if (usedQuestions.length >= allQuestions.length) {
            usedQuestions = [];
            localStorage.setItem('mercy_used_questions', '[]');
        }

        while (currentShownQuestions.length < 4) {
            const available = allQuestions.filter(q => !usedQuestions.includes(q.query) && !currentShownQuestions.find(sq => sq.query === q.query));
            if (available.length === 0) break;
            const randomQ = available[Math.floor(Math.random() * available.length)];
            currentShownQuestions.push(randomQ);
        }

        if (currentShownQuestions.length === 0) {
            qaContainer.style.display = 'none';
            return;
        }

        currentShownQuestions.forEach(q => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-sm btn-outline-primary rounded-pill quick-action-btn';
            btn.textContent = q.label;
            btn.onclick = (e) => {
                e.stopPropagation();
                chatbotInput.value = q.query;

                usedQuestions.push(q.query);
                localStorage.setItem('mercy_used_questions', JSON.stringify(usedQuestions));

                qaContainer.style.display = 'none';
                chatbotSendBtn.click();
            };
            qaContainer.appendChild(btn);
        });
    }

    // Inicializar preguntas
    renderQuickActions();

    // Scroll button logic
    const scrollToBottomChatBtn = document.getElementById('scrollToBottomChatBtn');
    let userScrolledUp = false;

    if (scrollToBottomChatBtn) {
        chatbotMessages.addEventListener('scroll', () => {
            const distanceToBottom = chatbotMessages.scrollHeight - chatbotMessages.scrollTop - chatbotMessages.clientHeight;
            // Si la distancia es mayor a 2 pixeles (para evitar falsos positivos por redondeos decimales), significa que el usuario subió.
            if (distanceToBottom > 2) {
                userScrolledUp = true;
                scrollToBottomChatBtn.classList.remove('d-none');
            } else {
                userScrolledUp = false;
                scrollToBottomChatBtn.classList.add('d-none');
            }
        });

        scrollToBottomChatBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            chatbotMessages.scrollTo({ top: chatbotMessages.scrollHeight, behavior: 'smooth' });
        });
    }

    // Handle Send
    const sendMessage = async () => {
        const text = chatbotInput.value.trim();
        if (!text || isConnecting) return;

        isConnecting = true;
        setButtonLoadingState(true);

        // 1. Añadir mensaje de usuario al backend memory y pantalla
        sessionChatHistory.push({ role: 'user', content: text });
        if (sessionChatHistory.length > 8) sessionChatHistory.shift(); // Memorizar los últimos 8 mensajes

        addBubble(text, 'user');
        chatbotInput.value = '';

        // Ocultar acciones rápidas siempre que envíe algo el usuario
        const qaContainer = document.getElementById('chatQuickActions');
        if (qaContainer) qaContainer.style.display = 'none';

        // 2. Mostrar indicador "Escribiendo..."
        const typingId = showTypingIndicator();

        // 3. Recopilar contexto de la página actual
        let currentContext = "Página principal";
        const currentUrl = window.location.href;

        if (currentUrl.includes('simulador_credito')) {
            const amount = document.getElementById('loanAmount')?.value || 'no especificado';
            const rate = document.getElementById('annualRate')?.value || 'no especificada';
            currentContext = `Simulador de crédito. Monto analizado: $${amount}. Tasa: ${rate}%`;
        } else if (currentUrl.includes('simulador_ahorro')) {
            const amount = document.getElementById('targetAmount')?.value || 'no especificado';
            currentContext = `Simulador de ahorro. Meta: $${amount}.`;
        } else if (currentUrl.includes('simulador_inversion')) {
            const amount = document.getElementById('initialInvestment')?.value || 'no especificado';
            currentContext = `Simulador de inversión. Monto inicial: $${amount}.`;
        } else if (currentUrl.includes('simulador_retiro')) {
            const age = document.getElementById('currentAge')?.value || 'no especificada';
            currentContext = `Simulador de retiro. Edad actual del usuario: ${age} años.`;
        } else if (currentUrl.includes('simulador_presupuesto')) {
            const income = document.getElementById('monthlyIncome')?.value || 'no especificado';
            currentContext = `Simulador de presupuesto (Regla 50/30/20). Ingreso: $${income}.`;
        } else if (currentUrl.includes('diagnostico')) {
            const score = document.getElementById('scoreValue')?.innerText || 'ninguno';
            currentContext = `Diagnosticador financiero 360. Puntaje obtenido: ${score}.`;
        } else if (currentUrl.includes('sofipos')) {
            currentContext = "Ranking de SOFIPOs y tasas de rendimiento. Discutiendo inversiones y niveles NICAP.";
        }

        try {
            const response = await fetch('/api/copiloto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mensaje: text,
                    contexto: currentContext,
                    historial: sessionChatHistory.slice(0, -1) // Enviamos todo excepto el mensaje actual que ya va en 'mensaje' o incluimos todo. 
                    // Python app.py espera este arreglo y lo sumará al prompt. Enviaremos el que el usuario digitó como el 'mensaje' de la petición.
                })
            });

            const data = await response.json();
            removeBubble(typingId);

            isTyping = true;
            setButtonTypingState(true);

            if (data.success) {
                // Agregar respuesta a la memoria de la IA
                sessionChatHistory.push({ role: 'assistant', content: data.respuesta_cruda });

                let formattedText = data.respuesta.replace(/\n/g, '<br>');
                formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                // Formatear listas estilo viñeta a colores
                formattedText = formattedText.replace(/<li(.*?)>/g, '<li class="text-primary" style="margin-bottom: 5px;"><span class="text-dark">$1');
                formattedText = formattedText.replace(/<\/li>/g, '</span></li>');

                await typeTextInBubble(formattedText);
            } else {
                await typeTextInBubble(data.respuesta || "No pude conectarme a mis servidores en este momento.");
            }

        } catch (error) {
            console.error("Error Copiloto:", error);
            removeBubble(typingId);
            isTyping = true;
            setButtonTypingState(true);
            await typeTextInBubble("Lo siento, tuve un problema de conexión temporal.");
        } finally {
            isConnecting = false;
            isTyping = false;
            abortTyping = false;
            setButtonTypingState(false);
            setButtonLoadingState(false);
            chatbotInput.focus();
        }
    };

    // Events for Sending
    chatbotSendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isTyping) {
            abortTyping = true;
            return;
        }
        sendMessage();
    });

    chatbotInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            if (isTyping) {
                abortTyping = true;
                return;
            }
            sendMessage();
        }
    });

    // Helpers
    function setButtonLoadingState(isLoading) {
        if (isLoading) {
            chatbotSendBtn.disabled = true;
            chatbotInput.disabled = true;
            chatbotSendBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
        } else {
            chatbotSendBtn.disabled = false;
            chatbotInput.disabled = false;
            chatbotSendBtn.innerHTML = '<i class="bi bi-send-fill" style="margin-left: -2px;"></i>';
        }
    }

    function setButtonTypingState(typingState) {
        if (typingState) {
            chatbotSendBtn.disabled = false; // We want user to be able to click STOP!
            chatbotInput.disabled = false;
            chatbotSendBtn.innerHTML = '<i class="bi bi-stop-fill fs-5"></i>';
            chatbotSendBtn.classList.add('btn-danger');
            chatbotSendBtn.classList.remove('btn-primary');
        } else {
            chatbotSendBtn.classList.remove('btn-danger');
            chatbotSendBtn.classList.add('btn-primary');
        }
    }

    function addBubble(text, sender, isTextRaw = true) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}-bubble`;
        if (sender === 'ai' && !isTextRaw) {
            bubble.innerHTML = text;
        } else {
            bubble.textContent = text;
        }
        bubble.innerHTML = text;
        chatbotMessages.appendChild(bubble);
        if (!userScrolledUp) {
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
        return bubble;
    }

    // Función para el efecto de máquina de escribir
    async function typeTextInBubble(htmlText) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ai-bubble`;
        chatbotMessages.appendChild(bubble);

        // Creamos un elemento temporal para parsear el HTML y extraer nodos
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlText;

        let currentHtml = "";

        // Función recursiva para escribir nodos
        async function processNode(node) {
            if (abortTyping) return;
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.nodeValue;
                for (let i = 0; i < text.length; i++) {
                    if (abortTyping) return;
                    currentHtml += text.charAt(i);
                    bubble.innerHTML = currentHtml;

                    if (!userScrolledUp) {
                        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                    }

                    // Pequeña pausa entre caracteres (rápida para que no sea molesto)
                    await new Promise(resolve => setTimeout(resolve, 15));
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Abrimos la etiqueta
                const tag = node.tagName.toLowerCase();
                let attributes = "";
                for (let a of node.attributes || []) {
                    attributes += ` ${a.name}="${a.value}"`;
                }
                currentHtml += `<${tag}${attributes}>`;

                // Si es un <br>, no tiene hijos que procesar
                if (tag !== 'br') {
                    for (let child of node.childNodes) {
                        await processNode(child);
                    }
                    // Cerramos etiqueta principal
                    currentHtml += `</${tag}>`;
                }
                bubble.innerHTML = currentHtml;

                if (!userScrolledUp) {
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                }
            }
        }

        for (const child of tempDiv.childNodes) {
            await processNode(child);
        }
    }

    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble ai-bubble typing-indicator';
        bubble.id = id;
        bubble.innerHTML = '<span></span><span></span><span></span>';
        chatbotMessages.appendChild(bubble);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return id;
    }

    function removeBubble(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }
});
