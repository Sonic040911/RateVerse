console.log('Rating_board.js loaded');

// Base context path (root context)
const contextPath = ''; // Change to '/rateverse' if needed

// Get topicId from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const topicId = urlParams.get('topicId');
console.log('Topic ID:', topicId);

if (!topicId) {
    console.error('Topic ID not found in URL');
    alert('Topic ID not found');
    window.location.href = `${contextPath}/index.html`;
}

// Pagination configuration
let currentPage = 1;
const pageSize = 10;
let sortType = 'popular';

// Fetch and display Topic information
async function fetchTopic() {
    try {
        console.log(`Fetching topic: ${contextPath}/api/topic/${topicId}`);
        const response = await fetch(`${contextPath}/api/topic/${topicId}`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            if (response.status === 401) {
                console.log('Received 401 Unauthorized');
                const result = await response.json();
                alert(result.message || 'Please login first');
                window.location.href = `${contextPath}/Login.html`;
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Topic API response:', result);
        if (result.code === 200) {
            const topic = result.data;
            const nameCategory = document.querySelector('.name-category');
            const descriptionCategory = document.querySelector('.description-category');
            const userCreate = document.querySelector('.user-create');
            if (!nameCategory || !descriptionCategory || !userCreate) {
                console.error('Topic DOM elements not found:', {
                    nameCategory: !!nameCategory,
                    descriptionCategory: !!descriptionCategory,
                    userCreate: !!userCreate
                });
                return;
            }
            nameCategory.textContent = topic.title || 'Untitled Topic';
            descriptionCategory.textContent = topic.description || 'No description';
            userCreate.innerHTML = `
                <img class="user-img" src="${topic.user?.avatarUrl || `${contextPath}/static/assets/User.svg`}" alt="User Avatar">${topic.user?.username || 'Unknown User'}
            `;
        } else {
            console.error('Failed to fetch Topic:', result.message);
            alert('Failed to load Topic');
        }
    } catch (error) {
        console.error('Fetch topic failed:', error);
        alert('Network error while fetching topic');
    }
}

// Fetch and display paginated Item data with sorting
async function fetchItems() {
    try {
        console.log(`Fetching items: ${contextPath}/api/item/getItemsByTopicId/${topicId}/${pageSize}/${currentPage}?sortType=${sortType}`);
        const response = await fetch(`${contextPath}/api/item/getItemsByTopicId/${topicId}/${pageSize}/${currentPage}?sortType=${sortType}`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            if (response.status === 401) {
                console.log('Received 401 Unauthorized');
                const result = await response.json();
                alert(result.message || 'Please login first');
                window.location.href = `${contextPath}/Login.html`;
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Items API response:', result);
        if (result.code === 200) {
            const items = result.data.data;
            const ratingsSection = document.querySelector('.ratings');
            const imgCategory = document.querySelector('.img-category');
            if (!ratingsSection || !imgCategory) {
                console.error('Required DOM elements not found:', {
                    ratingsSection: !!ratingsSection,
                    imgCategory: !!imgCategory
                });
                return;
            }

            // Initialize ratingsSection on first page
            if (currentPage === 1) {
                ratingsSection.innerHTML = `<div class="more-ratings"><button class="show-more"><img class="show-img" src="${contextPath}/static/assets/Vector.svg" alt="Vector img">Show More</button></div>`;
            }

            if (items.length === 0) {
                if (currentPage === 1) {
                    ratingsSection.innerHTML = '<p class="no-items">No items available for this topic.</p>';
                }
                imgCategory.src = `${contextPath}/static/assets/NoImageFound.jpg.png`;
                return;
            }

            // 找到最火的 Item（totalRatings 最大）
            let selectedItem = items.reduce((max, item) =>
                (item.totalRatings || 0) > (max.totalRatings || 0) ? item : max, items[0]);

            // 如果所有 Item 的 totalRatings 都为 0，则选择第一个 Item
            const allRatingsZero = items.every(item => (item.totalRatings || 0) === 0);
            if (allRatingsZero) {
                selectedItem = items[0];
            }

            // 更新 Topic 图片为选中 Item 的图片（仅在第一页）
            if (currentPage === 1) {
                imgCategory.src = selectedItem.imageUrl || `${contextPath}/static/assets/NoImageFound.jpg.png`;
                console.log(`Updated Topic image to: ${imgCategory.src}`);
            }

            // 渲染 Item 卡片
            renderItems(items);

            // 更新 Show More 按钮
            const showMoreButton = document.querySelector('.show-more');
            const moreRatings = document.querySelector('.more-ratings');
            if (showMoreButton && moreRatings) {
                showMoreButton.style.display = items.length === pageSize ? 'block' : 'none';
                console.log(`Show More button visibility: ${showMoreButton.style.display}`);
                // 确保 more-ratings 在末尾
                ratingsSection.appendChild(moreRatings);
                showMoreButton.addEventListener('click', () => {
                    console.log('Show More clicked');
                    currentPage++;
                    fetchItems();
                }, { once: true });
            }
        } else {
            console.error('Failed to fetch Items:', result.message);
            alert('Failed to load Items');
        }
    } catch (error) {
        console.error('Fetch items failed:', error);
        alert('Network error while fetching items');
    }
}

// Render Item cards
function renderItems(items) {
    console.log(`Rendering items: count=${items.length}`);
    const ratingsSection = document.querySelector('.ratings');
    const moreRatings = document.querySelector('.more-ratings') || document.createElement('div');
    if (!ratingsSection) {
        console.error('Ratings section not found during render');
        return;
    }
    items.forEach(item => {
        console.log(`Rendering item: ${item.name}, rating: ${item.averageRating}`);
        const ratingCard = document.createElement('div');
        ratingCard.className = 'rating-card';
        ratingCard.setAttribute('data-item-id', item.id);
        const fullStars = Math.floor(item.averageRating || 0);
        const hasHalfStar = (item.averageRating % 1) >= 0.5;
        let starHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                starHtml += '<span class="star light">★</span>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                starHtml += '<span class="star half">★</span>';
            } else {
                starHtml += '<span class="star">★</span>';
            }
        }
        ratingCard.innerHTML = `
            <div class="rating-info">
                <img class="img-rating" src="${item.imageUrl || `${contextPath}/static/assets/NoImageFound.jpg.png`}" alt="Rating Item Image">
                <div class="name-desc">
                    <h3 class="name-rating">${item.name || 'Unnamed Item'}</h3>
                    <p class="description-rating">${item.description || 'No description'}</p>
                </div>
            </div>
            <div class="game-info">
                <div class="star-rating">${starHtml}</div>
                <div class="score">${item.averageRating ? (item.averageRating * 2).toFixed(1) : '0.0'}</div>
                <p class="number-rating">${item.totalRatings || 0} ratings</p>
            </div>
        `;
        ratingCard.addEventListener('click', () => {
            window.location.href = `${contextPath}/Feedback.html?itemId=${item.id}`;
        });
        ratingsSection.insertBefore(ratingCard, moreRatings);
    });
}

// Add filter button event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Rating_board');
    const filterButtons = document.querySelectorAll('.type-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const buttonText = button.textContent.toLowerCase().replace(' ', '_');
            sortType = buttonText;
            currentPage = 1;
            fetchItems();
        });
    });
    const upToDateButton = document.querySelector('.type-button:nth-child(2)');
    if (upToDateButton) {
        upToDateButton.classList.add('active');
    }
    fetchTopic();
    fetchItems();
});