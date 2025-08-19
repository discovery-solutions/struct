import { Model } from "mongoose";
import { CRUDOptions, StructUser } from "./types";
import { NextRequest } from "next/server";
/**
 * Generic CRUD controller — now backed by ModelService for core ops.
 */
export declare class CRUDController<T, U extends StructUser = StructUser> {
    private model;
    private options;
    private service;
    constructor(model: Model<T>, options?: CRUDOptions<T, U>);
    private getRoleForMethod;
    GET: (req: NextRequest, context: {
        params?: Promise<any>;
    }) => Promise<Response | undefined>;
    POST: (req: NextRequest, context: {
        params?: Promise<any>;
    }) => Promise<Response | undefined>;
    PATCH: (req: NextRequest, context: {
        params?: Promise<any>;
    }) => Promise<Response | undefined>;
    DELETE: (req: NextRequest, context: {
        params?: Promise<any>;
    }) => Promise<Response | undefined>;
    dynamic: any;
    runtime: any;
    private parseFilters;
}
