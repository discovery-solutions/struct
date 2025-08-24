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
            if (config_1.Struct.config?.database?.startConnection)
                await config_1.Struct.config?.database?.startConnection?.();
            if (config_1.Struct.config?.auth?.getSession) {
                console.log(config_1.Struct.config?.auth?.getSession);
                const session = await config_1.Struct.config?.auth?.getSession?.();
                user = session?.user || null;
                if (!user)
                    return Response.json({ message: 'Unauthorized' }, { status: 401 });
                const roles = Array.isArray(params.role) ? params.role : [params.role];
                console.log(roles, session, user.role);
                if (params.role && !roles.includes(user.role))
                    return Response.json({ message: 'Forbidden' }, { status: 403 });
            }
            return (await Promise.all([handler({ user }, req, context)])).at(0);
        }
        catch (e) {
            const error = e?.flatten ? e.flatten().fieldErrors : e.message || 'Internal Server Error';
            return Response.json({ error }, { status: 500 });
        }
    };
};
exports.withSession = withSession;
