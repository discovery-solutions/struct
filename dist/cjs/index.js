"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelService = exports.CRUDController = exports.Struct = void 0;
var config_1 = require("./config");
Object.defineProperty(exports, "Struct", { enumerable: true, get: function () { return config_1.Struct; } });
var crud_1 = require("./api/crud");
Object.defineProperty(exports, "CRUDController", { enumerable: true, get: function () { return crud_1.CRUDController; } });
var service_1 = require("./api/service");
Object.defineProperty(exports, "ModelService", { enumerable: true, get: function () { return service_1.ModelService; } });
