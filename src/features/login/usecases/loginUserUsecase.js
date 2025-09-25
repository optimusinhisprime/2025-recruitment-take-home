import RestAPIService from "../../../services/restAPIService.js";
import LoginRepository from "../data/loginRepository.js";
import databaseService from "../../../services/databaseService.js";
import Helper from "../../../utils/helper.js";

/**
 * Use case class for handling user login functionality.
 *
 * @export
 * @class LoginUserUsecase
 */
export default class LoginUserUsecase {
    /**
     * Creates an instance of LoginUserUsecase.
     * @param {Object} app - The Framework7 app instance
     * @memberof LoginUserUsecase
     */
    constructor(app) {
        this.app = app;
        this.repository = new LoginRepository();
        this.apiService = new RestAPIService(this.repository);
    }

    /**
     *
     *
     * @param {string} email
     * @param {string} password
     * @return {Object} The logged-in user data.
     * @memberof LoginUserUsecase
     */
    async execute(email, password) {
        try {
            const credentials = {
                email,
                password,
            };

            const userData = await this.apiService.makePostCall(credentials);

            // Store user info in local DB with encryption for sensitive data
            const encryptedUserData = await Helper.encryptString(
                JSON.stringify(userData)
            );
            if (encryptedUserData) {
                await databaseService.setDataById(
                    "currentUserData",
                    encryptedUserData
                );
            } else {
                // Fallback to unencrypted if encryption fails
                await databaseService.setDataById("currentUserData", userData);
            }
            await databaseService.setDataById("currentUserId", userData.userId);

            Helper.showSuccess(this.app, "Login successful!");

            // Close login screen and navigate to home with configured delay
            setTimeout(() => {
                this.app.loginScreen.close("#login-screen");
                this.app.views.main.router.navigate("/");
            }, Helper.VALIDATION_CONFIG.AUTO_REDIRECT_DELAY);
        } catch (error) {
            Helper.showError(this.app, `Login failed: ${error.message}`);
            throw error; // Re-throw so the controller can handle button state reset
        }
    }
}
