import { NextRequest } from "next/server";
import { z } from "zod";
export type StructUser = {
    id: string;
    email?: string;
    role?: string;
    [key: string]: any;
};
export interface HookContext<T, U extends StructUser = StructUser> {
    user: U | null;
    data?: T;
    original?: T | null;
}
export interface Hooks<T, U extends StructUser = StructUser> {
    beforeCreate?: (ctx: HookContext<T, U>) => Promise<Partial<T> | void | boolean>;
    afterCreate?: (ctx: HookContext<T, U> & {
        created: T;
    }) => Promise<void>;
    beforeUpdate?: (ctx: HookContext<T, U> & {
        id: string;
    }) => Promise<Partial<T> | void | boolean>;
    afterUpdate?: (ctx: HookContext<T, U> & {
        updated: T;
    }) => Promise<void>;
    beforeDelete?: (ctx: HookContext<T, U>) => Promise<void>;
    afterDelete?: (ctx: HookContext<T, U>) => Promise<void>;
    beforeGet?: (ctx: HookContext<T, U> & {
        query: any;
        id?: string;
    }) => Promise<void>;
    afterGet?: (ctx: HookContext<T, U> & {
        query: any;
        id?: string;
        result: T | T[] | null;
    }) => Promise<T>;
    beforeSend?: (result: T | T[] | null, ctx: HookContext<T, U> & {
        id?: string;
        method: string;
        query?: any;
    }) => Promise<any>;
}
export interface CRUDOptions<T, U extends StructUser = StructUser> {
    populate?: (keyof T)[] | any;
    createSchema?: z.infer<any>;
    updateSchema?: z.infer<any>;
    hooks?: Hooks<T, U>;
    softDelete?: boolean;
    customParser?: (req: NextRequest) => Promise<Partial<T>>;
    roles?: Partial<Record<"GET" | "POST" | "PATCH" | "DELETE", string | string[]>>;
    sort?: Record<string, 1 | -1> | string[];
}
export interface Params {
    roles?: string | string[];
}
export type Handler<U extends StructUser> = (session: {
    user: U | null;
}, req: NextRequest, context: {
    params?: Promise<any>;
}) => Promise<Response>;
