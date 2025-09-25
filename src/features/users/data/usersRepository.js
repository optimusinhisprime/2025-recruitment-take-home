/**
 * Repository class for handling user data operations.
 *
 * @export
 * @class UsersRepository
 */
export default class UsersRepository {
    /**
     *
     *
     * @return {string} The create user API endpoint.
     * @memberof UsersRepository
     */
    getRequestUrl() {
        return "/portal-controller";
    }

    /**
     * Transforms user form data to API payload format.
     *
     * @param {Object} userData The user form data.
     * @return {Object} The API payload.
     * @memberof UsersRepository
     */
    dataToPayload(userData) {
        return {
            definition: "createUser",
            data: {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                account: userData.account,
                accounts:
                    userData.userType === "Merchant"
                        ? userData.accounts || []
                        : [],
                outlets: userData.outlets || [],
                createdby: userData.createdby,
                group: userData.group,
                password: userData.password,
                role: userData.role,
                userType: userData.userType,
                currentUserUid: userData.currentUserUid,
                branch: userData.branch,
            },
        };
    }

    /**
     * Transforms API response payload to user data format.
     *
     * @param {Object} payload The API response payload.
     * @return {Object} The user data extracted from the payload.
     * @memberof UsersRepository
     */
    payloadToData(payload) {
        return {
            code: payload?.code,
            response: payload?.response,
            message: payload?.message,
            description: payload?.description,
            status: payload?.status,
            success: payload?.code === "0" && payload?.status === 200,
        };
    }
}
