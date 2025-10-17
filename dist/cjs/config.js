"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Struct = void 0;
let config = {};
exports.Struct = {
    configure: (cfg) => {
        config = cfg;
        if (cfg.database?.startConnection)
            Promise.resolve(cfg.database.startConnection()).catch(console.error);
    },
    get config() {
        return config;
    }
};
