"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsolateSocket = void 0;
const rpc_websockets_1 = require("rpc-websockets");
class IsolateSocket extends rpc_websockets_1.Client {
    constructor() {
        super(...arguments);
        this.isolateId = 0;
    }
    async executeSocketCommand(cmd) {
        // call an RPC method with parameters
        return this.call(`ext.flutter.driver`, {
            ...cmd,
            isolateId: this.isolateId,
        });
    }
}
exports.IsolateSocket = IsolateSocket;
//# sourceMappingURL=isolate_socket.js.map