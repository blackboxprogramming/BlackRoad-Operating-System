/**
 * BlackRoad OS - Window Manager & Event Bus
 * Core operating system functionality
 * Handles window creation, dragging, z-index, minimization, and global events
 * TODO: Add window resizing support
 * TODO: Add window snapping/tiling
 */

class BlackRoadOS {
    constructor() {
        this.windows = new Map(); // windowId -> window data
        this.zIndexCounter = 100;
        this.eventBus = new EventEmitter();
        this.windowsContainer = null;
        this.taskbarWindows = null;

        this.init();
    }

    init() {
        this.windowsContainer = document.getElementById('windows-container');
        this.taskbarWindows = document.getElementById('taskbar-windows');

        // Setup global event listeners
        this.setupGlobalListeners();

        // Emit boot event
        this.eventBus.emit('os:boot', { timestamp: new Date().toISOString() });
        console.log('BlackRoad OS initialized');
    }

    setupGlobalListeners() {
        // Close window on Escape (if focused)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const focusedWindow = this.getFocusedWindow();
                if (focusedWindow) {
                    this.closeWindow(focusedWindow.id);
                }
            }
        });

        // Command palette on Ctrl+K (future feature)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                // TODO: Open command palette
                console.log('Command palette - coming soon');
            }
        });
    }

    /**
     * Create a new window
     * @param {Object} options - { id, title, icon, content, width, height, x, y }
     * @returns {string} windowId
     */
    createWindow(options) {
        const windowId = options.id || `window_${Date.now()}`;

        // Check if window already exists
        if (this.windows.has(windowId)) {
            // Focus existing window
            this.focusWindow(windowId);
            return windowId;
        }

        // Create window element
        const windowEl = document.createElement('div');
        windowEl.className = 'os-window opening';
        windowEl.id = windowId;
        windowEl.style.width = options.width || '800px';
        windowEl.style.height = options.height || '600px';

        // Center window by default, or use provided coordinates
        if (options.x !== undefined && options.y !== undefined) {
            windowEl.style.left = `${options.x}px`;
            windowEl.style.top = `${options.y}px`;
        } else {
            // Center with slight random offset to avoid stacking
            const offsetX = (this.windows.size * 30) % 100;
            const offsetY = (this.windows.size * 30) % 100;
            windowEl.style.left = `calc(50% - ${parseInt(options.width || 800) / 2}px + ${offsetX}px)`;
            windowEl.style.top = `calc(50% - ${parseInt(options.height || 600) / 2}px + ${offsetY}px)`;
        }

        windowEl.style.zIndex = this.zIndexCounter++;

        // Create titlebar
        const titlebar = document.createElement('div');
        titlebar.className = 'window-titlebar';

        const titlebarLeft = document.createElement('div');
        titlebarLeft.className = 'window-titlebar-left';

        if (options.icon) {
            const icon = document.createElement('div');
            icon.className = 'window-icon';
            icon.innerHTML = options.icon;
            titlebarLeft.appendChild(icon);
        }

        const title = document.createElement('div');
        title.className = 'window-title';
        title.textContent = options.title || 'Untitled Window';
        titlebarLeft.appendChild(title);

        titlebar.appendChild(titlebarLeft);

        // Window controls
        const controls = document.createElement('div');
        controls.className = 'window-controls';

        const minimizeBtn = document.createElement('button');
        minimizeBtn.className = 'window-control-btn minimize';
        minimizeBtn.innerHTML = '−';
        minimizeBtn.title = 'Minimize';
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeWindow(windowId);
        });

        const maximizeBtn = document.createElement('button');
        maximizeBtn.className = 'window-control-btn maximize';
        maximizeBtn.innerHTML = '□';
        maximizeBtn.title = 'Maximize (coming soon)';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'window-control-btn close';
        closeBtn.innerHTML = '×';
        closeBtn.title = 'Close';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeWindow(windowId);
        });

        controls.appendChild(minimizeBtn);
        controls.appendChild(maximizeBtn);
        controls.appendChild(closeBtn);

        titlebar.appendChild(controls);
        windowEl.appendChild(titlebar);

        // Toolbar (if provided)
        if (options.toolbar) {
            windowEl.appendChild(options.toolbar);
        }

        // Window content
        const content = document.createElement('div');
        content.className = 'window-content';
        if (options.noPadding) {
            content.classList.add('no-padding');
        }
        if (typeof options.content === 'string') {
            content.innerHTML = options.content;
        } else if (options.content instanceof HTMLElement) {
            content.appendChild(options.content);
        }
        windowEl.appendChild(content);

        // Status bar (if provided)
        if (options.statusBar) {
            windowEl.appendChild(options.statusBar);
        }

        // Make draggable
        this.makeDraggable(windowEl, titlebar);

        // Add to container
        this.windowsContainer.appendChild(windowEl);

        // Store window data
        this.windows.set(windowId, {
            id: windowId,
            element: windowEl,
            title: options.title,
            icon: options.icon,
            minimized: false
        });

        // Add to taskbar
        this.addToTaskbar(windowId);

        // Focus window
        this.focusWindow(windowId);

        // Emit event
        this.eventBus.emit('window:created', { windowId, title: options.title });

        // Remove opening animation class after animation
        setTimeout(() => {
            windowEl.classList.remove('opening');
        }, 200);

        return windowId;
    }

    /**
     * Make window draggable
     */
    makeDraggable(windowEl, handle) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        handle.addEventListener('mousedown', (e) => {
            // Don't drag if clicking on buttons
            if (e.target.classList.contains('window-control-btn')) {
                return;
            }

            isDragging = true;
            initialX = e.clientX - windowEl.offsetLeft;
            initialY = e.clientY - windowEl.offsetTop;

            this.focusWindow(windowEl.id);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            e.preventDefault();

            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            // Prevent dragging off-screen (mostly)
            currentX = Math.max(0, Math.min(currentX, window.innerWidth - 100));
            currentY = Math.max(0, Math.min(currentY, window.innerHeight - 150));

            windowEl.style.left = `${currentX}px`;
            windowEl.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    /**
     * Focus a window (bring to front)
     */
    focusWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        // Update z-index
        windowData.element.style.zIndex = this.zIndexCounter++;

        // Update visual states
        this.windows.forEach((w, id) => {
            w.element.classList.toggle('focused', id === windowId);
        });

        // Update taskbar
        this.updateTaskbar();

        this.eventBus.emit('window:focused', { windowId });
    }

    /**
     * Minimize a window
     */
    minimizeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        windowData.minimized = true;
        windowData.element.classList.add('minimized');

        this.updateTaskbar();
        this.eventBus.emit('window:minimized', { windowId });
    }

    /**
     * Restore a minimized window
     */
    restoreWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        windowData.minimized = false;
        windowData.element.classList.remove('minimized');

        this.focusWindow(windowId);
        this.eventBus.emit('window:restored', { windowId });
    }

    /**
     * Close a window
     */
    closeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        // Remove from DOM
        windowData.element.remove();

        // Remove from windows map
        this.windows.delete(windowId);

        // Update taskbar
        this.updateTaskbar();

        this.eventBus.emit('window:closed', { windowId });
    }

    /**
     * Add window to taskbar
     */
    addToTaskbar(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        const btn = document.createElement('button');
        btn.className = 'taskbar-window-button';
        btn.id = `taskbar-${windowId}`;
        btn.textContent = windowData.title;

        btn.addEventListener('click', () => {
            if (windowData.minimized) {
                this.restoreWindow(windowId);
            } else {
                // If already focused, minimize
                if (windowData.element.classList.contains('focused')) {
                    this.minimizeWindow(windowId);
                } else {
                    this.focusWindow(windowId);
                }
            }
        });

        this.taskbarWindows.appendChild(btn);
    }

    /**
     * Update taskbar buttons state
     */
    updateTaskbar() {
        this.windows.forEach((windowData, windowId) => {
            const btn = document.getElementById(`taskbar-${windowId}`);
            if (btn) {
                btn.classList.toggle('active', windowData.element.classList.contains('focused'));
                if (windowData.minimized) {
                    btn.style.opacity = '0.6';
                } else {
                    btn.style.opacity = '1';
                }
            } else {
                // Button doesn't exist, might have been removed
                this.taskbarWindows.querySelector(`#taskbar-${windowId}`)?.remove();
            }
        });

        // Remove buttons for closed windows
        this.taskbarWindows.querySelectorAll('.taskbar-window-button').forEach(btn => {
            const windowId = btn.id.replace('taskbar-', '');
            if (!this.windows.has(windowId)) {
                btn.remove();
            }
        });
    }

    /**
     * Get currently focused window
     */
    getFocusedWindow() {
        for (let [id, data] of this.windows) {
            if (data.element.classList.contains('focused')) {
                return data;
            }
        }
        return null;
    }

    /**
     * Show a notification
     */
    showNotification(options) {
        const container = document.getElementById('notification-container');

        const notification = document.createElement('div');
        notification.className = `notification ${options.type || 'info'}`;

        const header = document.createElement('div');
        header.className = 'notification-header';

        const title = document.createElement('div');
        title.className = 'notification-title';
        title.textContent = options.title || 'Notification';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        header.appendChild(title);
        header.appendChild(closeBtn);

        const body = document.createElement('div');
        body.className = 'notification-body';
        body.textContent = options.message || '';

        notification.appendChild(header);
        notification.appendChild(body);

        container.appendChild(notification);

        // Auto-remove after duration
        const duration = options.duration || 5000;
        if (duration > 0) {
            setTimeout(() => {
                notification.remove();
            }, duration);
        }

        this.eventBus.emit('notification:shown', options);
    }
}

/**
 * Simple Event Emitter
 */
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }

    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
}

// Create global OS instance
window.OS = new BlackRoadOS();
