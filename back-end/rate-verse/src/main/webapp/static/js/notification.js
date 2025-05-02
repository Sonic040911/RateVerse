/* Notification modal */
document.addEventListener('DOMContentLoaded', () => {
    const notificationButton = document.getElementById('notificationButton');
    const notificationModal = document.getElementById('notificationModal');
    const profileDropdown = document.getElementById('profileDropdown');
    const notificationBody = document.querySelector('.notification-body');

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

    // Sample notification data (replace with real data from backend in production)
    const notifications = [
        { id: 1, message: "User123 liked your rating on 'Top Games'.", time: "2h ago" },
        { id: 2, message: "JaneDoe commented on your rating: 'Great list!'.", time: "5h ago" },
        { id: 3, message: "AlexSmith replied to your comment on 'Steam's Badly Rated Games'.", time: "1d ago" },
        { id: 4, message: "GameFan liked your comment on 'Name 1'.", time: "1d ago" }
    ];

    // Function to render notifications
    function renderNotifications() {
        // Clear existing content
        notificationBody.innerHTML = '';

        if (notifications.length === 0) {
            // Show placeholder if no notifications
            notificationBody.innerHTML = `
                <svg class="bell-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7e8590" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
                <h3>Nothing here yet</h3>
                <p>This section will display notifications</p>
            `;
        } else {
            // Create notification list
            const ul = document.createElement('ul');
            ul.className = 'notification-list';
            notifications.forEach(notification => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${notification.time}</div>
                `;
                ul.appendChild(li);
            });
            notificationBody.appendChild(ul);
        }
    }

    // Initial render
    renderNotifications();

    // Toggle notification modal
    notificationButton.addEventListener('click', (event) => {
        event.stopPropagation();
        console.log("Notification button clicked!");
        // Close profile modal if open
        if (profileDropdown && profileDropdown.classList.contains('active')) {
            console.log("Closing profile modal");
            profileDropdown.classList.remove('active');
        }
        // Toggle notification modal
        console.log("Toggling notification modal. Current state:", notificationModal.classList.contains('active'));
        notificationModal.classList.toggle('active');
        console.log("Notification modal new state:", notificationModal.classList.contains('active'));
    });

    // Close modal when clicking outside
    document.addEventListener('click', (event) => {
        if (!notificationModal.contains(event.target) && event.target !== notificationButton) {
            console.log("Clicked outside notification modal, closing it");
            notificationModal.classList.remove('active');
        }
    });
});