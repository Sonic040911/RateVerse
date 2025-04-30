// Получаем элементы для модального окна смены фото
const avatarWrapper = document.querySelector('.avatar-wrapper');
const photoModal = document.getElementById('photoModal');
const photoCloseBtn = photoModal.querySelector('.close-btn');

// Получаем элементы для модального окна переименования
const editIcon = document.querySelector('.edit-icon');
const renameModal = document.getElementById('renameModal');
const renameCloseBtn = renameModal.querySelector('.close-btn');
const renameForm = renameModal.querySelector('.rename-form');
const cancelBtn = renameModal.querySelector('.cancel-btn');

// Получаем элементы для формы профиля, отображения информации и уведомления
const profileForm = document.querySelector('.profile-form');
const emailValue = document.querySelector('.user-info .info-item:nth-child(1) .info-value');
const phoneValue = document.querySelector('.user-info .info-item:nth-child(2) .info-value');
const addressValue = document.querySelector('.user-info .info-item:nth-child(3) .info-value');
const saveNotification = document.querySelector('.save-notification');

// Открытие модального окна смены фото
avatarWrapper.addEventListener('click', () => {
    photoModal.style.display = 'flex';
    setTimeout(() => {
        photoModal.querySelector('.modal-content').classList.add('show');
    }, 10);
});

// Закрытие модального окна смены фото
photoCloseBtn.addEventListener('click', () => {
    photoModal.style.display = 'none';
});

// Открытие модального окна переименования
editIcon.addEventListener('click', () => {
    renameModal.style.display = 'flex';
    setTimeout(() => {
        renameModal.querySelector('.modal-content').classList.add('show');
    }, 10);
});

// Закрытие модального окна переименования
renameCloseBtn.addEventListener('click', () => {
    renameModal.style.display = 'none';
});

cancelBtn.addEventListener('click', () => {
    renameModal.style.display = 'none';
});

// Закрытие модальных окон при клике вне контента
window.addEventListener('click', (event) => {
    if (event.target === photoModal) {
        photoModal.style.display = 'none';
    }
    if (event.target === renameModal) {
        renameModal.style.display = 'none';
    }
});

// Обработка отправки формы переименования (демонстрация)
renameForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newName = document.getElementById('newName').value;
    document.querySelector('.profile-card h2').textContent = newName;
    document.getElementById('fullName').value = newName;
    renameModal.style.display = 'none';
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

// Инициализация графика активности
const ctx = document.getElementById('activityChart').getContext('2d');
const activityChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Ratings Created',
                data: [5, 10, 8, 15, 12, 20],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Comments Posted',
                data: [10, 15, 20, 10, 25, 30],
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                fill: true,
                tension: 0.4
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Activity Count'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Month'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top'
            }
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM 加载完成，开始初始化");

    // 获取用户资料
    fetchUserProfile();
    fetchUserStats();
    fetchUserRatings();

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
        renameModal.style.display = 'block';
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            renameModal.style.display = 'none';
        });
    });

    renameForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newUsername = newNameInput.value.trim();
        if (!newUsername) {
            alert('用户名不能为空');
            return;
        }

        try {
            const response = await fetch('/user/api/update-username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `newUsername=${encodeURIComponent(newUsername)}`,
                credentials: 'include',
            });
            const result = await response.json();
            if (result.code === 200) {
                document.querySelector('.name-wrapper h2').textContent = newUsername;
                renameModal.style.display = 'none';
            } else {
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
        avatarInput.click();
    });

    avatarInput.addEventListener('change', async () => {
        const file = avatarInput.files[0];
        if (!file) return;

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
                document.querySelector('.avatar').src = avatarUrl;

                const updateResponse = await fetch('/user/api/update-avatar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `avatarUrl=${encodeURIComponent(avatarUrl)}`,
                    credentials: 'include',
                });
                const updateResult = await updateResponse.json();
                if (updateResult.code !== 200) {
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

        const email = document.querySelector('#email').value.trim();
        const phone = document.querySelector('#phone').value.trim();
        const address = document.querySelector('#address').value.trim();

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
                // 更新左侧显示
                document.querySelector('.info-value[data-field="email"]').textContent = email || 'N/A';
                document.querySelector('.info-value[data-field="phone"]').textContent = phone || 'N/A';
                document.querySelector('.info-value[data-field="address"]').textContent = address || 'N/A';
                // 显示保存成功通知
                saveNotification.style.display = 'block';
                setTimeout(() => {
                    saveNotification.style.display = 'none';
                }, 3000);
            } else {
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
    try {
        const response = await fetch('/user/api/profile', {
            method: 'GET',
            credentials: 'include',
        });
        console.log('用户资料 API 响应状态:', response.status);
        if (response.status === 401) {
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
            // 左侧用户信息
            const usernameElement = document.querySelector('.name-wrapper h2');
            const avatarElement = document.querySelector('.avatar');
            const emailElement = document.querySelector('.info-value[data-field="email"]');
            const phoneElement = document.querySelector('.info-value[data-field="phone"]');
            const addressElement = document.querySelector('.info-value[data-field="address"]');
            // 右侧表单
            const emailInput = document.querySelector('#email');
            const phoneInput = document.querySelector('#phone');
            const addressInput = document.querySelector('#address');

            if (!usernameElement || !avatarElement) {
                console.error("未找到 usernameElement 或 avatarElement，请检查 my_profile.html 中是否有 .name-wrapper h2 和 .avatar 元素");
                return;
            }
            if (!emailElement || !phoneElement || !addressElement) {
                console.error("未找到 emailElement, phoneElement 或 addressElement，请检查 my_profile.html 中是否有对应的 .info-value 元素");
                return;
            }
            if (!emailInput || !phoneInput || !addressInput) {
                console.error("未找到 emailInput, phoneInput 或 addressInput，请检查 my_profile.html 中是否有对应的 input 元素");
                return;
            }

            // 更新左侧用户信息
            usernameElement.textContent = profile.username || 'Unknown User';
            avatarElement.src = profile.avatarUrl || '/assets/Block_with_X(2).svg';
            emailElement.textContent = profile.email || 'N/A';
            phoneElement.textContent = profile.phone || 'N/A';
            addressElement.textContent = profile.address || 'N/A';

            // 更新右侧表单
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

