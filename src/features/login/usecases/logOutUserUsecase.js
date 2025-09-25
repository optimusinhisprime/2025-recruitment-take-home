import databaseService from "../../../services/databaseService.js";

/**
 * Use case class for handling user logout functionality.
 *
 * @export
 * @class LogOutUserUsecase
 */
export default class LogOutUserUsecase {
    constructor(app) {
        this.app = app;
    }

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
