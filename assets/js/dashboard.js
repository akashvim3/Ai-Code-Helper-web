// ============================================
// DASHBOARD JAVASCRIPT - CodeAssist AI
// ============================================

class Dashboard {
    constructor() {
        this.stats = {
            suggestions: 1247,
            projects: 34,
            codingTime: 127,
            accuracy: 95
        };
        this.init();
    }

    init() {
        this.loadUserData();
        this.renderProjects();
        this.renderActivity();
        this.updateStats();
        this.attachEventListeners();
        console.log('📊 Dashboard - Initialized');
    }

    // Load user data
    loadUserData() {
        const userData = localStorage.getItem('user_data');
        if (userData) {
            this.userData = JSON.parse(userData);
        } else {
            this.userData = {
                name: 'John Doe',
                email: 'john@example.com',
                avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff',
                joinedDate: new Date('2025-01-15')
            };
        }
    }

    // Render projects
    renderProjects() {
        // Projects are already in HTML, but could be dynamically loaded
        this.animateProjectCards();
    }

    // Animate project cards
    animateProjectCards() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.5s ease';

                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
    }

    // Render activity feed
    renderActivity() {
        const activities = [
            {
                type: 'success',
                icon: 'check',
                title: 'Code suggestion accepted',
                description: 'Accepted AI suggestion in "E-Commerce Dashboard"',
                time: '2 minutes ago'
            },
            {
                type: 'primary',
                icon: 'code',
                title: 'New file created',
                description: 'Created "AuthService.js" in REST API Server',
                time: '1 hour ago'
            },
            {
                type: 'warning',
                icon: 'exclamation-triangle',
                title: 'Error detected',
                description: 'Potential null pointer exception in ML Model Trainer',
                time: '3 hours ago'
            }
        ];

        // Activities are already in HTML, add real-time updates if needed
        this.startActivityUpdates();
    }

    // Start real-time activity updates
    startActivityUpdates() {
        setInterval(() => {
            // Simulate new activity (in production, fetch from API)
            const randomActivity = Math.random();
            if (randomActivity > 0.95) {
                this.addNewActivity({
                    type: 'info',
                    icon: 'lightbulb',
                    title: 'New suggestion',
                    description: 'AI recommends optimizing your loop',
                    time: 'Just now'
                });
            }
        }, 10000);
    }

    // Add new activity
    addNewActivity(activity) {
        const feed = document.querySelector('.activity-feed');
        if (!feed) return;

        const activityHTML = `
            <div class="activity-item new">
                <div class="activity-icon ${activity.type}">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${activity.title}</strong></p>
                    <span>${activity.description}</span>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `;

        feed.insertAdjacentHTML('afterbegin', activityHTML);

        // Remove 'new' class after animation
        setTimeout(() => {
            feed.querySelector('.activity-item.new').classList.remove('new');
        }, 500);

        // Show notification
        showNotification(activity.title, 'info');
    }

    // Update stats with animation
    updateStats() {
        const statCards = document.querySelectorAll('.stat-card h3');
        statCards.forEach(stat => {
            const target = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
            this.animateCounter(stat, 0, target, 2000);
        });
    }

    // Animate counter
    animateCounter(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = this.formatStatValue(end);
                clearInterval(timer);
            } else {
                element.textContent = this.formatStatValue(Math.floor(current));
            }
        }, 16);
    }

    // Format stat value
    formatStatValue(value) {
        if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
        }
        return value.toString();
    }

    // Attach event listeners
    attachEventListeners() {
        // Sidebar menu items
        document.querySelectorAll('.sidebar-menu li').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.sidebar-menu li').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Project menu buttons
        document.querySelectorAll('.project-menu').forEach(menu => {
            menu.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showProjectMenu(menu);
            });
        });

        // User menu
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.addEventListener('click', () => {
                this.toggleUserMenu();
            });
        }
    }

    // Show project menu
    showProjectMenu(menuBtn) {
        // Create context menu
        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.innerHTML = `
            <div class="context-menu-item"><i class="fas fa-edit"></i> Edit</div>
            <div class="context-menu-item"><i class="fas fa-star"></i> Add to Favorites</div>
            <div class="context-menu-item"><i class="fas fa-share-alt"></i> Share</div>
            <div class="context-menu-item danger"><i class="fas fa-trash"></i> Delete</div>
        `;

        document.body.appendChild(menu);

        const rect = menuBtn.getBoundingClientRect();
        menu.style.top = `${rect.bottom + 5}px`;
        menu.style.left = `${rect.left - 150}px`;

        // Close menu on click outside
        setTimeout(() => {
            document.addEventListener('click', () => menu.remove(), { once: true });
        }, 100);
    }

    // Toggle user menu
    toggleUserMenu() {
        // Implement user dropdown menu
        showNotification('User menu coming soon!', 'info');
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});
