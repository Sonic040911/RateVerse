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