// Comment.js

// Get itemId from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('itemId');
if (!itemId) {
  alert('Item ID not found');
  window.location.href = 'Rating_board.html'; // Redirect to Rating page if itemId is missing
}

// Pagination configuration
let currentPage = 1;
const pageSize = 5; // Display 5 comments per page
let sortType = 'likes'; // Default sorting by time (Latest)

// Reset stars function (moved to global scope)
function resetStars() {
  const stars = document.querySelectorAll('.my-star');
  stars.forEach(star => star.classList.remove('active'));
}

// Fetch and display Item information
async function fetchItem() {
  try {
    const response = await fetch(`/api/item/status/${itemId}`, {
      method: 'GET',
      credentials: 'include'
    });
    const result = await response.json();
    if (result.code === 200) {
      const data = result.data;
      const item = data.item;
      const distributions = data.scoreDistribution;
      const topic = data.topic;

      // 设置 Item 信息
      document.querySelector('.name-block').textContent = topic.title;
      document.querySelector('.name-block').href = 'Rating_board.html?topicId=' + topic.id
      document.querySelector('.some-name').textContent = item.name;
      document.querySelector('.description').textContent = item.description;
      renderRatingDistribution(distributions);
      document.querySelector('.rating-score').textContent = item.averageRating ? item.averageRating.toFixed(1) : '0.0';

      // 设置图片
      const itemImage = document.querySelector('.some-image img');
      itemImage.src = item.imageUrl || 'static/assets/NoImageFound.jpg.png';
      console.log(`Loading image for item ${item.id}: ${itemImage.src}`);
      itemImage.onerror = () => {
        console.error(`Failed to load image for item ${item.id}: ${itemImage.src}`);
        itemImage.src = 'static/assets/NoImageFound.jpg.png';
      };
      itemImage.onload = () => {
        console.log(`Image loaded successfully for item ${item.id}: ${itemImage.src}`);
      };
    } else {
      console.error('Failed to fetch Item:', result.message);
      alert('Failed to load Item');
    }
  } catch (error) {
    console.error('Request failed:', error);
    alert('Network error');
  }
}

// Fetch user rating
async function fetchUserRating() {
  try {
    const response = await fetch(`/api/rating/${itemId}/user`, {
      method: 'GET',
      credentials: 'include'
    });
    const result = await response.json();
    if (result.code === 200) {
      const rating = result.data;
      const ratingInput = document.querySelector('.my-rating-input');
      const stars = document.querySelectorAll('.my-star');
      if (rating && rating.score) {
        ratingInput.value = rating.score;
        resetStars(); // 清空当前星级
        for (let i = 0; i < rating.score; i++) {
          stars[i].classList.add('active');
        }
      } else {
        ratingInput.value = 0;
        resetStars(); // 清空星级
      }
    } else {
      console.error('Failed to fetch user rating:', result.message);
      alert('Failed to load user rating');
    }
  } catch (error) {
    console.error('Fetch user rating failed:', error);
    alert('Network error');
  }
}

// Render score distribution
function renderRatingDistribution(distributions) {
  const ratingsDiv = document.querySelector('.ratings');
  ratingsDiv.innerHTML = '';

  const distributionMap = {};
  distributions.forEach(dist => {
    distributionMap[dist.score] = dist.percentage;
  });

  for (let i = 5; i >= 1; i--) {
    const percentage = distributionMap[i] || 0;
    const ratingBar = document.createElement('div');
    ratingBar.className = 'ratings-bar';
    ratingBar.innerHTML = `
            <div class="star-rating">
                ${Array(i).fill('<span class="star light">★</span>').join('')}${Array(5 - i).fill('<span class="star">★</span>').join('')}
            </div>
            <div class="bar"><div class="bar-fill" style="width: ${percentage}%;"></div></div>
            <div>${percentage.toFixed(1)}%</div>
        `;
    ratingsDiv.appendChild(ratingBar);
  }
}

// Fetch and display paginated comments
async function fetchComments() {
  try {
    const apiUrl = `/api/comment/getCommentsByItemId/${itemId}/${pageSize}/${currentPage}?sortType=${sortType}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      credentials: 'include'
    });
    const result = await response.json();
    if (result.code === 200) {
      const comments = result.data.data;
      renderComments(comments);
      updateCommentCount(result.data.total);
    } else {
      console.error('Failed to fetch comments:', result.message);
      alert('Failed to load comments');
    }
  } catch (error) {
    console.error('Request failed:', error);
    alert('Network error');
  }
}

// Render comments
function renderComments(comments) {
  const commentList = document.querySelector('.comment-list');
  commentList.innerHTML = '';
  comments.forEach(comment => {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.setAttribute('data-comment-id', comment.id);

    const avatarSrc = comment.user.avatarUrl || 'static/assets/User.svg';
    commentDiv.innerHTML = `
            <img src="${avatarSrc}" alt="user img" class="user-avatar">
            <div class="comment-content">
                <div class="user-info">
                    <div class="username">${comment.user.username}</div>
                    <div class="user-comment-star">
                        ${generateStars(comment.userRating || 0)}
                    </div>
                </div>
                <p class="comment-text">${comment.content}</p>
                <div class="comment-footer">
                    <span class="comment-date">${new Date(comment.createdAt).toLocaleDateString()}</span>
                    <button class="reply-btn" data-comment-id="${comment.id}">Reply</button>
                    <div class="like-dislike">
                        <span class="like-count">${comment.likes}</span>
                        <button class="like-btn" data-comment-id="${comment.id}"><img src="static/assets/like.svg" alt="like"></button>
                    </div>
                    <div class="like-dislike">
                        <span class="dislike-count">${comment.dislikes}</span>
                        <button class="dislike-btn" data-comment-id="${comment.id}"><img src="static/assets/dislike.svg" alt="dislike"></button>
                    </div>
                </div>
                <div class="replies"></div>
            </div>
        `;
    commentList.appendChild(commentDiv);

    loadReplies(comment.id, commentDiv.querySelector('.replies'));
  });

  addCommentInteractions();
}

// Load replies
async function loadReplies(parentCommentId, repliesContainer) {
  try {
    const response = await fetch(`/api/comment/replies/${parentCommentId}`, {
      method: 'GET',
      credentials: 'include'
    });
    const result = await response.json();
    if (result.code === 200) {
      const replies = result.data;
      renderReplies(repliesContainer, replies);
    } else {
      console.error('Failed to fetch replies:', result.message);
      alert('Failed to load replies');
    }
  } catch (error) {
    console.error('Request failed:', error);
    alert('Network error');
  }
}

// Render replies
function renderReplies(repliesContainer, replies) {
  repliesContainer.innerHTML = '';
  replies.forEach(reply => {
    const replyDiv = document.createElement('div');
    replyDiv.className = 'comment reply';
    replyDiv.setAttribute('data-comment-id', reply.id);

    replyDiv.innerHTML = `
            <div class="comment-content">
                <div class="user-info">
                    <div class="username">${reply.user.username}</div>
                </div>
                <p class="comment-text">${reply.content}</p>
                <div class="comment-footer">
                    <span class="comment-date">${new Date(reply.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        `;
    repliesContainer.appendChild(replyDiv);
  });
}

// Generate star HTML
function generateStars(score) {
  let stars = '';
  const fullStars = Math.floor(score);
  const halfStar = score % 1 >= 0.5 ? 1 : 0;
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars += '<span class="user-star light">★</span>';
    } else if (i === fullStars + 1 && halfStar) {
      stars += '<span class="user-star half">★</span>';
    } else {
      stars += '<span class="user-star">★</span>';
    }
  }
  return stars;
}

// Update comment count
function updateCommentCount(total) {
  document.querySelector('.comment-count').textContent = `(${total} comments)`;
}

// Add comment interactions
function addCommentInteractions() {
  document.querySelectorAll('.like-btn, .dislike-btn').forEach(btn => {
    btn.addEventListener('click', async function () {
      const commentId = this.getAttribute('data-comment-id');
      const action = this.classList.contains('like-btn') ? 'like' : 'dislike';
      await handleVote(commentId, action);
    });
  });

  document.querySelectorAll('.reply-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const commentId = this.getAttribute('data-comment-id');
      showReplyInput(this, commentId);
    });
  });

  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      sortType = this.getAttribute('data-sort');
      currentPage = 1;
      fetchComments();
    });
  });

  document.querySelector('.send-btn').addEventListener('click', async function () {
    const content = document.querySelector('.write-comment').value;
    if (content.trim()) {
      await addComment(content);
      document.querySelector('.write-comment').value = '';
    } else {
      alert('Comment content cannot be empty');
    }
  });

  const stars = document.querySelectorAll('.my-star');
  const ratingInput = document.querySelector('.my-rating-input');
  stars.forEach(star => {
    star.addEventListener('click', function () {
      const value = parseInt(this.getAttribute('data-value'));
      ratingInput.value = value;
      resetStars();
      for (let i = 0; i < value; i++) {
        stars[i].classList.add('active');
      }
      submitRating(value);
    });
  });
}

// Submit rating
async function submitRating(score) {
  try {
    const response = await fetch('/api/rating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        itemId: parseInt(itemId),
        score: parseInt(score)
      }),
      credentials: 'include'
    });
    const result = await response.json();
    if (result.code === 200) {
      console.log('Rating submitted successfully');
      fetchItem(); // 更新 Item 信息
      fetchUserRating(); // 更新用户评分
    } else {
      alert('Failed to submit rating: ' + result.message);
    }
  } catch (error) {
    console.error('Failed to submit rating:', error);
    alert('Network error');
  }
}

// Add comment
async function addComment(content) {
  try {
    const response = await fetch(`/api/comment/${itemId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: content }),
      credentials: 'include'
    });
    const result = await response.json();
    if (result.code === 200) {
      currentPage = 1;
      fetchComments();
    } else {
      alert('Failed to add comment: ' + result.message);
    }
  } catch (error) {
    console.error('Failed to add comment:', error);
    alert('Network error');
  }
}

// Reply to comment
function showReplyInput(replyBtn, parentCommentId) {
  const commentContent = replyBtn.closest('.comment-content');
  const replyInput = document.createElement('input');
  replyInput.type = 'text';
  replyInput.className = 'reply-input';
  replyInput.placeholder = 'Enter reply...';
  const submitReply = document.createElement('button');
  submitReply.textContent = 'Send';
  submitReply.className = 'submit-reply';
  replyBtn.style.display = 'none';
  commentContent.appendChild(replyInput);
  commentContent.appendChild(submitReply);

  submitReply.addEventListener('click', async () => {
    const content = replyInput.value.trim();
    if (content) {
      await replyComment(parentCommentId, content);
      replyBtn.style.display = 'block';
      commentContent.removeChild(replyInput);
      commentContent.removeChild(submitReply);
    } else {
      alert('Reply content cannot be empty');
    }
  });
}

async function replyComment(parentCommentId, content) {
  try {
    const response = await fetch('/api/comment/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ parentCommentId: parseInt(parentCommentId), content: content, itemId: parseInt(itemId) }),
      credentials: 'include'
    });
    const result = await response.json();
    if (result.code === 200) {
      const commentDiv = document.querySelector(`.comment[data-comment-id="${parentCommentId}"]`);
      if (commentDiv) {
        const repliesContainer = commentDiv.querySelector('.replies');
        await loadReplies(parentCommentId, repliesContainer);
        repliesContainer.style.display = 'block';
      }
      currentPage = 1;
      fetchComments();
    } else {
      alert('Failed to reply to comment: ' + result.message);
    }
  } catch (error) {
    console.error('Failed to reply to comment:', error);
    alert('Network error');
  }
}

// Like/Dislike
async function handleVote(commentId, action) {
  try {
    const apiUrl = `/api/comment/${action}/${commentId}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      credentials: 'include'
    });
    const result = await response.json();
    if (result.code === 200) {
      fetchComments();
    } else {
      alert(`${action === 'like' ? 'Like' : 'Dislike'} failed: ${result.message}`);
    }
  } catch (error) {
    console.error(`${action} failed:`, error);
    alert('Network error');
  }
}

// Initialize page with share functionality
document.addEventListener('DOMContentLoaded', () => {
  fetchItem();
  fetchComments();
  fetchUserRating(); // 加载用户评分

  document.querySelector('.filter-btn[data-sort="time"]').classList.add('active');

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