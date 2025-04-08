function applyTheme(isDark) {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
  
  const savedTheme = localStorage.getItem('theme');
  applyTheme(savedTheme === 'dark');
  
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.checked = (savedTheme === 'dark');
  
    themeToggle.addEventListener('change', () => {
      if (themeToggle.checked) {
        localStorage.setItem('theme', 'dark');
        applyTheme(true);
      } else {
        localStorage.setItem('theme', 'light');
        applyTheme(false);
      }
    });
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
      applyTheme(e.newValue === 'dark');
      if (themeToggle) {
        themeToggle.checked = (e.newValue === 'dark');
      }
    }
  });


  /* dark mode function */
  document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const toggleContainer = document.querySelector('.toggle-container');

    let modeText = document.createElement('span');
    modeText.className = 'mode-text';
    modeText.style.marginRight = '10px'; 
    toggleContainer.insertBefore(modeText, toggleContainer.firstChild);

    function updateModeText() {
      if (themeToggle.checked) {
        modeText.textContent = 'Dark Mode';
      } else {
        modeText.textContent = 'Light Mode';
      }
    }

    updateModeText();

    themeToggle.addEventListener('change', function() {
      updateModeText();
      if (themeToggle.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    });
  });
  