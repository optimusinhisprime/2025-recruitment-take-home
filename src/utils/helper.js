// Environment configuration - only for sensitive data
const config = {
    hashingSecret: import.meta.env.VITE_HASHING_SECRET || "thisIsASecret",
};

/**
 * A utility class providing various helper methods.
 *
 * This class contains static methods that can be used throughout the
 * application
 * to perform common tasks or calculations.
 */
export default class Helper {
    /**
     * Constants for configuration
     *
     * @readonly
     * @static
     * @memberof Helper
     */
    static get VALIDATION_CONFIG() {
        return {
            PASSWORD_MIN_LENGTH: 10,
            LOGIN_PASSWORD_MIN_LENGTH: 10, // Specific requirement for login
            EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            TOAST_TIMEOUT: 3000,
            TRANSITION_DELAY: 300,
            AUTO_REDIRECT_DELAY: 2000,
        };
    }

    /**
     * UI configuration constants
     *
     * @readonly
     * @static
     * @memberof Helper
     */
    static get UI_CONFIG() {
        return {
            ERROR_STYLES: {
                borderColor: "#ff3b30",
                backgroundColor: "#fff5f5",
            },
            LOADING_STYLES: {
                opacity: "0.7",
                pointerEvents: "none",
            },
            TOAST_COLORS: {
                success: "green",
                error: "red",
                info: "blue",
                warning: "orange",
            },
        };
    }

    /**
     * Registers the service worker if available in the current browser.
     *
     * @returns {Promise<void>} A promise that resolves when the service
     * worker registration is successful.
     * @throws {Error} Throws an error if the registration fails.
     */
    async registerServiceWorker() {
        if ("serviceWorker" in navigator) {
            try {
                await navigator.serviceWorker.register("service_worker.js");
            } catch (e) {
                throw new Error(e.message);
                // Optional: Handle or log the error if needed
            }
        }
    }

    /**
     * Reads the value from an input field by its ID and then clears the field.
     *
     * @param {*} fieldId
     * @return {*}
     * @memberof Helper
     */
    async readAndClearField(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            const value = field.value;
            field.value = "";
            return value;
        }
        return null;
    }

    /**
     * Validates email format using configurable regex pattern
     * @param {string} email - Email address to validate
     * @returns {boolean} True if email format is valid
     */
    static validateEmail(email) {
        return this.VALIDATION_CONFIG.EMAIL_REGEX.test(email);
    }

    /**
     * Validates password requirements with configurable minimum length
     * @param {string} password - Password to validate
     * @param {number} minLength - Minimum password length (uses default from config if not provided)
     * @returns {boolean} True if password meets requirements
     */
    static validatePassword(password, minLength = null) {
        const actualMinLength =
            minLength || this.VALIDATION_CONFIG.PASSWORD_MIN_LENGTH;
        return password && password.length >= actualMinLength;
    }

    /**
     * Validates that a field is not empty
     * @param {string} value - Value to validate
     * @returns {boolean} True if field has content
     */
    static validateRequired(value) {
        return value && value.trim() !== "";
    }

    /**
     * Highlights or removes highlight from input fields with configurable styles
     * @param {string} selector - CSS selector for the field
     * @param {boolean} hasError - Whether the field has an error
     */
    static highlightField(selector, hasError) {
        const field = document.querySelector(selector);
        if (field) {
            if (hasError) {
                Object.assign(field.style, this.UI_CONFIG.ERROR_STYLES);
            } else {
                field.style.borderColor = "";
                field.style.backgroundColor = "";
            }
        }
    }

    /**
     * Shows a toast notification with configurable settings
     * @param {Object} app - Framework7 app instance
     * @param {string} message - Message to display
     * @param {string} type - Type of toast ('success', 'error', 'info', 'warning')
     * @param {number} timeout - Auto close timeout in milliseconds
     */
    static showToast(app, message, type = "info", timeout = null) {
        const actualTimeout = timeout || this.VALIDATION_CONFIG.TOAST_TIMEOUT;
        const color =
            this.UI_CONFIG.TOAST_COLORS[type] ||
            this.UI_CONFIG.TOAST_COLORS.info;

        app.toast
            .create({
                text: message,
                closeTimeout: actualTimeout,
                color: color,
            })
            .open();
    }

    /**
     * Shows an error toast (convenience method)
     * @param {Object} app - Framework7 app instance
     * @param {string} message - Error message to display
     */
    static showError(app, message) {
        this.showToast(app, message, "error");
    }

    /**
     * Shows a success toast (convenience method)
     * @param {Object} app - Framework7 app instance
     * @param {string} message - Success message to display
     */
    static showSuccess(app, message) {
        this.showToast(app, message, "success");
    }

    /**
     * Sets button loading state with configurable styles
     * @param {string} selector - CSS selector for the button
     * @param {boolean} isLoading - Whether button should show loading state
     * @param {string} loadingText - Text to show during loading
     */
    static setButtonLoading(selector, isLoading, loadingText = "Loading...") {
        const button = document.querySelector(selector);
        if (button) {
            if (isLoading) {
                button.dataset.originalText = button.textContent;
                button.textContent = loadingText;
                Object.assign(button.style, this.UI_CONFIG.LOADING_STYLES);
            } else {
                button.textContent =
                    button.dataset.originalText || button.textContent;
                button.style.pointerEvents = "auto";
                button.style.opacity = "1";
            }
        }
    }

    /**
     * Gets form field value by name
     * @param {string} fieldName - Name attribute of the field
     * @returns {string} Field value or empty string
     */
    static getFieldValue(fieldName) {
        const field = document.querySelector(`input[name="${fieldName}"]`);
        return field ? field.value.trim() : "";
    }

    /**
     * Clears form field value
     * @param {string} fieldName - Name attribute of the field
     */
    static clearField(fieldName) {
        const field = document.querySelector(`input[name="${fieldName}"]`);
        if (field) {
            field.value = "";
        }
    }

    /**
     * Encrypts a string using AES-256-CBC encryption (browser-compatible version).
     * Maintains compatibility with the original Node.js implementation.
     *
     * @param {string} plaintext The string to encrypt.
     * @param {string} secret The secret key for encryption (defaults to config.hashingSecret).
     * @returns {Promise<string|false>} The encrypted string in format "iv:encryptedData" or false if input is invalid.
     */
    static async encryptString(plaintext, secret = config.hashingSecret) {
        if (typeof plaintext === "string" && plaintext.length > 0) {
            try {
                // Generate a random initialization vector (16 bytes for AES-CBC)
                const iv = crypto.getRandomValues(new Uint8Array(16));

                // Create key from secret using SHA-256 hash (same as Node.js version)
                const encoder = new TextEncoder();
                const secretBytes = encoder.encode(secret);
                const keyBuffer = await crypto.subtle.digest(
                    "SHA-256",
                    secretBytes
                );

                // Import the key for AES-CBC encryption
                const key = await crypto.subtle.importKey(
                    "raw",
                    keyBuffer,
                    { name: "AES-CBC" },
                    false,
                    ["encrypt"]
                );

                // Encrypt the plaintext
                const plaintextBytes = encoder.encode(plaintext);
                const encrypted = await crypto.subtle.encrypt(
                    { name: "AES-CBC", iv: iv },
                    key,
                    plaintextBytes
                );

                // Convert IV and encrypted data to base64 (same format as Node.js version)
                const ivBase64 = btoa(String.fromCharCode(...iv));
                const encryptedBase64 = btoa(
                    String.fromCharCode(...new Uint8Array(encrypted))
                );

                // Return in same format: "iv:encryptedData"
                return ivBase64 + ":" + encryptedBase64;
            } catch (error) {
                console.error("Encryption failed:", error);
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Decrypts a string that was encrypted using AES-256-CBC encryption (browser-compatible version).
     * Maintains compatibility with the original Node.js implementation.
     *
     * @param {string} encryptedString The encrypted string in format "iv:encryptedData" to decrypt.
     * @param {string} secret The secret key for decryption (defaults to config.hashingSecret).
     * @returns {Promise<string|false>} The decrypted plaintext string or false if input is invalid or decryption fails.
     */
    static async decryptString(encryptedString, secret = config.hashingSecret) {
        if (
            typeof encryptedString === "string" &&
            encryptedString.includes(":")
        ) {
            try {
                console.log(
                    "Attempting to decrypt with secret:",
                    secret ? "Secret provided" : "No secret"
                );

                // Split the encrypted string to get IV and encrypted data
                const [ivBase64, encryptedData] = encryptedString.split(":");
                console.log(
                    "IV length:",
                    ivBase64.length,
                    "Data length:",
                    encryptedData.length
                );

                // Convert from base64 back to byte arrays
                const iv = new Uint8Array(
                    atob(ivBase64)
                        .split("")
                        .map((c) => c.charCodeAt(0))
                );
                const encrypted = new Uint8Array(
                    atob(encryptedData)
                        .split("")
                        .map((c) => c.charCodeAt(0))
                );

                console.log(
                    "IV bytes:",
                    iv.length,
                    "Encrypted bytes:",
                    encrypted.length
                );

                // Create key from secret using SHA-256 hash (same as Node.js version)
                const encoder = new TextEncoder();
                const secretBytes = encoder.encode(secret);
                const keyBuffer = await crypto.subtle.digest(
                    "SHA-256",
                    secretBytes
                );

                // Import the key for AES-CBC decryption
                const key = await crypto.subtle.importKey(
                    "raw",
                    keyBuffer,
                    { name: "AES-CBC" },
                    false,
                    ["decrypt"]
                );

                // Decrypt the data
                const decrypted = await crypto.subtle.decrypt(
                    { name: "AES-CBC", iv: iv },
                    key,
                    encrypted
                );

                // Convert back to string
                const decoder = new TextDecoder();
                return decoder.decode(decrypted);
            } catch (error) {
                console.error("Decryption failed:", error);
                console.error("Error details:", {
                    name: error.name,
                    message: error.message,
                    encryptedString: encryptedString.substring(0, 50) + "...",
                    secretUsed: secret ? "Secret provided" : "No secret",
                });
                return false;
            }
        } else {
            console.error("Invalid encrypted string format:", encryptedString);
            return false;
        }
    }
}
