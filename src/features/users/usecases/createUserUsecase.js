import RestAPIService from "../../../services/restAPIService.js";
import UsersRepository from "../data/usersRepository.js";
import databaseService from "../../../services/databaseService.js";
import Helper from "../../../utils/helper.js";

/**
 * Use case for handling user creation functionality.
 *
 * @export
 * @class CreateUserUsecase
 */
export default class CreateUserUsecase {
    /**
     * Creates an instance of CreateUserUsecase.
     * @param {Object} app - The Framework7 app instance
     * @memberof CreateUserUsecase
     */
    constructor(app) {
        this.app = app;
        this.repository = new UsersRepository();
        this.apiService = new RestAPIService(this.repository);
    }

    /**
     * Execute user creation process
     * @param {Object} userData - User data for creation
     */
    async execute(userData) {
        console.log(`Creating user: ${userData.email}`);

        // Set loading state for the create user button
        Helper.setButtonLoading(
            ".create-user-button",
            true,
            "Creating user..."
        );

        try {
            // Get current user ID for the API call
            const currentUserId =
                await databaseService.getDataById("currentUserId");

            // Add current user ID to the payload
            const userDataWithCurrentUser = {
                ...userData,
                currentUserUid: currentUserId,
            };

            console.log("User Data Payload:", userDataWithCurrentUser);

            // Make actual API call using the RestAPIService
            const result = await this.apiService.makePostCall(
                userDataWithCurrentUser
            );

            if (!result.success) {
                throw new Error(result.message || "Failed to create user");
            }

            Helper.showSuccess(
                this.app,
                result.message || "User created successfully!"
            );

            // Navigate back or close modal after configured delay
            setTimeout(() => {
                this.app.views.main.router.back();
            }, Helper.VALIDATION_CONFIG.AUTO_REDIRECT_DELAY);

            return result;
        } catch (error) {
            console.error("Create user API error:", error);
            Helper.showError(
                this.app,
                error.message || "Failed to create user"
            );
            throw error;
        } finally {
            // Remove loading state
            Helper.setButtonLoading(".create-user-button", false);
        }
    }
}
