import { Handler, Params, StructUser } from "./types";
import { NextRequest } from "next/server";
export declare const parseEntityToObject: (entity: any) => any;
export declare const withSession: <U extends StructUser>(handler: Handler<U>, params?: Params) => (req: NextRequest, context: {
    params?: Promise<any>;
}) => Promise<Response | undefined>;
