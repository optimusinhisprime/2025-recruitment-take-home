/**
 * A utility class providing various helper methods.
 *
 * This class contains static methods that can be used throughout the
 * application
 * to perform common tasks or calculations.
 */
export default class Helper {
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
}
