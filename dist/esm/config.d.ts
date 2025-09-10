import { NextRequest } from "next/server";
export type StructConfig = {
    database?: {
        startConnection: (...args: any) => Promise<any>;
    };
    auth?: {
        getSession?: (req?: NextRequest, context?: {
            params: Promise<any>;
        }) => Promise<any>;
        getUser?: () => Promise<any>;
    };
};
export declare const Struct: {
    configure: (cfg: StructConfig) => void;
    readonly config: StructConfig;
};
