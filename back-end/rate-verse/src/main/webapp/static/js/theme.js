document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded fired');
  const themeToggle = document.getElementById('theme-toggle');
  const toggleContainer = document.querySelector('.toggle-container');

  if (!toggleContainer) {
      console.warn('toggleContainer not found');
  }

  let modeText = document.createElement('span');
  modeText.className = 'mode-text';
  modeText.style.marginRight = '10px';
  if (toggleContainer) {
      toggleContainer.insertBefore(modeText, toggleContainer.firstChild);
  }

  function applyTheme(isDark) {
      console.log('Applying theme:', isDark ? 'dark' : 'light');
      if (isDark) {
          document.body.classList.add('dark-mode');
          modeText.textContent = 'Dark Mode';
      } else {
          document.body.classList.remove('dark-mode');
          modeText.textContent = 'Light Mode';
      }
  }

  const savedTheme = localStorage.getItem('theme');
  console.log('Saved theme:', savedTheme);
  const isDark = savedTheme === 'dark';
  applyTheme(isDark);
  if (themeToggle) {
      themeToggle.checked = isDark;
  }

  if (themeToggle) {
      themeToggle.addEventListener('change', () => {
          const isDarkMode = themeToggle.checked;
          console.log('Theme toggle changed:', isDarkMode);
          localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
          applyTheme(isDarkMode);
      });
  }

  window.addEventListener('storage', (e) => {
      if (e.key === 'theme') {
          console.log('Storage event:', e.newValue);
          const isDarkMode = e.newValue === 'dark';
          applyTheme(isDarkMode);
          if (themeToggle) {
              themeToggle.checked = isDarkMode;
          }
      }
  });
});