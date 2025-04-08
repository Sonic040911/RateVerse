document.addEventListener("DOMContentLoaded", function () {
    const filterBtn = document.querySelector(".filter-icon");
    const filterOptions = document.querySelector(".filter-options");

    filterBtn.addEventListener("click", function () {
        if (filterOptions.style.display === "none" || filterOptions.style.display === "") {
            filterOptions.style.display = "flex";
        } else {
            filterOptions.style.display = "none";
        }
    });
});

  /*modal (filter button)*/ 
  document.addEventListener('DOMContentLoaded', function() {
    const openFilterBtn = document.getElementById('openFilterBtn');
    const filterModal = document.getElementById('filterModal');
    const closeFilterX = document.getElementById('closeFilterX');
    const closeFilterBtn = document.getElementById('closeFilterBtn');
    const applyFilterBtn = document.getElementById('applyFilterBtn');

    openFilterBtn.addEventListener('click', function() {
        filterModal.style.display = 'block';
    });

    closeFilterX.addEventListener('click', function() {
        filterModal.style.display = 'none';
    });

    closeFilterBtn.addEventListener('click', function() {
        filterModal.style.display = 'none';
    });

    applyFilterBtn.addEventListener('click', function() {
        // Логика для применения фильтров
        console.log('Filters applied!');
        filterModal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === filterModal) {
            filterModal.style.display = 'none';
        }
    });
});

