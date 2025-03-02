document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // 1. Call login API
        const loginResponse = await fetch('/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, passwordHash: password })
        });

        // 2. Parse login response
        const loginResult = await loginResponse.json();
        if (loginResult.code === 200) {
            window.location.href = '/Home.html'; // Redirect on successful login
        } else if (loginResult.code === 505) {
            showError("Incorrect email or password"); // Show error message for code 505
        } else {
            showError('Unknown error, please try again');
        }

    } catch (error) {
        console.error('Login process error:', error);
        showError('Login service error, please try again later');
    }
});

// Function to display error messages
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        alert(message); // Fallback
    }
}
