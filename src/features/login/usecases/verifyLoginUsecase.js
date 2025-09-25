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
     * @memberof VerifyLoginUsecase
     */
    constructor() {}

    /**
     * Executes the use case to verify if a user is logged in.
     *
     * @return {boolean} True if the user is logged in, false otherwise.
     * @memberof VerifyLoginUsecase
     */
    async execute() {
        // Check if user data exists in the database to determine login status
        const userId = await databaseService.getDataById("currentUserId");
        console.log("VerifyLoginUsecase: User ID fetched:", userId);
        return !!userId;
    }
}
