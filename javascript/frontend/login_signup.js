function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    var form = $_GET("form");
    var status = $_GET("status");
    var msg = $_GET("msg");

    if (form != null && status != null && msg != null) {
        if (form === "login") {
            loginForm.classList.remove("form--hidden");
            createAccountForm.classList.add("form--hidden");
            setFormMessage(loginForm, status, msg);
        }else if (form === "register") {
            loginForm.classList.add("form--hidden");
            createAccountForm.classList.remove("form--hidden");
            setFormMessage(createAccountForm, status, msg);
        }
    }

    /*
    loginForm.addEventListener("submit", e => {
        
    });
    */

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            // Validate E-Mail
            if (e.target.id === "loginEmail" && !validateEmail(e.target.value)) {
                setInputError(inputElement, "Please enter a valid e-mail address");
            }
            
             // Validate Password
            if (e.target.id === "loginPassword" && !validatePassword(e.target.value)) {
                setInputError(inputElement, "Password must be at least 8 characters long");
            }

            // Validate username
            if (e.target.id === "signupUsername"&& !validateUsername(e.target.value)) {
                setInputError(inputElement, "Username must ba at least 3 characters long");
            }

            // Validate E-Mail
            if (e.target.id === "signupEmail" && !validateEmail(e.target.value)) {
                setInputError(inputElement, "Please enter a valid e-mail address");
            }

            // Validate Password
            if (e.target.id === "signupPassword" && !validatePassword(e.target.value)) {
                setInputError(inputElement, "Password must be at least 8 characters long");
            }

            // Validate Matching Password
            if (e.target.id === "signupMatchingPassword" && !validateMatchingPassword(e.target.value, document.getElementById("signupPassword").value)) {
                setInputError(inputElement, "Password does not match");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});