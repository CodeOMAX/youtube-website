// ===================================
// Smooth Navigation & Scroll
// ===================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const mobileToggle = document.getElementById('mobileToggle');
const navLinksContainer = document.getElementById('navLinks');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active link on scroll
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(l => l.classList.remove('active'));
            if (link) link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Mobile menu toggle
mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
    });
});

// ===================================
// Video Cards Dynamic Loading
// ===================================
const videosGrid = document.querySelector('.videos-grid');

const videoData = [
    {
        id: 1,
        title: "Getting Started with Web Development in 2026",
        thumbnail: "https://via.placeholder.com/640x360/6366f1/ffffff?text=Video+1",
        duration: "15:42",
        views: "125K",
        date: "2 days ago",
        url: "#"
    },
    {
        id: 2,
        title: "10 Tips for Better Code Quality",
        thumbnail: "https://via.placeholder.com/640x360/8b5cf6/ffffff?text=Video+2",
        duration: "12:30",
        views: "98K",
        date: "5 days ago",
        url: "#"
    },
    {
        id: 3,
        title: "Building Modern UI with CSS Grid",
        thumbnail: "https://via.placeholder.com/640x360/ec4899/ffffff?text=Video+3",
        duration: "18:15",
        views: "156K",
        date: "1 week ago",
        url: "#"
    },
    {
        id: 4,
        title: "JavaScript ES2026 Features You Should Know",
        thumbnail: "https://via.placeholder.com/640x360/06b6d4/ffffff?text=Video+4",
        duration: "20:05",
        views: "210K",
        date: "2 weeks ago",
        url: "#"
    },
    {
        id: 5,
        title: "Responsive Design Best Practices",
        thumbnail: "https://via.placeholder.com/640x360/f59e0b/ffffff?text=Video+5",
        duration: "14:28",
        views: "87K",
        date: "3 weeks ago",
        url: "#"
    },
    {
        id: 6,
        title: "Performance Optimization Techniques",
        thumbnail: "https://via.placeholder.com/640x360/10b981/ffffff?text=Video+6",
        duration: "16:50",
        views: "142K",
        date: "1 month ago",
        url: "#"
    }
];

function createVideoCard(video) {
    return `
        <div class="video-card fade-in" onclick="window.location.href='${video.url}'">
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}">
                <div class="video-duration">${video.duration}</div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <div class="video-meta">
                    <span class="video-views">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        ${video.views} views
                    </span>
                    <span class="video-date">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        ${video.date}
                    </span>
                </div>
            </div>
        </div>
    `;
}

function loadVideos() {
    videosGrid.innerHTML = videoData.map(video => createVideoCard(video)).join('');
    observeElements();
}

// ===================================
// Blog Cards Dynamic Loading
// ===================================
const blogGrid = document.querySelector('.blog-grid');

const blogData = [
    {
        id: 1,
        title: "The Future of Web Development",
        excerpt: "Exploring emerging technologies and trends that will shape the future of web development in the coming years.",
        image: "https://via.placeholder.com/600x360/6366f1/ffffff?text=Blog+1",
        category: "Technology",
        date: "Aug 25, 2026",
        readTime: "5 min read",
        url: "#"
    },
    {
        id: 2,
        title: "Behind the Scenes: My Creative Process",
        excerpt: "A deep dive into how I plan, script, and produce content for my YouTube channel.",
        image: "https://via.placeholder.com/600x360/8b5cf6/ffffff?text=Blog+2",
        category: "Behind the Scenes",
        date: "Aug 20, 2026",
        readTime: "7 min read",
        url: "#"
    },
    {
        id: 3,
        title: "Productivity Tips for Developers",
        excerpt: "Practical advice and tools to help you become more productive and efficient in your development workflow.",
        image: "https://via.placeholder.com/600x360/ec4899/ffffff?text=Blog+3",
        category: "Productivity",
        date: "Aug 15, 2026",
        readTime: "6 min read",
        url: "#"
    }
];

function createBlogCard(blog) {
    return `
        <div class="blog-card fade-in" onclick="window.location.href='${blog.url}'">
            <div class="blog-image">
                <img src="${blog.image}" alt="${blog.title}">
            </div>
            <div class="blog-content">
                <span class="blog-category">${blog.category}</span>
                <h3 class="blog-title">${blog.title}</h3>
                <p class="blog-excerpt">${blog.excerpt}</p>
                <div class="blog-meta">
                    <span>${blog.date}</span>
                    <span>•</span>
                    <span>${blog.readTime}</span>
                </div>
            </div>
        </div>
    `;
}

function loadBlogPosts() {
    blogGrid.innerHTML = blogData.map(blog => createBlogCard(blog)).join('');
    observeElements();
}

// ===================================
// Contact Form Handling
// ===================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Simulate form submission
    console.log('Form submitted:', formData);

    // Show success message
    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');

    // Reset form
    contactForm.reset();
});

// ===================================
// Notification System
// ===================================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--warning)'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===================================
// Intersection Observer for Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

function observeElements() {
    const elements = document.querySelectorAll('.video-card, .blog-card, .highlight');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// ===================================
// Parallax Effect for Hero Background
// ===================================
const heroSection = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (heroSection && scrolled < window.innerHeight) {
        const orbs = document.querySelectorAll('.gradient-orb');
        orbs.forEach((orb, index) => {
            const speed = 0.5 + (index * 0.2);
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
});

// ===================================
// Mouse Follow Effect (Optional Enhancement)
// ===================================
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Create custom cursor (optional - uncomment to enable)
/*
const cursor = document.createElement('div');
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid var(--primary);
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    transition: transform 0.2s ease;
    mix-blend-mode: difference;
`;
document.body.appendChild(cursor);

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
    requestAnimationFrame(animateCursor);
}
animateCursor();
*/

// ===================================
// Smooth Scroll Polyfill for older browsers
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// ===================================
// Load More Videos
// ===================================
const loadMoreBtn = document.querySelector('.load-more .btn');

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        showNotification('Loading more videos...', 'success');
        // In a real application, you would fetch more videos from your API
        setTimeout(() => {
            showNotification('No more videos to load', 'success');
        }, 1000);
    });
}

// ===================================
// Theme Toggle (Optional - Dark/Light)
// ===================================
// Uncomment to add theme switching functionality
/*
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
}

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
}
*/

// ===================================
// Initialize
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    loadVideos();
    loadBlogPosts();
    activateNavLink();

    // Add fade-in animation to hero content
    const heroContent = document.querySelector('.hero-content');
    const heroVideo = document.querySelector('.hero-video');

    if (heroContent) heroContent.classList.add('fade-in');
    if (heroVideo) heroVideo.classList.add('fade-in');

    console.log('🎬 YouTube Website loaded successfully!');
});

// ===================================
// Performance Optimization
// ===================================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScroll = debounce(() => {
    activateNavLink();
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ===================================
// Lazy Loading Images
// ===================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// Service Worker Registration (PWA Support)
// ===================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you have a service worker file
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}

// ===================================
// Analytics (Add your tracking code)
// ===================================
function trackEvent(eventName, eventData) {
    console.log('Event tracked:', eventName, eventData);
    // Add your analytics tracking code here
    // Example: gtag('event', eventName, eventData);
}

// Track button clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        trackEvent('button_click', {
            button_text: e.target.textContent.trim(),
            button_location: e.target.closest('section')?.id || 'unknown'
        });
    });
});