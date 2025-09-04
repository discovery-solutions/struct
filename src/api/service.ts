import type { Model, FilterQuery, UpdateQuery } from "mongoose";
import { parseEntityToObject } from "./utils";
import mongoose from "mongoose";

/**
 * Generic Model Service to perform basic CRUD operations on any Mongoose model.
 */
export class ModelService<T> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Finds a single document by query.
   * @param query - MongoDB filter query.
   * @returns {Promise<T | null>} The found document or null.
   */
  async findOne(query: FilterQuery<T>, ...args: any): Promise<T | null> {
    const raw = await this.model.findOne(query, ...args).lean() as T | null;
    return parseEntityToObject(raw);
  }

  /**
   * Finds a document by ID.
   * @param id - Document ID.
   * @returns {Promise<T | null>} The found document or null.
   */
  async findById(id: string | T, populate: string[] = []): Promise<T | null> {
    const raw = await this.model.findById(id).populate(populate).lean() as T | null;
    return parseEntityToObject(raw);
  }

  /**
   * Finds multiple documents by query.
   * @param query - MongoDB filter query.
   * @returns {Promise<T[]>} Array of documents.
   */
  async findMany(query: FilterQuery<T> = {}): Promise<T[]> {
    const raw = await this.model.find(query).lean() as T[];
    return parseEntityToObject(raw);
  }

  /**
   * Creates a new document.
   * @param data - Document data.
   * @returns {Promise<T>} The created document.
   */
  async create(data: Partial<T>): Promise<T> {
    return parseEntityToObject(await this.model.create(data));
  }

  /**
   * Updates a document by query.
   * @param query - MongoDB filter query.
   * @param updates - Update data.
   * @returns {Promise<T | null>} The updated document or null.
   */
  async updateOne(query: FilterQuery<T>, updates: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findOneAndUpdate(query, updates, { new: true }).lean() as T | null;
  }

  /**
   * Update a document by ID.
   * @param id - Document ID.
   * @param updates - Update data.
   * @returns {Promise<T | null>} The updated document or null.
   */
  async updateById(id: string, updates: UpdateQuery<T>): Promise<T | null> {
    const raw = await this.model.updateOne({ _id: new mongoose.Types.ObjectId(id) }, updates)
    return parseEntityToObject(raw);
  }

  /**
   * Deletes a document by query.
   * @param query - MongoDB filter query.
   * @returns {Promise<void>}
   */
  async deleteOne(query: FilterQuery<T>): Promise<void> {
    await await this.model.deleteOne(query);
  }
}