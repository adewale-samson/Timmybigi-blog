let postCount = 0;

document.getElementById("create-post-button").addEventListener("click", function() {
    const postContent = document.getElementById("post-content").value;
    const postImage = document.getElementById("post-image").files[0];

    if (postContent || postImage) {
        const postContainer = document.getElementById("posts-container");
        const postElement = document.createElement("div");
        postElement.className = "post";

        let postHTML = `<p>${postContent}</p>`;

        if (postImage) {
            const reader = new FileReader();
            reader.onload = function(e) {
                postHTML += `<img src="${e.target.result}" alt="Uploaded Image" style="max-width: 100%; height: auto;">`;
                postHTML += generatePostOptions();
                postElement.innerHTML = postHTML;
                postContainer.appendChild(postElement);

                resetInputs();
                updateNotificationCount();
                setupPostOptions(postElement);
            };
            reader.readAsDataURL(postImage);
        } else {
            postHTML += generatePostOptions();
            postElement.innerHTML = postHTML;
            postContainer.appendChild(postElement);

            resetInputs();
            updateNotificationCount();
            setupPostOptions(postElement);
        }
    } else {
        alert("Please enter some content or upload an image!");
     }
});

function generatePostOptions() {
    return `
        <div class="kebab-menu">⋮</div>
        <div class="kebab-menu-options">
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
        </div>
        <div class="comment-section">
            <input type="text" class="comment-input" placeholder="Add a comment...">
            <button class="comment-button">Comment</button>
            <div class="comments-list"></div>
        </div>
    `;
}

function resetInputs() {
    document.getElementById("post-content").value = '';
    document.getElementById("post-image").value = '';
}

function updateNotificationCount() {
    postCount++;
    document.getElementById("notification-count").textContent = postCount;
}

function setupPostOptions(postElement) {
    const kebabMenu = postElement.querySelector(".kebab-menu");
    const kebabOptions = postElement.querySelector(".kebab-menu-options");

    kebabMenu.addEventListener("click", function() {
        kebabOptions.style.display = kebabOptions.style.display === "block" ? "none" : "block";
    });

    const editButton = postElement.querySelector(".edit-button");
    const deleteButton = postElement.querySelector(".delete-button");
    
    editButton.addEventListener("click", function() {
        const postText = postElement.querySelector("p").innerText;
        document.getElementById("post-content").value = postText;
        postElement.remove();
        postCount--;
        document.getElementById("notification-count").textContent = postCount;
    });

    deleteButton.addEventListener("click", function() {
        postElement.remove();
        postCount--;
        document.getElementById("notification-count").textContent = postCount;
    });

    const commentButton = postElement.querySelector(".comment-button");
    commentButton.addEventListener("click", function() {
        const commentInput = postElement.querySelector(".comment-input");
        const commentText = commentInput.value;
        if (commentText) {
            const commentsList = postElement.querySelector(".comments-list");
            const commentElement = document.createElement("div");
            commentElement.className = "comment";
            commentElement.textContent = commentText;
            commentsList.appendChild(commentElement);
            commentInput.value = ''; // Clear the comment input
        } else {
            alert("Please enter a comment before submitting!");
        }
    });
}
