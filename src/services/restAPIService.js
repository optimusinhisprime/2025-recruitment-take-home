import { baseUrl } from "../data/baseUrl";

/**
 * Service class for making API requests (GET and POST) and handling errors.
 */
export default class RestAPIService {
    /**
     * Initializes the RestAPIService with an endpoint repository.
     *
     * @param {Object} endpointRepository The repository that provides
     * methods to format data and request URLs.
     */
    constructor(endpointRepository) {
        this.defaultHeaders = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        };
        this.endpointRepository = endpointRepository;
        this.timeoutDuration = 70000;
    }

    /**
     * Makes a POST request to the API with the provided data.
     *
     * @param {Object} data The data to be sent in the POST request.
     * @returns {Promise<Object>} A promise that resolves with the
     * response
     * data after it is processed by the endpoint repository.
     * @throws {Error} Throws an error if the request fails or the
     * response is not okay.
     */
    async makePostCall(data) {
        const controller = new AbortController();
        const timeoutId = setTimeout(
            () => controller.abort(),
            this.timeoutDuration
        );

        try {
            const payload = this.endpointRepository.dataToPayload(data);
            console.log("POST Payload:", payload);
            const response = await fetch(
                this.endpointRepository.getRequestUrl().startsWith("http")
                    ? this.endpointRepository.getRequestUrl()
                    : baseUrl + this.endpointRepository.getRequestUrl(),
                {
                    method: "POST",
                    headers: payload.headers || this.defaultHeaders,
                    body: payload.data,
                    signal: controller.signal,
                }
            );

            clearTimeout(timeoutId);
            this.response = response;

            this.responsePayload =
                (await response?.json()) || (await response?.text());

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return await this.endpointRepository.payloadToData(
                this.responsePayload
            );
        } catch (e) {
            clearTimeout(timeoutId);
            const userFriendlyMessage = await this.handleError(
                e,
                this.response
            );
            throw new Error(userFriendlyMessage);
        }
    }

    /**
     * Makes a GET request to the API.
     *
     * @returns {Promise<Object>} A promise that resolves with
     * the response data after it is processed by the endpoint
     * repository.
     * @throws {Error} Throws an error if the request fails or
     * the response is not okay.
     */
    async makeGetCall() {
        const controller = new AbortController();
        const timeoutId = setTimeout(
            () => controller.abort(),
            this.timeoutDuration
        );

        try {
            const response = await fetch(
                this.endpointRepository.getRequestUrl().startsWith("http")
                    ? this.endpointRepository.getRequestUrl()
                    : baseUrl + this.endpointRepository.getRequestUrl(),
                {
                    method: "GET",
                    headers: this.defaultHeaders,
                    signal: controller.signal,
                }
            );

            clearTimeout(timeoutId);
            this.response = response;

            this.responsePayload =
                (await response.json()) || (await response.text());

            if (!this.response.ok) {
                throw new Error(response.statusText);
            }

            return await this.endpointRepository.payloadToData(
                this.responsePayload
            );
        } catch (e) {
            clearTimeout(timeoutId);
            const userFriendlyMessage = await this.handleError(
                e,
                this.response
            );
            throw new Error(userFriendlyMessage);
        }
    }

    /**
     * Handles errors by generating a user-friendly message
     * based on the error and response.
     *
     * @param {Error} error The error object.
     * @param {Response} response The response object (if available).
     * @returns {Promise<string>} A promise that resolves to a
     * user-friendly error message.
     */
    async handleError(error, response) {
        let userFriendlyMessage =
            "An unexpected error occurred. Please try again later.";

        if (error instanceof TypeError && error.message === "Failed to fetch") {
            userFriendlyMessage =
                "Network error: Please check your internet connection and try again.";
            return userFriendlyMessage;
        }

        if (response) {
            const status = response.status;
            let customMessage = "";

            try {
                const errorBody = this.responsePayload;
                customMessage =
                    errorBody?.description || errorBody?.details || "";
            } catch (e) {
                throw new Error(e.message);
            }

            switch (status) {
                case 400:
                    userFriendlyMessage =
                        customMessage ||
                        "Bad request: Please check your input and try again.";
                    break;
                case 401:
                    userFriendlyMessage =
                        customMessage ||
                        "Unauthorized: Please log in and try again.";
                    break;
                case 403:
                    userFriendlyMessage =
                        customMessage ||
                        "Forbidden: You do not have permission to access this resource.";
                    break;
                case 404:
                    userFriendlyMessage =
                        customMessage ||
                        "Resource not found: The requested resource does not exist.";
                    break;
                case 500:
                    userFriendlyMessage =
                        customMessage ||
                        "Internal server error: Please try again later.";
                    break;
                case 502:
                    userFriendlyMessage =
                        customMessage ||
                        "Bad gateway: The server is temporarily unavailable.";
                    break;
                case 503:
                    userFriendlyMessage =
                        customMessage ||
                        "Service unavailable: The server is temporarily down for maintenance.";
                    break;
                default:
                    userFriendlyMessage =
                        customMessage ||
                        `An error occurred (Status: ${status}). Please try again later.`;
                    break;
            }
        } else if (error instanceof Error) {
            userFriendlyMessage = `An error occurred: ${error.message}`;
        }

        return userFriendlyMessage;
    }
}
