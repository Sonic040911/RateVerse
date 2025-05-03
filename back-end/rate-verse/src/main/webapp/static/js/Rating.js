const pageSize = 5; // Number of Topics to fetch per page
let currentTopicPage = 1; // Current page for Topics
let totalTopicPages = 0; // Total number of Topic pages

// Fetch Topic list
async function fetchTopics(append = false) {
    try {
        console.log(`Fetching topics: page=${currentTopicPage}, pageSize=${pageSize}`);
        const response = await fetch(`/api/topic/getAllByHeat/${pageSize}/${currentTopicPage}`, {
            method: 'GET',
            credentials: 'include'
        });
        const result = await response.json();
        console.log('API response:', result);
        if (result.code === 200) {
            const pageBean = result.data;
            if (!pageBean || !Array.isArray(pageBean.data)) {
                console.error('Invalid pageBean data:', pageBean);
                throw new Error('Invalid data format from API');
            }
            renderTopics(pageBean.data, append);
            totalTopicPages = Math.ceil(pageBean.total / pageSize);
            console.log(`Total pages: ${totalTopicPages}`);
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
    const topicTitle = topicHeader?.querySelector('.topic-title');
    const totalRatings = topicHeader?.querySelector('.recommended_total');
    const allComments = recommendedSection.querySelector('.all-comments');

    if (!topicList || !topicHeader || !topicTitle || !totalRatings || !allComments) {
        console.error('Required elements not found:', {
            topicList: !!topicList,
            topicHeader: !!topicHeader,
            topicTitle: !!topicTitle,
            totalRatings: !!totalRatings,
            allComments: !!allComments
        });
        return;
    }

    console.log(`Rendering topics: count=${topics.length}, append=${append}`);

    if (!append) {
        topicList.innerHTML = '';
        topicTitle.innerHTML = '';
        totalRatings.innerHTML = '';
        allComments.innerHTML = '';
    }

    if (topics && topics.length > 0) {
        topics.forEach((topic, index) => {
            console.log(`Processing topic: ${topic.title}, id: ${topic.id}`);
            const topicContainer = document.createElement('div');
            topicContainer.className = 'recommended-content';

            const newHeader = document.createElement('div');
            newHeader.className = 'recommended_header';
            const newSpan = document.createElement('span');
            const newLink = document.createElement('a');
            newLink.className = 'recommended_header-link';
            newLink.href = `Rating_board.html?topicId=${topic.id}`;
            newLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `Rating_board.html?topicId=${topic.id}`;
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

            topicContainer.appendChild(newHeader);
            topicContainer.appendChild(newComments);
            topicContainer.appendChild(newList);

            if (!append && index === 0) {
                topicTitle.textContent = topic.title || 'Untitled Topic';
                totalRatings.textContent = `Total Ratings: ${topic.totalRatings || 0}`;
                allComments.textContent = `${topic.totalComments || 0} comments`;

                const topicLink = topicHeader.querySelector('.recommended_header-link');
                topicLink.href = `Rating_board.html?topicId=${topic.id}`;
                topicLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = `Rating_board.html?topicId=${topic.id}`;
                });

                topicList.innerHTML = '';
            } else {
                recommendedSection.insertBefore(topicContainer, recommendedSection.querySelector('.more-ratings'));
            }

            const targetList = (!append && index === 0) ? topicList : newList;
            (topic.items || []).slice(0, 3).forEach(item => {
                console.log('Item data:', item);
                const itemLink = document.createElement('a');
                itemLink.className = 'recommended_item-link';
                itemLink.href = `Rating_board.html?topicId=${topic.id}`;
                itemLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = `Rating_board.html?topicId=${topic.id}`;
                });

                const itemDiv = document.createElement('div');
                itemDiv.className = 'recommended_item';

                const infoDiv = document.createElement('div');
                infoDiv.className = 'recommended_info';

                const img = document.createElement('img');
                img.className = 'recommended_img';
                img.src = item.imageUrl || 'static/assets/NoImageFound.jpg.png';
                console.log(`Loading image for item ${item.id}: ${img.src}`);
                img.alt = 'card_img';
                img.onerror = () => {
                    console.error(`Failed to load image for item ${item.id}: ${img.src}`);
                    img.src = 'static/assets/NoImageFound.jpg.png';
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
                targetList.appendChild(itemLink);
            });
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
        console.log(`Show More button visibility: ${showMoreButton.style.display}`);
    } else {
        console.error('Show More button not found');
    }
}

// Navigate to Topic detail page
function goToTopicDetail(topicId) {
    window.location.href = `Rating_board.html?topicId=${topicId}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    fetchTopics();

    const showMoreButton = document.querySelector('.show-more');
    if (showMoreButton) {
        console.log('Show More button found, binding event');
        showMoreButton.addEventListener('click', () => {
            console.log('Show More clicked');
            currentTopicPage++;
            fetchTopics(true);
        });
    } else {
        console.error('Show More button not found during initialization');
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
});