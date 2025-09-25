import RestAPIService from "../../../services/restAPIService.js";
import UsersListRepository from "../data/usersListRepository.js";
import databaseService from "../../../services/databaseService.js";
import Helper from "../../../utils/helper.js";

/**
 * Use case for handling users list functionality.
 *
 * @export
 * @class GetUsersListUsecase
 */
export default class GetUsersListUsecase {
    /**
     * Creates an instance of GetUsersListUsecase.
     * @param {Object} app - The Framework7 app instance
     * @memberof GetUsersListUsecase
     */
    constructor(app) {
        this.app = app;
        this.repository = new UsersListRepository();
        this.apiService = new RestAPIService(this.repository);
    }

    /**
     * Execute users list fetch process
     * @param {Object} filters - Optional filters for the user list
     */
    async execute(filters = {}) {
        console.log("Fetching users list...");

        try {
            // Get current user ID for the API call
            const currentUserId =
                await databaseService.getDataById("currentUserId");

            // Add current user ID to the filters
            const filtersWithCurrentUser = {
                ...filters,
                currentUserUid: currentUserId,
            };

            // Make API call using RestAPIService
            const result = await this.apiService.makePostCall(
                filtersWithCurrentUser
            );

            if (!result.success) {
                throw new Error(result.message || "Failed to fetch users list");
            }

            // Transform the response data
            const users = this.transformUsersData(result.users || []);

            return {
                success: true,
                users: users,
                total: result.total || users.length,
                page: result.page || 1,
                hasMore: result.hasMore || false,
                message: result.message || "Users fetched successfully",
            };
        } catch (error) {
            console.error("Get users list API error:", error);
            throw new Error(error.message || "Failed to fetch users list");
        }
    }

    /**
     * Transform API response users data to display format
     * @param {Array} usersData - Raw users data from API
     * @returns {Array} Transformed users data
     */
    transformUsersData(usersData) {
        if (!Array.isArray(usersData)) {
            return [];
        }

        return usersData.map((user) => ({
            id: user.uid || user.id,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            email: user.email || "",
            role: user.role || "",
            userType: user.userType || "",
            branch: user.branch || "",
            account: user.account || "",
            group: user.group || "",
            status: user.status || "Active",
            createdAt: user.createdAt || "",
            createdBy: user.createdby || user.createdBy || "",
        }));
    }
}
