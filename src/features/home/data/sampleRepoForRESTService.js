/**
 *
 */
export default class V3BankDetailsRepository {
    /**
     *
     */
    constructor() {}

    /**
     * Returns the request URL of the API endpoint.
     *
     * @returns {string} The URL string of the endpoint.
     */
    getRequestUrl() {
        return "/api/v3/sampleRepoForRESTService";
    }

    /**
     * Prepares data to a payload format for the backend API.
     *
     * @param {Object} data data (account)to be sent in the request.
     * @returns {string} The formatted JSON payload.
     */
    dataToPayload(data) {
        const payload = {
            data: JSON.stringify({
                definition: "sampleRepoForRESTService",
                data: { account: data },
            }),
            // headers: "",
        };

        return payload;
    }

    /**
     * Converts the backend API response payload to the format the application expects.
     *
     * @param {Object} payload - The API response payload.
     * @returns {Object} The parsed details from the payload.
     */
    payloadToData(payload) {
        // might want to do more here this is the response from the API
        return payload.description;
    }
}
