document.addEventListener('DOMContentLoaded', () => {
    const notificationButton = document.getElementById('notificationButton');
    const notificationModal = document.getElementById('notificationModal');
    const profileDropdown = document.getElementById('profileDropdown');
    const notificationBody = document.querySelector('.notification-body');
    const pageSize = 10;
    let currentPage = 1;
    let totalPages = 0;
    let currentUserId = null;

    // Debugging: Check if elements are found
    if (!notificationButton) {
        console.error("Notification button not found!");
        return;
    }
    if (!notificationModal) {
        console.error("Notification modal not found!");
        return;
    }
    if (!profileDropdown) {
        console.error("Profile dropdown not found!");
    }
    if (!notificationBody) {
        console.error("Notification body not found!");
        return;
    }

    // Show notification popup
    const showNotification = (message, isError = false) => {
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background: ${isError ? '#ff4444' : '#4CAF50'};
            color: #fff;
            border-radius: 5px;
            opacity: 1;
            transition: opacity 0.3s;
            z-index: 1000;
        `;
        popup.textContent = message;
        document.body.appendChild(popup);
        setTimeout(() => popup.style.opacity = '0', 2000);
        setTimeout(() => popup.remove(), 2300);
    };

    // Get current user ID from backend
    async function getCurrentUserId() {
        if (currentUserId !== null) {
            return currentUserId;
        }
        try {
            const response = await fetch('/api/auth/currentUser', {
                method: 'GET',
                credentials: 'include'
            });
            const result = await response.json();
            if (result.code === 200) {
                currentUserId = result.data;
                console.log(`Fetched userId: ${currentUserId}`);
                return currentUserId;
            } else {
                console.error('Failed to fetch user ID:', result.message);
                showNotification('Please log in to view notifications', true);
                return null;
            }
        } catch (error) {
            console.error('Error fetching user ID:', error);
            showNotification('Network error, please try again', true);
            return null;
        }
    }

    // Fetch notifications from backend
    async function fetchNotifications(append = false) {
        try {
            const userId = await getCurrentUserId();
            if (!userId) {
                console.error("User ID not found!");
                renderNotifications([]);
                return;
            }

            console.log(`Fetching notifications for userId: ${userId}`);
            const response = await fetch(`/api/notification/getByUser/${pageSize}/${currentPage}?userId=${userId}`, {
                method: 'GET',
                credentials: 'include'
            });
            const result = await response.json();
            console.log('Notification API response:', result);

            if (result.code === 200) {
                const pageBean = result.data;
                if (!pageBean || !Array.isArray(pageBean.data)) {
                    console.error('Invalid pageBean data:', pageBean);
                    showNotification("Invalid notification data", true);
                    renderNotifications([]);
                    return;
                }
                renderNotifications(pageBean.data, append);
                totalPages = Math.ceil(pageBean.total / pageSize);
                updateShowMoreButton();
            } else {
                console.error('Failed to fetch notifications:', result.message);
                showNotification("Failed to load notifications", true);
                renderNotifications([]);
            }
        } catch (error) {
            console.error('Request failed:', error);
            showNotification("Network error, please try again", true);
            renderNotifications([]);
        }
    }

    // Render notifications
    function renderNotifications(notifications, append = false) {
        if (!append) {
            notificationBody.innerHTML = `
                <svg class="bell-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7e8590" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
                <h3>Notifications</h3>
            `;
        }

        const ul = append ? notificationBody.querySelector('.notification-list') || document.createElement('ul') : document.createElement('ul');
        ul.className = 'notification-list';

        if (notifications.length === 0 && !append) {
            notificationBody.innerHTML += `<p>This section will display notifications</p>`;
        } else {
            notifications.forEach(notification => {
                const li = document.createElement('li');
                li.className = notification.isRead ? 'read' : 'unread';
                li.innerHTML = `
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${formatTime(notification.createdAt)}</div>
                `;
                li.addEventListener('click', async () => {
                    if (!notification.isRead) {
                        await markNotificationRead(notification.id);
                        li.className = 'read';
                    }
                });
                ul.appendChild(li);
            });
            notificationBody.appendChild(ul);
        }
    }

    // Mark notification as read
    async function markNotificationRead(notificationId) {
        try {
            const response = await fetch(`/api/notification/markRead/${notificationId}`, {
                method: 'POST',
                credentials: 'include'
            });
            const result = await response.json();
            if (result.code !== 200) {
                console.error('Failed to mark notification as read:', result.message);
                showNotification("Failed to mark notification as read", true);
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            showNotification("Network error while marking notification", true);
        }
    }

    // Format time (e.g., "2h ago")
    function formatTime(createdAt) {
        const now = new Date();
        const time = new Date(createdAt);
        const diffMs = now - time;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHr / 24);

        if (diffDay > 0) return `${diffDay}d ago`;
        if (diffHr > 0) return `${diffHr}h ago`;
        if (diffMin > 0) return `${diffMin}m ago`;
        return `${diffSec}s ago`;
    }

    // Update Show More button
    function updateShowMoreButton() {
        let showMoreButton = notificationBody.querySelector('.show-more');
        if (!showMoreButton) {
            showMoreButton = document.createElement('button');
            showMoreButton.className = 'show-more';
            showMoreButton.textContent = 'Show More';
            notificationBody.appendChild(showMoreButton);
            showMoreButton.addEventListener('click', () => {
                currentPage++;
                fetchNotifications(true);
            });
        }
        showMoreButton.style.display = currentPage < totalPages ? 'block' : 'none';
    }

    // Toggle notification modal
    notificationButton.addEventListener('click', (event) => {
        event.stopPropagation();
        console.log("Notification button clicked!");
        if (profileDropdown && profileDropdown.classList.contains('active')) {
            console.log("Closing profile modal");
            profileDropdown.classList.remove('active');
        }
        notificationModal.classList.toggle('active');
        if (notificationModal.classList.contains('active')) {
            currentPage = 1;
            fetchNotifications();
        }
    });

    // Close modal when clicking outside
    document.addEventListener('click', (event) => {
        if (!notificationModal.contains(event.target) && event.target !== notificationButton) {
            console.log("Clicked outside notification modal, closing it");
            notificationModal.classList.remove('active');
        }
    });
});