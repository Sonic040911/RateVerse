/*js code for 5 stars rating*/ 
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

/*js code for like and dislike*/ 
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

/*js code for modal window(share button)*/
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const shareBtn = document.querySelector(".share-btn");
  const closeBtn = document.querySelector(".close");
  const copyBtn = document.getElementById("copy-btn");
  const shareUrl = document.getElementById("share-url");

  shareBtn.addEventListener("click", () => {
      modal.style.display = "flex";
  });

  closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
      if (e.target === modal) {
          modal.style.display = "none";
      }
  });

  copyBtn.addEventListener("click", () => {
      shareUrl.select();
      document.execCommand("copy");
      alert("Link copied!");
  });
});

