import LoggingService from "./loggingService";
import IndexedDbRepository from "../data/indexedDbRepo";

/**
 * A service class for interacting with a database repository.
 * This class acts as a wrapper around a database repository, providing methods
 * to retrieve and store data by ID.
 */
class DatabaseService {
    /**
     * Creates an instance of DatabaseService.
     *
     * @param {Object} databaseRepository - The database repository instance to be used.
     */
    constructor(databaseRepository) {
        this.databaseRepository = databaseRepository;
    }

    /**
     * Retrieves data from the database repository by ID.
     *
     * @param {string|number} id - The ID of the data to retrieve.
     * @returns {Promise<Object|boolean>} - The retrieved data if successful, or `false` if an error occurs.
     */
    async getDataById(id) {
        try {
            return await this.databaseRepository.getDataById(id);
        } catch (e) {
            new LoggingService().logError(e);
            return false;
        }
    }

    /**
     * Stores data in the database repository by ID.
     *
     * @param {string|number} id - The ID to associate with the data.
     * @param {Object} data - The data to store.
     * @returns {Promise<boolean>} - `true` if the operation is successful, or `false` if an error occurs.
     */
    async setDataById(id, data) {
        try {
            await this.databaseRepository.setDataById(id, data);
            return true;
        } catch (e) {
            new LoggingService().logError(e);
            return false;
        }
    }

    /**
     * Removes data from database repository by ID.
     *
     * @param {string} id The ID of the record to remove.
     * @returns {Promise<void>} A promise that resolves when the data is removed.
     */
    async removeDataById(id) {
        try {
            await this.databaseRepository.removeDataById(id);
            return true;
        } catch (e) {
            new LoggingService().logError(e);
            return false;
        }
    }

    /**
     * Retrieves last record from database repository.
     *
     * @param {string} id The ID of the record to remove.
     * @returns {Promise<object>} A promise that resolves when the data is removed.
     */
    async getLatestRecord() {
        try {
            return await this.databaseRepository.getLatestRecord();
        } catch (e) {
            new LoggingService().logError(e);
            return false;
        }
    }

    /**
     * Retrieves the latest record that has a specific field with a particular value.
     *
     * @param {string} field - The field name to check in each record.
     * @param {*} value - The value to match against the field.
     * @returns {Promise<Object|null>} A promise that resolves with the matching record or null if no match is found.
     */
    async getLatestRecordByField(field, value) {
        try {
            return await this.databaseRepository.getLatestRecordByField(
                field,
                value
            );
        } catch (e) {
            new LoggingService().logError(e);
            return false;
        }
    }

    /**
     * Retrieves records that match multiple field criteria, with optional date range filtering and limit on results.
     *
     * @param {Object} criteria - An object with field-value pairs to match
     * @param {number} [limit=0] - Maximum number of records to return (0 for all)
     * @param {Object} [range] - Optional date range criteria
     * @param {Object} range.fieldName - The date field to filter on
     * @param {string} range.fieldName.start - ISO string of start date (inclusive)
     * @param {string} range.fieldName.end - ISO string of end date (inclusive)
     * @returns {Promise<Array>} A promise that resolves with matching records (empty array if none found)
     * @throws {Error} Throws an error if the operation fails
     */
    async getRecordsByFields(criteria, limit) {
        try {
            return await this.databaseRepository.getRecordsByFields(
                criteria,
                limit
            );
        } catch (e) {
            new LoggingService().logError(e);
            return false;
        }
    }

    /**
     * Clears transactions older than the specified number of months from the IndexedDB store.
     *
     * This method iterates through all records in the store, checks their transaction date against
     * the calculated cutoff date (current date minus specified months), and deletes records that
     * are older than the cutoff. The operation is performed in a single transaction for atomicity.
     *
     * @param {string} dateField - The name of the field in each record that contains the transaction date.
     *                            This field should contain a value that can be parsed by the Date constructor
     *                            (e.g., ISO 8601 string or timestamp).
     * @param {number} [months=6] - The number of months to use as the retention period. Records older than
     *                             this many months from the current date will be deleted. Defaults to 6 months.
     * @returns {Promise<number>} A promise that resolves with the count of deleted records when the operation
     *                           completes successfully. The promise will reject if any error occurs during
     *                           the operation.
     * @throws {Error} Throws an error if:
     *                 - The database cannot be opened
     *                 - The date field doesn't exist in a record
     *                 - A date value cannot be parsed
     *                 - Any deletion operation fails
     * @example
     * // Delete transactions older than 6 months (default)
     * repository.clearOldTransactions('transactionDateTime')
     *   .then(count => console.log(`Deleted ${count} old transactions`))
     *   .catch(err => console.error('Cleanup failed:', err));
     *
     * @example
     * // Delete transactions older than 12 months
     * repository.clearOldTransactions('createdAt', 12)
     *   .then(count => console.log(`Deleted ${count} records`));
     */
    async removeRecordsByDatefield(dateField, months = 6) {
        try {
            return await this.databaseRepository.removeRecordsByDatefield(
                dateField,
                months
            );
        } catch (e) {
            new LoggingService().logError(e);
            return false;
        }
    }
}

const databaseService = new DatabaseService(new IndexedDbRepository("records"));
export default databaseService;
