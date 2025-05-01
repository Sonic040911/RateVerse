/* Profile modal */
document.addEventListener('DOMContentLoaded', () => {
  const profileButton = document.getElementById('profileButton');
  const profileDropdown = document.getElementById('profileDropdown');
  const notificationModal = document.getElementById('notificationModal'); // Reference to notification modal

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

  profileButton.addEventListener('click', (event) => {
      event.stopPropagation();
      console.log("Profile button clicked!"); // Debugging
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
});

/* Modal theme button */
document.addEventListener("DOMContentLoaded", () => {
  const themeNav = document.getElementById("themeNav"); 
  const backToProfile = document.getElementById("backToProfile"); 

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

myProfile.addEventListener('click', () => {
    window.location.href = 'my_profile.html';
});

