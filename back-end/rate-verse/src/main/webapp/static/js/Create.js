const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const submitBtn = document.querySelector(".submit-btn");
const imageUploadInput = document.getElementById("image-upload");
let currentDraftId = null;
let items = [];
let isSubmitting = false;
let currentEditItemId = null;

// ==================== DOM Elements ====================
const titleInput = document.getElementById("topic");
const descInput = document.getElementById("list-description");
const sidebar = document.querySelector(".ratings");
const objectNameInput = document.getElementById("object-name");
const objectDescInput = document.getElementById("object-description");
const coverPreview = document.querySelector(".cover-preview"); // 图片预览容器
const imageUrlInput = document.getElementById("image-url");

// ==================== Word Count Limits ====================
const LIMITS = {
    topicTitle: 50,
    topicDesc: 200,
    itemName: 50,
    itemDesc: 200
};

// Add maxlength attributes and word count displays
function setupInputLimits() {
    titleInput.setAttribute("maxlength", LIMITS.topicTitle);
    const titleCount = document.createElement("div");
    titleCount.className = "word-count";
    titleCount.style.cssText = "font-size: 0.8rem; color: #666; margin-top: 5px;";
    titleInput.parentElement.appendChild(titleCount);
    updateWordCount(titleInput, titleCount, LIMITS.topicTitle);

    descInput.setAttribute("maxlength", LIMITS.topicDesc);
    const descCount = document.createElement("div");
    descCount.className = "word-count";
    descCount.style.cssText = "font-size: 0.8rem; color: #666; margin-top: 5px;";
    descInput.parentElement.appendChild(descCount);
    updateWordCount(descInput, descCount, LIMITS.topicDesc);

    objectNameInput.setAttribute("maxlength", LIMITS.itemName);
    const nameCount = document.createElement("div");
    nameCount.className = "word-count";
    nameCount.style.cssText = "font-size: 0.8rem; color: #666; margin-top: 5px;";
    objectNameInput.parentElement.appendChild(nameCount);
    updateWordCount(objectNameInput, nameCount, LIMITS.itemName);

    objectDescInput.setAttribute("maxlength", LIMITS.itemDesc);
    const objDescCount = document.createElement("div");
    objDescCount.className = "word-count";
    objDescCount.style.cssText = "font-size: 0.8rem; color: #666; margin-top: 5px;";
    objectDescInput.parentElement.appendChild(objDescCount);
    updateWordCount(objectDescInput, objDescCount, LIMITS.itemDesc);
}

function updateWordCount(input, countElement, maxLength) {
    const update = () => {
        const length = input.value.length;
        countElement.textContent = `${length}/${maxLength} characters`;
        countElement.style.color = length > maxLength * 0.9 ? "#ff4444" : "#666";
    };
    update();
    input.addEventListener("input", update);
}

function validateInputs() {
    if (titleInput.value.length > LIMITS.topicTitle) {
        showSaveStatus(`Topic title exceeds ${LIMITS.topicTitle} characters`, true);
        return false;
    }
    if (descInput.value.length > LIMITS.topicDesc) {
        showSaveStatus(`Topic description exceeds ${LIMITS.topicDesc} characters`, true);
        return false;
    }
    return true;
}

// ==================== Modal Controls ====================
openModalBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    document.querySelector(".modal-title").textContent = "Add Object";
    currentEditItemId = null;
    objectNameInput.value = "";
    objectDescInput.value = "";
    imageUrlInput.value = "";
    imageUploadInput.value = "";
    updateCoverPreview(); // 清空预览
    objectNameInput.focus();
});

closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.querySelector(".modal-title").textContent = "Add Object";
    currentEditItemId = null;
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
        document.querySelector(".modal-title").textContent = "Add Object";
        currentEditItemId = null;
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
        const draftRes = await fetch(`/api/drafts/${currentDraftId}`, {
            credentials: "include"
        });
        if (!draftRes.ok) throw new Error("Failed to load draft");

        const draftData = await draftRes.json();
        if (draftData.flag) {
            titleInput.value = draftData.data.title || "";
            descInput.value = draftData.data.description || "";
            updateWordCount(titleInput, titleInput.parentElement.querySelector(".word-count"), LIMITS.topicTitle);
            updateWordCount(descInput, descInput.parentElement.querySelector(".word-count"), LIMITS.topicDesc);
        }

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
                imageUrl: item.imageUrl
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
                    <div class="rating-actions">
                        <button class="edit-item">✏️ Edit</button>
                        <button class="delete-item">🗑️ Delete</button>
                    </div>
                </div>
                <img src="${item.imageUrl || 'static/assets/default_image.png'}" class="rating-image">
            </div>
        `;
        sidebar.insertAdjacentHTML("beforeend", itemHTML);
    });
}

// ==================== Auto-Save ====================
async function autoSaveDraft() {
    if (!validateInputs()) return false;
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
        if (result.flag) {
            updateWordCount(titleInput, titleInput.parentElement.querySelector(".word-count"), LIMITS.topicTitle);
            updateWordCount(descInput, descInput.parentElement.querySelector(".word-count"), LIMITS.topicDesc);
        }
        return result.flag;
    } catch (error) {
        return false;
    }
}

titleInput.addEventListener("blur", () => autoSaveDraft());
descInput.addEventListener("blur", () => autoSaveDraft());

// ==================== Page Lifecycle ====================
window.addEventListener("DOMContentLoaded", async () => {
    setupInputLimits();
    await loadDraftContent();

    window.addEventListener("beforeunload", async (e) => {
        if (isSubmitting) return;
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
    const editBtn = e.target.closest('.edit-item');

    if (deleteBtn) {
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
    } else if (editBtn) {
        const itemCard = editBtn.closest('[data-item-id]');
        const itemId = itemCard?.dataset?.itemId;
        const item = items.find(i => i.id.toString() === itemId);

        if (!item) return;

        currentEditItemId = itemId;
        modal.style.display = "flex";
        objectNameInput.value = item.name;
        objectDescInput.value = item.description || "";
        imageUrlInput.value = item.imageUrl || "";
        updateCoverPreview(); // 显示现有图片
        document.querySelector(".modal-title").textContent = "Edit Object";
        objectNameInput.focus();
    }
});

// ==================== Image Upload and Preview ====================
function updateCoverPreview() {
    const url = imageUrlInput.value.trim();
    coverPreview.innerHTML = url ? `<img src="${url}" alt="Cover preview">` : '<div>No image selected</div>';
}

document.querySelector('.cover-option:last-child').addEventListener('click', () => {
    imageUploadInput.click();
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
            credentials: "include"
        });
        const result = await res.json();
        if (result.flag) {
            imageUrlInput.value = result.data;
            updateCoverPreview(); // 更新预览
            showSaveStatus('Image uploaded successfully');
        } else {
            showSaveStatus(`Image upload failed: ${result.message}`, true);
        }
    } catch (error) {
        showSaveStatus('Image upload request failed', true);
    }
});

// ==================== Add/Edit Rating Item ====================
document.querySelector(".modal-content .save").addEventListener("click", async () => {
    const name = objectNameInput.value.trim();
    const desc = objectDescInput.value.trim();
    const imageUrl = imageUrlInput.value;

    if (!name) {
        showSaveStatus("Name cannot be empty", true);
        return;
    }
    if (name.length > LIMITS.itemName) {
        showSaveStatus(`Item name exceeds ${LIMITS.itemName} characters`, true);
        return;
    }
    if (desc.length > LIMITS.itemDesc) {
        showSaveStatus(`Item description exceeds ${LIMITS.itemDesc} characters`, true);
        return;
    }

    try {
        showSaveStatus(currentEditItemId ? "Updating..." : "Adding...");
        const url = currentEditItemId
            ? `/api/drafts/item/${currentEditItemId}`
            : `/api/drafts/item/${currentDraftId}`;
        const method = currentEditItemId ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description: desc, imageUrl }),
            credentials: "include"
        });
        const result = await res.json();

        if (result.flag) {
            if (currentEditItemId) {
                const index = items.findIndex(i => i.id.toString() === currentEditItemId);
                if (index !== -1) {
                    items[index] = {
                        id: result.data.draftItemId,
                        name: result.data.name,
                        description: result.data.description,
                        imageUrl: result.data.imageUrl
                    };
                }
            } else {
                items.unshift({
                    id: result.data.draftItemId,
                    name: result.data.name,
                    description: result.data.description,
                    imageUrl: result.data.imageUrl
                });
            }
            renderItems();
            modal.style.display = "none";
            objectNameInput.value = "";
            objectDescInput.value = "";
            imageUrlInput.value = "";
            imageUploadInput.value = "";
            updateCoverPreview(); // 清空预览
            document.querySelector(".modal-title").textContent = "Add Object";
            currentEditItemId = null;
            showSaveStatus(currentEditItemId ? "Updated successfully" : "Added successfully");
        } else {
            showSaveStatus(`${currentEditItemId ? "Update" : "Addition"} failed: ${result.message}`, true);
        }
    } catch (error) {
        showSaveStatus(`${currentEditItemId ? "Update" : "Addition"} failed`, true);
    }
});

// ==================== Publish Function ====================
submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    isSubmitting = true;

    showSaveStatus("Preparing to publish...");
    if (!validateInputs()) {
        isSubmitting = false;
        return;
    }
    if (!await autoSaveDraft()) {
        isSubmitting = false;
        return;
    }
    if (items.length === 0) {
        showSaveStatus("At least one rating item required", true);
        isSubmitting = false;
        return;
    }
    for (const item of items) {
        if (item.name.length > LIMITS.itemName) {
            showSaveStatus(`Item "${item.name}" name exceeds ${LIMITS.itemName} characters`, true);
            isSubmitting = false;
            return;
        }
        if (item.description && item.description.length > LIMITS.itemDesc) {
            showSaveStatus(`Item "${item.name}" description exceeds ${LIMITS.itemDesc} characters`, true);
            isSubmitting = false;
            return;
        }
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