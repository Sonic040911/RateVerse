document.addEventListener("DOMContentLoaded", function () {
    const categories = [
        { name: "Movie list", active: true },
        { name: "Game list", active: false },
        { name: "Car list", active: false },
        { name: "Sport list", active: false },
        { name: "Laptop list", active: false },
        { name: "Phone list", active: false },
    ];

    const movies = [
        { title: "Moana 2", year: 2018, rating: 8.6, image: "https://upload.wikimedia.org/wikipedia/ru/thumb/1/19/%D0%9C%D0%BE%D0%B0%D0%BD%D0%B0_2.jpg/640px-%D0%9C%D0%BE%D0%B0%D0%BD%D0%B0_2.jpg" },
        { title: "Mufasa", year: 2004, rating: 8.2, image: "https://upload.wikimedia.org/wikipedia/en/0/0b/Mufasa_The_Lion_King_Movie_2024.jpeg" },
        { title: "The Shift", year: 2018, rating: 8.2, image: "https://m.media-amazon.com/images/M/MV5BNDlkZDQxZjAtMmQwZi00M2Y0LWIzMWItM2FjMmQxY2M3YmRjXkEyXkFqcGc@._V1_.jpg" },
        { title: "Sarpatta", year: 2021, rating: 8.8, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE3ZaaQJsL_y0UIoVRZwgEvBfANAnOmjc3Rg&s" },
        { title: "Marvel", year: 2015, rating: 7.6, image: "https://m.media-amazon.com/images/M/MV5BZTk5ODY0MmQtMzA3Ni00NGY1LThiYzItZThiNjFiNDM4MTM3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
    ];
    
    const tagsContainer = document.getElementById("tags");
    categories.forEach((category) => {
        const button = document.createElement("button");
        button.className = `py-1 px-4 rounded-full ${
            category.active ? "bg-[#FF5733] text-white" : "bg-gray-300 text-black"
        }`;
        button.textContent = category.name;
        tagsContainer.appendChild(button);
    });
    
    const listContainer = document.getElementById("list");
    movies.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.className = "w-40 flex flex-col";

        movieCard.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}" class="w-full h-56 rounded-lg shadow-md">
            <p class="font-bold mt-2">${movie.title}</p>
            <p class="text-sm text-gray-500">${movie.year}</p>
            <p class="text-lg font-semibold text-orange-500">${movie.rating}</p>
        `;

        listContainer.appendChild(movieCard);
    });



    const games = [
        { title: "PUBG", rating: 5.6, image: "https://upload.wikimedia.org/wikipedia/ru/7/7e/PlayerUnknown%27s_Battlegrounds_Mobile.jpg" },
        { title: "CS:GO", rating: 8.6, image: "https://upload.wikimedia.org/wikipedia/ru/thumb/d/db/Counter-strike_2.jpg/640px-Counter-strike_2.jpg" },
        { title: "Valorant", rating: 7.2, image: "https://assets.xboxservices.com/assets/36/b5/36b52fa8-e71b-4435-888a-cecb98d3876a.jpg?n=153142244433_GLP-Page-Hero-0_1083x1222_02.jpg" },
        { title: "BattleField", rating: 7.2, image: "https://upload.wikimedia.org/wikipedia/ru/7/79/%D0%9E%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B0_Battlefield_2042.jpg" },
    ];
    
    const gameListContainer = document.getElementById("gameList");
    
    games.forEach(game => {
        const gameItem = document.createElement("div");
        gameItem.className = "game-item";

        gameItem.innerHTML = `
            <div class="w-full flex justify-between gap-2">
                <div class="w-40 h-56 rounded-lg overflow-hidden">
                    <img src="${game.image}" alt="${game.title}" class="w-full h-full object-cover">
                </div>
                <h3 class="text-2xl font-extrabold">${game.title}</h3>
                <p class="ml-auto text-lg font-semibold text-orange-500">${game.rating}</p>
            </div>
        `;

        gameListContainer.appendChild(gameItem);
    });


    const openModal = document.getElementById('addObject');
    const closeModal = document.getElementById('closeModal');
    const modal = document.getElementById('modal');

    openModal.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    });
});
