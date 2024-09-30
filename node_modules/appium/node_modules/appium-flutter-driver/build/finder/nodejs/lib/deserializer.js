"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserialize = void 0;
const base64url_1 = require("./base64url");
// @todo consider using protobuf
exports.deserialize = (base64String) => JSON.parse(base64url_1.decode(base64String));
//# sourceMappingURL=deserializer.js.map