document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM 加载完成，开始初始化");

    // 获取 DOM 元素
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

    // 检查必要元素是否存在
    if (!editIcon || !renameModal || !renameForm || !nameInput) {
        console.error("未找到用户名编辑相关元素，请检查 my_profile.html");
        return;
    }
    if (!avatarWrapper || !avatarInput) {
        console.error("未找到头像上传相关元素，请检查 my_profile.html");
        return;
    }
    if (!profileForm || !saveNotification) {
        console.error("未找到资料表单或通知元素，请检查 my_profile.html");
        return;
    }
    if (!ratingsList) {
        console.warn("未找到 ratings-list 元素，用户评分列表将不可用");
    }

    // 创建错误消息元素
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
    addressError.style.display = ' none';
    addressInput.parentElement.appendChild(addressError);

    // 初始化数据
    fetchUserProfile();
    fetchUserStats();
    fetchUserRatings();

    // 验证函数
    const validateName = (name) => {
        name = name.trim();
        if (name.length < 3) {
            return { valid: false, message: '用户名至少需要3个字符' };
        }
        if (name.length > 15) {
            return { valid: false, message: '用户名不能超过15个字符' };
        }
        return { valid: true, message: '' };
    };

    const validateEmail = (email) => {
        if (email.length > 35) {
            return { valid: false, message: '邮箱不能超过35个字符' };
        }
        return { valid: true, message: '' };
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9+\s()-]+$/;
        if (!phoneRegex.test(phone)) {
            return { valid: false, message: '电话号码只能包含数字、连字符、括号或加号' };
        }
        const digits = phone.replace(/[^0-9]/g, '');
        if (digits.length > 11) {
            return { valid: false, message: '电话号码不能超过11位数字' };
        }
        return { valid: true, message: '' };
    };

    const validateAddress = (address) => {
        const words = address.trim().split(/\s+/);
        if (words.length > 5) {
            return { valid: false, message: '地址不能超过5个单词' };
        }
        if (address.length > 35) {
            return { valid: false, message: '地址不能超过35个字符' };
        }
        return { valid: true, message: '' };
    };

    // 打开重命名模态框
    editIcon.addEventListener('click', () => {
        renameModal.style.display = 'flex';
        setTimeout(() => {
            renameModal.querySelector('.modal-content').classList.add('show');
        }, 10);
        errorMessage.style.display = 'none';
    });

    // 关闭重命名模态框
    const closeRenameModal = () => {
        renameModal.querySelector('.modal-content').classList.remove('show');
        setTimeout(() => {
            renameModal.style.display = 'none';
        }, 300);
        errorMessage.style.display = 'none';
    };

    closeBtn?.addEventListener('click', closeRenameModal);
    cancelBtn?.addEventListener('click', closeRenameModal);

    // 处理用户名表单提交
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
                closeRenameModal();
                alert('用户名更新成功');
            } else {
                errorMessage.textContent = result.message || '更新用户名失败';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('更新用户名出错:', error);
            errorMessage.textContent = '网络错误';
            errorMessage.style.display = 'block';
        }
    });

    // 处理头像上传
    avatarWrapper.addEventListener('click', () => {
        console.log("点击头像，触发文件选择");
        avatarInput.click();
    });

    avatarInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) {
            console.warn("未选择文件");
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
                    alert('头像更新成功');
                } else {
                    alert('更新头像失败: ' + updateResult.message);
                }
            } else {
                alert('上传图片失败: ' + uploadResult.message);
            }
        } catch (error) {
            console.error('上传图片出错:', error);
            alert('网络错误');
        }
    });

    // 处理资料表单提交
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        emailError.style.display = 'none';
        phoneError.style.display = 'none';
        addressError.style.display = 'none';

        const newEmail = emailInput.value.trim();
        const newPhone = phoneInput.value.trim();
        const newAddress = addressInput.value.trim();

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
                alert('用户信息更新成功');
            } else {
                alert('更新用户信息失败: ' + result.message);
            }
        } catch (error) {
            console.error('更新用户信息出错:', error);
            alert('网络错误');
        }
    });
});

// 获取用户资料
async function fetchUserProfile() {
    console.log("开始获取用户资料");
    try {
        const response = await fetch('/user/api/profile', {
            method: 'GET',
            credentials: 'include',
        });
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

// 获取并显示用户统计数据
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
            console.error("未找到统计数据元素，请检查 my_profile.html");
            return;
        }

        topicsElement.textContent = topicCount.code === 200 ? topicCount.data || 0 : '0';
        likesElement.textContent = likesCount.code === 200 ? likesCount.data || 0 : '0';
        commentsElement.textContent = commentsCount.code === 200 ? commentsCount.data || 0 : '0';
        ratingsElement.textContent = ratingsCount.code === 200 ? ratingsCount.data || 0 : '0';
    } catch (error) {
        console.error('获取统计数据出错:', error);
        alert('获取统计数据时发生网络错误');
    }
}

// 截断字符串函数
function truncateText(text, maxLength) {
    if (text && text.length > maxLength) {
        return text.substring(0, maxLength - 3) + '...';
    }
    return text || '';
}

// 获取并显示用户评分数据
async function fetchUserRatings() {
    console.log("开始获取用户评分数据");
    try {
        const response = await fetch('/api/topic/user-ratings?limit=3', {
            method: 'GET',
            credentials: 'include',
        });
        if (response.status === 401) {
            console.log("未登录，跳转到 login.html");
            alert('请先登录');
            window.location.href = 'login.html';
            return;
        }
        if (!response.ok) {
            const errorData = await response.json();
            console.error('服务器错误响应:', errorData);
            throw new Error(`HTTP 错误: ${response.status} - ${errorData.message || '未知错误'}`);
        }
        const result = await response.json();
        if (result.code === 200) {
            const ratings = Array.isArray(result.data) ? result.data : [];
            const ratingsList = document.querySelector('.ratings-list');
            if (!ratingsList) {
                console.error("未找到 ratings-list 元素");
                return;
            }
            ratingsList.innerHTML = '';
            ratings.slice(0, 3).forEach(rating => {
                const ratingItem = document.createElement('div');
                ratingItem.className = 'rating-item';
                ratingItem.dataset.topicId = rating.id;
                ratingItem.innerHTML = `
                    <img src="${rating.topItem?.imageUrl || '/static/assets/user-solid.svg'}" alt="${rating.title}" class="rating-image">
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
                    console.log(`点击Topic ${rating.id}，跳转到Rating_board.html`);
                    window.location.href = `Rating_board.html?topicId=${rating.id}`;
                });
                ratingsList.appendChild(ratingItem);
            });
        } else {
            console.error('获取用户评分失败:', result.message);
            alert('无法加载用户评分: ' + result.message);
        }
    } catch (error) {
        console.error('获取用户评分出错:', error);
        alert('获取用户评分时发生网络错误');
    }
}