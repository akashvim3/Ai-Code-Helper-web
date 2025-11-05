// ============================================
// SETTINGS JAVASCRIPT - CodeAssist AI
// ============================================

class Settings {
    constructor() {
        this.settings = this.loadSettings();
        this.init();
    }

    init() {
        this.populateSettings();
        this.attachEventListeners();
        console.log('⚙️ Settings - Initialized');
    }

    // Load settings from localStorage
    loadSettings() {
        const saved = localStorage.getItem('app_settings');
        if (saved) {
            return JSON.parse(saved);
        }

        return {
            general: {
                language: 'en',
                autoSave: true,
                autoSaveInterval: 30
            },
            editor: {
                fontSize: 14,
                fontFamily: 'Fira Code',
                tabSize: 2,
                lineNumbers: true,
                wordWrap: false
            },
            ai: {
                enabled: true,
                suggestionDelay: 300,
                aggressiveness: 'balanced',
                learnFromCode: true
            },
            appearance: {
                theme: 'auto',
                editorTheme: 'dracula',
                animations: true
            }
        };
    }

    // Save settings
    saveSettings() {
        localStorage.setItem('app_settings', JSON.stringify(this.settings));
        showNotification('Settings saved successfully!', 'success');
    }

    // Populate settings in UI
    populateSettings() {
        // This would populate all form fields with current settings
        // Implementation depends on your form structure
    }

    // Attach event listeners
    attachEventListeners() {
        // Settings menu navigation
        document.querySelectorAll('.settings-menu li').forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });

        // Save button
        const saveBtn = document.getElementById('saveSettings');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.collectAndSave();
            });
        }

        // Real-time updates for certain settings
        document.querySelectorAll('.setting-item input, .setting-item select').forEach(input => {
            input.addEventListener('change', () => {
                this.updatePreview(input);
            });
        });
    }

    // Switch settings section
    switchSection(section) {
        // Update menu
        document.querySelectorAll('.settings-menu li').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.settings-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');
    }

    // Collect and save all settings
    collectAndSave() {
        // Collect all form values and update settings object
        this.saveSettings();

        // Apply changes immediately if needed
        this.applySettings();
    }

    // Apply settings
    applySettings() {
        // Apply theme
        if (this.settings.appearance.theme !== 'auto') {
            window.themeSwitcher?.applyTheme(this.settings.appearance.theme);
        }

        // Apply editor settings if on editor page
        if (window.editor) {
            window.editor.setOption('fontSize', this.settings.editor.fontSize);
            window.editor.setOption('theme', this.settings.appearance.editorTheme);
        }

        showNotification('Settings applied!', 'success');
    }

    // Update preview for certain settings
    updatePreview(input) {
        const name = input.name || input.id;

        // Real-time theme preview
        if (name === 'theme' || name === 'themeSelect') {
            window.themeSwitcher?.applyTheme(input.value);
        }

        // Real-time font size preview
        if (name === 'fontSize' && window.editor) {
            window.editor.setOption('fontSize', parseInt(input.value));
        }
    }
}

// Initialize settings
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.settings-container')) {
        window.settings = new Settings();
    }
});
