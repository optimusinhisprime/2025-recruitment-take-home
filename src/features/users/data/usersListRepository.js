/**
 * Repository class for handling users list data operations.
 *
 * @export
 * @class UsersListRepository
 */
export default class UsersListRepository {
    /**
     * Creates an instance of UsersListRepository.
     * @memberof UsersListRepository
     */
    constructor() {}

    /**
     * Gets the API endpoint for users list operations.
     *
     * @return {string} The API endpoint URL.
     * @memberof UsersListRepository
     */
    getRequestUrl() {
        return "/portal-controller";
    }

    /**
     * Transforms users list request to API payload format.
     *
     * @param {Object} filters Optional filters for the user list
     * @return {Object} The API payload.
     * @memberof UsersListRepository
     */
    dataToPayload(filters = {}) {
        return {
            data: JSON.stringify({
                definition: "listUsers",
                data: {
                    currentUserUid: filters.currentUserUid,
                    startAfter: filters.startAfter || "",
                    limit: filters.limit?.toString() || "5",
                },
            }),
        };
    }

    /**
     * Transforms API response payload to users list data format.
     *
     * @param {Object} payload The API response payload.
     * @return {Object} The users list data extracted from the payload.
     * @memberof UsersListRepository
     */
    payloadToData(payload) {
        return {
            code: payload?.code,
            response: payload?.response,
            message: payload?.message,
            users: payload?.description || [],
            total: payload?.total || 0,
            page: payload?.page || 1,
            hasMore: payload?.hasMore || false,
            status: payload?.status,
            success: payload?.code === "0" && payload?.status === 200,
        };
    }

    /**
     * Transforms users list request for user search to API payload format.
     *
     * @param {Object} searchParams Search parameters
     * @return {Object} The API payload.
     * @memberof UsersListRepository
     */
    searchUsersPayload(searchParams = {}) {
        return {
            data: JSON.stringify({
                definition: "searchUsers",
                data: {
                    currentUserUid: searchParams.currentUserUid,
                    query: searchParams.query || "",
                    filters: {
                        role: searchParams.role || "",
                        userType: searchParams.userType || "",
                        branch: searchParams.branch || "",
                        status: searchParams.status || "active",
                    },
                    pagination: {
                        page: searchParams.page || 1,
                        limit: searchParams.limit || 20,
                    },
                },
            }),
        };
    }

    /**
     * Transforms user details request to API payload format.
     *
     * @param {Object} params Parameters for getting user details
     * @return {Object} The API payload.
     * @memberof UsersListRepository
     */
    getUserDetailsPayload(params = {}) {
        return {
            data: JSON.stringify({
                definition: "getUserDetails",
                data: {
                    currentUserUid: params.currentUserUid,
                    targetUserId: params.targetUserId,
                },
            }),
        };
    }

    /**
     * Transforms user status update request to API payload format.
     *
     * @param {Object} params Parameters for updating user status
     * @return {Object} The API payload.
     * @memberof UsersListRepository
     */
    updateUserStatusPayload(params = {}) {
        return {
            data: JSON.stringify({
                definition: "updateUserStatus",
                data: {
                    currentUserUid: params.currentUserUid,
                    targetUserId: params.targetUserId,
                    status: params.status, // "active" or "inactive"
                    reason: params.reason || "",
                },
            }),
        };
    }
}
