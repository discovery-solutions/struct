export type StructConfig = {
    database?: {
        startConnection: (...args: any) => Promise<any>;
    };
    auth?: {
        getSession?: () => Promise<any>;
        getUser?: () => Promise<any>;
    };
};
export declare const Struct: {
    configure: (cfg: StructConfig) => void;
    readonly config: StructConfig;
};
