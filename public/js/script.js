// Toast Notification System
if (typeof window.showToast !== 'function') {
    window.showToast = function (message, type = 'info', duration = 5000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        // Icon mapping
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const icon = icons[type] || icons.info;
        toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;

        // Add to container
        container.appendChild(toast);

        // Remove after duration
        setTimeout(() => {
            try { toast.remove(); } catch (e) { }
        }, duration);
    };
}

// Safe localStorage access wrapper
function getSafeLocalStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        return value !== null ? value : defaultValue;
    } catch (error) {
        console.error('localStorage read error:', error);
        showToast('We couldn\'t load your saved settings. Using defaults.', 'warning', 6000);
        return defaultValue;
    }
}

function setSafeLocalStorage(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.error('localStorage write error:', error);
        showToast('Your preference wasn\'t saved, but changes are applied.', 'warning', 6000);
        return false;
    }
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Apply saved theme preference (or default to 'dark') immediately
const currentTheme = getSafeLocalStorage('theme', 'dark');
html.setAttribute('data-theme', currentTheme);

// Apply per-element color variables to ensure scoped components reflect theme
function applyPerElementTheme(theme) {
    document.querySelectorAll('.program-card').forEach(el => {
        const style = el.style;
        // iterate inline custom properties and look for any --*-color-light / --*-color-dark
        for (let i = 0; i < style.length; i++) {
            const prop = style[i]; // e.g. --crs-color-light or --dept-color-dark
            if (!prop) continue;
            if (prop.endsWith('-color-light') || prop.endsWith('-color-dark')) {
                const base = prop.replace(/-(light|dark)$/, ''); // --crs-color
                const light = style.getPropertyValue(base + '-light').trim();
                const dark = style.getPropertyValue(base + '-dark').trim();
                const value = (theme === 'dark') ? (dark || light) : (light || dark);
                if (value) style.setProperty(base, value);
            }
        }
    });
}

applyPerElementTheme(currentTheme);

// If the toggle button exists, wire up icon and click handler.
if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');
    updateThemeIcon(currentTheme, themeIcon);

    themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);

    if (setSafeLocalStorage('theme', newTheme)) {
        const displayName = newTheme === 'dark' ? '🌙 Dark mode' : '☀️ Light mode';
        showToast(`${displayName} enabled`, 'success', 3000);
    }
        updateThemeIcon(newTheme, themeIcon);

        // Update per-element colors so inline --crs-color overrides CSS cascade.
        applyPerElementTheme(newTheme);

        // Add animation effect
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    });
} else {
    // No toggle found in DOM: try updating any matching icon node if present
    const potentialIcon = document.querySelector('.theme-toggle i');
    if (potentialIcon) updateThemeIcon(currentTheme, potentialIcon);
}

function updateThemeIcon(theme, iconEl) {
    const el = iconEl || document.querySelector('.theme-toggle i');
    if (!el) return;
    if (theme === 'dark') {
        el.classList.remove('fa-moon');
        el.classList.add('fa-sun');
    } else {
        el.classList.remove('fa-sun');
        el.classList.add('fa-moon');
    }
}

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');
const menuIcon = mobileMenuToggle.querySelector('i');

mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isActive = navLinks.classList.contains('active');

    mobileMenuToggle.setAttribute('aria-expanded', isActive);

    if (isActive) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
    } else {
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
const header = document.getElementById('header');
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    // Header effect
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
        scrollTop.classList.add('visible');
    } else {
        header.classList.remove('scrolled');
        scrollTop.classList.remove('visible');
    }
});

// Scroll to top functionality
scrollTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Loading overlay
window.addEventListener('load', () => {
    const loadingOverlay = document.getElementById('loadingOverlay');
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
    }, 500);
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Animate stats on scroll
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const target = parseInt(statNumber.textContent.replace(/\D/g, ''));
            animateValue(statNumber, 0, target, 2000);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end.toLocaleString() + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString() + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
        }
    }, 16);
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Install PWA prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('PWA install prompt ready');
});

// Keyboard navigation improvements
document.addEventListener('keydown', (e) => {
    // Press Escape to close mobile menu
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
});

// Add focus visible for better keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});
