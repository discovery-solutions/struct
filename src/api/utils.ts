import { Handler, Params, StructUser } from "./types";
import { NextRequest } from "next/server";
import { Struct } from "../config";
import { ZodError } from "zod";

export const parseEntityToObject = (entity: any): any => {
  if (!entity) return entity;

  if (Array.isArray(entity))
    return entity.map((item: any) => parseEntityToObject(item));

  const _id = entity?._id?.toString?.() || entity?._id;
  const parsed = entity?.toJSON?.();

  return JSON.parse(JSON.stringify(parsed || { ...entity, _id }));
}

export const withSession = <U extends StructUser>(handler: Handler<U>, params: Params = {}) => {
  return async (req: NextRequest, context: { params?: Promise<any> }) => {
    try {
      let user = null as U | null;

      if (Struct.config?.auth?.getSession)
        await Struct.config?.database?.startConnection?.();

      if (Struct.config?.auth?.getSession) {
        user = await Struct.config?.auth?.getSession?.();

        if (!user)
          return Response.json({ message: 'Unauthorized' }, { status: 401 })

        if (params.role && user.role !== params.role)
          return Response.json({ message: 'Forbidden' }, { status: 403 });
      }

      return (await Promise.all([handler({ user }, req, context)])).at(0);
    } catch (e: ZodError | any) {
      const error = e?.flatten ? e.flatten().fieldErrors : e.message || 'Internal Server Error';
      return Response.json({ error }, { status: 500 });
    }
  }
}