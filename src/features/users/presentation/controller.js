import CreateUserUsecase from "../usecases/createUserUsecase.js";
import Helper from "../../../utils/helper.js";

/**
 * Controller class responsible for managing user creation functionality.
 *
 * @export
 * @class UsersController
 */
export default class UsersController {
    /**
     * Creates an instance of UsersController.
     *
     * @param {Object} app - The Framework7 app instance
     * @memberof UsersController
     */
    constructor(app) {
        this.app = app;
        this.init();
    }

    /**
     * Initializes event listeners for user functionality.
     *
     * @private
     * @memberof UsersController
     */
    init() {
        console.log("UsersController initialized");

        document.addEventListener("click", async (e) => {
            if (e.target.classList.contains("create-user-button")) {
                e.preventDefault();
                await this.handleCreateUser();
            }
        });

        document.addEventListener("input", async (e) => {
            await this.handleInputEvents(e);
        });
    }

    /**
     * Handles the user creation process when the create button is clicked.
     *
     * @async
     * @returns {Promise<void>} A promise that resolves when user creation processing is complete
     * @memberof UsersController
     */
    async handleCreateUser() {
        try {
            const formData = this.getFormData();

            if (!this.validateUserForm(formData)) {
                return;
            }

            const useCase = new CreateUserUsecase(this.app);
            await useCase.execute(formData);
        } catch (error) {
            Helper.showError(
                this.app,
                error.message || "User creation failed. Please try again."
            );
            console.error("Error in handleCreateUser:", error);
        } finally {
            Helper.setButtonLoading(".create-user-button", false);
        }
    }

    /**
     * Gets form field value by name, supporting both input and select elements
     * @param {string} fieldName - Name attribute of the field
     * @returns {string} Field value or empty string
     */
    getFieldValue(fieldName) {
        // Try input first
        let field = document.querySelector(`input[name="${fieldName}"]`);
        if (!field) {
            // Try select if input not found
            field = document.querySelector(`select[name="${fieldName}"]`);
        }
        return field ? field.value.trim() : "";
    }

    /**
     * Gets form data from user creation fields.
     *
     * @private
     * @returns {Object} Form data object with user information
     * @memberof UsersController
     */
    getFormData() {
        return {
            firstName: this.getFieldValue("firstName"),
            lastName: this.getFieldValue("lastName"),
            email: this.getFieldValue("email"),
            account: this.getFieldValue("account"),
            accounts: this.getAccountsArray(),
            outlets: this.getOutletsArray(),
            createdby: this.getFieldValue("createdby"),
            group: this.getFieldValue("group"),
            password: this.getFieldValue("password"),
            role: this.getFieldValue("role"),
            userType: this.getFieldValue("userType"),
            branch: this.getFieldValue("branch"),
        };
    }

    /**
     * Gets accounts array from form (for Merchant user type).
     *
     * @private
     * @returns {Array} Array of account numbers
     * @memberof UsersController
     */
    getAccountsArray() {
        const accountsValue = this.getFieldValue("accounts");
        if (!accountsValue) return [];
        return accountsValue
            .split(",")
            .map((acc) => acc.trim())
            .filter((acc) => acc);
    }

    /**
     * Gets outlets array from form.
     *
     * @private
     * @returns {Array} Array of outlet IDs
     * @memberof UsersController
     */
    getOutletsArray() {
        const outletsValue = this.getFieldValue("outlets");
        if (!outletsValue) return [];
        return outletsValue
            .split(",")
            .map((outlet) => outlet.trim())
            .filter((outlet) => outlet);
    }

    /**
     * Validates the user creation form data.
     *
     * @private
     * @param {Object} formData - Form data to validate
     * @returns {boolean} True if form is valid
     * @memberof UsersController
     */
    validateUserForm(formData) {
        const requiredFields = [
            "firstName",
            "lastName",
            "email",
            "account",
            "group",
            "password",
            "role",
            "userType",
            "branch",
        ];

        // Clear any existing error highlights
        this.clearFieldErrors(requiredFields);

        // Validate required fields
        for (const field of requiredFields) {
            if (!Helper.validateRequired(formData[field])) {
                this.showFieldError(
                    field,
                    `${this.getFieldDisplayName(field)} is required`
                );
                return false;
            }
        }

        // Validate email format
        if (!Helper.validateEmail(formData.email)) {
            this.showFieldError("email", "Please enter a valid email address");
            return false;
        }

        // Validate password length
        if (
            !Helper.validatePassword(
                formData.password,
                Helper.VALIDATION_CONFIG.LOGIN_PASSWORD_MIN_LENGTH
            )
        ) {
            this.showFieldError(
                "password",
                `Password must be at least ${Helper.VALIDATION_CONFIG.LOGIN_PASSWORD_MIN_LENGTH} characters long`
            );
            return false;
        }

        // Validate account format (8 digits)
        if (
            !/^\d{8}$/.test(formData.account) &&
            formData.account !== "PrepaidPlus"
        ) {
            this.showFieldError(
                "account",
                "Account must be 8 digits or 'PrepaidPlus'"
            );
            return false;
        }

        return true;
    }

    /**
     * Gets user-friendly field display name.
     *
     * @private
     * @param {string} fieldName - Field name
     * @returns {string} Display name
     * @memberof UsersController
     */
    getFieldDisplayName(fieldName) {
        const displayNames = {
            firstName: "First Name",
            lastName: "Last Name",
            email: "Email",
            account: "Account",
            group: "Group",
            password: "Password",
            role: "Role",
            userType: "User Type",
            branch: "Branch",
            createdby: "Created By",
        };
        return displayNames[fieldName] || fieldName;
    }

    /**
     * Shows error for a specific field.
     *
     * @private
     * @param {string} fieldName - Name of the field
     * @param {string} message - Error message to display
     * @memberof UsersController
     */
    showFieldError(fieldName, message) {
        Helper.showError(this.app, message);
        Helper.highlightField(
            `input[name="${fieldName}"], select[name="${fieldName}"]`,
            true
        );
    }

    /**
     * Clears error highlights from specified fields.
     *
     * @private
     * @param {string[]} fieldNames - Array of field names to clear
     * @memberof UsersController
     */
    clearFieldErrors(fieldNames) {
        fieldNames.forEach((fieldName) => {
            Helper.highlightField(
                `input[name="${fieldName}"], select[name="${fieldName}"]`,
                false
            );
        });
    }

    /**
     * Handles input events for real-time validation feedback.
     *
     * @param {Event} e - The input event
     * @returns {Promise<void>} A promise that resolves when input handling is complete
     * @memberof UsersController
     */
    async handleInputEvents(e) {
        const { name, value } = e.target;

        // Clear error styling on input
        Helper.highlightField(
            `input[name="${name}"], select[name="${name}"]`,
            false
        );

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
     * @memberof UsersController
     */
    validateFieldRealTime(fieldName, value) {
        switch (fieldName) {
            case "email":
                if (!Helper.validateEmail(value)) {
                    Helper.highlightField(`input[name="email"]`, true);
                }
                break;

            case "account":
                if (!/^\d{8}$/.test(value) && value !== "PrepaidPlus") {
                    Helper.highlightField(`input[name="account"]`, true);
                }
                break;

            case "password":
                if (
                    !Helper.validatePassword(
                        value,
                        Helper.VALIDATION_CONFIG.LOGIN_PASSWORD_MIN_LENGTH
                    )
                ) {
                    Helper.highlightField(`input[name="password"]`, true);
                }
                break;
        }
    }
}
