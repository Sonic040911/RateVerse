document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous error messages
    clearErrors();

    // Get form data
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Simple front-end validation
    if (!username || !email || !password) {
        showError('All required fields must be filled out');
        return;
    }

    try {
        // Step 1: Check if username is available
        const usernameCheck = await checkUsernameAvailability(username);
        if (usernameCheck.code === 502) {
            showFieldError('username', 'Username is already taken');
            return;
        }

        // Step 2: Check if email is available
        const emailCheck = await checkEmailAvailability(email);
        if (emailCheck.code === 503) {
            showFieldError('email', 'Email is already registered');
            return;
        }

        // Step 3: Submit registration
        const registerResult = await registerUser({
            username: username,
            email: email,
            passwordHash: password
        });

        if (registerResult.code === 200) {
            setTimeout(() => {
                window.location.href = '/Login.html?registered=true';
            }, 500); // Delay redirect by 2 seconds
        } else {
            showError('Registration failed, please try again later');
        }

    } catch (error) {
        console.error('Registration process error:', error);
        showError('Service is temporarily unavailable, please try again later');
    }
});

// Check username availability
async function checkUsernameAvailability(username) {
    const response = await fetch(`/user/checkUserNameUsed/${encodeURIComponent(username)}`);
    return response.json();
}

// Check email availability
async function checkEmailAvailability(email) {
    const response = await fetch(`/user/checkUserEmailUsed/${encodeURIComponent(email)}`);
    return response.json();
}

// Submit registration
async function registerUser(userData) {
    const response = await fetch('/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    return response.json();
}

// Show success message
function showSuccess(message) {
    const successElement = document.getElementById('successMessage');
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
    }
}

// Show field-level error
function showFieldError(field, message) {
    const fieldElement = document.getElementById(field);
    const errorElement = document.getElementById(`${field}Error`);

    fieldElement.parentElement.classList.add('has-error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Show global error
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.querySelector('.application').after(errorElement);
}

// Clear all error messages
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
        el.textContent = '';
    });
    const successElement = document.getElementById('successMessage');
    if (successElement) {
        successElement.style.display = 'none';
        successElement.textContent = '';
    }
    document.querySelectorAll('.input-box').forEach(el => {
        el.classList.remove('has-error');
    });
}

document.querySelector('.cancel').addEventListener('click', () => {
    window.location.href = '/Login.html';
});
