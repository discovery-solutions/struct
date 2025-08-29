import mongoose, { isObjectIdOrHexString } from "mongoose";
import { ModelService } from "./service";
import { withSession } from "./utils";
import { Struct } from '../';
/**
 * Generic CRUD controller — now backed by ModelService for core ops.
 */
export class CRUDController {
    constructor(model, options = {}) {
        this.model = model;
        this.options = options;
        this.GET = withSession(async ({ user }, req, { params }) => {
            let { id } = (await params) || {};
            const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
            const query = this.parseFilters(searchParams);
            if (Array.isArray(id))
                id = id.at(0);
            if (this.options.hooks?.beforeGet) {
                await this.options.hooks.beforeGet({ user, query, id });
            }
            let result;
            let response = {};
            if (id) {
                query._id = new mongoose.Types.ObjectId(id);
                result = await this.service.findOne(query);
                response = result;
            }
            else {
                // pagination logic still on model for count/skip
                let { page, limit, ...filter } = clearQuery(query);
                page = parseInt(page || "1", 10);
                limit = parseInt(limit || "0", 10);
                const skip = (page - 1) * limit;
                const total = await this.model.countDocuments(filter);
                let q = this.model.find(filter);
                if (this.options.populate)
                    this.options.populate.forEach((p) => q = q.populate(p));
                if (limit > 0)
                    q = q.skip(skip).limit(limit);
                result = await q.sort({ updatedAt: -1 }).lean();
                response = { page, limit, total, totalPages: limit > 0 ? Math.ceil(total / limit) : 1, data: result };
            }
            if (this.options.hooks?.afterGet) {
                if (Array.isArray(result)) {
                    for (let i = 0; i < result.length; i++) {
                        result[i] = await this.options.hooks.afterGet({ user, query, id, result: result[i] });
                    }
                    response.data = result.filter(Boolean);
                }
                else {
                    response = await this.options.hooks.afterGet({ user, query, id, result });
                }
            }
            if (this.options.hooks?.beforeSend) {
                if (id || !Array.isArray(result)) {
                    response = await this.options.hooks.beforeSend(result, { user, id, method: "GET", query });
                }
                else {
                    response.data = await this.options.hooks.beforeSend(result, { user, id, method: "GET", query });
                }
            }
            if (!searchParams.page && !searchParams.limit && response?.data) {
                response = response.data;
            }
            if (!response)
                return Response.json({ message: "Not Found" }, { status: 404 });
            return Response.json(response);
        }, { roles: this.getRoleForMethod("GET") });
        this.POST = withSession(async ({ user }, req) => {
            let body;
            try {
                body = this.options.customParser ? await this.options.customParser(req) : await req.json();
            }
            catch (error) {
                return Response.json({ message: "Invalid request body", detail: error.message }, { status: 400 });
            }
            if (this.options.hooks?.beforeCreate) {
                const patched = await this.options.hooks.beforeCreate({ user, data: body });
                body = { ...body, ...patched };
            }
            if (this.options.createSchema) {
                await this.options.createSchema.parseAsync(body);
            }
            let created;
            try {
                created = await this.service.create({ ...body, createdAt: new Date(), updatedAt: new Date() });
            }
            catch (error) {
                if (JSON.stringify(error.message).includes("duplicate key error collection"))
                    throw new Error("Duplicated primary key in database");
                throw error;
            }
            if (this.options.hooks?.afterCreate) {
                await this.options.hooks.afterCreate({ user, data: body, created });
            }
            let response = created;
            if (this.options.hooks?.beforeSend) {
                response = await this.options.hooks.beforeSend(created, { user, method: "POST" });
            }
            return Response.json(response);
        }, { roles: this.getRoleForMethod("POST") });
        this.PATCH = withSession(async ({ user }, req, { params }) => {
            const [id] = (await params).id;
            let body = this.options.customParser
                ? await this.options.customParser(req)
                : await req.json();
            const original = await this.service.findOne({ _id: new mongoose.Types.ObjectId(id) });
            if (!original)
                return Response.json({ message: "Not Found" }, { status: 404 });
            if (this.options.hooks?.beforeUpdate) {
                const patched = await this.options.hooks.beforeUpdate({ user, data: body });
                if (patched === true)
                    return Response.json({ message: "Ok" });
                body = { ...body, ...patched };
            }
            if (this.options.updateSchema) {
                await this.options.updateSchema.partial().parseAsync(body);
            }
            const updated = await this.service.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { ...body, updatedAt: new Date() });
            if (!updated)
                return Response.json({ message: "Not Found" }, { status: 404 });
            if (this.options.hooks?.afterUpdate) {
                await this.options.hooks.afterUpdate({ user, data: body, original, updated });
            }
            let response = updated;
            if (this.options.hooks?.beforeSend) {
                response = await this.options.hooks.beforeSend(updated, { user, id, method: "PATCH" });
            }
            if (response)
                return Response.json(response);
            return Response.json({ message: "Update failed" }, { status: 500 });
        }, { roles: this.getRoleForMethod("PATCH") });
        this.DELETE = withSession(async ({ user }, _, { params }) => {
            const { id: [id] } = (await params) || { id: [undefined] };
            if (!id)
                return Response.json({ message: "Not Found" }, { status: 404 });
            const original = await this.service.findOne({ _id: new mongoose.Types.ObjectId(id) });
            if (!original)
                return Response.json({ message: "Not Found" }, { status: 404 });
            if (this.options.hooks?.beforeDelete) {
                await this.options.hooks.beforeDelete({ user, original });
            }
            if (this.options.softDelete) {
                await this.service.updateById(id, { deletedAt: new Date() });
            }
            else {
                await this.service.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
            }
            if (this.options.hooks?.afterDelete) {
                await this.options.hooks.afterDelete({ user, original });
            }
            return Response.json({ success: true });
        }, { roles: this.getRoleForMethod("DELETE") });
        this.dynamic = "force-dynamic";
        this.runtime = "nodejs";
        this.parseFilters = (filters) => {
            const parsedFilters = {};
            for (const [key, value] of Object.entries(filters)) {
                if (!key.includes(".")) {
                    parsedFilters[key] = value;
                    continue;
                }
                const parts = key.split(".");
                let current = parsedFilters;
                parts.forEach((part, idx) => {
                    if (idx === parts.length - 1) {
                        current[part] = value;
                    }
                    else {
                        current[part] = current[part] || {};
                        current = current[part];
                    }
                });
            }
            // 2. Converte campos comuns em ObjectId
            if (parsedFilters.id || parsedFilters._id) {
                parsedFilters._id = new mongoose.Types.ObjectId(parsedFilters.id || parsedFilters._id);
                delete parsedFilters.id;
            }
            if (this.model.modelName === "Business") {
                delete parsedFilters.business;
            }
            else if (typeof parsedFilters.business === "string") {
                parsedFilters.business = new mongoose.Types.ObjectId(parsedFilters.business);
            }
            // 3. Converte recursivamente qualquer propriedade "id" que pareça um ObjectId
            const convertObjectIds = (obj) => {
                for (const [key, value] of Object.entries(obj)) {
                    if (value && typeof value === "object" && !Array.isArray(value)) {
                        convertObjectIds(value);
                    }
                    else if (key === "id" && isObjectIdOrHexString(value)) {
                        obj[key] = new mongoose.Types.ObjectId(value);
                    }
                }
            };
            convertObjectIds(parsedFilters);
            // 4. Soft delete
            if (this.options.softDelete) {
                parsedFilters.$or = [
                    { deletedAt: { $exists: false } },
                    { deletedAt: null },
                ];
            }
            return parsedFilters;
        };
        Struct.config.database?.startConnection?.().catch(console.error);
        this.service = new ModelService(model);
    }
    getRoleForMethod(method) {
        return (this.options.roles?.[method] ?? "candidate");
    }
}
const clearQuery = (query) => {
    const cleared = { ...query };
    delete cleared.populate;
    return cleared;
};
