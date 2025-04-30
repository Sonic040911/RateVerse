console.log('Rating_board.js loaded'); // 调试：确认脚本加载

// Get topicId from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const topicId = urlParams.get('topicId');
console.log('Topic ID:', topicId); // 调试：记录 topicId

if (!topicId) {
    console.error('Topic ID not found in URL');
    alert('Topic ID not found');
    window.location.href = 'Rating.html'; // 重定向到主页
}

// Pagination configuration
let currentPage = 1;
const pageSize = 4;
let sortType = 'popular'; // 默认排序方式为 popular

// Fetch and display Topic information
async function fetchTopic() {
    try {
        console.log(`Fetching topic: /api/topic/${topicId}`); // 调试：记录请求
        const response = await fetch(`/api/topic/${topicId}`, {
            method: 'GET',
            credentials: 'include'
        });
        const result = await response.json();
        console.log('Topic API response:', result); // 调试：记录响应
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
                <img class="user-img" src="static/assets/User.svg" alt="User Avatar">${topic.user?.username || 'Unknown User'}
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
        console.log(`Fetching items: /api/item/getItemsByTopicId/${topicId}/${pageSize}/${currentPage}?sortType=${sortType}`); // 调试：记录请求
        const response = await fetch(`/api/item/getItemsByTopicId/${topicId}/${pageSize}/${currentPage}?sortType=${sortType}`, {
            method: 'GET',
            credentials: 'include'
        });
        const result = await response.json();
        console.log('Items API response:', result); // 调试：记录响应
        if (result.code === 200) {
            const items = result.data.data;
            const ratingsSection = document.querySelector('.ratings');
            if (!ratingsSection) {
                console.error('Ratings section not found');
                return;
            }
            // 清空现有卡片（避免重复）
            ratingsSection.innerHTML = '<div class="more-ratings"><button class="show-more"><img class="show-img" src="static/assets/Vector.svg" alt="Vector img">Show More</button></div>';
            renderItems(items);
            const showMoreButton = document.querySelector('.show-more');
            if (showMoreButton) {
                showMoreButton.style.display = items.length === pageSize ? 'block' : 'none';
                console.log(`Show More button visibility: ${showMoreButton.style.display}`); // 调试：记录按钮状态
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
    console.log(`Rendering items: count=${items.length}`); // 调试：记录渲染数量
    const ratingsSection = document.querySelector('.ratings');
    if (!ratingsSection) {
        console.error('Ratings section not found during render');
        return;
    }
    items.forEach(item => {
        console.log(`Rendering item: ${item.name}, rating: ${item.averageRating}`); // 调试：记录项数据
        const ratingCard = document.createElement('div');
        ratingCard.className = 'rating-card';
        ratingCard.setAttribute('data-item-id', item.id);

        // 生成静态星星
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
                <img class="img-rating" src="${item.imageUrl || 'static/assets/default-image.svg'}" alt="Rating Item Image">
                <div class="name-desc">
                    <h3 class="name-rating">${item.name || 'Unnamed Item'}</h3>
                    <p class="description-rating">${item.description || 'No description'}</p>
                </div>
            </div>
            <div class="game-info">
                <div class="star-rating">${starHtml}</div>
                <div class="score">${item.averageRating ? item.averageRating.toFixed(1) : '0.0'}</div>
                <p class="number-rating">${item.totalRatings || 0} ratings</p>
            </div>
        `;

        ratingsSection.insertBefore(ratingCard, document.querySelector('.more-ratings'));

        // Add click event to navigate to Feedback.html with itemId
        ratingCard.addEventListener('click', () => {
            window.location.href = `Feedback.html?itemId=${item.id}`;
        });
    });
}

// Add filter button event listeners
document.addEventListener('DOMContentLoaded', () => {

    const filterButtons = document.querySelectorAll('.type-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的激活样式
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 给当前点击的按钮添加激活样式
            button.classList.add('active');

            // 根据按钮文本设置 sortType
            const buttonText = button.textContent.toLowerCase().replace(' ', '_');
            sortType = buttonText; // e.g., "popular", "up_to_date", "high_score", "low_score"

            // 重置分页并重新加载数据
            currentPage = 1;
            fetchItems();
        });
    });

    // 默认激活 "Up to date" 按钮
    const upToDateButton = document.querySelector('.type-button:nth-child(2)');
    if (upToDateButton) {
        upToDateButton.classList.add('active');
    }

    // Initialize page
    fetchTopic();
    fetchItems();

    // "Show More" button event
    const showMoreButton = document.querySelector('.show-more');
    if (showMoreButton) {
        showMoreButton.addEventListener('click', () => {
            console.log('Show More clicked'); // 调试：确认点击
            currentPage++;
            fetchItems();
        });
    } else {
        console.error('Show More button not found');
    }
});