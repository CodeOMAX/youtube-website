// ===================================
// PREMIUM ANIMATIONS & INTERACTIONS
// Inspired by: Stripe, Vercel, Linear, Raycast
// ===================================

// ===================================
// Magnetic Button Effect (Raycast-style)
// ===================================
class MagneticButton {
    constructor(element) {
        this.element = element;
        this.boundingRect = element.getBoundingClientRect();
        this.init();
    }

    init() {
        this.element.addEventListener('mouseenter', this.onMouseEnter.bind(this));
        this.element.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    }

    onMouseEnter() {
        this.boundingRect = this.element.getBoundingClientRect();
    }

    onMouseMove(e) {
        const x = e.clientX - this.boundingRect.left;
        const y = e.clientY - this.boundingRect.top;
        const centerX = this.boundingRect.width / 2;
        const centerY = this.boundingRect.height / 2;
        const deltaX = (x - centerX) * 0.2;
        const deltaY = (y - centerY) * 0.2;

        gsap.to(this.element, {
            x: deltaX,
            y: deltaY,
            duration: 0.3,
            ease: 'power2.out'
        });
    }

    onMouseLeave() {
        gsap.to(this.element, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });
    }
}

// ===================================
// Smooth Scroll with Lenis (Linear-style)
// ===================================
function initSmoothScroll() {
    // Polyfill for smooth scrolling
    const smoothScroll = {
        target: 0,
        current: 0,
        ease: 0.075,

        init() {
            this.target = window.scrollY;
            this.current = window.scrollY;
            this.update();
        },

        update() {
            this.current += (this.target - this.current) * this.ease;

            if (Math.abs(this.target - this.current) < 0.001) {
                this.current = this.target;
            }

            requestAnimationFrame(() => this.update());
        },

        setScroll(value) {
            this.target = value;
        }
    };

    // Initialize on desktop only
    if (window.innerWidth > 768) {
        smoothScroll.init();
    }
}

// ===================================
// Parallax Effect (Stripe-style)
// ===================================
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ===================================
// Cursor Follower (Cuberto-style)
// ===================================
class CustomCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'custom-cursor-dot';

        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorDot);

        this.cursorPos = { x: 0, y: 0 };
        this.cursorDotPos = { x: 0, y: 0 };
        this.mousePos = { x: 0, y: 0 };

        this.init();
    }

    init() {
        // Add cursor styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor,
            .custom-cursor-dot {
                position: fixed;
                pointer-events: none;
                z-index: 10000;
                mix-blend-mode: difference;
            }

            .custom-cursor {
                width: 40px;
                height: 40px;
                border: 2px solid rgba(99, 102, 241, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
            }

            .custom-cursor-dot {
                width: 6px;
                height: 6px;
                background: rgba(99, 102, 241, 0.8);
                border-radius: 50%;
                transform: translate(-50%, -50%);
            }

            body.cursor-hover .custom-cursor {
                width: 60px;
                height: 60px;
                border-color: rgba(99, 102, 241, 0.8);
            }

            @media (max-width: 768px) {
                .custom-cursor,
                .custom-cursor-dot {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });

        // Animate cursor
        this.animate();

        // Add hover effects
        this.addHoverEffects();
    }

    animate() {
        // Smooth cursor following
        this.cursorPos.x += (this.mousePos.x - this.cursorPos.x) * 0.15;
        this.cursorPos.y += (this.mousePos.y - this.cursorPos.y) * 0.15;

        this.cursorDotPos.x += (this.mousePos.x - this.cursorDotPos.x) * 0.4;
        this.cursorDotPos.y += (this.mousePos.y - this.cursorDotPos.y) * 0.4;

        this.cursor.style.left = this.cursorPos.x + 'px';
        this.cursor.style.top = this.cursorPos.y + 'px';

        this.cursorDot.style.left = this.cursorDotPos.x + 'px';
        this.cursorDot.style.top = this.cursorDotPos.y + 'px';

        requestAnimationFrame(() => this.animate());
    }

    addHoverEffects() {
        const hoverElements = document.querySelectorAll('a, button, .video-card, .blog-card, .btn');

        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });

            element.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }
}

// ===================================
// Card Tilt Effect (Vercel-style)
// ===================================
class CardTilt {
    constructor(element) {
        this.element = element;
        this.init();
    }

    init() {
        this.element.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    }

    onMouseMove(e) {
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        this.element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    onMouseLeave() {
        this.element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
}

// ===================================
// Text Reveal Animation (Linear-style)
// ===================================
function initTextReveal() {
    const textElements = document.querySelectorAll('[data-text-reveal]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                const chars = text.split('');
                entry.target.textContent = '';
                entry.target.style.opacity = '1';

                chars.forEach((char, index) => {
                    const span = document.createElement('span');
                    span.textContent = char === ' ' ? ' ' : char;
                    span.style.display = 'inline-block';
                    span.style.opacity = '0';
                    span.style.transform = 'translateY(20px)';
                    span.style.animation = `revealChar 0.5s ease forwards ${index * 0.03}s`;
                    entry.target.appendChild(span);
                });

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    textElements.forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });

    // Add animation keyframes
    if (!document.getElementById('reveal-animation')) {
        const style = document.createElement('style');
        style.id = 'reveal-animation';
        style.textContent = `
            @keyframes revealChar {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===================================
// Gradient Animation (Stripe-style)
// ===================================
function animateGradients() {
    const gradientElements = document.querySelectorAll('.gradient-text, .gradient-orb');

    gradientElements.forEach(element => {
        let position = 0;
        setInterval(() => {
            position = (position + 1) % 200;
            element.style.backgroundPosition = `${position}% 50%`;
        }, 50);
    });
}

// ===================================
// Number Counter Animation
// ===================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        // Format number with K/M suffix
        let displayValue = Math.floor(current);
        if (displayValue >= 1000000) {
            displayValue = (displayValue / 1000000).toFixed(1) + 'M+';
        } else if (displayValue >= 1000) {
            displayValue = (displayValue / 1000).toFixed(0) + 'K+';
        }

        element.textContent = displayValue;
    }, 16);
}

// ===================================
// Stagger Animation for Cards
// ===================================
function initStaggerAnimation() {
    const cards = document.querySelectorAll('.video-card, .blog-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ===================================
// Ripple Effect on Click
// ===================================
function addRippleEffect(element) {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.className = 'ripple';

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
}

// Add ripple styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ===================================
// Floating Navigation Progress Bar
// ===================================
function initProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
        transform-origin: 0%;
        transform: scaleX(0);
        z-index: 10000;
        transition: transform 0.1s ease;
        box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        progressBar.style.transform = `scaleX(${scrollPercent})`;
    });
}

// ===================================
// Mouse Trail Effect
// ===================================
class MouseTrail {
    constructor() {
        this.particles = [];
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            if (this.particles.length < 10) {
                this.createParticle(e.clientX, e.clientY);
            }
        });

        this.animate();
    }

    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(99, 102, 241, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(particle);

        this.particles.push({
            element: particle,
            life: 1
        });
    }

    animate() {
        this.particles.forEach((particle, index) => {
            particle.life -= 0.02;
            particle.element.style.opacity = particle.life;
            particle.element.style.transform = `translate(-50%, -50%) scale(${particle.life})`;

            if (particle.life <= 0) {
                particle.element.remove();
                this.particles.splice(index, 1);
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ===================================
// Initialize All Premium Animations
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initializing premium animations...');

    // Initialize magnetic buttons
    document.querySelectorAll('.btn-primary, .btn-glow').forEach(btn => {
        new MagneticButton(btn);
        addRippleEffect(btn);
    });

    // Initialize card tilt
    document.querySelectorAll('.video-card, .blog-card').forEach(card => {
        new CardTilt(card);
    });

    // Initialize custom cursor (desktop only)
    if (window.innerWidth > 768) {
        new CustomCursor();
        new MouseTrail();
    }

    // Initialize other effects
    initParallax();
    initTextReveal();
    initStaggerAnimation();
    initProgressBar();
    animateGradients();

    // Animate stat counters
    const statValues = document.querySelectorAll('.stat-value');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                if (number) {
                    entry.target.textContent = '0';
                    animateCounter(entry.target, number, 2000);
                }
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(stat => statObserver.observe(stat));

    // Smooth scroll to sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log('✨ Premium animations loaded successfully!');
});

// ===================================
// Performance Monitoring
// ===================================
if (window.performance) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
        }, 0);
    });
}