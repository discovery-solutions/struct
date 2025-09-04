import { parseEntityToObject } from "./utils";
import mongoose from "mongoose";
/**
 * Generic Model Service to perform basic CRUD operations on any Mongoose model.
 */
export class ModelService {
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
        return parseEntityToObject(raw);
    }
    /**
     * Finds a document by ID.
     * @param id - Document ID.
     * @returns {Promise<T | null>} The found document or null.
     */
    async findById(id, populate = []) {
        const raw = await this.model.findById(id).populate(populate).lean();
        return parseEntityToObject(raw);
    }
    /**
     * Finds multiple documents by query.
     * @param query - MongoDB filter query.
     * @returns {Promise<T[]>} Array of documents.
     */
    async findMany(query = {}) {
        const raw = await this.model.find(query).lean();
        return parseEntityToObject(raw);
    }
    /**
     * Creates a new document.
     * @param data - Document data.
     * @returns {Promise<T>} The created document.
     */
    async create(data) {
        return parseEntityToObject(await this.model.create(data));
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
        const raw = await this.model.updateOne({ _id: new mongoose.Types.ObjectId(id) }, updates);
        return parseEntityToObject(raw);
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
