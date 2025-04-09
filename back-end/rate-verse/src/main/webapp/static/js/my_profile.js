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