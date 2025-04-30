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
});