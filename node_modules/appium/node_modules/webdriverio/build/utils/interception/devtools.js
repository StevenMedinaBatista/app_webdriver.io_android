"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const atob_1 = __importDefault(require("atob"));
const minimatch_1 = __importDefault(require("minimatch"));
const logger_1 = __importDefault(require("@wdio/logger"));
const _1 = __importDefault(require("."));
const __1 = require("..");
const constants_1 = require("../../constants");
const log = logger_1.default('webdriverio');
class DevtoolsInterception extends _1.default {
    static handleRequestInterception(client, mocks) {
        return async (event) => {
            const isRequest = !event.responseHeaders;
            const eventResponseHeaders = event.responseHeaders || [];
            const responseHeaders = eventResponseHeaders.reduce((headers, { name, value }) => {
                headers[name] = value;
                return headers;
            }, {});
            const { requestId, request, responseStatusCode = 200 } = event;
            for (const mock of mocks) {
                if (isRequest && (mock.respondOverwrites.length === 0 ||
                    (!mock.respondOverwrites[0].errorReason &&
                        mock.respondOverwrites[0].params &&
                        mock.respondOverwrites[0].params.fetchResponse !== false))) {
                    continue;
                }
                if (!minimatch_1.default(request.url, mock.url)) {
                    continue;
                }
                request.statusCode = responseStatusCode;
                request.responseHeaders = { ...responseHeaders };
                if (filterMethod(request.method, mock.filterOptions.method) ||
                    filterHeaders(request.headers, mock.filterOptions.requestHeaders) ||
                    filterHeaders(responseHeaders, mock.filterOptions.headers) ||
                    filterRequest(request.postData, mock.filterOptions.postData) ||
                    filterStatusCode(responseStatusCode, mock.filterOptions.statusCode)) {
                    continue;
                }
                const { body, base64Encoded = undefined } = isRequest ? { body: '' } : await client.send('Fetch.getResponseBody', { requestId }).catch(() => ({}));
                request.body = base64Encoded ? atob_1.default(body) : body;
                const contentTypeHeader = Object.keys(responseHeaders).find(h => h.toLowerCase() === 'content-type') || '';
                const responseContentType = responseHeaders[contentTypeHeader];
                request.body = responseContentType && responseContentType.includes('application/json')
                    ? tryParseJson(request.body)
                    : request.body;
                mock.matches.push(request);
                if (mock.respondOverwrites.length === 0) {
                    continue;
                }
                const { errorReason, overwrite, params = {} } = mock.respondOverwrites[0].sticky
                    ? mock.respondOverwrites[0]
                    : mock.respondOverwrites.shift() || {};
                if (overwrite !== undefined) {
                    let newBody = overwrite;
                    if (typeof overwrite === 'function') {
                        newBody = await overwrite(request, client);
                    }
                    const isBodyUndefined = typeof newBody === 'undefined';
                    if (isBodyUndefined) {
                        newBody = '';
                    }
                    if (typeof newBody !== 'string') {
                        newBody = JSON.stringify(newBody);
                    }
                    let responseCode = typeof params.statusCode === 'function' ? params.statusCode(request) : params.statusCode || responseStatusCode;
                    let responseHeaders = [
                        ...eventResponseHeaders,
                        ...Object.entries(typeof params.headers === 'function' ? params.headers(request) : params.headers || {}).map(([name, value]) => ({ name, value }))
                    ];
                    const responseFilePath = path_1.default.isAbsolute(newBody) ? newBody : path_1.default.join(process.cwd(), newBody);
                    if (newBody.length > 0 && await fs_extra_1.default.pathExists(responseFilePath) && await canAccess(responseFilePath)) {
                        newBody = await fs_extra_1.default.readFile(responseFilePath);
                    }
                    else if (newBody.startsWith('http')) {
                        responseCode = 301;
                        responseHeaders = responseHeaders.filter(({ name }) => name.toLowerCase() !== 'location');
                        responseHeaders.push({ name: 'Location', value: newBody });
                    }
                    request.mockedResponse = newBody;
                    return client.send('Fetch.fulfillRequest', {
                        requestId,
                        responseCode,
                        responseHeaders,
                        body: isBodyUndefined ? undefined : (newBody instanceof Buffer ? newBody : Buffer.from(newBody, 'utf8')).toString('base64')
                    }).catch(logFetchError);
                }
                if (errorReason) {
                    return client.send('Fetch.failRequest', {
                        requestId,
                        errorReason
                    }).catch(logFetchError);
                }
            }
            return client.send('Fetch.continueRequest', { requestId }).catch(logFetchError);
        };
    }
    get calls() {
        return this.matches;
    }
    clear() {
        this.matches = [];
    }
    restore() {
        this.clear();
        this.respondOverwrites = [];
    }
    respond(overwrite, params = {}) {
        this.respondOverwrites.push({ overwrite, params, sticky: true });
    }
    respondOnce(overwrite, params = {}) {
        this.respondOverwrites.push({ overwrite, params });
    }
    abort(errorReason, sticky = true) {
        if (typeof errorReason !== 'string' || !constants_1.ERROR_REASON.includes(errorReason)) {
            throw new Error(`Invalid value for errorReason, allowed are: ${constants_1.ERROR_REASON.join(', ')}`);
        }
        this.respondOverwrites.push({ errorReason, sticky });
    }
    abortOnce(errorReason) {
        this.abort(errorReason, false);
    }
}
exports.default = DevtoolsInterception;
const filterMethod = (method, expected) => {
    if (typeof expected === 'undefined') {
        return false;
    }
    if (typeof expected === 'function') {
        return expected(method) !== true;
    }
    return expected.toLowerCase() !== method.toLowerCase();
};
const filterHeaders = (responseHeaders, expected) => {
    if (typeof expected === 'undefined') {
        return false;
    }
    if (typeof expected === 'function') {
        return expected(responseHeaders) !== true;
    }
    return !__1.containsHeaderObject(responseHeaders, expected);
};
const filterRequest = (postData, expected) => {
    if (typeof expected === 'undefined') {
        return false;
    }
    if (typeof expected === 'function') {
        return expected(postData) !== true;
    }
    return postData !== expected;
};
const filterStatusCode = (statusCode, expected) => {
    if (typeof expected === 'undefined') {
        return false;
    }
    if (typeof expected === 'function') {
        return expected(statusCode) !== true;
    }
    return statusCode !== expected;
};
const canAccess = async (filepath) => {
    try {
        await fs_extra_1.default.access(filepath);
        return true;
    }
    catch (_a) {
        return false;
    }
};
const tryParseJson = (body) => {
    try {
        return JSON.parse(body) || body;
    }
    catch (_a) {
        return body;
    }
};
const logFetchError = (err) => {
    log.debug(err === null || err === void 0 ? void 0 : err.message);
};
