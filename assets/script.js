document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;
      const errorText = document.getElementById("signup-error");

      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        alert("Signup successful! Redirecting...");
        window.location.href = "index.html";
      } catch (error) {
        console.error(error);
        errorText.textContent = error.message;
      }
    });
  }
});
