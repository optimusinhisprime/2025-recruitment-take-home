import LoginUserUsecase from "../usecases/loginUserUsecase.js";
import Helper from "../../../utils/helper.js";

/**
 * Controller class responsible for managing the Login page and its interactions.
 *
 * @export
 * @class LoginController
 */
export default class LoginController {
    /**
     * Creates an instance of LoginController.
     *
     * @param {Object} app - The Framework7 app instance
     * @memberof LoginController
     */
    constructor(app) {
        this.app = app;
        this.init();
    }

    /**
     * Initializes event listeners for login functionality.
     *
     * @private
     * @memberof LoginController
     */
    init() {
        console.log("LoginController initialized");

        document.addEventListener("click", async (e) => {
            if (e.target.classList.contains("login-button")) {
                await this.handleLogin();
            }
        });

        document.addEventListener("input", async (e) => {
            await this.handleInputEvents(e);
        });
    }

    /**
     * Handles the login process when the login button is clicked.
     *
     * @async
     * @returns {Promise<void>} A promise that resolves when login processing is complete
     * @memberof LoginController
     */
    async handleLogin() {
        try {
            const formData = this.getFormData();

            if (!this.validateLoginForm(formData)) {
                return;
            }

            Helper.setButtonLoading(".login-button", true, "Signing in...");

            const useCase = new LoginUserUsecase(this.app);
            const encryptedPassword = await Helper.encryptString(
                formData.password
            );

            await useCase.execute(formData.email, encryptedPassword);
        } catch (error) {
            Helper.showError(
                this.app,
                error.message || "Login failed. Please try again."
            );
            console.error("Error in handleLogin:", error);
        } finally {
            Helper.setButtonLoading(".login-button", false);
        }
    }

    /**
     * Gets form data from login fields.
     *
     * @private
     * @returns {Object} Form data object with email and password
     * @memberof LoginController
     */
    getFormData() {
        return {
            email: Helper.getFieldValue("username"),
            password: Helper.getFieldValue("password"),
        };
    }

    /**
     * Validates the login form data.
     *
     * @private
     * @param {Object} formData - Form data to validate
     * @returns {boolean} True if form is valid
     * @memberof LoginController
     */
    validateLoginForm(formData) {
        const { email, password } = formData;

        // Clear any existing error highlights
        this.clearFieldErrors(["username", "password"]);

        // Validate required fields
        if (!Helper.validateRequired(email)) {
            this.showFieldError("username", "Email is required");
            return false;
        }

        if (!Helper.validateRequired(password)) {
            this.showFieldError("password", "Password is required");
            return false;
        }

        // Validate email format
        if (!Helper.validateEmail(email)) {
            this.showFieldError(
                "username",
                "Please enter a valid email address"
            );
            return false;
        }

        // Validate password length
        if (
            !Helper.validatePassword(
                password,
                Helper.VALIDATION_CONFIG.LOGIN_PASSWORD_MIN_LENGTH
            )
        ) {
            this.showFieldError(
                "password",
                `Password must be at least ${Helper.VALIDATION_CONFIG.LOGIN_PASSWORD_MIN_LENGTH} characters long`
            );
            return false;
        }

        return true;
    }

    /**
     * Shows error for a specific field.
     *
     * @private
     * @param {string} fieldName - Name of the field
     * @param {string} message - Error message to display
     * @memberof LoginController
     */
    showFieldError(fieldName, message) {
        Helper.showError(this.app, message);
        Helper.highlightField(`input[name="${fieldName}"]`, true);
    }

    /**
     * Clears error highlights from specified fields.
     *
     * @private
     * @param {string[]} fieldNames - Array of field names to clear
     * @memberof LoginController
     */
    clearFieldErrors(fieldNames) {
        fieldNames.forEach((fieldName) => {
            Helper.highlightField(`input[name="${fieldName}"]`, false);
        });
    }

    /**
     * Handles input events for real-time validation feedback.
     *
     * @param {Event} e - The input event
     * @returns {Promise<void>} A promise that resolves when input handling is complete
     * @memberof LoginController
     */
    async handleInputEvents(e) {
        const { name, value } = e.target;

        // Clear error styling on input
        Helper.highlightField(`input[name="${name}"]`, false);

        // Real-time validation
        if (value) {
            this.validateFieldRealTime(name, value);
        }
    }

    /**
     * Performs real-time validation for individual fields.
     *
     * @private
     * @param {string} fieldName - Name of the field being validated
     * @param {string} value - Current field value
     * @memberof LoginController
     */
    validateFieldRealTime(fieldName, value) {
        switch (fieldName) {
            case "username":
                if (!Helper.validateEmail(value)) {
                    Helper.highlightField('input[name="username"]', true);
                }
                break;

            case "password":
                if (
                    !Helper.validatePassword(
                        value,
                        Helper.VALIDATION_CONFIG.LOGIN_PASSWORD_MIN_LENGTH
                    )
                ) {
                    Helper.highlightField('input[name="password"]', true);
                }
                break;
        }
    }
}
