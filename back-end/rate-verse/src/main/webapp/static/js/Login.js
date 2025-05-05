document.addEventListener('DOMContentLoaded', () => {
    // Check for registration success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        showSuccess('Registration successful, please log in');
        // Remove the query parameter to prevent re-display on refresh
        window.history.replaceState({}, document.title, '/Login.html');
    }

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // Call login API
                const loginResponse = await fetch('/user/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, passwordHash: password })
                });

                // Parse login response
                const loginResult = await loginResponse.json();
                if (loginResult.code === 200) {
                    window.location.href = '/Rating.html'; // Redirect on successful login
                } else if (loginResult.code === 506) {
                    showError("User does not exist");
                } else if (loginResult.code === 504) {
                    showError('Incorrect email or password');
                } else if (loginResult.code === 505) {
                    showError("Incorrect email or password");
                } else {
                    showError(loginResult.message || 'Unknown error, please try again');
                }
            } catch (error) {
                console.error('Login process error:', error);
                showError('Login service error, please try again later');
            }
        });
    } else {
        console.error("Login form not found");
    }
});

// Function to display error messages
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        // Hide after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    } else {
        console.warn("Error message element not found, using alert");
        alert(message);
    }
}

// Function to display success messages
function showSuccess(message) {
    const successElement = document.getElementById('success-message');
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
        // Hide after 5 seconds
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 3000);
    } else {
        console.warn("Success message element not found, using alert");
        alert(message);
    }
}

// Handle Google Sign-In callback
window.handleCredentialResponse = async (response) => {
    try {
        // Send the ID token to the backend for verification
        const googleResponse = await fetch('/user/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: response.credential })
        });

        const googleResult = await googleResponse.json();
        if (googleResult.code === 200) {
            showSuccess('Google login successful');
            window.location.href = '/Rating.html';
        } else if (googleResult.code === 1010) {
            showError('Invalid Google token. Please try again.');
        } else if (googleResult.code === 1009) {
            showError('This email is already linked to another Google account. Please use the associated Google account or contact support.');
        } else if (googleResult.code === 1001) {
            showError('Database error. Please try again later.');
        } else if (googleResult.code === 1008) {
            showError('Server error. Please try again later.');
        } else {
            showError(googleResult.message || 'Google login failed. Please try again.');
        }
    } catch (error) {
        console.error('Google login error:', error);
        showError('Network error during Google login. Please try again later.');
    }
};