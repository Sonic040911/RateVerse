        // Toggle FAQ answers
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                faqItem.classList.toggle('active');
            });
        });
        
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
                    if (container.id === tabId) {
                        container.style.display = 'block';
                    } else {
                        container.style.display = 'none';
                    }
                });
            });
        });
        
        // Form submission handler
        const contactForm = document.querySelector('.contact-form');
        
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send this data to your backend
            // For now, let's just show an alert
            alert(`Thank you for your message, ${name}! Our support team will get back to you shortly.`);
            
            // Reset the form
            contactForm.reset();
        });