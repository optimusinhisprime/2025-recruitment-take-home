import databaseService from "../../../services/databaseService.js";

/**
 * Use case class for verifying if a user is logged in.
 *
 * @export
 * @class VerifyLoginUsecase
 */
export default class VerifyLoginUsecase {
    /**
     * Creates an instance of VerifyLoginUsecase.
     * @param {Object} app - The Framework7 app instance
     * @memberof VerifyLoginUsecase
     */
    constructor(app) {
        this.app = app;
    }

    /**
     * Executes the use case to verify if a user is logged in.
     *
     * @return {boolean} True if the user is logged in, false otherwise.
     * @memberof VerifyLoginUsecase
     */
    async execute() {
        // Check if user data exists in the database to determine login status
        const userId = await databaseService.getDataById("currentUserId");
        return !!userId;
    }
}
