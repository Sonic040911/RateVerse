const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const submitBtn = document.querySelector(".submit-btn");
const imageUploadInput = document.getElementById("image-upload"); // 新增：图片上传输入框
let currentDraftId = null;
let items = [];
let isSubmitting = false; // 新增：提交标志位

// ==================== DOM Elements ====================
const titleInput = document.getElementById("topic");
const descInput = document.getElementById("list-description");
const sidebar = document.querySelector(".ratings");

// ==================== Modal Controls ====================
openModalBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    document.getElementById("object-name").focus();
});

closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// ==================== Initialization Validation ====================
const urlParams = new URLSearchParams(window.location.search);
currentDraftId = urlParams.get('draftId');
if (!currentDraftId) {
    alert("Invalid draft ID, redirecting to homepage...");
    window.location.href = "Rating.html";
}

// ==================== Status Notifications ====================
const saveStatus = document.createElement("div");
saveStatus.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  opacity: 0;
  transition: opacity 0.3s;
`;
document.body.appendChild(saveStatus);

function showSaveStatus(message, isError = false) {
    saveStatus.textContent = `🔄 ${message}`;
    saveStatus.style.color = isError ? "#ff4444" : "#4CAF50";
    saveStatus.style.opacity = "1";
    setTimeout(() => saveStatus.style.opacity = "0", 2000);
}

// ==================== Core Functionality ====================
async function loadDraftContent() {
    try {
        // 1. Load draft metadata
        const draftRes = await fetch(`/api/drafts/${currentDraftId}`, {
            credentials: "include"
        });
        if (!draftRes.ok) throw new Error("Failed to load draft");

        const draftData = await draftRes.json();
        if (draftData.flag) {
            titleInput.value = draftData.data.title || "";
            descInput.value = draftData.data.description || "";
        }

        // 2. Load rating items (max 100 per page)
        const itemsRes = await fetch(`/api/drafts/item/${currentDraftId}/100/1`, {
            credentials: "include"
        });

        if (!itemsRes.ok) throw new Error("Failed to load rating items");

        const itemsData = await itemsRes.json();
        console.log(itemsData);

        items = itemsData.flag && itemsData.data && Array.isArray(itemsData.data.data)
            ? itemsData.data.data.map(item => ({
                id: item.draftItemId,
                name: item.name,
                description: item.description,
                imageUrl: item.imageUrl // 新增：加载图片 URL
            }))
            : [];

        renderItems();
    } catch (error) {
        showSaveStatus(`Initialization failed: ${error.message}`, true);
        console.error("Initialization error:", error);
    }
}

function renderItems() {
    sidebar.innerHTML = items.length > 0 ? "" : `<p class="empty-tip">No rating items yet, click the button above to add</p>`;
    items.forEach(item => {
        const itemHTML = `
            <div class="rating-card" data-item-id="${item.id}">
                <div class="rating-info">
                    <strong>${item.name}</strong>
                    <p>${item.description || "No description"}</p>
                    <button class="delete-item">🗑️ Delete</button>
                </div>
                <img src="${item.imageUrl || 'static/assets/default_image.png'}" class="rating-image">
            </div>
        `;
        sidebar.insertAdjacentHTML("beforeend", itemHTML);
    });
}

// ==================== Auto-Save ====================
async function autoSaveDraft() {
    try {
        const res = await fetch(`/api/drafts/${currentDraftId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: titleInput.value,
                description: descInput.value
            }),
            credentials: "include"
        });
        const result = await res.json();
        return result.flag;
    } catch (error) {
        return false;
    }
}

titleInput.addEventListener("blur", () => autoSaveDraft());
descInput.addEventListener("blur", () => autoSaveDraft());

// ==================== Page Lifecycle ====================
window.addEventListener("DOMContentLoaded", async () => {
    await loadDraftContent();

    window.addEventListener("beforeunload", async (e) => {
        if (isSubmitting) return; // 如果是提交操作，不触发保存提示
        if (items.length > 0 || titleInput.value) {
            e.preventDefault();
            e.returnValue = "";
            await autoSaveDraft();
        }
    });
});

// ==================== Rating Item Operations ====================
document.querySelector(".ratings").addEventListener("click", async (e) => {
    const deleteBtn = e.target.closest('.delete-item');
    if (!deleteBtn) return;

    const itemCard = deleteBtn.closest('[data-item-id]');
    const itemId = itemCard?.dataset?.itemId;

    if (!itemId || !confirm("Confirm deletion of this rating item?")) return;

    try {
        showSaveStatus("Deleting...");
        const res = await fetch(`/api/drafts/item/${itemId}`, {
            method: "DELETE",
            credentials: "include"
        });
        const result = await res.json();

        if (result.flag) {
            items = items.filter(i => i.id.toString() !== itemId);
            itemCard.remove();
            showSaveStatus("Deleted successfully");
        } else {
            showSaveStatus(`Deletion failed: ${result.message}`, true);
        }
    } catch (error) {
        showSaveStatus("Deletion request failed", true);
    }
});

// ==================== Image Upload ====================
document.querySelector('.cover-option:last-child').addEventListener('click', () => {
    imageUploadInput.click(); // 触发文件选择
});

imageUploadInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
        const res = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        const result = await res.json();
        if (result.flag) {
            document.getElementById('image-url').value = result.data; // 存储图片 URL
            showSaveStatus('Image uploaded successfully');
        } else {
            showSaveStatus(`Image upload failed: ${result.message}`, true);
        }
    } catch (error) {
        showSaveStatus('Image upload request failed', true);
    }
});

// ==================== Add Rating Item ====================
document.querySelector(".modal-content .save").addEventListener("click", async () => {
    const name = document.getElementById("object-name").value.trim();
    const desc = document.getElementById("object-description").value.trim();
    const imageUrl = document.getElementById("image-url").value; // 获取图片 URL

    if (!name) {
        showSaveStatus("Name cannot be empty", true);
        return;
    }

    try {
        showSaveStatus("Adding...");
        const res = await fetch(`/api/drafts/item/${currentDraftId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description: desc, imageUrl }), // 添加 imageUrl
            credentials: "include"
        });
        const result = await res.json();

        if (result.flag) {
            items.unshift({
                id: result.data.draftItemId,
                name: result.data.name,
                description: result.data.description,
                imageUrl: result.data.imageUrl // 存储图片 URL
            });
            renderItems();
            modal.style.display = "none";
            document.getElementById("object-name").value = "";
            document.getElementById("object-description").value = "";
            document.getElementById("image-url").value = ""; // 清空图片 URL
            imageUploadInput.value = ""; // 清空文件输入框
            showSaveStatus("Added successfully");
        } else {
            showSaveStatus(`Addition failed: ${result.message}`, true);
        }
    } catch (error) {
        showSaveStatus("Addition failed", true);
    }
});

// ==================== Publish Function ====================
submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    isSubmitting = true; // 设置提交标志位

    showSaveStatus("Preparing to publish...");
    if (!await autoSaveDraft()) {
        isSubmitting = false;
        return;
    }

    if (items.length === 0) {
        showSaveStatus("At least one rating item required", true);
        isSubmitting = false;
        return;
    }

    try {
        showSaveStatus("Publishing...");
        const res = await fetch(`/api/drafts/publish/${currentDraftId}`, {
            method: "POST",
            credentials: "include"
        });
        const result = await res.json();

        if (result.flag) {
            window.location.href = `Rating.html`;
        } else {
            showSaveStatus(`Publish failed: ${result.message}`, true);
            isSubmitting = false;
        }
    } catch (error) {
        showSaveStatus("Publish request failed", true);
        isSubmitting = false;
    }
});