// Configuration
const pageSize = 3; // Number of Topics to fetch per page
let currentTopicPage = 1; // Current page for Topics
let totalTopicPages = 0; // Total number of Topic pages

// Fetch Topic list
async function fetchTopics(append = false) {
    try {
        const response = await fetch(`/api/topic/getAllByTime/${pageSize}/${currentTopicPage}`, {
            method: 'GET',
            credentials: 'include'
        });
        const result = await response.json();
        if (result.code === 200) {
            const pageBean = result.data;
            renderTopics(pageBean.data, append);
            totalTopicPages = Math.ceil(pageBean.total / pageSize);
            updateShowMoreButton();
        } else {
            console.error('Failed to fetch Topics:', result.message);
            alert('Failed to load data, please try again later');
        }
    } catch (error) {
        console.error('Request failed:', error);
        alert('Network error, please check the backend service');
    }
}

// Render Topic list
function renderTopics(topics, append = false) {
    const recommendedSection = document.querySelector('.recommended');
    if (!recommendedSection) {
        console.error('Recommended section not found');
        return;
    }

    const topicList = recommendedSection.querySelector('.recommended_list');
    const topicHeader = recommendedSection.querySelector('.recommended_header');
    const topicTitle = topicHeader.querySelector('.topic-title');
    const totalRatings = topicHeader.querySelector('.recommended_total');
    const allComments = recommendedSection.querySelector('.all-comments');

    if (!topicList || !topicHeader || !topicTitle || !totalRatings || !allComments) {
        console.error('Required elements not found in recommended section');
        return;
    }

    if (!append) {
        topicList.innerHTML = '';
        topicTitle.innerHTML = '';
        totalRatings.innerHTML = '';
        allComments.innerHTML = '';
    }

    if (topics && topics.length > 0) {
        topics.forEach((topic, index) => {
            if (append || index > 0) {
                const newTopicContainer = document.createElement('div');
                newTopicContainer.className = 'topic-container';

                const newHeader = document.createElement('div');
                newHeader.className = 'recommended_header';
                const newSpan = document.createElement('span');
                const newLink = document.createElement('a');
                newLink.className = 'recommended_header-link';
                newLink.href = `Rating.html?topicId=${topic.id}`;
                newLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = `Rating.html?topicId=${topic.id}`;
                });
                const newTitle = document.createElement('h3');
                newTitle.className = 'topic-title';
                newTitle.textContent = topic.title || 'Untitled Topic';
                newLink.appendChild(newTitle);
                newSpan.appendChild(newLink);
                newHeader.appendChild(newSpan);

                const newTotalRatings = document.createElement('p');
                newTotalRatings.className = 'recommended_total';
                newTotalRatings.textContent = `Total Ratings: ${topic.totalRatings || 0}`;
                newHeader.appendChild(newTotalRatings);

                const newComments = document.createElement('p');
                newComments.className = 'all-comments';
                newComments.textContent = `${topic.totalComments || 0} comments`;

                const newList = document.createElement('div');
                newList.className = 'recommended_list';

                newTopicContainer.appendChild(newHeader);
                newTopicContainer.appendChild(newComments);
                newTopicContainer.appendChild(newList);

                recommendedSection.insertBefore(newTopicContainer, recommendedSection.querySelector('.more-ratings'));

                (topic.items || []).slice(0, 3).forEach(item => {
                    console.log('Item data:', item); // 添加日志
                    const itemLink = document.createElement('a');
                    itemLink.className = 'recommended_item-link';
                    itemLink.href = `Rating.html?topicId=${topic.id}`;
                    itemLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.location.href = `Rating.html?topicId=${topic.id}`;
                    });

                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'recommended_item';

                    const infoDiv = document.createElement('div');
                    infoDiv.className = 'recommended_info';

                    const img = document.createElement('img');
                    img.className = 'recommended_img';
                    img.src = item.imageUrl || 'static/assets/Block_with_X(2).svg';
                    console.log(`Loading image for item ${item.id}: ${img.src}`);
                    img.alt = 'card_img';
                    img.onerror = () => {
                        console.error(`Failed to load image for item ${item.id}: ${img.src}`);
                        img.src = 'static/assets/Block_with_X(2).svg';
                    };
                    img.onload = () => {
                        console.log(`Image loaded successfully for item ${item.id}: ${img.src}`);
                    };
                    infoDiv.appendChild(img);

                    const name = document.createElement('p');
                    name.className = 'recommended_name';
                    name.textContent = item.name || 'Unnamed Item';
                    infoDiv.appendChild(name);

                    const rankInfoDiv = document.createElement('div');
                    rankInfoDiv.className = 'rank-info';

                    const rating = document.createElement('div');
                    rating.className = 'recommended_rating';
                    rating.textContent = item.averageRating ? item.averageRating.toFixed(1) : '0.0';
                    rankInfoDiv.appendChild(rating);

                    const count = document.createElement('div');
                    count.className = 'recommended_count';
                    count.textContent = `${item.totalRatings || 0} ratings`;
                    rankInfoDiv.appendChild(count);

                    itemDiv.appendChild(infoDiv);
                    itemDiv.appendChild(rankInfoDiv);
                    itemLink.appendChild(itemDiv);
                    newList.appendChild(itemLink);
                });
            } else {
                topicTitle.textContent = topic.title || 'Untitled Topic';
                totalRatings.textContent = `Total Ratings: ${topic.totalRatings || 0}`;
                allComments.textContent = `${topic.totalComments || 0} comments`;

                const topicLink = topicHeader.querySelector('.recommended_header-link');
                topicLink.href = `Rating.html?topicId=${topic.id}`;
                topicLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = `Rating.html?topicId=${topic.id}`;
                });

                (topic.items || []).slice(0, 3).forEach(item => {
                    console.log('Item data:', item); // 添加日志
                    const itemLink = document.createElement('a');
                    itemLink.className = 'recommended_item-link';
                    itemLink.href = `Rating.html?topicId=${topic.id}`;
                    itemLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.location.href = `Rating.html?topicId=${topic.id}`;
                    });

                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'recommended_item';

                    const infoDiv = document.createElement('div');
                    infoDiv.className = 'recommended_info';

                    const img = document.createElement('img');
                    img.className = 'recommended_img';
                    img.src = item.imageUrl || 'static/assets/Block_with_X(2).svg';
                    console.log(`Loading image for item ${item.id}: ${img.src}`);
                    img.alt = 'card_img';
                    img.onerror = () => {
                        console.error(`Failed to load image for item ${item.id}: ${img.src}`);
                        img.src = 'static/assets/Block_with_X(2).svg';
                    };
                    img.onload = () => {
                        console.log(`Image loaded successfully for item ${item.id}: ${img.src}`);
                    };
                    infoDiv.appendChild(img);

                    const name = document.createElement('p');
                    name.className = 'recommended_name';
                    name.textContent = item.name || 'Unnamed Item';
                    infoDiv.appendChild(name);

                    const rankInfoDiv = document.createElement('div');
                    rankInfoDiv.className = 'rank-info';

                    const rating = document.createElement('div');
                    rating.className = 'recommended_rating';
                    rating.textContent = item.averageRating ? item.averageRating.toFixed(1) : '0.0';
                    rankInfoDiv.appendChild(rating);

                    const count = document.createElement('div');
                    count.className = 'recommended_count';
                    count.textContent = `${item.totalRatings || 0} ratings`;
                    rankInfoDiv.appendChild(count);

                    itemDiv.appendChild(infoDiv);
                    itemDiv.appendChild(rankInfoDiv);
                    itemLink.appendChild(itemDiv);
                    topicList.appendChild(itemLink);
                });
            }
        });
    } else if (!append) {
        topicTitle.textContent = 'No Topics Available';
        totalRatings.textContent = 'Total Ratings: 0';
        allComments.textContent = '0 comments';
    }
}

// Update "Show More" button visibility
function updateShowMoreButton() {
    const showMoreButton = document.querySelector('.show-more');
    if (showMoreButton) {
        showMoreButton.style.display = currentTopicPage < totalTopicPages ? 'block' : 'none';
    }
}

// Navigate to Topic detail page
function goToTopicDetail(topicId) {
    window.location.href = `Rating.html?topicId=${topicId}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchTopics();

    const showMoreButton = document.querySelector('.show-more');
    if (showMoreButton) {
        showMoreButton.addEventListener('click', () => {
            currentTopicPage++;
            fetchTopics(true);
        });
    }

    const createBtn = document.getElementById('createBtn');
    if (createBtn) {
        createBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/drafts', {
                    method: 'POST',
                    credentials: 'include'
                });
                const result = await response.json();

                if (result.code === 602) {
                    const draftId = result.data.draftId;
                    if (confirm("You have an unfinished draft. Do you want to continue editing?\nClick [OK] to continue editing, or [Cancel] to discard the draft and create a new one.")) {
                        window.location.href = `Create.html?draftId=${draftId}`;
                    } else {
                        const deleteResponse = await fetch(`/api/drafts/${draftId}`, {
                            method: 'DELETE',
                            credentials: 'include'
                        });
                        const deleteResult = await deleteResponse.json();
                        if (deleteResult.flag) {
                            const newResponse = await fetch('/api/drafts', {
                                method: 'POST',
                                credentials: 'include'
                            });
                            const newResult = await newResponse.json();
                            if (newResult.flag) {
                                window.location.href = `Create.html?draftId=${newResult.data.draftId}`;
                            } else {
                                alert(`Failed to create a new draft: ${newResult.message}`);
                            }
                        } else {
                            alert(`Failed to delete draft: ${deleteResult.message}`);
                        }
                    }
                } else {
                    window.location.href = `Create.html?draftId=${result.data.draftId}`;
                }
            } catch (error) {
                alert('Network request exception');
            }
        });
    }

    const searchButton = document.querySelector('.search-logo');
    const searchInput = document.querySelector('.search-input');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            const keyword = searchInput.value.trim();
            if (keyword) {
                // Redirect to Search.html with the search keyword as a URL parameter
                window.location.href = `Search.html?keyword=${encodeURIComponent(keyword)}`;
            } else {
                alert('Please enter a search keyword');
            }
        });
    }
});