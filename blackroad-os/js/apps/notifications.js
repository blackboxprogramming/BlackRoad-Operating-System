/**
 * Notifications App
 * View and manage system notifications and alerts
 * TODO: Add notification filtering
 * TODO: Add notification history
 * TODO: Add notification preferences
 */

window.NotificationsApp = function() {
    const appId = 'notifications';

    // Create toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'window-toolbar';

    const markAllReadBtn = Components.Button('Mark All Read', {
        onClick: () => {
            MockData.notifications.forEach(n => n.read = true);
            window.OS.showNotification({
                type: 'success',
                title: 'All Read',
                message: 'All notifications marked as read',
                duration: 2000
            });
            // Refresh would go here
        }
    });

    const clearAllBtn = Components.Button('Clear All', {
        type: 'danger',
        onClick: () => {
            if (confirm('Clear all notifications?')) {
                window.OS.showNotification({
                    type: 'info',
                    title: 'Notifications Cleared',
                    message: 'All notifications have been removed',
                    duration: 2000
                });
            }
        }
    });

    toolbar.appendChild(markAllReadBtn);
    toolbar.appendChild(clearAllBtn);

    // Create content
    const content = createNotificationsContent();

    // Create window
    window.OS.createWindow({
        id: appId,
        title: 'Notifications',
        icon: '🔔',
        toolbar: toolbar,
        content: content,
        width: '500px',
        height: '600px'
    });
};

function createNotificationsContent() {
    const container = document.createElement('div');

    const unreadCount = MockData.notifications.filter(n => !n.read).length;

    const header = document.createElement('div');
    header.style.marginBottom = '16px';
    header.innerHTML = `
        <div style="color: var(--text-primary); font-weight: 600; margin-bottom: 4px;">
            Notifications
        </div>
        <div style="color: var(--text-secondary); font-size: 13px;">
            ${unreadCount} unread • ${MockData.notifications.length} total
        </div>
    `;

    container.appendChild(header);

    // Notifications list
    if (MockData.notifications.length === 0) {
        container.appendChild(Components.EmptyState({
            icon: '🔔',
            title: 'No Notifications',
            text: 'You\'re all caught up!'
        }));
    } else {
        const notificationsList = Components.List(
            MockData.notifications.map(notif => ({
                icon: getNotificationIcon(notif.type),
                title: notif.title,
                subtitle: `${notif.message} • ${notif.timestamp}`,
                actions: createNotificationActions(notif),
                onClick: () => {
                    if (!notif.read) {
                        notif.read = true;
                        window.OS.showNotification({
                            type: 'info',
                            title: 'Marked as Read',
                            message: notif.title,
                            duration: 1500
                        });
                    }
                }
            }))
        );

        // Style unread notifications
        const listItems = notificationsList.querySelectorAll('.list-item');
        listItems.forEach((item, index) => {
            if (!MockData.notifications[index].read) {
                item.style.background = 'var(--bg-surface)';
                item.style.borderLeft = '3px solid var(--primary)';
                item.style.paddingLeft = '9px';
            }
        });

        container.appendChild(notificationsList);
    }

    return container;
}

function getNotificationIcon(type) {
    const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    return icons[type] || 'ℹ️';
}

function createNotificationActions(notif) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '4px';

    const deleteBtn = Components.Button('×', {
        size: 'small',
        onClick: (e) => {
            e.stopPropagation();
            window.OS.showNotification({
                type: 'info',
                title: 'Deleted',
                message: 'Notification removed',
                duration: 1500
            });
        }
    });

    container.appendChild(deleteBtn);

    return container;
}
