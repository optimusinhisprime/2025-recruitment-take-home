// API calls for login

/**
 * Repository class for handling user login data operations.
 *
 * @export
 * @class LoginRepository
 */
export default class LoginRepository {
    /**
     * Creates an instance of LoginRepository.
     * @memberof LoginRepository
     */
    constructor() {}

    /**
     *
     *
     * @return {string} The login API endpoint.
     * @memberof LoginRepository
     */
    getRequestUrl() {
        return "/portal-controller";
    }

    /**
     *
     *
     * @param {Object} credentials The user login credentials.
     * @return {Object} The formatted payload for the API.
     * @memberof LoginRepository
     */
    dataToPayload(credentials) {
        return {
            data: JSON.stringify({
                definition: "login",
                data: {
                    email: credentials.email,
                    password: credentials.password,
                },
            }),
        };
    }

    /**
     *
     *
     * @param {Object} payload The API response payload.
     * @return {Object} The user data extracted from the payload.
     * @memberof LoginRepository
     */
    payloadToData(payload) {
        const userData = payload?.description || {};
        return {
            userId: userData.uid,
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            displayName: userData?.displayName,
            role: userData?.role,
            email: userData?.email,
            userType: userData?.userType,
            group: userData?.group,
            account: userData?.account,
        };
    }
}
