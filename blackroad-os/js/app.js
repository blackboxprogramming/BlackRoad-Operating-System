/**
 * BlackRoad OS Bootloader
 * Initializes the desktop environment
 * Renders desktop icons, starts system clock, sets up event handlers
 * This is the last file loaded - all dependencies are available
 */

class BootLoader {
    constructor() {
        this.desktopIcons = document.getElementById('desktop-icons');
        this.startButton = document.getElementById('start-button');
        this.startMenu = document.getElementById('start-menu');
        this.systemClock = document.getElementById('system-clock');

        this.boot();
    }

    boot() {
        console.log('🚀 Booting BlackRoad OS...');

        // Render desktop icons
        this.renderDesktopIcons();

        // Populate start menu
        this.populateStartMenu();

        // Setup start menu toggle
        this.setupStartMenu();

        // Setup system tray
        this.setupSystemTray();

        // Start system clock
        this.startClock();

        // Show welcome notification
        this.showWelcome();

        // Listen to OS events
        this.setupEventListeners();

        console.log('✅ BlackRoad OS ready');
        window.OS.eventBus.emit('os:ready', { timestamp: new Date().toISOString() });
    }

    renderDesktopIcons() {
        // Get all apps from registry
        const apps = Object.values(AppRegistry);

        apps.forEach(app => {
            const icon = document.createElement('div');
            icon.className = 'desktop-icon';
            icon.dataset.appId = app.id;

            const iconImage = document.createElement('div');
            iconImage.className = 'desktop-icon-image';
            iconImage.textContent = app.icon;

            const iconLabel = document.createElement('div');
            iconLabel.className = 'desktop-icon-label';
            iconLabel.textContent = app.name;

            icon.appendChild(iconImage);
            icon.appendChild(iconLabel);

            // Double-click to launch
            icon.addEventListener('dblclick', () => {
                launchApp(app.id);
            });

            this.desktopIcons.appendChild(icon);
        });
    }

    populateStartMenu() {
        const menuApps = document.getElementById('start-menu-apps');
        const apps = Object.values(AppRegistry);

        apps.forEach(app => {
            const item = document.createElement('div');
            item.className = 'start-menu-item';

            const icon = document.createElement('div');
            icon.className = 'start-menu-item-icon';
            icon.textContent = app.icon;

            const details = document.createElement('div');
            details.className = 'start-menu-item-details';

            const name = document.createElement('div');
            name.className = 'start-menu-item-name';
            name.textContent = app.name;

            const desc = document.createElement('div');
            desc.className = 'start-menu-item-desc';
            desc.textContent = app.description;

            details.appendChild(name);
            details.appendChild(desc);

            item.appendChild(icon);
            item.appendChild(details);

            item.addEventListener('click', () => {
                launchApp(app.id);
                this.startMenu.style.display = 'none';
            });

            menuApps.appendChild(item);
        });
    }

    setupStartMenu() {
        this.startButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = this.startMenu.style.display === 'block';
            this.startMenu.style.display = isVisible ? 'none' : 'block';
        });

        // Close start menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.startMenu.contains(e.target) && !this.startButton.contains(e.target)) {
                this.startMenu.style.display = 'none';
            }
        });

        // Shutdown button
        const shutdownBtn = document.getElementById('shutdown-btn');
        shutdownBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to shutdown BlackRoad OS?')) {
                window.OS.showNotification({
                    type: 'info',
                    title: 'Shutting Down',
                    message: 'BlackRoad OS is shutting down...',
                    duration: 2000
                });
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        });
    }

    setupSystemTray() {
        // Notifications tray
        const notificationsTray = document.getElementById('notifications-tray');
        notificationsTray.addEventListener('click', () => {
            launchApp('notifications');
        });

        // Settings tray
        const settingsTray = document.getElementById('settings-tray');
        settingsTray.addEventListener('click', () => {
            launchApp('settings');
        });

        // Update notification badge
        this.updateNotificationBadge();
    }

    updateNotificationBadge() {
        const badge = document.getElementById('notification-badge');
        const unreadCount = MockData.notifications.filter(n => !n.read).length;

        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }

    startClock() {
        const updateClock = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            this.systemClock.textContent = `${hours}:${minutes}`;
        };

        updateClock();
        setInterval(updateClock, 1000);
    }

    showWelcome() {
        setTimeout(() => {
            window.OS.showNotification({
                type: 'success',
                title: 'Welcome to BlackRoad OS',
                message: 'System initialized successfully. All services online.',
                duration: 5000
            });
        }, 500);
    }

    setupEventListeners() {
        // Listen for window events
        window.OS.eventBus.on('window:created', (data) => {
            console.log('Window created:', data.windowId);
        });

        window.OS.eventBus.on('window:closed', (data) => {
            console.log('Window closed:', data.windowId);
        });

        window.OS.eventBus.on('theme:changed', (data) => {
            console.log('Theme changed:', data.theme);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+P -> Prism Console
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                launchApp('prism');
            }

            // Ctrl+Shift+M -> Miners
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                e.preventDefault();
                launchApp('miners');
            }

            // Ctrl+Shift+E -> Engineering
            if (e.ctrlKey && e.shiftKey && e.key === 'E') {
                e.preventDefault();
                launchApp('engineering');
            }
        });
    }
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BootLoader();
    });
} else {
    new BootLoader();
}
