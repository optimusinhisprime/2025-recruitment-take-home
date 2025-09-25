import ForgotPasswordUsecase from "../usecases/forgotPasswordUsecase.js";
import Helper from "../../../utils/helper.js";

/**
 * Controller class responsible for managing password-related functionality.
 *
 * @export
 * @class PasswordController
 */
export default class PasswordController {
    /**
     * Creates an instance of PasswordController.
     *
     * @param {Object} app - The Framework7 app instance
     * @memberof PasswordController
     */
    constructor(app) {
        this.app = app;
        this.init();
    }

    /**
     * Initializes event listeners for password functionality.
     *
     * @private
     * @memberof PasswordController
     */
    init() {
        console.log("PasswordController initialized");

        document.addEventListener("click", async (e) => {
            if (e.target.classList.contains("forgot-password-link")) {
                e.preventDefault();
                this.handleForgotPassword();
            }

            if (e.target.classList.contains("send-reset-button")) {
                e.preventDefault();
                await this.handleSendReset();
            }

            if (e.target.classList.contains("back-to-login-link")) {
                e.preventDefault();
                this.backToLogin();
            }
        });

        document.addEventListener("input", async (e) => {
            if (e.target.name === "reset-email") {
                await this.handleInputEvents(e);
            }
        });
    }

    /**
     * Navigate to forgot password screen.
     *
     * @memberof PasswordController
     */
    handleForgotPassword() {
        this.app.loginScreen.open("#forgot-password-screen");
    }

    /**
     * Handle sending reset email from the form.
     *
     * @async
     * @returns {Promise<void>} A promise that resolves when reset processing is complete
     * @memberof PasswordController
     */
    async handleSendReset() {
        try {
            const formData = this.getFormData();

            if (!this.validateResetForm(formData)) {
                return;
            }

            Helper.setButtonLoading(".send-reset-button", true, "Sending...");

            const useCase = new ForgotPasswordUsecase(this.app);
            const result = await useCase.execute(formData.email);

            Helper.showSuccess(
                this.app,
                result.message ||
                    "Password reset instructions sent to your email!"
            );

            Helper.clearField("reset-email");
            setTimeout(() => {
                this.backToLogin();
            }, Helper.VALIDATION_CONFIG.AUTO_REDIRECT_DELAY);
        } catch (error) {
            this.handleResetError(error);
        } finally {
            Helper.setButtonLoading(".send-reset-button", false);
        }
    }

    /**
     * Gets form data from reset fields.
     *
     * @private
     * @returns {Object} Form data object with email
     * @memberof PasswordController
     */
    getFormData() {
        return {
            email: Helper.getFieldValue("reset-email"),
        };
    }

    /**
     * Validates the password reset form.
     *
     * @private
     * @param {Object} formData - Form data to validate
     * @returns {boolean} True if form is valid
     * @memberof PasswordController
     */
    validateResetForm(formData) {
        const { email } = formData;

        // Clear any existing error highlights
        this.clearFieldErrors(["reset-email"]);

        if (!Helper.validateRequired(email)) {
            this.showFieldError("reset-email", "Email is required");
            return false;
        }

        if (!Helper.validateEmail(email)) {
            this.showFieldError(
                "reset-email",
                "Please enter a valid email address"
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
     * @memberof PasswordController
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
     * @memberof PasswordController
     */
    clearFieldErrors(fieldNames) {
        fieldNames.forEach((fieldName) => {
            Helper.highlightField(`input[name="${fieldName}"]`, false);
        });
    }

    /**
     * Handles errors during password reset.
     *
     * @private
     * @param {Error} error - The error object
     * @memberof PasswordController
     */
    handleResetError(error) {
        const errorMessage = this.getErrorMessage(error.message);
        Helper.showError(this.app, errorMessage);
        console.error("Error in handleSendReset:", error);

        if (error.message && error.message.includes("Invalid email")) {
            Helper.highlightField('input[name="reset-email"]', true);
        }
    }

    /**
     * Handles input events for real-time validation feedback.
     *
     * @param {Event} e - The input event
     * @returns {Promise<void>} A promise that resolves when input handling is complete
     * @memberof PasswordController
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
     * @memberof PasswordController
     */
    validateFieldRealTime(fieldName, value) {
        if (fieldName === "reset-email" && !Helper.validateEmail(value)) {
            Helper.highlightField('input[name="reset-email"]', true);
        }
    }

    /**
     * Go back to login screen with smooth transition.
     *
     * @memberof PasswordController
     */
    backToLogin() {
        this.app.loginScreen.close("#forgot-password-screen");

        setTimeout(() => {
            this.app.loginScreen.open("#login-screen");
        }, Helper.VALIDATION_CONFIG.TRANSITION_DELAY);
    }

    /**
     * Get user-friendly error message based on error content.
     *
     * @private
     * @param {string} errorMessage - Original error message from backend
     * @returns {string} User-friendly error message
     * @memberof PasswordController
     */
    getErrorMessage(errorMessage) {
        if (errorMessage && errorMessage.trim() !== "") {
            return errorMessage;
        }
        return "Failed to send password reset email. Please try again.";
    }
}
