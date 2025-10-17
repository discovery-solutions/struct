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

export const withSession = <U extends StructUser>(
  handler: Handler<U>,
  params: Params = {}
) => {
  return async (req: NextRequest, context: { params: Promise<any> }) => {
    try {
      let user = null as U | null;

      if (Struct.config?.database?.startConnection) {
        console.log("[withSession] Starting DB connection...");
        await Promise.resolve(Struct.config?.database?.startConnection?.(params?.database));
      }

      if (Struct.config?.auth?.getSession) {
        console.log("[withSession] Checking user session...");
        const session = await Struct.config?.auth?.getSession?.(req, context);
        user = (session?.user as U) || null;

        if (!user) {
          return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const roles = Array.isArray(params.roles)
          ? params.roles
          : [params.roles];
        const isAllowed =
          roles.includes(user.role) ||
          roles.includes("*") ||
          roles.length === 0;

        if (params.roles && !isAllowed) {
          return Response.json({ message: "Forbidden" }, { status: 403 });
        }
      }

      return await handler({ user }, req, context);
    } catch (err: ZodError | any) {
      const error = err?.flatten
        ? Object.values(err.flatten().fieldErrors)
          .flat()
          .map((msg) => `${msg || "Campo inválido"}`)
        : err.message || "Internal Server Error";

      console.log(error);
      return Response.json({ error }, { status: 500 });
    } finally {
      // garante que sempre será chamado
      if (Struct.config?.database?.closeConnection) {
        console.log("[withSession] Closing DB connection...");
        await Promise.resolve(Struct.config?.database?.closeConnection?.(params?.database));
      }
    }
  };
};
