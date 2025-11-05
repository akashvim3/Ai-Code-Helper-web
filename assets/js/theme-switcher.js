// ============================================
// THEME SWITCHER - CodeAssist AI
// ============================================

class ThemeSwitcher {
    constructor() {
        this.currentTheme = this.getStoredTheme();
        this.autoTheme = localStorage.getItem('theme-auto') === 'true';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.attachEventListeners();
        this.watchSystemTheme();
        console.log('🎨 Theme Switcher - Initialized');
        console.log('Current Theme:', this.currentTheme);
    }

    // Get stored theme or default
    getStoredTheme() {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Apply theme
    applyTheme(theme) {
        // Set theme attribute
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);

        // Update toggle button icons
        this.updateToggleIcon(theme);

        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);

        // Update code editor theme if exists
        this.updateEditorTheme(theme);

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));

        console.log('✅ Theme applied:', theme);
    }

    // Update toggle icon
    updateToggleIcon(theme) {
        const toggleButtons = document.querySelectorAll('#themeToggle, .theme-toggle');
        toggleButtons.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                // Remove old classes
                icon.className = '';
                // Add new icon
                if (theme === 'dark') {
                    icon.className = 'fas fa-sun';
                    btn.setAttribute('aria-label', 'Switch to light mode');
                    btn.setAttribute('title', 'Light mode');
                } else {
                    icon.className = 'fas fa-moon';
                    btn.setAttribute('aria-label', 'Switch to dark mode');
                    btn.setAttribute('title', 'Dark mode');
                }
            }
        });
    }

    // Update meta theme color
    updateMetaThemeColor(theme) {
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = 'theme-color';
            document.head.appendChild(metaTheme);
        }

        const colors = {
            light: '#ffffff',
            dark: '#0f172a'
        };

        metaTheme.setAttribute('content', colors[theme]);
    }

    // Update editor theme if CodeMirror exists
    updateEditorTheme(theme) {
        if (window.editor && window.editor.setOption) {
            const editorTheme = theme === 'dark' ? 'material-darker' : 'default';
            window.editor.setOption('theme', editorTheme);
        }
    }

    // Toggle theme
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';

        // Add smooth transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

        this.applyTheme(newTheme);

        // Show notification
        if (window.showNotification) {
            const emoji = newTheme === 'dark' ? '🌙' : '☀️';
            window.showNotification(`${emoji} ${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`, 'info', 2000);
        }

        // Remove transition after animation
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    // Attach event listeners
    attachEventListeners() {
        // Toggle buttons
        const toggleButtons = document.querySelectorAll('#themeToggle, .theme-toggle');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        });

        // Settings page theme selector
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = this.autoTheme ? 'auto' : this.currentTheme;

            themeSelect.addEventListener('change', (e) => {
                const value = e.target.value;

                if (value === 'auto') {
                    localStorage.setItem('theme-auto', 'true');
                    this.autoTheme = true;
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    this.applyTheme(prefersDark ? 'dark' : 'light');
                    if (window.showNotification) {
                        window.showNotification('Auto theme enabled - follows system preference', 'success');
                    }
                } else {
                    localStorage.setItem('theme-auto', 'false');
                    this.autoTheme = false;
                    this.applyTheme(value);
                }
            });
        }

        // Keyboard shortcut: Ctrl/Cmd + Shift + D
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    // Watch for system theme changes
    watchSystemTheme() {
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

            // Modern browsers
            if (darkModeQuery.addEventListener) {
                darkModeQuery.addEventListener('change', (e) => {
                    if (this.autoTheme) {
                        this.applyTheme(e.matches ? 'dark' : 'light');
                        if (window.showNotification) {
                            window.showNotification('Theme updated to match system preference', 'info', 2000);
                        }
                    }
                });
            }
            // Older browsers
            else if (darkModeQuery.addListener) {
                darkModeQuery.addListener((e) => {
                    if (this.autoTheme) {
                        this.applyTheme(e.matches ? 'dark' : 'light');
                    }
                });
            }
        }
    }

    // Get current theme
    getTheme() {
        return this.currentTheme;
    }

    // Set theme programmatically
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
            return true;
        }
        return false;
    }

    // Enable auto theme
    enableAutoTheme() {
        localStorage.setItem('theme-auto', 'true');
        this.autoTheme = true;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.applyTheme(prefersDark ? 'dark' : 'light');
    }

    // Disable auto theme
    disableAutoTheme() {
        localStorage.setItem('theme-auto', 'false');
        this.autoTheme = false;
    }
}

// Initialize theme switcher
let themeSwitcher;
document.addEventListener('DOMContentLoaded', () => {
    themeSwitcher = new ThemeSwitcher();

    // Make it globally accessible
    window.themeSwitcher = themeSwitcher;

    // Add to global API
    if (window.CodeAssistAI) {
        window.CodeAssistAI.themeSwitcher = themeSwitcher;
        window.CodeAssistAI.toggleTheme = () => themeSwitcher.toggleTheme();
        window.CodeAssistAI.setTheme = (theme) => themeSwitcher.setTheme(theme);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeSwitcher;
}
