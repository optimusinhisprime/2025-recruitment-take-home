import EventService from "../../../services/eventService";
import VerifyLoginUsecase from "../../login/usecases/verifyLoginUsecase";
// import store from "../../../js/store"; //framewor7 state management

/**
 * Controller class responsible for managing the Welcome page and its interactions.
 */
export default class HomeController {
    /**
     * Initializes the HomeController with the app object and sets up event listeners.
     *
     * @param {Object} app The application object used in the controller.
     */
    constructor(app) {
        this.app = app;
        this.init();
    }

    /**
     * Initializes event listeners for page initialization and click events.
     *
     * @private
     */
    init() {
        console.log("HomeController initialized");
        document.addEventListener(
            "page:init",
            async (e) => await this.handlePageInit(e)
        );
        document.addEventListener(
            "click",
            async (e) => await this.handleClickEvents(e)
        );
        new EventService().addEventListener(
            "logout",
            async () => await this.logUserOut()
        );
    }

    /**
     * Handles the page initialization event and processes actions based on the page name.
     *
     * @param {Event} e The page initialization event.
     * @returns {Promise<void>} A promise that resolves when the page handling is complete.
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
     * @param {Event} e The click event.
     * @returns {Promise<void>} A promise that resolves when the click handling is complete.
     */
    async handleClickEvents(e) {
        if (e.target.id == "home-action-logout") {
            await this.logUserOut();
        }
    }

    /**
     * Manages the state of the Welcome page based on device pairing and user login status.
     *
     * @returns {Promise<void>} A promise that resolves when the home page handling is complete.
     */
    async handleHomePage() {
        //the place to start thinking of login logic
        const isLoggedIn = await this.isUserLoggedIn();

        if (isLoggedIn) {
            return;
        }
        this.showLoginScreen();
    }

    /**
     * Logs out the current user by executing the LogoutUserUseCase.
     *
     * @async
     * @returns {Promise<void>} A promise that resolves when the user is logged out.
     */
    async logUserOut() {
        // await new LogoutUserUseCase(this.app).execute();
    }

    /**
     * Checks if the user is logged in. Placeholder function for login logic.
     *
     * @returns {Promise<boolean>} A promise that resolves to true if the user is logged in, false otherwise.
     */
    async isUserLoggedIn() {
        return new VerifyLoginUsecase().execute();
    }

    /**
     * Displays the login screen.
     */
    showLoginScreen() {
        this.app.loginScreen.open("#login-screen", false);
    }

    /**
     * Closes the login screen.
     */
    closeLoginScreen() {
        this.app.loginScreen.close("#login-screen", false);
    }
}
