import { Handler, Params, StructUser } from "./types";
import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { Struct } from "../config";

export const parseEntityToObject = (entity: any): any => {
  if (!entity) return entity;

  if (Array.isArray(entity))
    return entity.map((item: any) => parseEntityToObject(item));

  const _id = entity?._id?.toString?.() || entity?._id;
  const parsed = entity?.toJSON?.();

  return JSON.parse(JSON.stringify(parsed || { ...entity, _id }));
}

export const withSession = <U extends StructUser>(handler: Handler<U>, params: Params = {}) => {
  return async (req: NextRequest, context: { params: Promise<any> }) => {
    try {
      let user = null as U | null;

      if (Struct.config?.database?.startConnection)
        await Struct.config?.database?.startConnection?.();

      if (Struct.config?.auth?.getSession) {
        const session = await Struct.config?.auth?.getSession?.();
        user = session?.user as U || null;

        if (!user)
          return Response.json({ message: 'Unauthorized' }, { status: 401 })

        const roles = Array.isArray(params.roles) ? params.roles : [params.roles];
        if (params.roles && !roles.includes(user.role))
          return Response.json({ message: 'Forbidden' }, { status: 403 });
      }

      return (await Promise.all([handler({ user }, req, context)])).at(0);
    } catch (err: ZodError | any) {
      const error = err?.flatten ? Object.values(err.flatten().fieldErrors).flat().map((msg) => `${msg || "Campo inválido"}`) : err.message || 'Internal Server Error';
      console.log(error);
      return Response.json({ error }, { status: 500 });
    }
  }
}