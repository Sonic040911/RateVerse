// Configuration
const pageSize = 10; // Number of Topics to display per page
let currentPage = 1; // Current page number
let totalPages = 0; // Total number of pages

// Fetch Topic list
async function fetchTopics() {
    try {
        const response = await fetch(`/api/topic/getAllByTime/${pageSize}/${currentPage}`, {
            method: 'GET',
            credentials: 'include' // Include cookies for user authentication
        });
        const result = await response.json();
        if (result.code === 200) {
            const pageBean = result.data;
            renderTopics(pageBean.data);
            totalPages = Math.ceil(pageBean.total / pageSize);
            renderPagination();
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
function renderTopics(topics) {
    const topicList = document.getElementById('topicList');
    topicList.innerHTML = ''; // Clear existing content

    topics.forEach(topic => {
        const topicDiv = document.createElement('div');
        topicDiv.className = 'topic-card';
        topicDiv.onclick = () => goToTopicDetail(topic.id);

        const title = document.createElement('h2');
        title.textContent = topic.title;
        topicDiv.appendChild(title);

        const description = document.createElement('p');
        description.textContent = topic.description;
        topicDiv.appendChild(description);

        const totalRatings = document.createElement('p');
        totalRatings.textContent = `Total Ratings: ${topic.totalRatings}`;
        topicDiv.appendChild(totalRatings);

        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'items';
        topic.items.slice(0, 3).forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';

            const itemName = document.createElement('h3');
            itemName.textContent = item.name;
            itemDiv.appendChild(itemName);

            const itemRating = document.createElement('p');
            itemRating.textContent = `Average Rating: ${item.averageRating}`;
            itemDiv.appendChild(itemRating);

            itemsDiv.appendChild(itemDiv);
        });
        topicDiv.appendChild(itemsDiv);

        topicList.appendChild(topicDiv);
    });
}

// Render pagination controls
function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Clear existing content

    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement('button');
        button.textContent = page;
        button.className = page === currentPage ? 'active' : '';
        button.onclick = () => {
            currentPage = page;
            fetchTopics();
        };
        pagination.appendChild(button);
    }
}

// Navigate to Topic detail page
function goToTopicDetail(topicId) {
    window.location.href = `Rating.html?topicId=${topicId}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchTopics(); // Fetch first page data when the page loads
});

// Preserve the existing draft creation logic
document.getElementById('createBtn').addEventListener('click', async () => {
    try {
        // 1. Call the create draft API
        const response = await fetch('/api/drafts', {
            method: 'POST',
            credentials: 'include'
        });
        const result = await response.json();

        // If there is already a rating draft
        if (result.code === 602) {
            const draftId = result.data.draftId;
            // 2. Show a dialog asking the user if they want to continue editing the existing draft
            if (confirm("You have an unfinished draft. Do you want to continue editing?\nClick [OK] to continue editing, or [Cancel] to discard the draft and create a new one.")) {
                window.location.href = `Create.html?draftId=${draftId}`;
            } else {
                // User chooses to discard the draft
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