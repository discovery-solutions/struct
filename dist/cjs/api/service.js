"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelService = void 0;
const utils_1 = require("./utils");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Generic Model Service to perform basic CRUD operations on any Mongoose model.
 */
class ModelService {
    constructor(model) {
        this.model = model;
    }
    /**
     * Finds a single document by query.
     * @param query - MongoDB filter query.
     * @returns {Promise<T | null>} The found document or null.
     */
    async findOne(query, ...args) {
        const raw = await this.model.findOne(query, ...args).lean();
        return (0, utils_1.parseEntityToObject)(raw);
    }
    /**
     * Finds a document by ID.
     * @param id - Document ID.
     * @returns {Promise<T | null>} The found document or null.
     */
    async findById(id, populate = []) {
        let q = this.model.findById(id);
        if (populate && (Array.isArray(populate) ? populate.length > 0 : true)) {
            // cast necessário porque as overloads de populate no typing do mongoose são limitadas
            q = q.populate(populate);
        }
        const raw = await q.lean().exec();
        return raw ? ((0, utils_1.parseEntityToObject)(raw)) : null;
    }
    /**
     * Finds multiple documents by query.
     * @param query - MongoDB filter query.
     * @returns {Promise<T[]>} Array of documents.
     */
    async findMany(query = {}) {
        const raw = await this.model.find(query).lean();
        return (0, utils_1.parseEntityToObject)(raw);
    }
    /**
     * Creates a new document.
     * @param data - Document data.
     * @returns {Promise<T>} The created document.
     */
    async create(data) {
        return (0, utils_1.parseEntityToObject)(await this.model.create(data));
    }
    /**
     * Updates a document by query.
     * @param query - MongoDB filter query.
     * @param updates - Update data.
     * @returns {Promise<T | null>} The updated document or null.
     */
    async updateOne(query, updates) {
        return await this.model.findOneAndUpdate(query, updates, { new: true }).lean();
    }
    /**
     * Update a document by ID.
     * @param id - Document ID.
     * @param updates - Update data.
     * @returns {Promise<T | null>} The updated document or null.
     */
    async updateById(id, updates) {
        const raw = await this.model.updateOne({ _id: new mongoose_1.default.Types.ObjectId(id) }, updates);
        return (0, utils_1.parseEntityToObject)(raw);
    }
    /**
     * Deletes a document by query.
     * @param query - MongoDB filter query.
     * @returns {Promise<void>}
     */
    async deleteOne(query) {
        await await this.model.deleteOne(query);
    }
}
exports.ModelService = ModelService;
