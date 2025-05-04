document.addEventListener('DOMContentLoaded', () => {
    // Get keyword from URL
    const urlParams = new URLSearchParams(window.location.search);
    let keyword = urlParams.get('keyword') || '';

    // Track sort mode and pagination
    let sortMode = keyword ? 'latest' : 'popular'; // Default to popular if no keyword
    let currentPage = 1;
    const pageSize = 10;

    // Notification popup for user feedback
    const notificationPopup = document.createElement('div');
    notificationPopup.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        background: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 5px;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1000;
    `;
    document.body.appendChild(notificationPopup);

    function showNotification(message, isError = false) {
        notificationPopup.textContent = message;
        notificationPopup.style.background = isError ? '#ff4444' : '#4CAF50';
        notificationPopup.style.color = '#fff';
        notificationPopup.style.opacity = '1';
        setTimeout(() => {
            notificationPopup.style.opacity = '0';
        }, 2000);
    }

    // Navigation links for sorting (Popular, Earliest, Latest)
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach((link, index) => {
        // Set initial active state
        if (link.textContent.toLowerCase() === sortMode) {
            link.classList.add('active');
        }
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            sortMode = link.textContent.toLowerCase(); // popular, earliest, latest
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
                sortMode = 'latest'; // Reset to latest on search
                fetchResults();
                // Update URL without reloading
                window.history.pushState({}, '', `Search&Category.html?keyword=${encodeURIComponent(keyword)}`);
            } else {
                showNotification('Please enter a search keyword', true);
            }
        });

        // Allow pressing Enter to search
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                keyword = searchInput.value.trim();
                if (keyword) {
                    currentPage = 1;
                    sortMode = 'latest'; // Reset to latest on search
                    fetchResults();
                    // Update URL without reloading
                    window.history.pushState({}, '', `Search&Category.html?keyword=${encodeURIComponent(keyword)}`);
                } else {
                    showNotification('Please enter a search keyword', true);
                }
            }
        });
    }

    // Show More button for pagination
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
        if (sortMode === 'popular') {
            apiUrl = keyword
                ? `/api/topic/searchByHeat/${pageSize}/${currentPage}?keyword=${encodeURIComponent(keyword)}`
                : `/api/topic/getAllByHeat/${pageSize}/${currentPage}`;
        } else {
            const order = sortMode === 'earliest' ? 'ASC' : 'DESC';
            apiUrl = keyword
                ? `/api/topic/searchByTime/${pageSize}/${currentPage}?keyword=${encodeURIComponent(keyword)}&order=${order}`
                : `/api/topic/getAllByTime/${pageSize}/${currentPage}`;
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
                const totalPages = Math.ceil(data.total / pageSize);
                showMoreButton.style.display = currentPage < totalPages ? 'block' : 'none';
            } else {
                console.error('Failed to fetch results:', result.message);
                showNotification(`Failed to load results: ${result.message}`, true);
            }
        } catch (error) {
            console.error('Network error:', error);
            showNotification('Network error occurred', true);
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

        renderTopics(pageBean.data || [], categoriesSection);
    }

    // Render Topics
    function renderTopics(topics, categoriesSection) {
        if (topics.length === 0) {
            categoriesSection.innerHTML = '<p class="no-results">No topics found</p>';
            return;
        }

        topics.forEach(topic => {
            const categorySection = document.createElement('section');
            categorySection.className = 'category';
            categorySection.innerHTML = `
                <div class="category-nav">
                    <h3><a href="Rating_board.html?topicId=${topic.id}" class="category-title">${topic.title}</a></h3>
                    <button class="more-element-btn">Show More ></button>
                </div>
                <div class="elements"></div>
            `;

            const elementsDiv = categorySection.querySelector('.elements');
            (topic.items || []).slice(0, 5).forEach(item => {
                const itemCard = document.createElement('a');
                itemCard.className = 'element-card';
                itemCard.href = `Rating_board.html?topicId=${topic.id}`;
                itemCard.innerHTML = `
                    <img src="${item.imageUrl || 'static/assets/NoImageFound.jpg.png'}" alt="image category" class="element-image">
                    <p class="element-name">${item.name}</p>
                    <div class="element-date">${new Date(item.createdAt).getFullYear()}</div>
                    <strong class="element-rating">${item.averageRating ? item.averageRating.toFixed(1) : '0.0'}</strong>
                `;
                elementsDiv.appendChild(itemCard);
            });

            categoriesSection.appendChild(categorySection);
        });
    }

    // Initial fetch
    fetchResults();

    // Handle "Show More" buttons for each category
    document.addEventListener('click', (e) => {
        const moreBtn = e.target.closest('.more-element-btn');
        if (moreBtn) {
            const category = moreBtn.closest('.category');
            const elementsDiv = category.querySelector('.elements');
            // Logic to fetch more items for this topic (not implemented in backend yet)
            console.log('Fetch more items for topic:', category.querySelector('.category-title').textContent);
        }
    });
});




// Add this to your Search&Category.js file, inside the DOMContentLoaded event listener

// Mobile filter dropdown functionality
const mobileFilterBtn = document.querySelector('.mobile-filter-btn');
const mobileFilterDropdown = document.querySelector('.mobile-filter-dropdown');
const mobileFilterOptions = document.querySelectorAll('.mobile-filter-dropdown a');
const currentFilter = document.getElementById('current-filter');

if (mobileFilterBtn && mobileFilterDropdown) {
    // Toggle dropdown
    mobileFilterBtn.addEventListener('click', () => {
        mobileFilterBtn.classList.toggle('active');
        mobileFilterDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileFilterBtn.contains(e.target) && !mobileFilterDropdown.contains(e.target)) {
            mobileFilterBtn.classList.remove('active');
            mobileFilterDropdown.classList.remove('show');
        }
    });

    // Handle filter selection
    mobileFilterOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active state in dropdown
            mobileFilterOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Update button text
            currentFilter.textContent = option.textContent;
            
            // Close dropdown
            mobileFilterBtn.classList.remove('active');
            mobileFilterDropdown.classList.remove('show');
            
            // Update sortMode and fetch results
            sortMode = option.getAttribute('data-filter');
            currentPage = 1;
            fetchResults();
        });
    });
}

// Update the initial state of the mobile filter based on the current sortMode
function updateMobileFilterState() {
    if (currentFilter) {
        // Capitalize first letter of sortMode
        currentFilter.textContent = sortMode.charAt(0).toUpperCase() + sortMode.slice(1);
    }
    
    mobileFilterOptions.forEach(option => {
        const filterValue = option.getAttribute('data-filter');
        option.classList.toggle('active', filterValue === sortMode);
    });
}

// Call this after setting initial sortMode
updateMobileFilterState();