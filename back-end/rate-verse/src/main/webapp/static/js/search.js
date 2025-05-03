document.addEventListener('DOMContentLoaded', () => {
    // Notification popup for user feedback
    const notificationPopup = document.createElement('div');
    notificationPopup.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        background: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 5px;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1000;
    `;
    document.body.appendChild(notificationPopup);

    function showNotification(message, isError = false) {
        notificationPopup.textContent = message;
        notificationPopup.style.background = isError ? '#ff4444' : '#4CAF50';
        notificationPopup.style.color = '#fff';
        notificationPopup.style.opacity = '1';
        setTimeout(() => {
            notificationPopup.style.opacity = '0';
        }, 2000);
    }

    // Search button functionality
    const searchButton = document.querySelector('.search-logo');
    const searchInput = document.querySelector('.search-input');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            const keyword = searchInput.value.trim();
            if (keyword) {
                window.location.href = `Search&Category.html?keyword=${encodeURIComponent(keyword)}`;
            } else {
                showNotification('Please enter a search keyword', true);
            }
        });

        // Allow pressing Enter to search
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const keyword = searchInput.value.trim();
                if (keyword) {
                    window.location.href = `Search&Category.html?keyword=${encodeURIComponent(keyword)}`;
                } else {
                    showNotification('Please enter a search keyword', true);
                }
            }
        });
    }
});