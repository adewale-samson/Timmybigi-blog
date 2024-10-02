// let postCount = 0;

// document.getElementById("create-post-button").addEventListener("click", function() {
//     const postContent = document.getElementById("post-content").value;
//     const postImage = document.getElementById("post-image").files[0];

//     if (postContent || postImage) {
//         const postContainer = document.getElementById("posts-container");
//         const postElement = document.createElement("div");
//         postElement.className = "post";

//         let postHTML = `<p>${postContent}</p>`;

//         if (postImage) {
//             const reader = new FileReader();
//             reader.onload = function(e) {
//                 postHTML += `<img src="${e.target.result}" alt="Uploaded Image" style="max-width: 100%; height: auto;">`;
//                 postHTML += generatePostOptions();
//                 postElement.innerHTML = postHTML;
//                 postContainer.appendChild(postElement);

//                 resetInputs();
//                 updateNotificationCount();
//                 setupPostOptions(postElement);
//             };
//             reader.readAsDataURL(postImage);
//         } else {
//             postHTML += generatePostOptions();
//             postElement.innerHTML = postHTML;
//             postContainer.appendChild(postElement);

//             resetInputs();
//             updateNotificationCount();
//             setupPostOptions(postElement);
//         }
//     } else {
//         alert("Please enter some content or upload an image!");
//      }
// });

// function generatePostOptions() {
//     return `
//         <div class="kebab-menu">⋮</div>
//         <div class="kebab-menu-options">
//             <button class="edit-button">Edit</button>
//             <button class="delete-button">Delete</button>
//         </div>
//         <div class="comment-section">
//             <input type="text" class="comment-input" placeholder="Add a comment...">
//             <button class="comment-button">Comment</button>
//             <div class="comments-list"></div>
//         </div>
//     `;
// }

// function resetInputs() {
//     document.getElementById("post-content").value = '';
//     document.getElementById("post-image").value = '';
// }

// function updateNotificationCount() {
//     postCount++;
//     document.getElementById("notification-count").textContent = postCount;
// }

// function setupPostOptions(postElement) {
//     const kebabMenu = postElement.querySelector(".kebab-menu");
//     const kebabOptions = postElement.querySelector(".kebab-menu-options");

//     kebabMenu.addEventListener("click", function() {
//         kebabOptions.style.display = kebabOptions.style.display === "block" ? "none" : "block";
//     });

//     const editButton = postElement.querySelector(".edit-button");
//     const deleteButton = postElement.querySelector(".delete-button");
    
//     editButton.addEventListener("click", function() {
//         const postText = postElement.querySelector("p").innerText;
//         document.getElementById("post-content").value = postText;
//         postElement.remove();
//         postCount--;
//         document.getElementById("notification-count").textContent = postCount;
//     });

//     deleteButton.addEventListener("click", function() {
//         postElement.remove();
//         postCount--;
//         document.getElementById("notification-count").textContent = postCount;
//     });

//     const commentButton = postElement.querySelector(".comment-button");
//     commentButton.addEventListener("click", function() {
//         const commentInput = postElement.querySelector(".comment-input");
//         const commentText = commentInput.value;
//         if (commentText) {
//             const commentsList = postElement.querySelector(".comments-list");
//             const commentElement = document.createElement("div");
//             commentElement.className = "comment";
//             commentElement.textContent = commentText;
//             commentsList.appendChild(commentElement);
//             commentInput.value = ''; // Clear the comment input
//         } else {
//             alert("Please enter a comment before submitting!");
//         }
//     });
// }





document.addEventListener('DOMContentLoaded', () => {
    const createPostButton = document.getElementById("create-post-button");
    const postContentInput = document.getElementById("post-content");
    const postImageInput = document.getElementById("post-image");
    const postsContainer = document.getElementById("posts-container");
    const notificationCount = document.getElementById("notification-count");

    let postCount = 0;

    const user = JSON.parse(sessionStorage.getItem("user"));
    console.log(user);
    
    // Fetch and display existing posts on page load
    fetchPosts();

    // Event listener for creating a new post
    createPostButton.addEventListener("click", function () {
        const content = postContentInput.value.trim();
        const imageFile = postImageInput.files[0];
        console.log('content', content, 'image', imageFile)
        if (!content && !imageFile) {
            alert("Please enter some content or upload an image!");
            return;
        }

        // Prepare the form data
        const formData = new FormData();
        formData.append('content', content);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
        // console.log(formData);
        

        // Send POST request to create a new post
        fetch(`http://localhost:5000/api/posts/add/${user}`, { // Replace with your API endpoint
            method: 'POST',
            body: formData
        })
        .then((response) => {
            console.log(response);
            
            if (!response.ok) {
              return response.json().then((error) => {
                console.error('Error from server:', error);
              });
            }
            return response.json()
          })

          
        .then(data => {
            // Assuming the API returns the created post with an 'id'
            console.log(data);
            
            // appendPostToUI(data.post);
            appendPostToUI(data);
            resetInputs();
            updateNotificationCount();
        })
        .catch(error => {
            console.error('Error creating post:', error);
            alert('Failed to create post.');
        });
    });

    /**
     * Fetch posts from the API and display them
     */
    function fetchPosts() {
        fetch('http://localhost:5000/api/posts/post') // Replace with your API endpoint
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                
                const posts = data; // Assuming the API returns { posts: [...] }
                posts.forEach(post => {
                    appendPostToUI(post);
                    postCount++;
                });
                notificationCount.textContent = postCount;
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                postsContainer.innerHTML = '<p>Failed to load posts.</p>';
            });
    }

    /**
     * Append a single post to the UI
     * @param {Object} post - The post object containing id, content, imageUrl, etc.
     */
    function appendPostToUI(post) {
        const postElement = document.createElement("div");
        postElement.className = "post";
        postElement.setAttribute('data-post-id', post._id); // Store post ID for future reference
        postElement.setAttribute('data-user-id', post.userId); // Store post ID for future reference

        let postHTML = `<p>${escapeHTML(post.content)}</p>`;
        console.log(post)
        if (post.image) {
            postHTML += `<img src="${post.image}" alt="Uploaded Image" style="max-width: 30%; height: auto;">`;
        }

        postHTML += generatePostOptions();
        postElement.innerHTML = postHTML;
        // Render existing comments
        const commentsList = document.createElement("div");
        commentsList.className = "comments-list";
        post.comments.forEach(comment => {
            const commentElement = document.createElement("div");
            commentElement.className = "comment";
            commentElement.textContent = comment.comment; // Assuming each comment has a 'text' property
            commentsList.appendChild(commentElement);
        });

        postElement.appendChild(commentsList);
        postsContainer.prepend(postElement); // Add the newest post at the top

        setupPostOptions(postElement, post._id, post.content, post.imageUrl);
    }

    /**
     * Generate HTML for post options (kebab menu, edit, delete, comments)
     */
    function generatePostOptions() {
        return `
            <div class="kebab-menu">⋮
                <div class="kebab-menu-options">
                    <button class="edit-button">Edit</button>
                    <button class="delete-button">Delete</button>
                </div>
            </div>
            <div class="comment-section">
                <input type="text" class="comment-input" placeholder="Add a comment...">
                <button class="comment-button">Comment</button>
                <div class="comments-list"></div>
            </div>
        `;
    }

    /**
     * Reset the input fields after creating a post
     */
    function resetInputs() {
        postContentInput.value = '';
        postImageInput.value = '';
    }

    /**
     * Update the notification count when a new post is added
     */
    function updateNotificationCount() {
        postCount++;
        notificationCount.textContent = postCount;
    }

    /**
     * Setup event listeners for post options (edit, delete, comment)
     * @param {HTMLElement} postElement - The post DOM element
     * @param {string} postId - The unique ID of the post
     * @param {string} content - The content of the post
     * @param {string} imageUrl - The image URL of the post (if any)
     */
    function setupPostOptions(postElement, postId, content, imageUrl) {
        const kebabMenu = postElement.querySelector(".kebab-menu");
        const kebabOptions = postElement.querySelector(".kebab-menu-options");
        const editButton = postElement.querySelector(".edit-button");
        const deleteButton = postElement.querySelector(".delete-button");
        const commentButton = postElement.querySelector(".comment-button");

        // Toggle kebab menu options
        kebabMenu.addEventListener("click", function (e) {
            e.stopPropagation(); // Prevent event bubbling
            kebabOptions.style.display = kebabOptions.style.display === "block" ? "none" : "block";
        });

        // Hide kebab options when clicking outside
        document.addEventListener("click", function () {
            kebabOptions.style.display = "none";
        });

        // Edit post functionality
        editButton.addEventListener("click", function () {
            // Create input field and update button
        const updateContainer = document.createElement("div");
        updateContainer.className = "update-container";
        updateContainer.innerHTML = `
            <input type="text" class="update-input" value="${escapeHTML(content)}" />
            <button class="update-button">Update</button>
        `;
        postElement.insertBefore(updateContainer, postElement.firstChild);
            // Handle the update logic when the button is clicked
            const updateButton = updateContainer.querySelector(".update-button");
        updateButton.addEventListener("click", function () {
            const updatedContent = updateContainer.querySelector(".update-input").value.trim();
            if (!updatedContent) {
                alert("Please enter some content!");
                return;
            }

            // Prepare the updated data
            const updatedData = {
                content: updatedContent,
            };
            const postId = postElement.getAttribute('data-post-id');
            const userId = postElement.getAttribute('data-user-id');

            // PUT request to update the post
            fetch(`http://localhost:5000/api/posts/${postId}/${userId}`, { // Adjust the endpoint as needed
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update post');
                }
                return response.json();
            })
            .then(data => {
                // UI update with the new content
                postElement.querySelector('p').textContent = escapeHTML(updatedContent);
                updateContainer.remove(); 
            })
            .catch(error => {
                console.error('Error updating post:', error);
                alert('Failed to update post.');
            });
        });

            postCount--;
            notificationCount.textContent = postCount;
        });

        // Delete post functionality
        deleteButton.addEventListener("click", function () {
            if (confirm("Are you sure you want to delete this post?")) {

                const postIdToDelete = postElement.getAttribute('data-post-id');
                const userId = postElement.getAttribute('data-user-id');
                console.log(postIdToDelete);
                console.log(userId);
                // fetch(`http://localhost:5500/api/posts/${postId}`, { // Replace with your API endpoint
                fetch(`http://localhost:5000/api/posts/${postIdToDelete}/${userId}`, { 
                    method: 'DELETE'
                })
                .then(response => {
                    console.log(response);
                    
                    if (!response.ok) {
                        throw new Error('Failed to delete post');
                    }
                    return response.json();
                })
                .then(data => {
                    // Remove the post from the UI
                    postElement.remove();
                    postCount--;
                    notificationCount.textContent = postCount;
                })
                .catch(error => {
                    console.error('Error deleting post:', error);
                    alert('Failed to delete post.');
                });
            }
        });

        // Comment functionality
        commentButton.addEventListener("click", function () {
            const commentInput = postElement.querySelector(".comment-input");
            const commentText = commentInput.value.trim();
            const postId = postElement.getAttribute('data-post-id');
            const userId = postElement.getAttribute('data-user-id');
            if (commentText) {
                const commentsList = postElement.querySelector(".comments-list");
                const commentElement = document.createElement("div");
                commentElement.className = "comment";
                commentElement.textContent = commentText;
                commentsList.appendChild(commentElement);
                commentInput.value = ''; // Clear the comment input

                fetch(`http://localhost:5000/api/posts/${postId}/${userId}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ comment: commentText })
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Comment added:', data);
                })
                .catch(error => {
                    console.error('Error adding comment:', error);
                });
            } else {
                alert("Please enter a comment before submitting!");
            }
        });
    }

    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} unsafe - The string to escape
     * @returns {string} - The escaped string
     */
    function escapeHTML(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
