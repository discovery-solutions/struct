let config = {};
export const Struct = {
    configure: (cfg) => {
        config = cfg;
        if (cfg.database?.startConnection)
            Promise.resolve(cfg.database.startConnection()).catch(console.error);
    },
    get config() {
        return config;
    }
};
