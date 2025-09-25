import databaseService from "../../../services/databaseService.js";

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
        try {
            // Clear user info from local DB
            await databaseService.removeDataById("currentUserData", null);
            await databaseService.removeDataById("currentUserId", null);

            this.app.toast
                .create({
                    text: "Logout successful!",
                    closeTimeout: 3000,
                    position: "top",
                    color: "green",
                })
                .open();

            this.app.views.main.router.navigate("/");
        } catch (error) {
            this.app.toast
                .create({
                    text: `Logout failed: ${error.message}`,
                    closeTimeout: 3000,
                    position: "top",
                    color: "red",
                })
                .open();
        }
    }
}
