document.addEventListener('DOMContentLoaded', () => {
    // Get keyword from URL
    const urlParams = new URLSearchParams(window.location.search);
    let keyword = urlParams.get('keyword') || '';

    // Track search type and pagination
    let searchType = 'ratings'; // Default to Ratings
    let currentPage = 1;
    const pageSize = 10;

    // Navigation links for switching between Ratings and Users
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach((link, index) => {
        // Set initial active state
        if (index === 0) link.classList.add('active');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            searchType = link.textContent.toLowerCase(); // 'ratings' or 'users'
            currentPage = 1;
            fetchResults();
        });
    });

    // Search button functionality
    const searchButton = document.querySelector('.search-logo');
    const searchInput = document.querySelector('.search-input');
    if (searchButton && searchInput) {
        searchInput.value = keyword; // Pre-fill with URL keyword
        searchButton.addEventListener('click', () => {
            keyword = searchInput.value.trim();
            if (keyword) {
                currentPage = 1;
                fetchResults();
            } else {
                alert('Please enter a search keyword');
            }
        });
    }

    // Show More button for pagination (Ratings only)
    const showMoreButton = document.querySelector('.show-more');
    if (showMoreButton) {
        showMoreButton.addEventListener('click', () => {
            currentPage++;
            fetchResults(true); // Append mode
        });
    }

    // Fetch search results from backend
    async function fetchResults(append = false) {
        let apiUrl;
        if (searchType === 'ratings') {
            apiUrl = `/api/topic/searchByTime/${pageSize}/${currentPage}?keyword=${encodeURIComponent(keyword)}`;
        } else if (searchType === 'users') {
            apiUrl = `/user/search?keyword=${encodeURIComponent(keyword)}`;
        }

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                credentials: 'include', // Include cookies for session
            });
            const result = await response.json();

            if (result.code === 200) {
                const data = result.data;
                renderResults(data, append);
                if (searchType === 'ratings') {
                    const totalPages = Math.ceil(data.total / pageSize);
                    showMoreButton.style.display = currentPage < totalPages ? 'block' : 'none';
                } else {
                    showMoreButton.style.display = 'none'; // No pagination for Users
                }
            } else {
                console.error('Failed to fetch results:', result.message);
                alert('Failed to load results');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error occurred');
        }
    }

    // Render search results
    function renderResults(pageBean, append = false) {
        const categoriesSection = document.querySelector('.categories');
        if (!categoriesSection) {
            console.error('Categories section not found in the DOM');
            return;
        }
        if (!append) {
            categoriesSection.innerHTML = ''; // Clear previous results
        }

        if (searchType === 'ratings') {
            renderTopics(pageBean.data || [], categoriesSection);
        } else if (searchType === 'users') {
            renderUsers(pageBean || [], categoriesSection); // 传递 categoriesSection
        }
    }

    // Render Topics (Ratings)
    function renderTopics(topics, categoriesSection) {
        topics.forEach(topic => {
            const categorySection = document.createElement('section');
            categorySection.className = 'category';
            categorySection.innerHTML = `
            <div class="category-nav">
                <h3><a href="#" class="category-title">${topic.title}</a></h3>
                <button class="more-element-btn">Show More ></button>
            </div>
            <div class="elements"></div>
        `;

            const elementsDiv = categorySection.querySelector('.elements');
            (topic.items || []).slice(0, 5).forEach(item => {
                const itemCard = document.createElement('a');
                itemCard.className = 'element-card';
                itemCard.href = `Rating.html?topicId=${topic.id}`;
                itemCard.innerHTML = `
                <img src="${item.imageUrl || 'static/assets/Block_with_X(2).svg'}" alt="image category" class="element-image">
                <p class="element-name">${item.name}</p>
                <div class="element-date">${new Date(item.createdAt).getFullYear()}</div>
                <strong class="element-rating">${item.averageRating ? item.averageRating.toFixed(1) : '0.0'}</strong>
            `;
                elementsDiv.appendChild(itemCard);
            });

            categoriesSection.appendChild(categorySection); // 现在 categoriesSection 已定义
        });
    }

    // Render Users
    function renderUsers(users, categoriesSection) {
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `
            <img src="${user.avatarUrl || 'static/assets/User.svg'}" alt="user avatar" class="user-avatar">
            <p class="user-name">${user.username}</p>
        `;
            categoriesSection.appendChild(userCard); // 现在 categoriesSection 已定义
        });
    }

    // Initial fetch if keyword exists
    if (keyword) {
        fetchResults();
    }

    // Existing filter modal code (unchanged)
    const openFilterBtn = document.getElementById('openFilterBtn');
    const filterModal = document.getElementById('filterModal');
    const closeFilterX = document.getElementById('closeFilterX');
    const closeFilterBtn = document.getElementById('closeFilterBtn');
    const applyFilterBtn = document.getElementById('applyFilterBtn');

    openFilterBtn.addEventListener('click', () => {
        filterModal.style.display = 'block';
    });

    closeFilterX.addEventListener('click', () => {
        filterModal.style.display = 'none';
    });

    closeFilterBtn.addEventListener('click', () => {
        filterModal.style.display = 'none';
    });

    applyFilterBtn.addEventListener('click', () => {
        console.log('Filters applied!');
        filterModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === filterModal) {
            filterModal.style.display = 'none';
        }
    });
});