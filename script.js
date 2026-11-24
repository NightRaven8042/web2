
document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. DOM INTERACTION - MOBILE NAVIGATION
    // =====================================

    const menuToggle = document.querySelector("#menu-toggle");
    const navMenu = document.querySelector("#nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            const isExpanded =
                menuToggle.getAttribute("aria-expanded") === "true";

            menuToggle.setAttribute("aria-expanded", String(!isExpanded));
            navMenu.classList.toggle("active");

        });
    }

    // =====================================
    // 2. ACCESSIBLE CONTACT FORM VALIDATION
    // =====================================

    const form = document.querySelector("#contact-form");

    if (form) {

        const fields = [
            {
                id: "name",
                message: "Please enter your name."
            },
            {
                id: "email",
                message: "Please enter a valid email address."
            },
            {
                id: "message",
                message: "Please enter a message."
            }
        ];

        const status = document.querySelector("#form-status");

        // DISPLAY ERROR MESSAGE
        function showError(field, message) {

            const input = document.getElementById(field.id);
            const error = document.getElementById(`${field.id}-error`);

            if (!input || !error) return;

            input.setAttribute("aria-invalid", "true");
            error.textContent = message;
            error.hidden = false;
        }

        // CLEAR ERROR MESSAGE
        function clearError(field) {

            const input = document.getElementById(field.id);
            const error = document.getElementById(`${field.id}-error`);

            if (!input || !error) return;

            input.removeAttribute("aria-invalid");
            error.textContent = "";
            error.hidden = true;
        }

        // VALIDATE FIELDS WHILE TYPING
        fields.forEach((field) => {

            const input = document.getElementById(field.id);

            if (!input) return;

            input.addEventListener("input", () => {

                if (input.value.trim() && input.checkValidity()) {
                    clearError(field);
                }

            });

        });

        // FORM SUBMISSION
        form.addEventListener("submit", (event) => {

            event.preventDefault();

            let firstInvalid = null;
            let invalidCount = 0;

            fields.forEach((field) => {

                const input = document.getElementById(field.id);

                if (!input) return;

                let message = "";

                if (!input.value.trim()) {

                    message = field.message;

                } else if (!input.checkValidity()) {

                    message = field.id === "email"
                        ? "Please enter a valid email address."
                        : "Please check this field.";

                }

                if (message) {

                    showError(field, message);

                    invalidCount++;

                    if (!firstInvalid) {
                        firstInvalid = input;
                    }

                } else {

                    clearError(field);

                }

            });

            // DISPLAY FORM ERRORS
            if (status) {

                status.hidden = false;
                status.className = "form-status";

                if (invalidCount > 0) {

                    status.classList.add("error");

                    status.textContent =
                        `There are ${invalidCount} errors. Please review the highlighted fields.`;

                    firstInvalid.focus();

                    return;
                }

                // SUCCESS MESSAGE
                status.classList.add("success");

                status.textContent =
                    "Your form passed validation! Connect a form service to send your message.";

                form.reset();

            }

        });

    }

    // =====================================
    // 3. BONUS: GITHUB API FETCH
    // =====================================

    const githubContainer = document.querySelector("#github-profile");

    if (githubContainer) {

        const username = "octocat";

        fetch(`https://api.github.com/users/${username}`)
            .then(response => {

                if (!response.ok) {
                    throw new Error("Unable to load GitHub profile.");
                }

                return response.json();

            })
            .then(data => {

                githubContainer.innerHTML = `
                    <img src="${data.avatar_url}"
                         alt="GitHub profile avatar"
                         width="100">

                    <h3>${data.name || data.login}</h3>

                    <p>${data.bio || "No bio available."}</p>

                    <p>Public repositories: ${data.public_repos}</p>

                    <a href="${data.html_url}"
                       target="_blank"
                       rel="noopener noreferrer">
                       View GitHub Profile
                    </a>
                `;

            })
            .catch(error => {

                githubContainer.textContent =
                    "GitHub profile could not be loaded. Please try again later.";

                console.error(error);

            });

    }

});