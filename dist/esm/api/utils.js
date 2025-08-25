import { Struct } from "../config";
export const parseEntityToObject = (entity) => {
    if (!entity)
        return entity;
    if (Array.isArray(entity))
        return entity.map((item) => parseEntityToObject(item));
    const _id = entity?._id?.toString?.() || entity?._id;
    const parsed = entity?.toJSON?.();
    return JSON.parse(JSON.stringify(parsed || { ...entity, _id }));
};
export const withSession = (handler, params = {}) => {
    return async (req, context) => {
        try {
            let user = null;
            if (Struct.config?.database?.startConnection)
                await Struct.config?.database?.startConnection?.();
            if (Struct.config?.auth?.getSession) {
                const session = await Struct.config?.auth?.getSession?.();
                user = session?.user || null;
                if (!user)
                    return Response.json({ message: 'Unauthorized' }, { status: 401 });
                const roles = Array.isArray(params.roles) ? params.roles : [params.roles];
                if (params.roles && !roles.includes(user.role))
                    return Response.json({ message: 'Forbidden' }, { status: 403 });
            }
            return (await Promise.all([handler({ user }, req, context)])).at(0);
        }
        catch (err) {
            const error = err?.flatten ? err.flatten().fieldErrors.map(([key, [msg]]) => `${key}: ${msg || "Campo inválido"}`) : err.message || 'Internal Server Error';
            console.log(error);
            return Response.json({ error }, { status: 500 });
        }
    };
};
