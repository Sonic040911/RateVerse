/* Profile modal */
document.addEventListener('DOMContentLoaded', () => {
    const profileButton = document.getElementById('profileButton');
    const profileDropdown = document.getElementById('profileDropdown');
    const notificationModal = document.getElementById('notificationModal');
    const logoutButton = document.querySelector('.element.delete');

    // Debugging: Check if elements are found
    if (!profileButton) {
        console.error("Profile button not found!");
        return;
    }
    if (!profileDropdown) {
        console.error("Profile dropdown not found!");
        return;
    }
    if (!notificationModal) {
        console.error("Notification modal not found!");
        return;
    }
    if (!logoutButton) {
        console.error("Logout button not found!");
        return;
    }

    profileButton.addEventListener('click', (event) => {
        event.stopPropagation();
        console.log("Profile button clicked!");
        // Close notification modal if open
        if (notificationModal.classList.contains('active')) {
            console.log("Closing notification modal");
            notificationModal.classList.remove('active');
        }
        // Toggle profile modal
        console.log("Toggling profile modal. Current state:", profileDropdown.classList.contains('active'));
        profileDropdown.classList.toggle('active');
        console.log("Profile modal new state:", profileDropdown.classList.contains('active'));
    });

    document.addEventListener('click', (event) => {
        if (!profileDropdown.contains(event.target) && event.target !== profileButton) {
            console.log("Clicked outside profile modal, closing it");
            profileDropdown.classList.remove('active');
        }
    });

    // Handle logout
    logoutButton.addEventListener('click', async (event) => {
        event.stopPropagation();
        console.log("Logout button clicked!");
        try {
            const response = await fetch('/user/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (result.code === 200) {
                console.log("Logout successful, redirecting to login.html");
                alert('Logged out successfully');
                window.location.href = 'Login.html';
            } else {
                console.error('Failed to log out:', result.message);
                alert('Failed to log out: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error during logout:', error);
            alert('Network error during logout');
        }
    });
});

/* Modal theme button */
document.addEventListener("DOMContentLoaded", () => {
    const themeNav = document.getElementById("themeNav");
    const backToProfile = document.getElementById("backToProfile");
    const cardProfile = document.getElementById("cardProfile");
    const cardTheme = document.getElementById("cardTheme");

    if (!themeNav || !backToProfile || !cardProfile || !cardTheme) {
        console.error("Theme navigation elements not found!");
        return;
    }

    themeNav.addEventListener("click", (e) => {
        e.stopPropagation();
        cardProfile.style.display = "none";
        cardTheme.style.display = "block";
    });

    backToProfile.addEventListener("click", (e) => {
        e.stopPropagation();
        cardTheme.style.display = "none";
        cardProfile.style.display = "block";
    });
});

/* My profile button */
const myProfile = document.getElementById('myProfile');

if (myProfile) {
    myProfile.addEventListener('click', () => {
        window.location.href = 'my_profile.html';
    });
} else {
    console.error("My Profile button not found!");
}