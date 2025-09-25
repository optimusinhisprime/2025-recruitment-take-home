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

        // Pre-validate email using Helper class
        if (!Helper.validateEmail(email)) {
            throw new Error("Invalid email format");
        }

        try {
            // Make actual API call using the RestAPIService
            const result = await this.apiService.makePostCall({ email });

            if (!result.success) {
                throw new Error(result.message);
            }

            return result;
        } catch (error) {
            console.error("Forgot password API error:", error);
            throw new Error(
                error.message || "Failed to send password reset email"
            );
        }
    }
}
