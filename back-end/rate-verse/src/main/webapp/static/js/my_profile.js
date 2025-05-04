document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, starting initialization");

    // Get DOM elements
    const editIcon = document.querySelector('.edit-icon');
    const renameModal = document.getElementById('renameModal');
    const closeBtn = renameModal?.querySelector('.close-btn');
    const cancelBtn = renameModal?.querySelector('.cancel-btn');
    const renameForm = renameModal?.querySelector('.rename-form');
    const nameInput = document.getElementById('newName');
    const avatarWrapper = document.querySelector('.avatar-wrapper');
    const avatarInput = document.getElementById('avatarInput');
    const profileForm = document.querySelector('.profile-form');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const saveNotification = document.querySelector('.save-notification');
    const ratingsList = document.querySelector('.ratings-list');
    const googleEmailMessage = document.getElementById('googleEmailMessage');

    // Check for required elements
    if (!editIcon || !renameModal || !renameForm || !nameInput) {
        console.error("Username edit elements not found, please check my_profile.html");
        return;
    }
    if (!avatarWrapper || !avatarInput) {
        console.error("Avatar upload elements not found, please check my_profile.html");
        return;
    }
    if (!profileForm || !saveNotification || !googleEmailMessage) {
        console.error("Profile form, notification, or Google message elements not found, please check my_profile.html");
        return;
    }
    if (!ratingsList) {
        console.warn("Ratings list element not found, user ratings will be unavailable");
    }

    // Create error message elements
    const errorMessage = document.createElement('p');
    errorMessage.style.color = '#FF3B3B';
    errorMessage.style.fontSize = '0.8rem';
    errorMessage.style.marginTop = '0.5rem';
    errorMessage.style.display = 'none';
    nameInput.parentElement.appendChild(errorMessage);

    const emailError = document.createElement('p');
    emailError.style.color = '#FF3B3B';
    emailError.style.fontSize = '0.8rem';
    emailError.style.marginTop = '0.5rem';
    emailError.style.display = 'none';
    emailInput.parentElement.appendChild(emailError);

    const phoneError = document.createElement('p');
    phoneError.style.color = '#FF3B3B';
    phoneError.style.fontSize = '0.8rem';
    phoneError.style.marginTop = '0.5rem';
    phoneError.style.display = 'none';
    phoneInput.parentElement.appendChild(phoneError);

    const addressError = document.createElement('p');
    addressError.style.color = '#FF3B3B';
    addressError.style.fontSize = '0.8rem';
    addressError.style.marginTop = '0.5rem';
    addressError.style.display = 'none';
    addressInput.parentElement.appendChild(addressError);

    // Initialize data
    fetchUserProfile();
    fetchUserStats();
    fetchUserRatings();

    // Validation functions
    const validateName = (name) => {
        name = name.trim();
        if (name.length < 3) {
            return { valid: false, message: 'Username must be at least 3 characters' };
        }
        if (name.length > 15) {
            return { valid: false, message: 'Username cannot exceed 15 characters' };
        }
        return { valid: true, message: '' };
    };

    const validateEmail = (email) => {
        if (email.length > 35) {
            return { valid: false, message: 'Email cannot exceed 35 characters' };
        }
        return { valid: true, message: '' };
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9+\s()-]+$/;
        if (!phoneRegex.test(phone)) {
            return { valid: false, message: 'Phone number can only contain digits, hyphens, parentheses, or plus sign' };
        }
        const digits = phone.replace(/[^0-9]/g, '');
        if (digits.length > 11) {
            return { valid: false, message: 'Phone number cannot exceed 11 digits' };
        }
        return { valid: true, message: '' };
    };

    const validateAddress = (address) => {
        const words = address.trim().split(/\s+/);
        if (words.length > 5) {
            return { valid: false, message: 'Address cannot exceed 5 words' };
        }
        if (address.length > 35) {
            return { valid: false, message: 'Address cannot exceed 35 characters' };
        }
        return { valid: true, message: '' };
    };

    // Open rename modal
    editIcon.addEventListener('click', () => {
        const currentUsername = document.querySelector('.name-wrapper h2').textContent;
        nameInput.value = currentUsername || 'Unknown User';
        renameModal.style.display = 'flex';
        setTimeout(() => {
            renameModal.querySelector('.modal-content').classList.add('show');
        }, 10);
        errorMessage.style.display = 'none';
    });

    // Close rename modal
    const closeRenameModal = () => {
        renameModal.querySelector('.modal-content').classList.remove('show');
        setTimeout(() => {
            renameModal.style.display = 'none';
        }, 300);
        errorMessage.style.display = 'none';
    };

    closeBtn?.addEventListener('click', closeRenameModal);
    cancelBtn?.addEventListener('click', closeRenameModal);

    // Handle username form submission
    renameForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = nameInput.value.trim();
        const validation = validateName(newName);

        if (!validation.valid) {
            errorMessage.textContent = validation.message;
            errorMessage.style.display = 'block';
            return;
        }

        try {
            const response = await fetch('/user/api/update-username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `newUsername=${encodeURIComponent(newName)}`,
                credentials: 'include',
            });
            const result = await response.json();
            if (result.code === 200) {
                document.querySelector('.name-wrapper h2').textContent = newName;
                nameInput.value = newName;
                closeRenameModal();
                alert('Username updated successfully');
            } else if (result.code === 502) {
                errorMessage.textContent = 'Username already exists';
                errorMessage.style.display = 'block';
            } else {
                errorMessage.textContent = result.message || 'Failed to update username';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error updating username:', error);
            errorMessage.textContent = 'Network error';
            errorMessage.style.display = 'block';
        }
    });

    // Handle avatar upload
    avatarWrapper.addEventListener('click', () => {
        console.log("Avatar clicked, triggering file selection");
        avatarInput.click();
    });

    avatarInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) {
            console.warn("No file selected");
            return;
        }
        const formData = new FormData();
        formData.append('image', file);
        try {
            const uploadResponse = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            const uploadResult = await uploadResponse.json();
            if (uploadResult.code === 200) {
                const avatarUrl = uploadResult.data;
                const updateResponse = await fetch('/user/api/update-avatar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `avatarUrl=${encodeURIComponent(avatarUrl)}`,
                    credentials: 'include',
                });
                const updateResult = await updateResponse.json();
                if (updateResult.code === 200) {
                    document.querySelector('.avatar').src = avatarUrl;
                    alert('Avatar updated successfully');
                } else {
                    alert('Failed to update avatar: ' + updateResult.message);
                }
            } else {
                alert('Failed to upload image: ' + uploadResult.message);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Network error');
        }
    });

    // Handle profile form submission
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        emailError.style.display = 'none';
        phoneError.style.display = 'none';
        addressError.style.display = 'none';

        const newEmail = emailInput.value.trim();
        const newPhone = phoneInput.value.trim();
        const newAddress = addressInput.value.trim();

        // Skip email validation for Google users (since input is disabled)
        const emailValidation = emailInput.disabled ? { valid: true, message: '' } : validateEmail(newEmail);
        const phoneValidation = validatePhone(newPhone);
        const addressValidation = validateAddress(newAddress);

        if (!emailValidation.valid) {
            emailError.textContent = emailValidation.message;
            emailError.style.display = 'block';
            return;
        }
        if (!phoneValidation.valid) {
            phoneError.textContent = phoneValidation.message;
            phoneError.style.display = 'block';
            return;
        }
        if (!addressValidation.valid) {
            addressError.textContent = addressValidation.message;
            addressError.style.display = 'block';
            return;
        }

        try {
            const response = await fetch('/user/api/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `email=${encodeURIComponent(newEmail)}&phone=${encodeURIComponent(newPhone)}&address=${encodeURIComponent(newAddress)}`,
                credentials: 'include',
            });
            const result = await response.json();
            if (result.code === 200) {
                document.querySelector('.info-value[data-field="email"]').textContent = newEmail || 'N/A';
                document.querySelector('.info-value[data-field="phone"]').textContent = newPhone || 'N/A';
                document.querySelector('.info-value[data-field="address"]').textContent = newAddress || 'N/A';
                saveNotification.style.display = 'block';
                setTimeout(() => {
                    saveNotification.style.display = 'none';
                }, 2000);
                alert('Profile updated successfully');
            } else if (result.code === 503) {
                emailError.textContent = 'Email already exists';
                emailError.style.display = 'block';
            } else if (result.code === 1007) {
                emailError.textContent = 'Google 登录用户的邮箱不可更改';
                emailError.style.display = 'block';
            } else {
                emailError.textContent = result.message || 'Failed to update profile';
                emailError.style.display = 'block';
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            emailError.textContent = 'Network error';
            emailError.style.display = 'block';
        }
    });

    // Fetch user profile
    async function fetchUserProfile() {
        console.log("Fetching user profile");
        try {
            const response = await fetch('/user/api/profile', {
                method: 'GET',
                credentials: 'include',
            });
            if (response.status === 401) {
                console.log("Not logged in, redirecting to login.html");
                alert('Please log in');
                window.location.href = 'login.html';
                return;
            }
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const result = await response.json();
            if (result.code === 200) {
                const profile = result.data;
                const usernameElement = document.querySelector('.name-wrapper h2');
                const avatarElement = document.querySelector('.avatar');
                const emailElement = document.querySelector('.info-value[data-field="email"]');
                const phoneElement = document.querySelector('.info-value[data-field="phone"]');
                const addressElement = document.querySelector('.info-value[data-field="address"]');
                const emailInput = document.querySelector('#email');
                const phoneInput = document.querySelector('#phone');
                const addressInput = document.querySelector('#address');
                const nameInput = document.getElementById('newName');

                if (!usernameElement || !avatarElement || !emailElement || !phoneElement || !addressElement || !nameInput) {
                    console.error("Required DOM elements not found");
                    return;
                }

                usernameElement.textContent = profile.username || 'Unknown User';
                nameInput.value = profile.username || 'Unknown User';
                avatarElement.src = profile.avatarUrl || 'static/assets/User_img.png';
                emailElement.textContent = profile.email || 'N/A';
                phoneElement.textContent = profile.phone || 'N/A';
                addressElement.textContent = profile.address || 'N/A';
                emailInput.value = profile.email || '';
                phoneInput.value = profile.phone || '';
                addressInput.value = profile.address || '';

                // 禁用 Google 用户的邮箱输入框
                if (profile.isGoogleUser) {
                    emailInput.disabled = true;
                    googleEmailMessage.style.display = 'block';
                } else {
                    emailInput.disabled = false;
                    googleEmailMessage.style.display = 'none';
                }
            } else {
                console.error('Failed to fetch user profile:', result.message);
                alert('Unable to load user profile: ' + result.message);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            alert('Network error while fetching user profile');
        }
    }

    // Fetch and display user stats
    async function fetchUserStats() {
        try {
            const [topicCountRes, likesCountRes, commentsCountRes, ratingsCountRes] = await Promise.all([
                fetch('/api/topic/user-topic-count', { method: 'GET', credentials: 'include' }),
                fetch('/api/topic/user-topic-likes-count', { method: 'GET', credentials: 'include' }),
                fetch('/api/topic/user-topic-comments-count', { method: 'GET', credentials: 'include' }),
                fetch('/api/topic/user-topic-ratings-count', { method: 'GET', credentials: 'include' }),
            ]);

            const topicCount = await topicCountRes.json();
            const likesCount = await likesCountRes.json();
            const commentsCount = await commentsCountRes.json();
            const ratingsCount = await ratingsCountRes.json();

            const topicsElement = document.querySelector('.stat-value[for="topics"]');
            const likesElement = document.querySelector('.stat-value[for="likes"]');
            const commentsElement = document.querySelector('.stat-value[for="comments"]');
            const ratingsElement = document.querySelector('.stat-value[for="ratings"]');

            if (!topicsElement || !likesElement || !commentsElement || !ratingsElement) {
                console.error("Stats elements not found, please check my_profile.html");
                return;
            }

            topicsElement.textContent = topicCount.code === 200 ? topicCount.data || 0 : '0';
            likesElement.textContent = likesCount.code === 200 ? likesCount.data || 0 : '0';
            commentsElement.textContent = commentsCount.code === 200 ? commentsCount.data || 0 : '0';
            ratingsElement.textContent = ratingsCount.code === 200 ? ratingsCount.data || 0 : '0';
        } catch (error) {
            console.error('Error fetching stats:', error);
            alert('Network error while fetching stats');
        }
    }

    // Truncate text function
    function truncateText(text, maxLength) {
        if (text && text.length > maxLength) {
            return text.substring(0, maxLength - 3) + '...';
        }
        return text || '';
    }

    // Fetch and display user ratings
    async function fetchUserRatings() {
        console.log("Fetching all user ratings");
        try {
            const response = await fetch('/api/topic/user-ratings', {
                method: 'GET',
                credentials: 'include',
            });
            console.log('User ratings API response status:', response.status);
            if (response.status === 401) {
                console.log("Not logged in, redirecting to login.html");
                alert('Please log in');
                window.location.href = 'login.html';
                return;
            }
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error response:', errorData);
                throw new Error(`HTTP error: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }
            const result = await response.json();
            console.log('User ratings API response data:', result);
            if (result.code === 200) {
                const ratings = Array.isArray(result.data) ? result.data : [];
                const ratingsList = document.querySelector('.ratings-list');
                if (!ratingsList) {
                    console.error("Ratings list element not found");
                    return;
                }
                ratingsList.innerHTML = '';
                ratings.forEach(rating => {
                    const ratingItem = document.createElement('div');
                    ratingItem.className = 'rating-item';
                    ratingItem.dataset.topicId = rating.id;
                    ratingItem.innerHTML = `
                        <img src="${rating.topItem?.imageUrl || 'static/assets/NoImageFound.jpg.png'}" alt="${rating.title}" class="rating-image">
                        <div class="rating-info">
                            <h4>${truncateText(rating.title, 30)}</h4>
                            <p>${truncateText(rating.description, 100)}</p>
                            <div class="rating-stats">
                                <span><i class="fas fa-heart"></i> ${rating.topItem?.totalRatings || 0} Likes</span>
                                <span><i class="fas fa-comment"></i> ${rating.topItem?.totalComments || 0} Comments</span>
                            </div>
                        </div>
                    `;
                    ratingItem.addEventListener('click', () => {
                        console.log(`Clicked Topic ${rating.id}, redirecting to Rating_board.html`);
                        window.location.href = `Rating_board.html?topicId=${rating.id}`;
                    });
                    ratingsList.appendChild(ratingItem);
                });
            } else {
                console.error('Failed to fetch user ratings:', result.message);
                alert('Unable to load user ratings: ' + result.message);
            }
        } catch (error) {
            console.error('Error fetching user ratings:', error);
            alert('Network error while fetching user ratings');
        }
    }
});