import EventService from "../../../services/eventService";
import VerifyLoginUsecase from "../../login/usecases/verifyLoginUsecase";
import LogoutUserUsecase from "../../login/usecases/logOutUserusecase.js";
import Helper from "../../../utils/helper.js";

/**
 * Controller class responsible for managing the Home page and its interactions.
 *
 * @export
 * @class HomeController
 */
export default class HomeController {
    /**
     * Creates an instance of HomeController.
     *
     * @param {Object} app - The Framework7 app instance
     * @memberof HomeController
     */
    constructor(app) {
        this.app = app;
        this.eventService = new EventService();
        this.init();
    }

    /**
     * Initializes event listeners and sets up the controller.
     *
     * @private
     * @memberof HomeController
     */
    init() {
        console.log("HomeController initialized");

        // Page initialization events
        document.addEventListener("page:init", async (e) => {
            await this.handlePageInit(e);
        });

        // Click events
        document.addEventListener("click", async (e) => {
            await this.handleClickEvents(e);
        });

        // Custom logout event
        this.eventService.addEventListener("logout", async () => {
            await this.logUserOut();
        });
    }

    /**
     * Handles the page initialization event and processes actions based on the page name.
     *
     * @param {Event} e - The page initialization event
     * @returns {Promise<void>} A promise that resolves when the page handling is complete
     * @memberof HomeController
     */
    async handlePageInit(e) {
        const page = e.detail;

        if (page.name === "home") {
            await this.handleHomePage();
        }
    }

    /**
     * Handles click events on the page, triggering actions based on the clicked element.
     *
     * @param {Event} e - The click event
     * @returns {Promise<void>} A promise that resolves when the click handling is complete
     * @memberof HomeController
     */
    async handleClickEvents(e) {
        if (e.target.id === "home-action-logout") {
            await this.logUserOut();
        }
    }

    /**
     * Manages the state of the Home page based on user login status.
     *
     * @returns {Promise<void>} A promise that resolves when the home page handling is complete
     * @memberof HomeController
     */
    async handleHomePage() {
        try {
            const isLoggedIn = await this.isUserLoggedIn();

            if (isLoggedIn) {
                return;
            }

            this.showLoginScreen();
        } catch (error) {
            Helper.showError(this.app, "Error checking login status");
            console.error("Error in handleHomePage:", error);
        }
    }

    /**
     * Logs out the current user.
     *
     * @async
     * @returns {Promise<void>} A promise that resolves when the user is logged out
     * @memberof HomeController
     */
    async logUserOut() {
        try {
            await new LogoutUserUsecase(this.app).execute();
            Helper.showSuccess(this.app, "Logged out successfully");
            this.showLoginScreen();
        } catch (error) {
            Helper.showError(this.app, "Error logging out");
            console.error("Error in logUserOut:", error);
        }
    }

    /**
     * Checks if the user is logged in.
     *
     * @returns {Promise<boolean>} A promise that resolves to true if the user is logged in
     * @memberof HomeController
     */
    async isUserLoggedIn() {
        try {
            return await new VerifyLoginUsecase().execute();
        } catch (error) {
            console.error("Error verifying login:", error);
            return false;
        }
    }

    /**
     * Displays the login screen.
     *
     * @memberof HomeController
     */
    showLoginScreen() {
        // Reset login button state to ensure it's not stuck in loading state
        Helper.setButtonLoading(".login-button", false);
        this.app.loginScreen.open("#login-screen", false);
    }

    /**
     * Closes the login screen.
     *
     * @memberof HomeController
     */
    closeLoginScreen() {
        this.app.loginScreen.close("#login-screen", false);
    }
}
