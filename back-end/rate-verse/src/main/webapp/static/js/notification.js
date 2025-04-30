/* Notification modal */
document.addEventListener('DOMContentLoaded', () => {
    const notificationButton = document.getElementById('notificationButton');
    const notificationModal = document.getElementById('notificationModal');
    const profileDropdown = document.getElementById('profileDropdown'); // Reference to profile modal

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

    notificationButton.addEventListener('click', (event) => {
        event.stopPropagation();
        console.log("Notification button clicked!"); // Debugging
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

    document.addEventListener('click', (event) => {
        if (!notificationModal.contains(event.target) && event.target !== notificationButton) {
            console.log("Clicked outside notification modal, closing it");
            notificationModal.classList.remove('active');
        }
    });
});