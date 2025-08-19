import type { Model, FilterQuery, UpdateQuery } from "mongoose";
/**
 * Generic Model Service to perform basic CRUD operations on any Mongoose model.
 */
export declare class ModelService<T> {
    private model;
    constructor(model: Model<T>);
    /**
     * Finds a single document by query.
     * @param query - MongoDB filter query.
     * @returns {Promise<T | null>} The found document or null.
     */
    findOne(query: FilterQuery<T>, ...args: any): Promise<T | null>;
    /**
     * Finds a document by ID.
     * @param id - Document ID.
     * @returns {Promise<T | null>} The found document or null.
     */
    findById(id: string | T, populate?: string[]): Promise<T | null>;
    /**
     * Finds multiple documents by query.
     * @param query - MongoDB filter query.
     * @returns {Promise<T[]>} Array of documents.
     */
    findMany(query?: FilterQuery<T>): Promise<T[]>;
    /**
     * Creates a new document.
     * @param data - Document data.
     * @returns {Promise<T>} The created document.
     */
    create(data: Partial<T>): Promise<T>;
    /**
     * Updates a document by query.
     * @param query - MongoDB filter query.
     * @param updates - Update data.
     * @returns {Promise<T | null>} The updated document or null.
     */
    updateOne(query: FilterQuery<T>, updates: UpdateQuery<T>): Promise<T | null>;
    /**
     * Update a document by ID.
     * @param id - Document ID.
     * @param updates - Update data.
     * @returns {Promise<T | null>} The updated document or null.
     */
    updateById(id: string, updates: UpdateQuery<T>): Promise<T | null>;
    /**
     * Deletes a document by query.
     * @param query - MongoDB filter query.
     * @returns {Promise<void>}
     */
    deleteOne(query: FilterQuery<T>): Promise<void>;
}
