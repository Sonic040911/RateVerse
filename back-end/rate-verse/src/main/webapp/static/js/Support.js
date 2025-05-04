// Tab switching
const tabs = document.querySelectorAll('.faq-tab');
const containers = document.querySelectorAll('.faq-container');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show/hide containers
        containers.forEach(container => {
            container.style.display = container.id === tabId ? 'block' : 'none';
        });
        
        // Close all FAQs in the new tab
        document.querySelectorAll('.faq-item.active').forEach(item => {
            item.classList.remove('active');
        });
    });
});

// FAQ toggling
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all other FAQs
        document.querySelectorAll('.faq-item.active').forEach(item => {
            item.classList.remove('active');
        });
        
        // Toggle the clicked FAQ (open if closed, close if open)
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Search bar clear functionality
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');

searchInput.addEventListener('input', () => {
    if (searchInput.value.length > 0) {
        searchClear.classList.add('active');
    } else {
        searchClear.classList.remove('active');
    }
});

searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.classList.remove('active');
    searchInput.focus();
});