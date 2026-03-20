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
export const getLogger = () => ({
    info: config.logger?.info ?? console.log,
    error: config.logger?.error ?? console.error,
    warn: config.logger?.warn ?? console.warn,
});
