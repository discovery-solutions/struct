import { NextRequest } from "next/server";
export type StructLogger = {
    info?: (...args: any[]) => void;
    error?: (...args: any[]) => void;
    warn?: (...args: any[]) => void;
};
export type StructConfig = {
    database?: {
        startConnection: (dbName?: string) => Promise<any>;
        closeConnection?: (dbName?: string) => Promise<any>;
    };
    auth?: {
        getSession?: (req?: NextRequest, context?: {
            params: Promise<any>;
        }) => Promise<any>;
        getUser?: () => Promise<any>;
    };
    logger?: StructLogger;
};
export declare const Struct: {
    configure: (cfg: StructConfig) => void;
    readonly config: StructConfig;
};
export declare const getLogger: () => Required<StructLogger>;
