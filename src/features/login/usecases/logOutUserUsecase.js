import databaseService from "../../../services/databaseService.js";
import Helper from "../../../utils/helper.js";

/**
 * Use case class for handling user logout functionality.
 *
 * @export
 * @class LogOutUserUsecase
 */
export default class LogOutUserUsecase {
    /**
     * Creates an instance of LogOutUserUsecase.
     * @param {Object} app - The Framework7 app instance
     * @memberof LogOutUserUsecase
     */
    constructor(app) {
        this.app = app;
    }

    /**
     * Executes the logout process by clearing user data and navigating to the login page.
     *
     * @memberof LogOutUserUsecase
     */
    async execute() {
        // Set loading state for logout button if it exists
        Helper.setButtonLoading(".logout-button", true, "Logging out...");

        try {
            // Clear user info from local DB
            await databaseService.removeDataById("currentUserData", null);
            await databaseService.removeDataById("currentUserId", null);

            Helper.showSuccess(this.app, "Logout successful!");

            Helper.setButtonLoading(".logout-button", false);
            // Navigate to home with delay for better UX
            setTimeout(() => {
                this.app.views.main.router.navigate("/");
            }, Helper.VALIDATION_CONFIG.AUTO_REDIRECT_DELAY);
        } catch (error) {
            Helper.showError(this.app, `Logout failed: ${error.message}`);
        }
    }
}
