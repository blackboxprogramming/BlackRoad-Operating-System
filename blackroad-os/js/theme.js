/**
 * Theme Manager
 * Handles TealOS <-> NightOS theme switching
 * Persists user preference to localStorage
 * TODO: Add more theme variants
 * TODO: Add custom theme builder
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'tealOS';
        this.init();
    }

    init() {
        // Load saved theme from localStorage
        const saved = localStorage.getItem('blackroad-theme');
        if (saved && (saved === 'tealOS' || saved === 'nightOS')) {
            this.currentTheme = saved;
        }

        // Apply theme
        this.applyTheme(this.currentTheme);

        // Setup toggle button
        this.setupToggleButton();

        console.log('Theme Manager initialized:', this.currentTheme);
    }

    setupToggleButton() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', () => {
            this.toggleTheme();
        });

        this.updateToggleButton();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'tealOS' ? 'nightOS' : 'tealOS';
        this.applyTheme(this.currentTheme);
        this.saveTheme();
        this.updateToggleButton();

        // Emit event
        if (window.OS) {
            window.OS.eventBus.emit('theme:changed', { theme: this.currentTheme });
            window.OS.showNotification({
                type: 'info',
                title: 'Theme Changed',
                message: `Switched to ${this.currentTheme === 'tealOS' ? 'Teal OS' : 'Night OS'}`,
                duration: 2000
            });
        }
    }

    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
    }

    saveTheme() {
        localStorage.setItem('blackroad-theme', this.currentTheme);
    }

    updateToggleButton() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (!toggleBtn) return;

        const icon = toggleBtn.querySelector('.icon');
        if (icon) {
            icon.textContent = this.currentTheme === 'tealOS' ? '🌙' : '☀️';
        }
    }

    getTheme() {
        return this.currentTheme;
    }

    setTheme(theme) {
        if (theme === 'tealOS' || theme === 'nightOS') {
            this.currentTheme = theme;
            this.applyTheme(theme);
            this.saveTheme();
            this.updateToggleButton();
        }
    }
}

// Create global instance
window.ThemeManager = new ThemeManager();
