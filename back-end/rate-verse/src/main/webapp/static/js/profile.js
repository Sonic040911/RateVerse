/* Modal profile button */
const profileButton = document.getElementById('profileButton');
const profileDropdown = document.getElementById('profileDropdown');

const cardProfile = document.getElementById("cardProfile");
const cardTheme = document.getElementById("cardTheme");

if (profileButton && profileDropdown) {
  profileButton.addEventListener('click', (event) => {
    event.stopPropagation();
    profileDropdown.classList.toggle('active');
  });
}

document.addEventListener('click', (event) => {
  if (profileDropdown && !profileDropdown.contains(event.target) && event.target !== profileButton) {
    profileDropdown.classList.remove('active');

    if (cardProfile && cardTheme) {
      cardProfile.style.display = "block";
      cardTheme.style.display = "none";
    }
  }
});

/* Modal theme button */
document.addEventListener("DOMContentLoaded", () => {
  const themeNav = document.getElementById("themeNav");
  const backToProfile = document.getElementById("backToProfile");

  if (themeNav && cardProfile && cardTheme) {
    themeNav.addEventListener("click", (e) => {
      e.stopPropagation();
      cardProfile.style.display = "none";
      cardTheme.style.display = "block";
    });
  }

  if (backToProfile && cardProfile && cardTheme) {
    backToProfile.addEventListener("click", (e) => {
      e.stopPropagation();
      cardTheme.style.display = "none";
      cardProfile.style.display = "block";
    });
  }

  /* My profile button */
  const myProfile = document.getElementById('myProfile');
  if (myProfile) {
    myProfile.addEventListener('click', () => {
      window.location.href = 'my_profile.html';
    });
  }

  /* My Account button */
  const myAccountNav = document.getElementById('myAccountNav');
  if (myAccountNav) {
    myAccountNav.addEventListener('click', () => {
      window.location.href = 'my_profile.html';
    });
  }
});