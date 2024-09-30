"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIGS = exports.ConfigParser = exports.isCloudCapability = exports.detectBackend = exports.getSauceEndpoint = exports.validateConfig = void 0;
const ConfigParser_1 = __importDefault(require("./lib/ConfigParser"));
exports.ConfigParser = ConfigParser_1.default;
const utils_1 = require("./utils");
Object.defineProperty(exports, "validateConfig", { enumerable: true, get: function () { return utils_1.validateConfig; } });
Object.defineProperty(exports, "getSauceEndpoint", { enumerable: true, get: function () { return utils_1.getSauceEndpoint; } });
Object.defineProperty(exports, "detectBackend", { enumerable: true, get: function () { return utils_1.detectBackend; } });
Object.defineProperty(exports, "isCloudCapability", { enumerable: true, get: function () { return utils_1.isCloudCapability; } });
const constants_1 = require("./constants");
Object.defineProperty(exports, "DEFAULT_CONFIGS", { enumerable: true, get: function () { return constants_1.DEFAULT_CONFIGS; } });
__exportStar(require("./types"), exports);
