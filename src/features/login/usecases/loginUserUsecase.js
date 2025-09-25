import RestAPIService from "../../../services/restAPIService.js";
import LoginRepository from "../data/loginRepository.js";
import databaseService from "../../../services/databaseService.js";

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
            const credentials = { email, password };

            const userData = await this.apiService.makePostCall(credentials);

            // Store user info in local DB
            await databaseService.setDataById("currentUserData", userData);
            await databaseService.setDataById("currentUserId", userData.userId);

            this.app.toast
                .create({
                    text: "Login successful!",
                    closeTimeout: 3000,
                    position: "top",
                    color: "green",
                })
                .open();

            // Close login screen and navigate to home
            this.app.loginScreen.close("#login-screen");
            this.app.views.main.router.navigate("/");
        } catch (error) {
            this.app.toast
                .create({
                    text: `Login failed: ${error.message}`,
                    closeTimeout: 3000,
                    position: "top",
                    color: "red",
                })
                .open();
        }
    }
}
