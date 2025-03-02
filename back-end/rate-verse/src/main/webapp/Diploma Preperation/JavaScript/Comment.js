const ratings = document.querySelectorAll('.my-rating');

ratings.forEach(rating => {
  const stars = rating.querySelectorAll('.my-star');
  const ratingInput = rating.querySelector('.my-rating-input');

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const value = parseInt(star.getAttribute('data-value'));
      ratingInput.value = value;
      resetStars();
      for (let i = 0; i < value; i++) {
        stars[i].classList.add('active');
      }
      console.log('You have given a rating ' + ratingInput.name + ': ' + value);
    });
  });

  function resetStars() {
    stars.forEach(star => {
      star.classList.remove('active');
    });
  }
});


document.querySelectorAll(".comment-footer").forEach(footer => {
  const likeBtn = footer.querySelector(".like-btn");
  const dislikeBtn = footer.querySelector(".dislike-btn");

  likeBtn.addEventListener("click", function() {
      this.classList.toggle("active");
      dislikeBtn.classList.remove("active");
  });

  dislikeBtn.addEventListener("click", function() {
      this.classList.toggle("active");
      likeBtn.classList.remove("active");
  });
});
