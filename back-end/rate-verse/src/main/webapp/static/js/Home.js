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

    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    } else {
        console.error('Hamburger or nav menu not found:', {
            hamburger: !!hamburger,
            navMenu: !!navMenu
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
        if (window.innerWidth > 768 && navMenu) {
            navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        }
    }

    // Initial call and event listener for window resize
    handleResize();
    window.addEventListener('resize', handleResize);
});