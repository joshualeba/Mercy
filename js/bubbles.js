// Localized bg-bubbles - dynamic for all cards
function initBubblesOn(container) {
    if (container.dataset.bubblesInitialized === 'true') return;
    container.dataset.bubblesInitialized = 'true';

    // Enforce positioning rules
    const currentPos = window.getComputedStyle(container).position;
    if (currentPos === 'static') container.style.position = 'relative';
    container.style.overflow = 'hidden';

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0'; // Behind card content
    canvas.style.pointerEvents = 'none'; // doesn't block clicks

    container.insertBefore(canvas, container.firstChild);

    const ctx = canvas.getContext('2d');
    let width = 0, height = 0;
    const bubbles = [];
    let mouse = { x: -1000, y: -1000 };
    const numBubbles = 10; // Fewer bubbles so they don't distract

    function resize() {
        const rect = container.getBoundingClientRect();
        // Solo actualizar si las dimensiones son válidas (esto evita que colapse a 0x0 cuando está oculto d-none)
        if (rect.width > 0 && rect.height > 0) {
            width = rect.width;
            height = rect.height;
            canvas.width = width;
            canvas.height = height;
        }
    }

    // Usar ResizeObserver para que se adapte automáticamente cuando cambie de display:none a block al cambiar de pestaña
    const resizeObserver = new ResizeObserver(() => {
        resize();
    });
    resizeObserver.observe(container);
    window.addEventListener('resize', resize);
    resize();

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    container.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    class Bubble {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Smaller radius
            this.baseRadius = Math.random() * 3 + 1.5;
            this.radius = this.baseRadius;

            // Speed and direction
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;

            // Theming based on main color (primary blue)
            this.color = `rgba(13, 110, 253, ${Math.random() * 0.2 + 0.1})`;
        }

        update() {
            // Check if test is active to hide them
            const testContainer = document.getElementById('testContainer');
            const isTestActive = testContainer && !testContainer.classList.contains('d-none');

            if (isTestActive) return;

            // Move
            this.x += this.vx;
            this.y += this.vy;

            // Bounce on edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Avoid mouse
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let minDistance = 100;

            if (distance < minDistance) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (minDistance - distance) / minDistance;

                this.x -= forceDirectionX * force * 3;
                this.y -= forceDirectionY * force * 3;
            }

            this.draw();
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Init bubbles
    for (let i = 0; i < numBubbles; i++) {
        bubbles.push(new Bubble());
    }

    function animate() {
        const testContainer = document.getElementById('testContainer');
        const isTestActive = testContainer && !testContainer.classList.contains('d-none');

        ctx.clearRect(0, 0, width, height);

        if (!isTestActive) {
            bubbles.forEach(bubble => bubble.update());
        }

        requestAnimationFrame(animate);
    }

    animate();
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize existing containers on page load
    const containers = document.querySelectorAll('.has-bubbles');
    containers.forEach(container => initBubblesOn(container));

    // 2. Setup a MutationObserver to track any newly added .has-bubbles dynamically
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && node.classList.contains('has-bubbles')) {
                            initBubblesOn(node);
                        }
                        // Also check within the newly added node in case it's a container wrapper
                        const subNodes = node.querySelectorAll('.has-bubbles');
                        subNodes.forEach(subNode => initBubblesOn(subNode));
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
});
