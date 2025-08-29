"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withSession = exports.parseEntityToObject = void 0;
const config_1 = require("../config");
const parseEntityToObject = (entity) => {
    if (!entity)
        return entity;
    if (Array.isArray(entity))
        return entity.map((item) => (0, exports.parseEntityToObject)(item));
    const _id = entity?._id?.toString?.() || entity?._id;
    const parsed = entity?.toJSON?.();
    return JSON.parse(JSON.stringify(parsed || { ...entity, _id }));
};
exports.parseEntityToObject = parseEntityToObject;
const withSession = (handler, params = {}) => {
    return async (req, context) => {
        try {
            let user = null;
            if (config_1.Struct.config?.database?.startConnection) {
                console.log("[withSession] Starting DB connection...");
                await config_1.Struct.config?.database?.startConnection?.();
            }
            if (config_1.Struct.config?.auth?.getSession) {
                console.log("[withSession] Checking user session...");
                const session = await config_1.Struct.config?.auth?.getSession?.();
                user = session?.user || null;
                if (!user)
                    return Response.json({ message: 'Unauthorized' }, { status: 401 });
                const roles = Array.isArray(params.roles) ? params.roles : [params.roles];
                const isAllowed = roles.includes(user.role) || roles.includes("*") || roles.length === 0;
                if (params.roles && !isAllowed)
                    return Response.json({ message: 'Forbidden' }, { status: 403 });
            }
            return (await Promise.all([handler({ user }, req, context)])).at(0);
        }
        catch (err) {
            const error = err?.flatten ? Object.values(err.flatten().fieldErrors).flat().map((msg) => `${msg || "Campo inválido"}`) : err.message || 'Internal Server Error';
            console.log(error);
            return Response.json({ error }, { status: 500 });
        }
    };
};
exports.withSession = withSession;
