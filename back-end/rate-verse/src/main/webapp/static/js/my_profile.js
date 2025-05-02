document.addEventListener('DOMContentLoaded', () => {
    const editIcon = document.querySelector('.edit-icon');
    const renameModal = document.getElementById('renameModal');
    const closeBtn = renameModal.querySelector('.close-btn');
    const cancelBtn = renameModal.querySelector('.cancel-btn');
    const renameForm = renameModal.querySelector('.rename-form');
    const nameInput = document.getElementById('newName');
    const avatarWrapper = document.querySelector('.avatar-wrapper');
    const avatarInput = document.getElementById('avatarInput');
    const profileForm = document.querySelector('.profile-form');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const saveNotification = document.querySelector('.save-notification');

    // Create error message element for rename modal
    const errorMessage = document.createElement('p');
    errorMessage.style.color = '#FF3B3B';
    errorMessage.style.fontSize = '0.8rem';
    errorMessage.style.marginTop = '0.5rem';
    errorMessage.style.display = 'none';
    nameInput.parentElement.appendChild(errorMessage);

    // Create error message elements for profile form
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

    // Open rename modal when edit icon is clicked
    editIcon.addEventListener('click', () => {
        renameModal.style.display = 'flex';
        setTimeout(() => {
            renameModal.querySelector('.modal-content').classList.add('show');
        }, 10);
        errorMessage.style.display = 'none'; // Reset error on open
    });

    // Close rename modal
    const closeRenameModal = () => {
        renameModal.querySelector('.modal-content').classList.remove('show');
        setTimeout(() => {
            renameModal.style.display = 'none';
        }, 300);
        errorMessage.style.display = 'none'; // Reset error on close
    };

    closeBtn.addEventListener('click', closeRenameModal);
    cancelBtn.addEventListener('click', closeRenameModal);

    // Validate name input (min 3 characters, max 20 characters)
    const validateName = (name) => {
        if (name.trim().length < 3) {
            return { valid: false, message: 'Name must be at least 3 characters long.' };
        }
        if (name.length > 15) {
            return { valid: false, message: 'Name must not exceed 15 characters.' };
        }
        return { valid: true, message: '' };
    };

    // Validate phone input (only digits, hyphens, parentheses, and plus sign; max 15 digits)
    const validatePhone = (phone) => {
        // Allow digits, hyphens, parentheses, and plus sign
        const phoneRegex = /^[0-9+\s()-]+$/;
        if (!phoneRegex.test(phone)) {
            return { valid: false, message: 'Phone must contain only numbers, hyphens, parentheses, or a plus sign.' };
        }

        // Count digits (ignore hyphens, parentheses, and plus sign)
        const digits = phone.replace(/[^0-9]/g, '');
        if (digits.length > 11) {
            return { valid: false, message: 'Phone number must not exceed 11 digits.' };
        }

        return { valid: true, message: '' };
    };

    // Validate email input (max 50 characters)
    const validateEmail = (email) => {
        if (email.length > 35) {
            return { valid: false, message: 'Email must not exceed 35 characters.' };
        }
        return { valid: true, message: '' };
    };

    // Validate address input (maximum 5 words and 50 characters)
    const validateAddress = (address) => {
        const words = address.trim().split(/\s+/);
        if (words.length > 5) {
            return { valid: false, message: 'Address must not exceed 5 words.' };
        }
        if (address.length > 35) {
            return { valid: false, message: 'Address must not exceed 35 characters.' };
        }
        return { valid: true, message: '' };
    };

    // Handle rename form submission
    renameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = nameInput.value.trim();
        const validation = validateName(newName);

        if (validation.valid) {
            document.querySelector('.profile-card h2').textContent = newName;
            closeRenameModal();
        } else {
            errorMessage.textContent = validation.message;
            errorMessage.style.display = 'block';
        }
    });

    // Handle profile form submission to update profile card info
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Reset error messages
        emailError.style.display = 'none';
        phoneError.style.display = 'none';
        addressError.style.display = 'none';

        // Get new values from the form
        const newEmail = emailInput.value.trim();
        const newPhone = phoneInput.value.trim();
        const newAddress = addressInput.value.trim();

        // Validate email, phone, and address
        const emailValidation = validateEmail(newEmail);
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

        // Update the profile card info
        document.querySelector('.info-value[data-field="email"]').textContent = newEmail;
        document.querySelector('.info-value[data-field="phone"]').textContent = newPhone;
        document.querySelector('.info-value[data-field="address"]').textContent = newAddress;

        // Show the "Changes saved!" notification
        saveNotification.style.display = 'block';
        setTimeout(() => {
            saveNotification.style.display = 'none';
        }, 2000);
    });

    // Trigger file input when avatar is clicked
    avatarWrapper.addEventListener('click', () => {
        avatarInput.click();
    });

    // Handle avatar file selection
    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.querySelector('.avatar').src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});

// Обработка отправки формы профиля (синхронизация с .user-info)
profileForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newEmail = document.getElementById('email').value;
    const newPhone = document.getElementById('phone').value;
    const newAddress = document.getElementById('address').value;

    // Обновляем отображаемые значения в .user-info
    emailValue.textContent = newEmail;
    phoneValue.textContent = newPhone;
    addressValue.textContent = newAddress;

    // Показываем уведомление
    saveNotification.style.display = 'block';
    setTimeout(() => {
        saveNotification.style.display = 'none';
    }, 2000); // Уведомление исчезает через 2 секунды
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM 加载完成，开始初始化");

    // 获取用户资料
    fetchUserProfile();
    fetchUserStats();
    //fetchUserRatings(); // 以后搞

    // 更新用户名
    const editIcon = document.querySelector('.edit-icon');
    const renameModal = document.getElementById('renameModal');
    const closeBtns = document.querySelectorAll('.close-btn');
    const renameForm = document.querySelector('.rename-form');
    const newNameInput = document.getElementById('newName');

    if (!editIcon) {
        console.error("未找到 editIcon 元素，请检查 my_profile.html 中是否有 .edit-icon 元素");
        return;
    }
    if (!renameModal) {
        console.error("未找到 renameModal 元素，请检查 my_profile.html 中是否有 #renameModal 元素");
        return;
    }
    if (!renameForm) {
        console.error("未找到 renameForm 元素，请检查 my_profile.html 中是否有 .rename-form 元素");
        return;
    }
    if (!newNameInput) {
        console.error("未找到 newNameInput 元素，请检查 my_profile.html 中是否有 #newName 元素");
        return;
    }

    editIcon.addEventListener('click', () => {
        renameModal.style.display = 'flex'; // Fixed: Changed from 'block' to 'flex'
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            renameModal.style.display = 'none';
        });
    });

    renameForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("提交用户名修改表单");
        const newUsername = newNameInput.value.trim();
        if (!newUsername) {
            console.warn("用户名为空");
            alert('用户名不能为空');
            return;
        }
        console.log("发送用户名修改请求:", newUsername);
        try {
            const response = await fetch('/user/api/update-username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `newUsername=${encodeURIComponent(newUsername)}`,
                credentials: 'include',
            });
            console.log('更新用户名 API 响应状态:', response.status);
            const result = await response.json();
            console.log('更新用户名 API 返回数据:', result);
            if (result.code === 200) {
                document.querySelector('.name-wrapper h2').textContent = newUsername;
                renameModal.style.display = 'none';
                alert('用户名更新成功');
            } else {
                console.error('更新用户名失败:', result.message);
                alert('更新用户名失败: ' + result.message);
            }
        } catch (error) {
            console.error('更新用户名出错:', error);
            alert('网络错误');
        }
    });

    // 更新头像
    const avatarWrapper = document.querySelector('.avatar-wrapper');
    const avatarInput = document.getElementById('avatarInput');

    if (!avatarWrapper) {
        console.error("未找到 avatarWrapper 元素，请检查 my_profile.html 中是否有 .avatar-wrapper 元素");
        return;
    }
    if (!avatarInput) {
        console.error("未找到 avatarInput 元素，请检查 my_profile.html 中是否有 #avatarInput 元素");
        return;
    }

    avatarWrapper.addEventListener('click', () => {
        console.log("点击头像，触发文件选择");
        avatarInput.click();
    });

    avatarInput.addEventListener('change', async () => {
        console.log("选择头像文件");
        const file = avatarInput.files[0];
        if (!file) {
            console.warn("未选择文件");
            return;
        }
        console.log("上传头像文件:", file.name);
        const formData = new FormData();
        formData.append('image', file);
        try {
            const uploadResponse = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            console.log('上传图片 API 响应状态:', uploadResponse.status);
            const uploadResult = await uploadResponse.json();
            console.log('上传图片 API 返回数据:', uploadResult);
            if (uploadResult.code === 200) {
                const avatarUrl = uploadResult.data;
                document.querySelector('.avatar').src = avatarUrl;
                console.log("发送头像更新请求:", avatarUrl);
                const updateResponse = await fetch('/user/api/update-avatar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `avatarUrl=${encodeURIComponent(avatarUrl)}`,
                    credentials: 'include',
                });
                console.log('更新头像 API 响应状态:', updateResponse.status);
                const updateResult = await updateResponse.json();
                console.log('更新头像 API 返回数据:', updateResult);
                if (updateResult.code === 200) {
                    alert('头像更新成功');
                } else {
                    console.error('更新头像失败:', updateResult.message);
                    alert('更新头像失败: ' + updateResult.message);
                }
            } else {
                console.error('上传图片失败:', uploadResult.message);
                alert('上传图片失败: ' + uploadResult.message);
            }
        } catch (error) {
            console.error('上传图片出错:', error);
            alert('网络错误');
        }
    });

    // 处理表单提交（保存更改）
    const profileForm = document.querySelector('.profile-form');
    const saveNotification = document.querySelector('.save-notification');

    if (!profileForm) {
        console.error("未找到 profileForm 元素，请检查 my_profile.html 中是否有 .profile-form 元素");
        return;
    }
    if (!saveNotification) {
        console.error("未找到 saveNotification 元素，请检查 my_profile.html 中是否有 .save-notification 元素");
        return;
    }

    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("提交用户信息修改表单");
        const email = document.querySelector('#email').value.trim();
        const phone = document.querySelector('#phone').value.trim();
        const address = document.querySelector('#address').value.trim();
        console.log("发送用户信息修改请求:", { email, phone, address });
        try {
            const response = await fetch('/user/api/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&address=${encodeURIComponent(address)}`,
                credentials: 'include',
            });
            console.log('更新用户信息 API 响应状态:', response.status);
            const result = await response.json();
            console.log('更新用户信息 API 返回数据:', result);
            if (result.code === 200) {
                document.querySelector('.info-value[data-field="email"]').textContent = email || 'N/A';
                document.querySelector('.info-value[data-field="phone"]').textContent = phone || 'N/A';
                document.querySelector('.info-value[data-field="address"]').textContent = address || 'N/A';
                saveNotification.style.display = 'block';
                setTimeout(() => {
                    saveNotification.style.display = 'none';
                }, 3000);
                alert('用户信息更新成功');
            } else {
                console.error('更新用户信息失败:', result.message);
                alert('更新用户信息失败: ' + result.message);
            }
        } catch (error) {
            console.error('更新用户信息出错:', error);
            alert('网络错误');
        }
    });
});

/* 获取用户资料 */
async function fetchUserProfile() {
    console.log("开始获取用户资料");
    try {
        const response = await fetch('/user/api/profile', {
            method: 'GET',
            credentials: 'include',
        });
        console.log('用户资料 API 响应状态:', response.status);
        if (response.status === 401) {
            console.log("未登录，跳转到 login.html");
            alert('请先登录');
            window.location.href = 'login.html';
            return;
        }
        if (!response.ok) {
            throw new Error(`HTTP 错误: ${response.status}`);
        }
        const result = await response.json();
        console.log('用户资料 API 返回数据:', result);

        if (result.code === 200) {
            const profile = result.data;
            // 更新 DOM（保持不变）
            const usernameElement = document.querySelector('.name-wrapper h2');
            const avatarElement = document.querySelector('.avatar');
            const emailElement = document.querySelector('.info-value[data-field="email"]');
            const phoneElement = document.querySelector('.info-value[data-field="phone"]');
            const addressElement = document.querySelector('.info-value[data-field="address"]');
            const emailInput = document.querySelector('#email');
            const phoneInput = document.querySelector('#phone');
            const addressInput = document.querySelector('#address');

            if (!usernameElement || !avatarElement || !emailElement || !phoneElement || !addressElement) {
                console.error("未找到必要的 DOM 元素");
                return;
            }

            usernameElement.textContent = profile.username || 'Unknown User';
            avatarElement.src = profile.avatarUrl || '/assets/Block_with_X(2).svg';
            emailElement.textContent = profile.email || 'N/A';
            phoneElement.textContent = profile.phone || 'N/A';
            addressElement.textContent = profile.address || 'N/A';
            emailInput.value = profile.email || '';
            phoneInput.value = profile.phone || '';
            addressInput.value = profile.address || '';
        } else {
            console.error('获取用户资料失败:', result.message);
            alert('无法加载用户资料: ' + result.message);
        }
    } catch (error) {
        console.error('获取用户资料出错:', error);
        alert('获取用户资料时发生网络错误');
    }
}

/* 获取并显示用户统计数据 */
async function fetchUserStats() {
    try {
        const [topicCountRes, likesCountRes, commentsCountRes, ratingsCountRes] = await Promise.all([
            fetch('/api/topic/user-topic-count', { method: 'GET', credentials: 'include' }),
            fetch('/api/topic/user-topic-likes-count', { method: 'GET', credentials: 'include' }),
            fetch('/api/topic/user-topic-comments-count', { method: 'GET', credentials: 'include' }),
            fetch('/api/topic/user-topic-ratings-count', { method: 'GET', credentials: 'include' }),
        ]);

        console.log('统计数据 API 响应状态:', {
            topicCount: topicCountRes.status,
            likesCount: likesCountRes.status,
            commentsCount: commentsCountRes.status,
            ratingsCount: ratingsCountRes.status,
        });

        const topicCount = await topicCountRes.json();
        const likesCount = await likesCountRes.json();
        const commentsCount = await commentsCountRes.json();
        const ratingsCount = await ratingsCountRes.json();

        console.log('统计数据 API 返回数据:', {
            topicCount,
            likesCount,
            commentsCount,
            ratingsCount,
        });

        const topicsElement = document.querySelector('.stat-value[for="topics"]');
        const likesElement = document.querySelector('.stat-value[for="likes"]');
        const commentsElement = document.querySelector('.stat-value[for="comments"]');
        const ratingsElement = document.querySelector('.stat-value[for="ratings"]');

        if (!topicsElement || !likesElement || !commentsElement || !ratingsElement) {
            console.error("未找到统计数据元素，请检查 my_profile.html 中是否有 .stat-value 元素");
            return;
        }

        if (topicCount.code === 200) {
            topicsElement.textContent = topicCount.data || 0;
            console.log('更新 Topics 数量:', topicsElement.textContent);
        } else {
            console.error('获取 Topics 数量失败:', topicCount.message);
            topicsElement.textContent = '0';
        }
        if (likesCount.code === 200) {
            likesElement.textContent = likesCount.data || 0;
            console.log('更新 Likes 数量:', likesElement.textContent);
        } else {
            console.error('获取 Likes 数量失败:', likesCount.message);
            likesElement.textContent = '0';
        }
        if (commentsCount.code === 200) {
            commentsElement.textContent = commentsCount.data || 0;
            console.log('更新 Comments 数量:', commentsElement.textContent);
        } else {
            console.error('获取 Comments 数量失败:', commentsCount.message);
            commentsElement.textContent = '0';
        }
        if (ratingsCount.code === 200) {
            ratingsElement.textContent = ratingsCount.data || 0;
            console.log('更新 Ratings 数量:', ratingsElement.textContent);
        } else {
            console.error('获取 Ratings 数量失败:', ratingsCount.message);
            ratingsElement.textContent = '0';
        }
    } catch (error) {
        console.error('获取统计数据出错:', error);
        alert('获取统计数据时发生网络错误');
    }
}