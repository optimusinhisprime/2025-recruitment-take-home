import LoginUserUsecase from "../usecases/loginUserUsecase.js";

/**
 * Controller class responsible for managing the Login page and its interactions.
 *
 * @export
 * @class LoginController
 */
export default class LoginController {
    /**
     * Creates an instance of LoginController.
     * @param {*} app
     * @memberof LoginController
     */
    constructor(app) {
        this.app = app;
        this.init();
    }
    /**
     * Initializes event listeners for click events on the login button.
     *
     * @memberof LoginController
     */
    init() {
        document.addEventListener("click", async (e) => {
            if (e.target.classList.contains("login-button")) {
                await this.handleLogin();
            }
        });

        // listen for input in email and password for validation
        document.addEventListener("input", async (e) => {
            await this.handleInputEvents(e);
        });
    }

    /**
     * Handles the login process when the login button is clicked.
     *
     * @memberof LoginController
     */
    async handleLogin() {
        try {
            const email = document.querySelector(
                'input[name="username"]'
            ).value;
            const password = document.querySelector(
                'input[name="password"]'
            ).value;

            if (!this.validateRequiredFields(email, password)) {
                return;
            }

            if (!this.validateEmail(email)) {
                this.showError("Please enter a valid email address");
                return;
            }

            if (!this.validatePassword(password)) {
                this.showError("Password must be at least 6 characters long");
                return;
            }

            const useCase = new LoginUserUsecase(this.app);
            await useCase.execute(email, password);

            console.log("Login successful:", result);
        } catch (error) {
            this.showError(error.message);
        }
    }

    /**
     * Validates that required fields are not empty
     * @param {string} email
     * @param {string} password
     * @returns {boolean}
     */
    validateRequiredFields(email, password) {
        if (!email || email.trim() === "") {
            this.showError("Email is required");
            this.highlightField('input[name="username"]', true);
            return false;
        }

        if (!password || password.trim() === "") {
            this.showError("Password is required");
            this.highlightField('input[name="password"]', true);
            return false;
        }

        // Remove error highlights if fields are filled
        this.highlightField('input[name="username"]', false);
        this.highlightField('input[name="password"]', false);

        return true;
    }

    /**
     * Validates email format
     * @param {string} email
     * @returns {boolean}
     */
    validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    /**
     * Validates password requirements
     * @param {string} password
     * @returns {boolean}
     */
    validatePassword(password) {
        return password && password.length >= 10;
    }

    highlightField(selector, hasError) {
        const field = document.querySelector(selector);
        if (field) {
            if (hasError) {
                field.style.borderColor = "#ff3b30";
                field.style.backgroundColor = "#fff5f5";
            } else {
                field.style.borderColor = "";
                field.style.backgroundColor = "";
            }
        }
    }

    showError(message) {
        this.app.toast
            .create({
                text: message,
                closeTimeout: 3000,
            })
            .open();
    }

    async handleInputEvents(e) {
        const { name, value } = e.target;

        // Clear error styling on input
        this.highlightField(`input[name="${name}"]`, false);

        switch (name) {
            case "username":
                // Real-time email validation
                if (value && !this.validateEmail(value)) {
                    this.highlightField('input[name="username"]', true);
                }
                break;

            case "password":
                // Real-time password validation
                if (value && !this.validatePassword(value)) {
                    this.highlightField('input[name="password"]', true);
                }
                break;
            default:
                break;
        }
    }
}
