import RestAPIService from "../../../services/restAPIService.js";
import ForgotPasswordRepository from "../data/forgotPasswordRepository.js";
import Helper from "../../../utils/helper.js";

/**
 * Use case for handling forgot password functionality.
 *
 * @export
 * @class ForgotPasswordUsecase
 */
export default class ForgotPasswordUsecase {
    /**
     * Creates an instance of ForgotPasswordUsecase.
     * @param {Object} app
     * @memberof ForgotPasswordUsecase
     */
    constructor(app) {
        this.app = app;
        this.repository = new ForgotPasswordRepository();
        this.apiService = new RestAPIService(this.repository);
    }

    /**
     * Execute forgot password process
     * @param {string} email - User's email address
     */
    async execute(email) {
        console.log(`Sending password reset to: ${email}`);

        // Set loading state for the forgot password button
        Helper.setButtonLoading(
            ".forgot-password-button",
            true,
            "Sending reset email..."
        );

        try {
            // Make actual API call using the RestAPIService
            const result = await this.apiService.makePostCall({ email });

            if (!result.success) {
                throw new Error(result.message);
            }

            Helper.showSuccess(
                this.app,
                "Password reset email sent successfully!"
            );

            // Navigate back or close modal after configured delay
            setTimeout(() => {
                // This could navigate back to login or close a modal depending on UI structure
                this.app.views.main.router.back();
            }, Helper.VALIDATION_CONFIG.AUTO_REDIRECT_DELAY);

            return result;
        } catch (error) {
            console.error("Forgot password API error:", error);
            Helper.showError(
                this.app,
                error.message || "Failed to send password reset email"
            );
            throw error;
        } finally {
            // Remove loading state
            Helper.setButtonLoading(".forgot-password-button", false);
        }
    }
}
