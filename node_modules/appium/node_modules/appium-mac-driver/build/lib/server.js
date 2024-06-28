"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startServer = startServer;

require("source-map-support/register");

var _logger = _interopRequireDefault(require("./logger"));

var _appiumBaseDriver = require("appium-base-driver");

var _driver = require("./driver");

async function startServer(port, address) {
  const driver = new _driver.MacDriver({
    port,
    address
  });
  const server = await (0, _appiumBaseDriver.server)({
    routeConfiguringFunction: (0, _appiumBaseDriver.routeConfiguringFunction)(driver),
    port,
    hostname: address
  });

  _logger.default.info(`MacDriver server listening on http://${address}:${port}`);

  return server;
}require('source-map-support').install();


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zZXJ2ZXIuanMiXSwibmFtZXMiOlsic3RhcnRTZXJ2ZXIiLCJwb3J0IiwiYWRkcmVzcyIsImRyaXZlciIsIk1hY0RyaXZlciIsInNlcnZlciIsInJvdXRlQ29uZmlndXJpbmdGdW5jdGlvbiIsImhvc3RuYW1lIiwibG9nIiwiaW5mbyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFHQSxlQUFlQSxXQUFmLENBQTRCQyxJQUE1QixFQUFrQ0MsT0FBbEMsRUFBMkM7QUFDekMsUUFBTUMsTUFBTSxHQUFHLElBQUlDLGlCQUFKLENBQWM7QUFBQ0gsSUFBQUEsSUFBRDtBQUFPQyxJQUFBQTtBQUFQLEdBQWQsQ0FBZjtBQUNBLFFBQU1HLE1BQU0sR0FBRyxNQUFNLDhCQUFXO0FBQzlCQyxJQUFBQSx3QkFBd0IsRUFBRSxnREFBeUJILE1BQXpCLENBREk7QUFFOUJGLElBQUFBLElBRjhCO0FBRzlCTSxJQUFBQSxRQUFRLEVBQUVMO0FBSG9CLEdBQVgsQ0FBckI7O0FBS0FNLGtCQUFJQyxJQUFKLENBQVUsd0NBQXVDUCxPQUFRLElBQUdELElBQUssRUFBakU7O0FBQ0EsU0FBT0ksTUFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGxvZyBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQgeyBzZXJ2ZXIgYXMgYmFzZVNlcnZlciwgcm91dGVDb25maWd1cmluZ0Z1bmN0aW9uIH0gZnJvbSAnYXBwaXVtLWJhc2UtZHJpdmVyJztcbmltcG9ydCB7IE1hY0RyaXZlciB9IGZyb20gJy4vZHJpdmVyJztcblxuXG5hc3luYyBmdW5jdGlvbiBzdGFydFNlcnZlciAocG9ydCwgYWRkcmVzcykge1xuICBjb25zdCBkcml2ZXIgPSBuZXcgTWFjRHJpdmVyKHtwb3J0LCBhZGRyZXNzfSk7XG4gIGNvbnN0IHNlcnZlciA9IGF3YWl0IGJhc2VTZXJ2ZXIoe1xuICAgIHJvdXRlQ29uZmlndXJpbmdGdW5jdGlvbjogcm91dGVDb25maWd1cmluZ0Z1bmN0aW9uKGRyaXZlciksXG4gICAgcG9ydCxcbiAgICBob3N0bmFtZTogYWRkcmVzcyxcbiAgfSk7XG4gIGxvZy5pbmZvKGBNYWNEcml2ZXIgc2VydmVyIGxpc3RlbmluZyBvbiBodHRwOi8vJHthZGRyZXNzfToke3BvcnR9YCk7XG4gIHJldHVybiBzZXJ2ZXI7XG59XG5cbmV4cG9ydCB7IHN0YXJ0U2VydmVyIH07XG4iXSwiZmlsZSI6ImxpYi9zZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiLi4vLi4ifQ==
