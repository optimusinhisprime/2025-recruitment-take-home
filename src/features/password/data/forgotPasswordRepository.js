/**
 * Repository for forgot password API operations.
 *
 * @export
 * @class ForgotPasswordRepository
 */
export default class ForgotPasswordRepository {
    /**
     * Creates an instance of ForgotPasswordRepository.
     * @memberof ForgotPasswordRepository
     */
    constructor() {}

    /**
     * Get the API endpoint for forgot password
     * @returns {string}
     */
    getRequestUrl() {
        return "/portal-controller";
    }

    /**
     * Format data for forgot password API request according to Postman collection
     * @param {Object} data - Contains email
     * @returns {Object}
     */
    dataToPayload(data) {
        const payload = {
            data: JSON.stringify({
                definition: "resetPassword",
                data: {
                    email: data.email,
                },
            }),
        };

        return payload;
    }

    /**
     * Parse API response for forgot password
     * @param {Object} payload - API response
     * @returns {Object}
     */
    payloadToData(payload) {
        try {
            // Handle the specific API response format from your backend
            const response = payload || {};

            // Check for error responses
            if (response.code && response.response === "Failure") {
                return {
                    success: false,
                    message:
                        response.description ||
                        response.message ||
                        "Failed to send password reset email",
                    errorCode: response.code,
                    status: response.status || 400,
                };
            }

            // Handle success responses
            return {
                success: true,
                message:
                    response.description ||
                    response.message ||
                    "Password reset email sent successfully",
                code: response.code || null,
                status: response.status || 200,
            };
        } catch (error) {
            console.error("Error parsing forgot password response:", error);
            return {
                success: false,
                message: "Failed to process password reset request",
                error: error.message,
            };
        }
    }
}
