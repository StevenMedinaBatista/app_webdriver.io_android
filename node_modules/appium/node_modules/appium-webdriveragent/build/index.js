"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetTestProcesses = exports.checkForDependencies = exports.bundleWDASim = exports.WebDriverAgent = exports.WDA_RUNNER_BUNDLE_ID = exports.WDA_BUNDLE_ID = exports.WDA_BASE_URL = exports.PROJECT_FILE = exports.NoSessionProxy = exports.BOOTSTRAP_PATH = void 0;

require("source-map-support/register");

var dependencies = _interopRequireWildcard(require("./lib/check-dependencies"));

var proxies = _interopRequireWildcard(require("./lib/no-session-proxy"));

var driver = _interopRequireWildcard(require("./lib/webdriveragent"));

var constants = _interopRequireWildcard(require("./lib/constants"));

var utils = _interopRequireWildcard(require("./lib/utils"));

var _asyncbox = require("asyncbox");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const {
  checkForDependencies,
  bundleWDASim
} = dependencies;
exports.bundleWDASim = bundleWDASim;
exports.checkForDependencies = checkForDependencies;
const {
  NoSessionProxy
} = proxies;
exports.NoSessionProxy = NoSessionProxy;
const {
  WebDriverAgent
} = driver;
exports.WebDriverAgent = WebDriverAgent;
const {
  WDA_BUNDLE_ID,
  BOOTSTRAP_PATH,
  WDA_BASE_URL,
  WDA_RUNNER_BUNDLE_ID,
  PROJECT_FILE
} = constants;
exports.PROJECT_FILE = PROJECT_FILE;
exports.WDA_RUNNER_BUNDLE_ID = WDA_RUNNER_BUNDLE_ID;
exports.WDA_BASE_URL = WDA_BASE_URL;
exports.BOOTSTRAP_PATH = BOOTSTRAP_PATH;
exports.WDA_BUNDLE_ID = WDA_BUNDLE_ID;
const {
  resetTestProcesses
} = utils;
exports.resetTestProcesses = resetTestProcesses;

if (require.main === module) {
  (0, _asyncbox.asyncify)(checkForDependencies);
}require('source-map-support').install();


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImNoZWNrRm9yRGVwZW5kZW5jaWVzIiwiYnVuZGxlV0RBU2ltIiwiZGVwZW5kZW5jaWVzIiwiTm9TZXNzaW9uUHJveHkiLCJwcm94aWVzIiwiV2ViRHJpdmVyQWdlbnQiLCJkcml2ZXIiLCJXREFfQlVORExFX0lEIiwiQk9PVFNUUkFQX1BBVEgiLCJXREFfQkFTRV9VUkwiLCJXREFfUlVOTkVSX0JVTkRMRV9JRCIsIlBST0pFQ1RfRklMRSIsImNvbnN0YW50cyIsInJlc2V0VGVzdFByb2Nlc3NlcyIsInV0aWxzIiwicmVxdWlyZSIsIm1haW4iLCJtb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFHQSxNQUFNO0FBQUVBLEVBQUFBLG9CQUFGO0FBQXdCQyxFQUFBQTtBQUF4QixJQUF5Q0MsWUFBL0M7OztBQUNBLE1BQU07QUFBRUMsRUFBQUE7QUFBRixJQUFxQkMsT0FBM0I7O0FBQ0EsTUFBTTtBQUFFQyxFQUFBQTtBQUFGLElBQXFCQyxNQUEzQjs7QUFDQSxNQUFNO0FBQUVDLEVBQUFBLGFBQUY7QUFBaUJDLEVBQUFBLGNBQWpCO0FBQWlDQyxFQUFBQSxZQUFqQztBQUErQ0MsRUFBQUEsb0JBQS9DO0FBQXFFQyxFQUFBQTtBQUFyRSxJQUFzRkMsU0FBNUY7Ozs7OztBQUNBLE1BQU07QUFBRUMsRUFBQUE7QUFBRixJQUF5QkMsS0FBL0I7OztBQUlBLElBQUlDLE9BQU8sQ0FBQ0MsSUFBUixLQUFpQkMsTUFBckIsRUFBNkI7QUFDM0IsMEJBQVNqQixvQkFBVDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJy4vbGliL2NoZWNrLWRlcGVuZGVuY2llcyc7XG5pbXBvcnQgKiBhcyBwcm94aWVzIGZyb20gJy4vbGliL25vLXNlc3Npb24tcHJveHknO1xuaW1wb3J0ICogYXMgZHJpdmVyIGZyb20gJy4vbGliL3dlYmRyaXZlcmFnZW50JztcbmltcG9ydCAqIGFzIGNvbnN0YW50cyBmcm9tICcuL2xpYi9jb25zdGFudHMnO1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi9saWIvdXRpbHMnO1xuaW1wb3J0IHsgYXN5bmNpZnkgfSBmcm9tICdhc3luY2JveCc7XG5cblxuY29uc3QgeyBjaGVja0ZvckRlcGVuZGVuY2llcywgYnVuZGxlV0RBU2ltIH0gPSBkZXBlbmRlbmNpZXM7XG5jb25zdCB7IE5vU2Vzc2lvblByb3h5IH0gPSBwcm94aWVzO1xuY29uc3QgeyBXZWJEcml2ZXJBZ2VudCB9ID0gZHJpdmVyO1xuY29uc3QgeyBXREFfQlVORExFX0lELCBCT09UU1RSQVBfUEFUSCwgV0RBX0JBU0VfVVJMLCBXREFfUlVOTkVSX0JVTkRMRV9JRCwgUFJPSkVDVF9GSUxFIH0gPSBjb25zdGFudHM7XG5jb25zdCB7IHJlc2V0VGVzdFByb2Nlc3NlcyB9ID0gdXRpbHM7XG5cblxuLy8gV2hlbiBydW4gYXMgYSBjb21tYW5kIGxpbmUgdXRpbGl0eSwgdGhpcyBzaG91bGQgY2hlY2sgZm9yIHRoZSBkZXBlbmRlbmNpZXNcbmlmIChyZXF1aXJlLm1haW4gPT09IG1vZHVsZSkge1xuICBhc3luY2lmeShjaGVja0ZvckRlcGVuZGVuY2llcyk7XG59XG5cbmV4cG9ydCB7XG4gIFdlYkRyaXZlckFnZW50LFxuICBOb1Nlc3Npb25Qcm94eSxcbiAgY2hlY2tGb3JEZXBlbmRlbmNpZXMsIGJ1bmRsZVdEQVNpbSxcbiAgcmVzZXRUZXN0UHJvY2Vzc2VzLFxuICBCT09UU1RSQVBfUEFUSCwgV0RBX0JVTkRMRV9JRCxcbiAgV0RBX1JVTk5FUl9CVU5ETEVfSUQsIFBST0pFQ1RfRklMRSxcbiAgV0RBX0JBU0VfVVJMLFxufTtcbiJdLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi4ifQ==
