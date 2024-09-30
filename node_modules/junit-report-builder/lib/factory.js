"use strict";
var Builder = require("./builder");
var TestSuite = require("./test_suite");
var TestCase = require("./test_case");
var Factory = /** @class */ (function () {
    function Factory() {
    }
    Factory.prototype.newBuilder = function () {
        return new Builder(this);
    };
    Factory.prototype.newTestSuite = function () {
        return new TestSuite(this);
    };
    Factory.prototype.newTestCase = function () {
        return new TestCase();
    };
    return Factory;
}());
module.exports = Factory;
//# sourceMappingURL=factory.js.map