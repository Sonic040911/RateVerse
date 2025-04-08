/* Modal profile button */
const profileButton = document.getElementById('profileButton');
const profileDropdown = document.getElementById('profileDropdown');

const cardProfile = document.getElementById("cardProfile");
const cardTheme = document.getElementById("cardTheme");

profileButton.addEventListener('click', (event) => {
  event.stopPropagation();
  profileDropdown.classList.toggle('active');
});

document.addEventListener('click', (event) => {
  if (!profileDropdown.contains(event.target) && event.target !== profileButton) {
    profileDropdown.classList.remove('active');

    cardProfile.style.display = "block";
    cardTheme.style.display = "none";
  }
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
