document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('open');
            mobileMenuBtn.textContent = nav.classList.contains('open') ? '✕' : '☰';
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                mobileMenuBtn.textContent = '☰';
            });
        });
    }

    // Check if images load, log errors if they fail
    document.querySelectorAll('.about-us-image img, .our-mission-image img, .for-advertisers-image img').forEach(img => {
        img.addEventListener('error', () => {
            console.error(`Failed to load image: ${img.src}`);
            img.style.display = 'none'; // Hide the image if it fails to load
            img.parentElement.style.backgroundColor = '#e0e0e0'; // Show fallback background
        });
        img.addEventListener('load', () => {
            console.log(`Successfully loaded image: ${img.src}`);
        });
    });
    
    // Responsive handling
    function handleResize() {
        if (window.innerWidth > 768 && nav) {
            nav.classList.remove('open');
            if (mobileMenuBtn) mobileMenuBtn.textContent = '☰';
        }
    }
    
    // Initial call and event listener for window resize
    handleResize();
    window.addEventListener('resize', handleResize);
});