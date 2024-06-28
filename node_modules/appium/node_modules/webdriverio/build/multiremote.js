"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiRemoteDriver = void 0;
const lodash_zip_1 = __importDefault(require("lodash.zip"));
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const utils_1 = require("@wdio/utils");
const middlewares_1 = require("./middlewares");
const utils_2 = require("./utils");
class MultiRemote {
    constructor() {
        this.instances = {};
    }
    async addInstance(browserName, client) {
        this.instances[browserName] = await client;
        return this.instances[browserName];
    }
    modifier(wrapperClient) {
        const propertiesObject = {};
        propertiesObject.commandList = { value: wrapperClient.commandList };
        propertiesObject.options = { value: wrapperClient.options };
        for (const commandName of wrapperClient.commandList) {
            propertiesObject[commandName] = {
                value: this.commandWrapper(commandName),
                configurable: true
            };
        }
        propertiesObject['__propertiesObject__'] = {
            value: propertiesObject
        };
        this.baseInstance = new MultiRemoteDriver(this.instances, propertiesObject);
        const client = Object.create(this.baseInstance, propertiesObject);
        for (const [identifier, instance] of Object.entries(this.instances)) {
            client[identifier] = instance;
        }
        return client;
    }
    static elementWrapper(instances, result, propertiesObject) {
        const prototype = { ...propertiesObject, ...lodash_clonedeep_1.default(utils_2.getPrototype('element')), scope: { value: 'element' } };
        const element = utils_1.webdriverMonad({}, (client) => {
            for (const [i, identifier] of Object.entries(Object.keys(instances))) {
                client[identifier] = result[i];
            }
            client.instances = Object.keys(instances);
            delete client.sessionId;
            return client;
        }, prototype);
        return element(this.sessionId, middlewares_1.multiremoteHandler(utils_1.wrapCommand));
    }
    commandWrapper(commandName) {
        const instances = this.instances;
        return utils_1.wrapCommand(commandName, async function (...args) {
            const result = await Promise.all(Object.entries(instances).map(([, instance]) => instance[commandName](...args)));
            if (commandName === '$') {
                return MultiRemote.elementWrapper(instances, result, this.__propertiesObject__);
            }
            else if (commandName === '$$') {
                const zippedResult = lodash_zip_1.default(...result);
                return zippedResult.map((singleResult) => MultiRemote.elementWrapper(instances, singleResult, this.__propertiesObject__));
            }
            return result;
        });
    }
}
exports.default = MultiRemote;
class MultiRemoteDriver {
    constructor(instances, propertiesObject) {
        this.isMultiremote = true;
        this.instances = Object.keys(instances);
        this.__propertiesObject__ = propertiesObject;
    }
    on(eventName, emitter) {
        this.instances.forEach((instanceName) => this[instanceName].on(eventName, emitter));
        return undefined;
    }
    once(eventName, emitter) {
        this.instances.forEach((instanceName) => this[instanceName].once(eventName, emitter));
        return undefined;
    }
    emit(eventName, emitter) {
        return this.instances.map((instanceName) => this[instanceName].emit(eventName, emitter)).some(Boolean);
    }
    eventNames() {
        return this.instances.map((instanceName) => this[instanceName].eventNames());
    }
    getMaxListeners() {
        return this.instances.map((instanceName) => this[instanceName].getMaxListeners());
    }
    listenerCount(eventName) {
        return this.instances.map((instanceName) => this[instanceName].listenerCount(eventName));
    }
    listeners(eventName) {
        return this.instances.map((instanceName) => this[instanceName].listeners(eventName)).reduce((prev, cur) => {
            prev.concat(cur);
            return prev;
        }, []);
    }
    removeListener(eventName, emitter) {
        this.instances.forEach((instanceName) => this[instanceName].removeListener(eventName, emitter));
        return undefined;
    }
    removeAllListeners(eventName) {
        this.instances.forEach((instanceName) => this[instanceName].removeAllListeners(eventName));
        return undefined;
    }
}
exports.MultiRemoteDriver = MultiRemoteDriver;
