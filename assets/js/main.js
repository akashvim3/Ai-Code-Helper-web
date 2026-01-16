// ============================================
// MAIN JAVASCRIPT - CodeAssist AI
// ============================================

// Global Variables
let currentUser = null;
let notificationQueue = [];
let isScrolling = false;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    console.log('🚀 CodeAssist AI - Application Loaded');
});

function initializeApp() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initAnimations();
    initForms();
    initModals();
    initNotifications();
    initUserSession();
    initTooltips();
    initLazyLoading();

    console.log('✅ All components initialized');
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });

    // Sticky navbar on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ============================================
// SCROLL EFFECTS
// ============================================
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Scroll to top button
    const scrollTopBtn = createScrollTopButton();
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
}

function createScrollTopButton() {
    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.setAttribute('aria-label', 'Scroll to top');

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    return btn;
}

// ============================================
// ANIMATIONS
// ============================================
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card, .stat-box').forEach(el => {
        observer.observe(el);
    });

    // Counter animation for stats
    animateCounters();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number, .counter');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.floor(current).toLocaleString();
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target.toLocaleString();
                        }
                    };
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        });

        observer.observe(counter);
    });
}

// ============================================
// FORMS
// ============================================
function initForms() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;

    // Validate all fields
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    if (isValid) {
        // Show loading state
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        // Simulate form submission
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            form.reset();
            showNotification('Form submitted successfully!', 'success');
        }, 2000);
    } else {
        showNotification('Please fix the errors in the form', 'error');
    }
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    // Required check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    // Email validation
    else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email';
        }
    }
    // Phone validation
    else if (type === 'tel' && value) {
        const phoneRegex = /^[\d\s-+()]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    // URL validation
    else if (type === 'url' && value) {
        try {
            new URL(value);
        } catch {
            isValid = false;
            errorMessage = 'Please enter a valid URL';
        }
    }
    // Min length
    else if (field.minLength && value.length < field.minLength) {
        isValid = false;
        errorMessage = `Minimum ${field.minLength} characters required`;
    }

    // Update UI
    const errorEl = field.parentElement.querySelector('.error-message');
    if (!isValid) {
        field.classList.add('error');
        if (errorEl) {
            errorEl.textContent = errorMessage;
        } else {
            const error = document.createElement('span');
            error.className = 'error-message';
            error.textContent = errorMessage;
            field.parentElement.appendChild(error);
        }
    } else {
        field.classList.remove('error');
        if (errorEl) {
            errorEl.remove();
        }
    }

    return isValid;
}

// ============================================
// MODALS
// ============================================
function initModals() {
    // Close modal on background click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') && e.target.classList.contains('active')) {
            closeModal(e.target);
        }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    if (typeof modal === 'string') {
        modal = document.getElementById(modal);
    }
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================
// NOTIFICATIONS
// ============================================
function initNotifications() {
    const container = document.createElement('div');
    container.id = 'notificationContainer';
    container.className = 'notification-container';
    document.body.appendChild(container);
}

function showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };

    notification.innerHTML = `
        <i class="fas fa-${icons[type]}"></i>
        <span>${message}</span>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });

    // Auto remove
    if (duration > 0) {
        setTimeout(() => {
            removeNotification(notification);
        }, duration);
    }

    return notification;
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// ============================================
// USER SESSION
// ============================================
function initUserSession() {
    // Check if user is logged in
    const userData = localStorage.getItem('user_data');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateUIForLoggedInUser();
    }
}

function updateUIForLoggedInUser() {
    // Update navigation buttons
    const navButtons = document.querySelector('.nav-buttons');
    if (navButtons && currentUser) {
        navButtons.innerHTML = `
            <button class="theme-toggle" id="themeToggle">
                <i class="fas fa-moon"></i>
            </button>
            <div class="user-menu" id="userMenu">
                <img src="${currentUser.avatar}" alt="User" class="user-avatar">
                <span>${currentUser.name}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
        `;
        
        // Add click event to user menu
        document.getElementById('userMenu').addEventListener('click', toggleUserDropdown);
    }
}

function toggleUserDropdown() {
    // Create dropdown if it doesn't exist
    let dropdown = document.querySelector('.user-dropdown');
    if (dropdown) {
        dropdown.remove();
        return;
    }
    
    dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.innerHTML = `
        <div class="dropdown-item" onclick="handleUserProfile()">
            <i class="fas fa-user"></i> Profile
        </div>
        <div class="dropdown-item" onclick="handleSettings()">
            <i class="fas fa-cog"></i> Settings
        </div>
        <div class="dropdown-item" onclick="handleLogout()">
            <i class="fas fa-sign-out-alt"></i> Logout
        </div>
    `;
    
    document.getElementById('userMenu').appendChild(dropdown);
}

function handleLogout() {
    // Clear user data
    localStorage.removeItem('user_data');
    currentUser = null;
    
    // Update UI
    const navButtons = document.querySelector('.nav-buttons');
    if (navButtons) {
        navButtons.innerHTML = `
            <button class="btn-secondary" onclick="window.location.href='login.html'">Sign In</button>
            <button class="btn-primary" onclick="window.location.href='signup.html'">Get Started</button>
        `;
    }
    
    // Remove dropdown if exists
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown) {
        dropdown.remove();
    }
    
    showNotification('Successfully logged out!', 'success');
}

function handleUserProfile() {
    // Navigate to profile page (or dashboard)
    window.location.href = 'dashboard.html'; // Placeholder
}

function handleSettings() {
    // Navigate to settings page
    window.location.href = 'settings.html';
}

// ============================================
// TOOLTIPS
// ============================================
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const text = e.target.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.id = 'activeTooltip';

    document.body.appendChild(tooltip);

    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

    setTimeout(() => tooltip.classList.add('show'), 10);
}

function hideTooltip() {
    const tooltip = document.getElementById('activeTooltip');
    if (tooltip) {
        tooltip.classList.remove('show');
        setTimeout(() => tooltip.remove(), 200);
    }
}

// ============================================
// LAZY LOADING IMAGES
// ============================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function
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

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy', 'error');
        });
    } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Copied to clipboard!', 'success');
    }
}

// Format date
function formatDate(date) {
    const d = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('en-US', options);
}

// Format time ago
function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    for (const [name, value] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / value);
        if (interval >= 1) {
            return interval === 1 ? `1 ${name} ago` : `${interval} ${name}s ago`;
        }
    }

    return 'Just now';
}

// ============================================
// GLOBAL EXPORTS
// ============================================
window.CodeAssistAI = {
    showNotification,
    openModal,
    closeModal,
    copyToClipboard,
    formatDate,
    timeAgo,
    debounce,
    throttle
};

console.log('✅ Main.js loaded successfully');
