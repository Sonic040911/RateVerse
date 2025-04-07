// Get topicId from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const topicId = urlParams.get('topicId');
// if (!topicId) {
//     alert('Topic ID not found');
//     window.location.href = 'Home.html'; // Redirect to homepage if topicId is missing
// }

// Pagination configuration
let currentPage = 1;
const pageSize = 4;

// Fetch and display Topic information
async function fetchTopic() {
    try {
        const response = await fetch(`/api/topic/${topicId}`, {
            method: 'GET',
            credentials: 'include'
        });
        const result = await response.json();
        if (result.code === 200) {
            const topic = result.data;
            document.querySelector('.name-category').textContent = topic.title;
            document.querySelector('.description-category').textContent = topic.description;
            document.querySelector('.user-create').innerHTML = `
                <img class="user-img" src="static/assets/User.svg" alt="User Avatar">${topic.user.username}
            `;
        } else {
            console.error('Failed to fetch Topic:', result.message);
            alert('Failed to load Topic');
        }
    } catch (error) {
        console.error('Request failed:', error);
        alert('Network error');
    }
}

// Fetch and display paginated Item data
async function fetchItems() {
    try {
        const response = await fetch(`/api/item/getItemsByTopicId/${topicId}/${pageSize}/${currentPage}`, {
            method: 'GET',
            credentials: 'include'
        });
        const result = await response.json();
        if (result.code === 200) {
            const items = result.data.data;
            renderItems(items);
            document.querySelector('.show-more').style.display = items.length === pageSize ? 'block' : 'none';
        } else {
            console.error('Failed to fetch Items:', result.message);
            alert('Failed to load Items');
        }
    } catch (error) {
        console.error('Request failed:', error);
        alert('Network error');
    }
}

// Render Item cards
function renderItems(items) {
    const ratingsSection = document.querySelector('.ratings');
    items.forEach(item => {
        const ratingCard = document.createElement('div');
        ratingCard.className = 'rating-card';
        ratingCard.setAttribute('data-item-id', item.id);

        ratingCard.innerHTML = `
            <div class="rating-info">
                <img class="img-rating" src="${item.imageUrl || 'static/assets/default-image.svg'}" alt="Rating Item Image">
                <div class="name-desc">
                    <h3 class="name-rating">${item.name}</h3>
                    <p class="description-rating">${item.description}</p>
                </div>
            </div>
            <div class="game-info">
                <div class="interactive-stars" data-item-id="${item.id}">
                    <span class="star" data-value="1">★</span>
                    <span class="star" data-value="2">★</span>
                    <span class="star" data-value="3">★</span>
                    <span class="star" data-value="4">★</span>
                    <span class="star" data-value="5">★</span>
                </div>
                <div class="score">${item.averageRating ? item.averageRating.toFixed(1) : '0.0'}</div>
                <p class="number-rating">${item.totalRatings} ratings</p>
            </div>
        `;

        ratingsSection.insertBefore(ratingCard, document.querySelector('.more-ratings'));

        // Initialize star display
        updateStars(ratingCard.querySelector('.interactive-stars'), item.averageRating);

        // Add click event to navigate to Comment.html with itemId
        ratingCard.addEventListener('click', () => {
            window.location.href = `Comment.html?itemId=${item.id}`;
        });
    });

    // Add star click event
    document.querySelectorAll('.interactive-stars .star').forEach(star => {
        star.addEventListener('click', async function () {
            const itemId = this.parentElement.getAttribute('data-item-id');
            const score = parseInt(this.getAttribute('data-value'));
            await submitRating(itemId, score); // Submit immediately on click
            await refreshItem(itemId); // Refresh rating display
        });
    });
}

// Update star display (based on 1-5 value)
function updateStars(starContainer, averageRating) {
    const score = averageRating || 0; // Default to 0 if no rating
    const fullStars = Math.floor(score);
    const halfStar = score % 1 >= 0.5 ? 1 : 0;
    const stars = starContainer.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.classList.remove('light', 'half');
        if (index + 1 <= fullStars) {
            star.classList.add('light'); // Full star
        } else if (index + 1 === fullStars + 1 && halfStar) {
            star.classList.add('half'); // Half star
        }
    });
}

// Submit rating to backend
async function submitRating(itemId, score) {
    try {
        const response = await fetch('/api/rating', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                itemId: parseInt(itemId),
                score: parseInt(score)
            }),
            credentials: 'include'
        });
        const result = await response.json();
        if (result.code === 200) {
            console.log('Rating submitted successfully');
        } else {
            alert('Failed to submit rating: ' + result.message);
        }
    } catch (error) {
        console.error('Failed to submit rating:', error);
        alert('Network error');
    }
}

// Refresh Item's rating display
async function refreshItem(itemId) {
    try {
        const response = await fetch(`/api/item/${itemId}`, {
            method: 'GET',
            credentials: 'include'
        });
        const result = await response.json();
        if (result.code === 200) {
            const item = result.data;
            const card = document.querySelector(`.rating-card[data-item-id="${itemId}"]`);
            if (card) {
                const starContainer = card.querySelector('.interactive-stars');
                updateStars(starContainer, item.averageRating);
                card.querySelector('.score').textContent = item.averageRating ? item.averageRating.toFixed(1) : '0.0';
                card.querySelector('.number-rating').textContent = `${item.totalRatings} ratings`;
            }
        } else {
            console.error('Failed to fetch Item:', result.message);
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
}

// "Show More" button event
document.querySelector('.show-more').addEventListener('click', () => {
    currentPage++;
    fetchItems();
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    fetchTopic();
    fetchItems();
});