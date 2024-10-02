const container = document.getElementById("container");
const registerbtn = document.getElementById("register");
const loginbtn = document.getElementById("login");
const signInForm = document.querySelector(".sign-in form");

registerbtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginbtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Function to handle the form submission
signInForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  // Capture form data
  const email = signInForm.querySelector('input[type="text"]').value;
  const password = signInForm.querySelector('input[type="password"]').value;

  console.log(email, password);

  // Create a data object
  const data = {
    email: email,
    password: password,
  };

  try {
    // Send the form data to the server via a POST request
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    // console.log(response)
    // Check if the response is successful
    if (response.ok) {
      const result = await response.json();
      console.log(result);
      sessionStorage.setItem("user", JSON.stringify(result.user._id));
      
      console.log("Login successful:", result);

      // Redirect to another page (e.g., dashboard)
      window.location.href = "Blog3.html";
    } else {
      // Handle errors (e.g., incorrect email or password)
      const error = await response.json();
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  } catch (error) {
    console.error("Error occurred during login:", error);
    alert("An error occurred. Please try again later.");
  }
});