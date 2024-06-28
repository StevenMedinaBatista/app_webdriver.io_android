"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("source-map-support/register");

var _lodash = _interopRequireDefault(require("lodash"));

var _2 = require("../..");

var _protocol = require("../../lib/protocol/protocol");

var _requestPromise = _interopRequireDefault(require("request-promise"));

var _chai = _interopRequireDefault(require("chai"));

var _chaiAsPromised = _interopRequireDefault(require("chai-as-promised"));

var _bluebird = _interopRequireDefault(require("bluebird"));

const should = _chai.default.should();

const DEFAULT_ARGS = {
  address: 'localhost',
  port: 8181
};

_chai.default.use(_chaiAsPromised.default);

function baseDriverE2ETests(DriverClass, defaultCaps = {}) {
  describe('BaseDriver (e2e)', function () {
    let baseServer,
        d = new DriverClass(DEFAULT_ARGS);
    before(async function () {
      baseServer = await (0, _2.server)({
        routeConfiguringFunction: (0, _2.routeConfiguringFunction)(d),
        port: DEFAULT_ARGS.port
      });
    });
    after(async function () {
      await baseServer.close();
    });

    function startSession(caps) {
      return (0, _requestPromise.default)({
        url: 'http://localhost:8181/wd/hub/session',
        method: 'POST',
        json: {
          desiredCapabilities: caps,
          requiredCapabilities: {}
        }
      });
    }

    function endSession(id) {
      return (0, _requestPromise.default)({
        url: `http://localhost:8181/wd/hub/session/${id}`,
        method: 'DELETE',
        json: true,
        simple: false
      });
    }

    function getSession(id) {
      return (0, _requestPromise.default)({
        url: `http://localhost:8181/wd/hub/session/${id}`,
        method: 'GET',
        json: true,
        simple: false
      });
    }

    describe('session handling', function () {
      it('should create session and retrieve a session id, then delete it', async function () {
        let res = await (0, _requestPromise.default)({
          url: 'http://localhost:8181/wd/hub/session',
          method: 'POST',
          json: {
            desiredCapabilities: defaultCaps,
            requiredCapabilities: {}
          },
          simple: false,
          resolveWithFullResponse: true
        });
        res.statusCode.should.equal(200);
        res.body.status.should.equal(0);
        should.exist(res.body.sessionId);
        res.body.value.should.eql(defaultCaps);
        res = await (0, _requestPromise.default)({
          url: `http://localhost:8181/wd/hub/session/${d.sessionId}`,
          method: 'DELETE',
          json: true,
          simple: false,
          resolveWithFullResponse: true
        });
        res.statusCode.should.equal(200);
        res.body.status.should.equal(0);
        should.equal(d.sessionId, null);
      });
    });
    it.skip('should throw NYI for commands not implemented', async function () {});
    describe('command timeouts', function () {
      let originalFindElement, originalFindElements;

      function startTimeoutSession(timeout) {
        let caps = _lodash.default.clone(defaultCaps);

        caps.newCommandTimeout = timeout;
        return startSession(caps);
      }

      before(function () {
        originalFindElement = d.findElement;

        d.findElement = function () {
          return 'foo';
        }.bind(d);

        originalFindElements = d.findElements;

        d.findElements = async function () {
          await _bluebird.default.delay(200);
          return ['foo'];
        }.bind(d);
      });
      after(function () {
        d.findElement = originalFindElement;
        d.findElements = originalFindElements;
      });
      it('should set a default commandTimeout', async function () {
        let newSession = await startTimeoutSession();
        d.newCommandTimeoutMs.should.be.above(0);
        await endSession(newSession.sessionId);
      });
      it('should timeout on commands using commandTimeout cap', async function () {
        let newSession = await startTimeoutSession(0.25);
        await (0, _requestPromise.default)({
          url: `http://localhost:8181/wd/hub/session/${d.sessionId}/element`,
          method: 'POST',
          json: {
            using: 'name',
            value: 'foo'
          }
        });
        await _bluebird.default.delay(400);
        let res = await (0, _requestPromise.default)({
          url: `http://localhost:8181/wd/hub/session/${d.sessionId}`,
          method: 'GET',
          json: true,
          simple: false
        });
        res.status.should.equal(6);
        should.equal(d.sessionId, null);
        res = await endSession(newSession.sessionId);
        res.status.should.equal(6);
      });
      it('should not timeout with commandTimeout of false', async function () {
        let newSession = await startTimeoutSession(0.1);
        let start = Date.now();
        let res = await (0, _requestPromise.default)({
          url: `http://localhost:8181/wd/hub/session/${d.sessionId}/elements`,
          method: 'POST',
          json: {
            using: 'name',
            value: 'foo'
          }
        });
        (Date.now() - start).should.be.above(150);
        res.value.should.eql(['foo']);
        await endSession(newSession.sessionId);
      });
      it('should not timeout with commandTimeout of 0', async function () {
        d.newCommandTimeoutMs = 2;
        let newSession = await startTimeoutSession(0);
        await (0, _requestPromise.default)({
          url: `http://localhost:8181/wd/hub/session/${d.sessionId}/element`,
          method: 'POST',
          json: {
            using: 'name',
            value: 'foo'
          }
        });
        await _bluebird.default.delay(400);
        let res = await (0, _requestPromise.default)({
          url: `http://localhost:8181/wd/hub/session/${d.sessionId}`,
          method: 'GET',
          json: true,
          simple: false
        });
        res.status.should.equal(0);
        res = await endSession(newSession.sessionId);
        res.status.should.equal(0);
        d.newCommandTimeoutMs = 60 * 1000;
      });
      it('should not timeout if its just the command taking awhile', async function () {
        let newSession = await startTimeoutSession(0.25);
        await (0, _requestPromise.default)({
          url: `http://localhost:8181/wd/hub/session/${d.sessionId}/element`,
          method: 'POST',
          json: {
            using: 'name',
            value: 'foo'
          }
        });
        await _bluebird.default.delay(400);
        let res = await (0, _requestPromise.default)({
          url: `http://localhost:8181/wd/hub/session/${d.sessionId}`,
          method: 'GET',
          json: true,
          simple: false
        });
        res.status.should.equal(6);
        should.equal(d.sessionId, null);
        res = await endSession(newSession.sessionId);
        res.status.should.equal(6);
      });
      it('should not have a timer running before or after a session', async function () {
        should.not.exist(d.noCommandTimer);
        let newSession = await startTimeoutSession(0.25);
        newSession.sessionId.should.equal(d.sessionId);
        should.exist(d.noCommandTimer);
        await endSession(newSession.sessionId);
        should.not.exist(d.noCommandTimer);
      });
    });
    describe('settings api', function () {
      before(function () {
        d.settings = new _2.DeviceSettings({
          ignoreUnimportantViews: false
        });
      });
      it('should be able to get settings object', function () {
        d.settings.getSettings().ignoreUnimportantViews.should.be.false;
      });
      it('should throw error when updateSettings method is not defined', async function () {
        await d.settings.update({
          ignoreUnimportantViews: true
        }).should.eventually.be.rejectedWith('onSettingsUpdate');
      });
      it('should throw error for invalid update object', async function () {
        await d.settings.update('invalid json').should.eventually.be.rejectedWith('JSON');
      });
    });
    describe('unexpected exits', function () {
      it('should reject a current command when the driver crashes', async function () {
        d._oldGetStatus = d.getStatus;

        d.getStatus = async function () {
          await _bluebird.default.delay(5000);
        }.bind(d);

        let p = (0, _requestPromise.default)({
          url: 'http://localhost:8181/wd/hub/status',
          method: 'GET',
          json: true,
          simple: false
        });
        await _bluebird.default.delay(100);
        d.startUnexpectedShutdown(new Error('Crashytimes'));
        let res = await p;
        res.status.should.equal(13);
        res.value.message.should.contain('Crashytimes');
        await d.onUnexpectedShutdown.should.be.rejectedWith('Crashytimes');
        d.getStatus = d._oldGetStatus;
      });
    });
    describe('event timings', function () {
      it('should not add timings if not using opt-in cap', async function () {
        let session = await startSession(defaultCaps);
        let res = await getSession(session.sessionId);
        should.not.exist(res.events);
        await endSession(session.sessionId);
      });
      it('should add start session timings', async function () {
        let caps = Object.assign({}, defaultCaps, {
          eventTimings: true
        });
        let session = await startSession(caps);
        let res = (await getSession(session.sessionId)).value;
        should.exist(res.events);
        should.exist(res.events.newSessionRequested);
        should.exist(res.events.newSessionStarted);
        res.events.newSessionRequested[0].should.be.a('number');
        res.events.newSessionStarted[0].should.be.a('number');
        await endSession(session.sessionId);
      });
    });
    describe('execute driver script', function () {
      let originalFindElement, sessionId;
      before(function () {
        d.allowInsecure = ['execute_driver_script'];
        originalFindElement = d.findElement;

        d.findElement = function (strategy, selector) {
          if (strategy === 'accessibility id' && selector === 'amazing') {
            return {
              [_protocol.W3C_ELEMENT_KEY]: 'element-id-1'
            };
          }

          throw new _2.errors.NoSuchElementError('not found');
        }.bind(d);
      });
      beforeEach(async function () {
        ({
          sessionId
        } = await startSession(defaultCaps));
      });
      after(function () {
        d.findElement = originalFindElement;
      });
      afterEach(async function () {
        await endSession(sessionId);
      });
      it('should not work unless the allowInsecure feature flag is set', async function () {
        d._allowInsecure = d.allowInsecure;
        d.allowInsecure = [];
        const script = `return 'foo'`;
        await (0, _requestPromise.default)({
          url: `http://localhost:8181/wd/hub/session/${sessionId}/appium/execute_driver`,
          method: 'POST',
          json: {
            script,
            type: 'wd'
          }
        }).should.eventually.be.rejectedWith(/allow-insecure/);
        await endSession(sessionId);
        d.allowInsecure = d._allowInsecure;
      });
      it('should execute a webdriverio script in the context of session', async function () {
        const script = `
          const timeouts = await driver.getTimeouts();
          const status = await driver.status();
          return [timeouts, status];
        `;
        const res = await (0, _requestPromise.default)({
          url: `http://localhost:8181/wd/hub/session/${sessionId}/appium/execute_driver`,
          method: 'POST',
          json: {
            script,
            type: 'webdriverio'
          }
        });
        const expectedTimeouts = {
          command: 250,
          implicit: 0
        };
        const expectedStatus = {};
        res.value.result.should.eql([expectedTimeouts, expectedStatus]);
      });
      it('should fail with any script type other than webdriverio currently', async function () {
        const script = `return 'foo'`;
        await (0, _requestPromise.default)({
          url: `http://localhost:8181/wd/hub/session/${sessionId}/appium/execute_driver`,
          method: 'POST',
          json: {
            script,
            type: 'wd'
          }
        }).should.eventually.be.rejectedWith(/script type/);
      });
      it('should execute a webdriverio script that returns elements correctly', async function () {
        const script = `
          return await driver.$("~amazing");
        `;
        const res = await (0, _requestPromise.default)({
          url: `http://localhost:8181/wd/hub/session/${sessionId}/appium/execute_driver`,
          method: 'POST',
          json: {
            script
          }
        });
        res.value.result.should.eql({
          [_protocol.W3C_ELEMENT_KEY]: 'element-id-1',
          [_protocol.MJSONWP_ELEMENT_KEY]: 'element-id-1'
        });
      });
      it('should execute a webdriverio script that returns elements in deep structure', async function () {
        const script = `
          const el = await driver.$("~amazing");
          return {element: el, elements: [el, el]};
        `;
        const res = await (0, _requestPromise.default)({
          url: `http://localhost:8181/wd/hub/session/${sessionId}/appium/execute_driver`,
          method: 'POST',
          json: {
            script
          }
        });
        const elObj = {
          [_protocol.W3C_ELEMENT_KEY]: 'element-id-1',
          [_protocol.MJSONWP_ELEMENT_KEY]: 'element-id-1'
        };
        res.value.result.should.eql({
          element: elObj,
          elements: [elObj, elObj]
        });
      });
      it('should store and return logs to the user', async function () {
        const script = `
          console.log("foo");
          console.log("foo2");
          console.warn("bar");
          console.error("baz");
          return null;
        `;
        const res = await (0, _requestPromise.default)({
          url: `http://localhost:8181/wd/hub/session/${sessionId}/appium/execute_driver`,
          method: 'POST',
          json: {
            script
          }
        });
        res.value.logs.should.eql({
          log: ['foo', 'foo2'],
          warn: ['bar'],
          error: ['baz']
        });
      });
      it('should have appium specific commands available', async function () {
        const script = `
          return typeof driver.lock;
        `;
        const res = await (0, _requestPromise.default)({
          url: `http://localhost:8181/wd/hub/session/${sessionId}/appium/execute_driver`,
          method: 'POST',
          json: {
            script
          }
        });
        res.value.result.should.eql('function');
      });
      it('should correctly handle errors that happen in a webdriverio script', async function () {
        const script = `
          return await driver.$("~notfound");
        `;
        const res = await (0, _requestPromise.default)({
          url: `http://localhost:8181/wd/hub/session/${sessionId}/appium/execute_driver`,
          method: 'POST',
          json: {
            script
          },
          simple: false
        });
        res.should.eql({
          sessionId,
          status: 13,
          value: {
            message: 'An unknown server-side error occurred while processing the command. Original error: Could not execute driver script. Original error was: Error: not found'
          }
        });
      });
      it('should correctly handle errors that happen when a script cannot be compiled', async function () {
        const script = `
          return {;
        `;
        const res = await (0, _requestPromise.default)({
          url: `http://localhost:8181/wd/hub/session/${sessionId}/appium/execute_driver`,
          method: 'POST',
          json: {
            script
          },
          simple: false
        });
        res.sessionId.should.eql(sessionId);
        res.status.should.eql(13);
        res.value.should.have.property('message');
        res.value.message.should.match(/An unknown server-side error occurred while processing the command. Original error: Could not execute driver script. Original error was: Error: Unexpected token '?;'?/);
      });
      it('should be able to set a timeout on a driver script', async function () {
        const script = `
          await Promise.delay(1000);
          return true;
        `;
        const res = await (0, _requestPromise.default)({
          url: `http://localhost:8181/wd/hub/session/${sessionId}/appium/execute_driver`,
          method: 'POST',
          json: {
            script,
            timeout: 50
          },
          simple: false
        });
        res.value.message.should.match(/.+50.+timeout.+/);
      });
    });
  });
}

var _default = baseDriverE2ETests;
exports.default = _default;require('source-map-support').install();


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvYmFzZWRyaXZlci9kcml2ZXItZTJlLXRlc3RzLmpzIl0sIm5hbWVzIjpbInNob3VsZCIsImNoYWkiLCJERUZBVUxUX0FSR1MiLCJhZGRyZXNzIiwicG9ydCIsInVzZSIsImNoYWlBc1Byb21pc2VkIiwiYmFzZURyaXZlckUyRVRlc3RzIiwiRHJpdmVyQ2xhc3MiLCJkZWZhdWx0Q2FwcyIsImRlc2NyaWJlIiwiYmFzZVNlcnZlciIsImQiLCJiZWZvcmUiLCJyb3V0ZUNvbmZpZ3VyaW5nRnVuY3Rpb24iLCJhZnRlciIsImNsb3NlIiwic3RhcnRTZXNzaW9uIiwiY2FwcyIsInVybCIsIm1ldGhvZCIsImpzb24iLCJkZXNpcmVkQ2FwYWJpbGl0aWVzIiwicmVxdWlyZWRDYXBhYmlsaXRpZXMiLCJlbmRTZXNzaW9uIiwiaWQiLCJzaW1wbGUiLCJnZXRTZXNzaW9uIiwiaXQiLCJyZXMiLCJyZXNvbHZlV2l0aEZ1bGxSZXNwb25zZSIsInN0YXR1c0NvZGUiLCJlcXVhbCIsImJvZHkiLCJzdGF0dXMiLCJleGlzdCIsInNlc3Npb25JZCIsInZhbHVlIiwiZXFsIiwic2tpcCIsIm9yaWdpbmFsRmluZEVsZW1lbnQiLCJvcmlnaW5hbEZpbmRFbGVtZW50cyIsInN0YXJ0VGltZW91dFNlc3Npb24iLCJ0aW1lb3V0IiwiXyIsImNsb25lIiwibmV3Q29tbWFuZFRpbWVvdXQiLCJmaW5kRWxlbWVudCIsImJpbmQiLCJmaW5kRWxlbWVudHMiLCJCIiwiZGVsYXkiLCJuZXdTZXNzaW9uIiwibmV3Q29tbWFuZFRpbWVvdXRNcyIsImJlIiwiYWJvdmUiLCJ1c2luZyIsInN0YXJ0IiwiRGF0ZSIsIm5vdyIsIm5vdCIsIm5vQ29tbWFuZFRpbWVyIiwic2V0dGluZ3MiLCJEZXZpY2VTZXR0aW5ncyIsImlnbm9yZVVuaW1wb3J0YW50Vmlld3MiLCJnZXRTZXR0aW5ncyIsImZhbHNlIiwidXBkYXRlIiwiZXZlbnR1YWxseSIsInJlamVjdGVkV2l0aCIsIl9vbGRHZXRTdGF0dXMiLCJnZXRTdGF0dXMiLCJwIiwic3RhcnRVbmV4cGVjdGVkU2h1dGRvd24iLCJFcnJvciIsIm1lc3NhZ2UiLCJjb250YWluIiwib25VbmV4cGVjdGVkU2h1dGRvd24iLCJzZXNzaW9uIiwiZXZlbnRzIiwiT2JqZWN0IiwiYXNzaWduIiwiZXZlbnRUaW1pbmdzIiwibmV3U2Vzc2lvblJlcXVlc3RlZCIsIm5ld1Nlc3Npb25TdGFydGVkIiwiYSIsImFsbG93SW5zZWN1cmUiLCJzdHJhdGVneSIsInNlbGVjdG9yIiwiVzNDX0VMRU1FTlRfS0VZIiwiZXJyb3JzIiwiTm9TdWNoRWxlbWVudEVycm9yIiwiYmVmb3JlRWFjaCIsImFmdGVyRWFjaCIsIl9hbGxvd0luc2VjdXJlIiwic2NyaXB0IiwidHlwZSIsImV4cGVjdGVkVGltZW91dHMiLCJjb21tYW5kIiwiaW1wbGljaXQiLCJleHBlY3RlZFN0YXR1cyIsInJlc3VsdCIsIk1KU09OV1BfRUxFTUVOVF9LRVkiLCJlbE9iaiIsImVsZW1lbnQiLCJlbGVtZW50cyIsImxvZ3MiLCJsb2ciLCJ3YXJuIiwiZXJyb3IiLCJoYXZlIiwicHJvcGVydHkiLCJtYXRjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQSxNQUFNQSxNQUFNLEdBQUdDLGNBQUtELE1BQUwsRUFBZjs7QUFDQSxNQUFNRSxZQUFZLEdBQUc7QUFDbkJDLEVBQUFBLE9BQU8sRUFBRSxXQURVO0FBRW5CQyxFQUFBQSxJQUFJLEVBQUU7QUFGYSxDQUFyQjs7QUFJQUgsY0FBS0ksR0FBTCxDQUFTQyx1QkFBVDs7QUFFQSxTQUFTQyxrQkFBVCxDQUE2QkMsV0FBN0IsRUFBMENDLFdBQVcsR0FBRyxFQUF4RCxFQUE0RDtBQUMxREMsRUFBQUEsUUFBUSxDQUFDLGtCQUFELEVBQXFCLFlBQVk7QUFDdkMsUUFBSUMsVUFBSjtBQUFBLFFBQWdCQyxDQUFDLEdBQUcsSUFBSUosV0FBSixDQUFnQk4sWUFBaEIsQ0FBcEI7QUFDQVcs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QUpnQixTQUFSLENBQWxCO0FBTUFHLFFBQUFBLEdBQUcsQ0FBQ08sU0FBSixDQUFjcEMsTUFBZCxDQUFxQnNDLEdBQXJCLENBQXlCRixTQUF6QjtBQUNBUCxRQUFBQSxHQUFHLENBQUNLLE1BQUosQ0FBV2xDLE1BQVgsQ0FBa0JzQyxHQUFsQixDQUFzQixFQUF0QjtBQUNBVCxRQUFBQSxHQUFHLENBQUNRLEtBQUosQ0FBVXJDLE1BQVYsQ0FBaUI4RyxJQUFqQixDQUFzQkMsUUFBdEIsQ0FBK0IsU0FBL0I7QUFDQWxGLFFBQUFBLEdBQUcsQ0FBQ1EsS0FBSixDQUFVc0MsT0FBVixDQUFrQjNFLE1BQWxCLENBQXlCZ0gsS0FBekIsQ0FBK0Isd0tBQS9CO0FBQ0QsT0FkQyxDQUFGO0FBZ0JBcEYsTUFBQUEsRUFBRSxDQUFDLG9EQUFELEVBQXVELGtCQUFrQjtBQUN6RSxjQUFNbUUsTUFBTSxHQUFJOzs7U0FBaEI7QUFJQSxjQUFNbEUsR0FBRyxHQUFHLE1BQU0sNkJBQVE7QUFDeEJWLFVBQUFBLEdBQUcsRUFBRyx3Q0FBdUNpQixTQUFVLHdCQUQvQjtBQUV4QmhCLFVBQUFBLE1BQU0sRUFBRSxNQUZnQjtBQUd4QkMsVUFBQUEsSUFBSSxFQUFFO0FBQUMwRSxZQUFBQSxNQUFEO0FBQVNwRCxZQUFBQSxPQUFPLEVBQUU7QUFBbEIsV0FIa0I7QUFJeEJqQixVQUFBQSxNQUFNLEVBQUU7QUFKZ0IsU0FBUixDQUFsQjtBQU1BRyxRQUFBQSxHQUFHLENBQUNRLEtBQUosQ0FBVXNDLE9BQVYsQ0FBa0IzRSxNQUFsQixDQUF5QmdILEtBQXpCLENBQStCLGlCQUEvQjtBQUNELE9BWkMsQ0FBRjtBQWFELEtBNUtPLENBQVI7QUE2S0QsR0F4YU8sQ0FBUjtBQXlhRDs7ZUFFY3pHLGtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IHNlcnZlciwgcm91dGVDb25maWd1cmluZ0Z1bmN0aW9uLCBEZXZpY2VTZXR0aW5ncywgZXJyb3JzIH0gZnJvbSAnLi4vLi4nO1xuaW1wb3J0IHsgVzNDX0VMRU1FTlRfS0VZLCBNSlNPTldQX0VMRU1FTlRfS0VZIH0gZnJvbSAnLi4vLi4vbGliL3Byb3RvY29sL3Byb3RvY29sJztcbmltcG9ydCByZXF1ZXN0IGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XG5pbXBvcnQgY2hhaSBmcm9tICdjaGFpJztcbmltcG9ydCBjaGFpQXNQcm9taXNlZCBmcm9tICdjaGFpLWFzLXByb21pc2VkJztcbmltcG9ydCBCIGZyb20gJ2JsdWViaXJkJztcblxuY29uc3Qgc2hvdWxkID0gY2hhaS5zaG91bGQoKTtcbmNvbnN0IERFRkFVTFRfQVJHUyA9IHtcbiAgYWRkcmVzczogJ2xvY2FsaG9zdCcsXG4gIHBvcnQ6IDgxODFcbn07XG5jaGFpLnVzZShjaGFpQXNQcm9taXNlZCk7XG5cbmZ1bmN0aW9uIGJhc2VEcml2ZXJFMkVUZXN0cyAoRHJpdmVyQ2xhc3MsIGRlZmF1bHRDYXBzID0ge30pIHtcbiAgZGVzY3JpYmUoJ0Jhc2VEcml2ZXIgKGUyZSknLCBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGJhc2VTZXJ2ZXIsIGQgPSBuZXcgRHJpdmVyQ2xhc3MoREVGQVVMVF9BUkdTKTtcbiAgICBiZWZvcmUoYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgYmFzZVNlcnZlciA9IGF3YWl0IHNlcnZlcih7XG4gICAgICAgIHJvdXRlQ29uZmlndXJpbmdGdW5jdGlvbjogcm91dGVDb25maWd1cmluZ0Z1bmN0aW9uKGQpLFxuICAgICAgICBwb3J0OiBERUZBVUxUX0FSR1MucG9ydCxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGFmdGVyKGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGF3YWl0IGJhc2VTZXJ2ZXIuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHN0YXJ0U2Vzc2lvbiAoY2Fwcykge1xuICAgICAgcmV0dXJuIHJlcXVlc3Qoe1xuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjgxODEvd2QvaHViL3Nlc3Npb24nLFxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAganNvbjoge2Rlc2lyZWRDYXBhYmlsaXRpZXM6IGNhcHMsIHJlcXVpcmVkQ2FwYWJpbGl0aWVzOiB7fX0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmRTZXNzaW9uIChpZCkge1xuICAgICAgcmV0dXJuIHJlcXVlc3Qoe1xuICAgICAgICB1cmw6IGBodHRwOi8vbG9jYWxob3N0OjgxODEvd2QvaHViL3Nlc3Npb24vJHtpZH1gLFxuICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICBzaW1wbGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXNzaW9uIChpZCkge1xuICAgICAgcmV0dXJuIHJlcXVlc3Qoe1xuICAgICAgICB1cmw6IGBodHRwOi8vbG9jYWxob3N0OjgxODEvd2QvaHViL3Nlc3Npb24vJHtpZH1gLFxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICBzaW1wbGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkZXNjcmliZSgnc2Vzc2lvbiBoYW5kbGluZycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGl0KCdzaG91bGQgY3JlYXRlIHNlc3Npb24gYW5kIHJldHJpZXZlIGEgc2Vzc2lvbiBpZCwgdGhlbiBkZWxldGUgaXQnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCByZXMgPSBhd2FpdCByZXF1ZXN0KHtcbiAgICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjgxODEvd2QvaHViL3Nlc3Npb24nLFxuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGpzb246IHtkZXNpcmVkQ2FwYWJpbGl0aWVzOiBkZWZhdWx0Q2FwcywgcmVxdWlyZWRDYXBhYmlsaXRpZXM6IHt9fSxcbiAgICAgICAgICBzaW1wbGU6IGZhbHNlLFxuICAgICAgICAgIHJlc29sdmVXaXRoRnVsbFJlc3BvbnNlOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlcy5zdGF0dXNDb2RlLnNob3VsZC5lcXVhbCgyMDApO1xuICAgICAgICByZXMuYm9keS5zdGF0dXMuc2hvdWxkLmVxdWFsKDApO1xuICAgICAgICBzaG91bGQuZXhpc3QocmVzLmJvZHkuc2Vzc2lvbklkKTtcbiAgICAgICAgcmVzLmJvZHkudmFsdWUuc2hvdWxkLmVxbChkZWZhdWx0Q2Fwcyk7XG5cbiAgICAgICAgcmVzID0gYXdhaXQgcmVxdWVzdCh7XG4gICAgICAgICAgdXJsOiBgaHR0cDovL2xvY2FsaG9zdDo4MTgxL3dkL2h1Yi9zZXNzaW9uLyR7ZC5zZXNzaW9uSWR9YCxcbiAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICAgIGpzb246IHRydWUsXG4gICAgICAgICAgc2ltcGxlOiBmYWxzZSxcbiAgICAgICAgICByZXNvbHZlV2l0aEZ1bGxSZXNwb25zZTogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICByZXMuc3RhdHVzQ29kZS5zaG91bGQuZXF1YWwoMjAwKTtcbiAgICAgICAgcmVzLmJvZHkuc3RhdHVzLnNob3VsZC5lcXVhbCgwKTtcbiAgICAgICAgc2hvdWxkLmVxdWFsKGQuc2Vzc2lvbklkLCBudWxsKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQuc2tpcCgnc2hvdWxkIHRocm93IE5ZSSBmb3IgY29tbWFuZHMgbm90IGltcGxlbWVudGVkJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2NvbW1hbmQgdGltZW91dHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgb3JpZ2luYWxGaW5kRWxlbWVudCwgb3JpZ2luYWxGaW5kRWxlbWVudHM7XG4gICAgICBmdW5jdGlvbiBzdGFydFRpbWVvdXRTZXNzaW9uICh0aW1lb3V0KSB7XG4gICAgICAgIGxldCBjYXBzID0gXy5jbG9uZShkZWZhdWx0Q2Fwcyk7XG4gICAgICAgIGNhcHMubmV3Q29tbWFuZFRpbWVvdXQgPSB0aW1lb3V0O1xuICAgICAgICByZXR1cm4gc3RhcnRTZXNzaW9uKGNhcHMpO1xuICAgICAgfVxuXG4gICAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICAgICBvcmlnaW5hbEZpbmRFbGVtZW50ID0gZC5maW5kRWxlbWVudDtcbiAgICAgICAgZC5maW5kRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gJ2Zvbyc7XG4gICAgICAgIH0uYmluZChkKTtcblxuICAgICAgICBvcmlnaW5hbEZpbmRFbGVtZW50cyA9IGQuZmluZEVsZW1lbnRzO1xuICAgICAgICBkLmZpbmRFbGVtZW50cyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBhd2FpdCBCLmRlbGF5KDIwMCk7XG4gICAgICAgICAgcmV0dXJuIFsnZm9vJ107XG4gICAgICAgIH0uYmluZChkKTtcbiAgICAgIH0pO1xuXG4gICAgICBhZnRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGQuZmluZEVsZW1lbnQgPSBvcmlnaW5hbEZpbmRFbGVtZW50O1xuICAgICAgICBkLmZpbmRFbGVtZW50cyA9IG9yaWdpbmFsRmluZEVsZW1lbnRzO1xuICAgICAgfSk7XG5cblxuICAgICAgaXQoJ3Nob3VsZCBzZXQgYSBkZWZhdWx0IGNvbW1hbmRUaW1lb3V0JywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgbmV3U2Vzc2lvbiA9IGF3YWl0IHN0YXJ0VGltZW91dFNlc3Npb24oKTtcbiAgICAgICAgZC5uZXdDb21tYW5kVGltZW91dE1zLnNob3VsZC5iZS5hYm92ZSgwKTtcbiAgICAgICAgYXdhaXQgZW5kU2Vzc2lvbihuZXdTZXNzaW9uLnNlc3Npb25JZCk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCB0aW1lb3V0IG9uIGNvbW1hbmRzIHVzaW5nIGNvbW1hbmRUaW1lb3V0IGNhcCcsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IG5ld1Nlc3Npb24gPSBhd2FpdCBzdGFydFRpbWVvdXRTZXNzaW9uKDAuMjUpO1xuXG4gICAgICAgIGF3YWl0IHJlcXVlc3Qoe1xuICAgICAgICAgIHVybDogYGh0dHA6Ly9sb2NhbGhvc3Q6ODE4MS93ZC9odWIvc2Vzc2lvbi8ke2Quc2Vzc2lvbklkfS9lbGVtZW50YCxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBqc29uOiB7dXNpbmc6ICduYW1lJywgdmFsdWU6ICdmb28nfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGF3YWl0IEIuZGVsYXkoNDAwKTtcbiAgICAgICAgbGV0IHJlcyA9IGF3YWl0IHJlcXVlc3Qoe1xuICAgICAgICAgIHVybDogYGh0dHA6Ly9sb2NhbGhvc3Q6ODE4MS93ZC9odWIvc2Vzc2lvbi8ke2Quc2Vzc2lvbklkfWAsXG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgIHNpbXBsZTogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcy5zdGF0dXMuc2hvdWxkLmVxdWFsKDYpO1xuICAgICAgICBzaG91bGQuZXF1YWwoZC5zZXNzaW9uSWQsIG51bGwpO1xuICAgICAgICByZXMgPSBhd2FpdCBlbmRTZXNzaW9uKG5ld1Nlc3Npb24uc2Vzc2lvbklkKTtcbiAgICAgICAgcmVzLnN0YXR1cy5zaG91bGQuZXF1YWwoNik7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgdGltZW91dCB3aXRoIGNvbW1hbmRUaW1lb3V0IG9mIGZhbHNlJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgbmV3U2Vzc2lvbiA9IGF3YWl0IHN0YXJ0VGltZW91dFNlc3Npb24oMC4xKTtcbiAgICAgICAgbGV0IHN0YXJ0ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgbGV0IHJlcyA9IGF3YWl0IHJlcXVlc3Qoe1xuICAgICAgICAgIHVybDogYGh0dHA6Ly9sb2NhbGhvc3Q6ODE4MS93ZC9odWIvc2Vzc2lvbi8ke2Quc2Vzc2lvbklkfS9lbGVtZW50c2AsXG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAganNvbjoge3VzaW5nOiAnbmFtZScsIHZhbHVlOiAnZm9vJ30sXG4gICAgICAgIH0pO1xuICAgICAgICAoRGF0ZS5ub3coKSAtIHN0YXJ0KS5zaG91bGQuYmUuYWJvdmUoMTUwKTtcbiAgICAgICAgcmVzLnZhbHVlLnNob3VsZC5lcWwoWydmb28nXSk7XG4gICAgICAgIGF3YWl0IGVuZFNlc3Npb24obmV3U2Vzc2lvbi5zZXNzaW9uSWQpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgbm90IHRpbWVvdXQgd2l0aCBjb21tYW5kVGltZW91dCBvZiAwJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICBkLm5ld0NvbW1hbmRUaW1lb3V0TXMgPSAyO1xuICAgICAgICBsZXQgbmV3U2Vzc2lvbiA9IGF3YWl0IHN0YXJ0VGltZW91dFNlc3Npb24oMCk7XG5cbiAgICAgICAgYXdhaXQgcmVxdWVzdCh7XG4gICAgICAgICAgdXJsOiBgaHR0cDovL2xvY2FsaG9zdDo4MTgxL3dkL2h1Yi9zZXNzaW9uLyR7ZC5zZXNzaW9uSWR9L2VsZW1lbnRgLFxuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGpzb246IHt1c2luZzogJ25hbWUnLCB2YWx1ZTogJ2Zvbyd9LFxuICAgICAgICB9KTtcbiAgICAgICAgYXdhaXQgQi5kZWxheSg0MDApO1xuICAgICAgICBsZXQgcmVzID0gYXdhaXQgcmVxdWVzdCh7XG4gICAgICAgICAgdXJsOiBgaHR0cDovL2xvY2FsaG9zdDo4MTgxL3dkL2h1Yi9zZXNzaW9uLyR7ZC5zZXNzaW9uSWR9YCxcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIGpzb246IHRydWUsXG4gICAgICAgICAgc2ltcGxlOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgcmVzLnN0YXR1cy5zaG91bGQuZXF1YWwoMCk7XG4gICAgICAgIHJlcyA9IGF3YWl0IGVuZFNlc3Npb24obmV3U2Vzc2lvbi5zZXNzaW9uSWQpO1xuICAgICAgICByZXMuc3RhdHVzLnNob3VsZC5lcXVhbCgwKTtcblxuICAgICAgICBkLm5ld0NvbW1hbmRUaW1lb3V0TXMgPSA2MCAqIDEwMDA7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgdGltZW91dCBpZiBpdHMganVzdCB0aGUgY29tbWFuZCB0YWtpbmcgYXdoaWxlJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgbmV3U2Vzc2lvbiA9IGF3YWl0IHN0YXJ0VGltZW91dFNlc3Npb24oMC4yNSk7XG4gICAgICAgIGF3YWl0IHJlcXVlc3Qoe1xuICAgICAgICAgIHVybDogYGh0dHA6Ly9sb2NhbGhvc3Q6ODE4MS93ZC9odWIvc2Vzc2lvbi8ke2Quc2Vzc2lvbklkfS9lbGVtZW50YCxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBqc29uOiB7dXNpbmc6ICduYW1lJywgdmFsdWU6ICdmb28nfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGF3YWl0IEIuZGVsYXkoNDAwKTtcbiAgICAgICAgbGV0IHJlcyA9IGF3YWl0IHJlcXVlc3Qoe1xuICAgICAgICAgIHVybDogYGh0dHA6Ly9sb2NhbGhvc3Q6ODE4MS93ZC9odWIvc2Vzc2lvbi8ke2Quc2Vzc2lvbklkfWAsXG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgIHNpbXBsZTogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcy5zdGF0dXMuc2hvdWxkLmVxdWFsKDYpO1xuICAgICAgICBzaG91bGQuZXF1YWwoZC5zZXNzaW9uSWQsIG51bGwpO1xuICAgICAgICByZXMgPSBhd2FpdCBlbmRTZXNzaW9uKG5ld1Nlc3Npb24uc2Vzc2lvbklkKTtcbiAgICAgICAgcmVzLnN0YXR1cy5zaG91bGQuZXF1YWwoNik7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgaGF2ZSBhIHRpbWVyIHJ1bm5pbmcgYmVmb3JlIG9yIGFmdGVyIGEgc2Vzc2lvbicsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2hvdWxkLm5vdC5leGlzdChkLm5vQ29tbWFuZFRpbWVyKTtcbiAgICAgICAgbGV0IG5ld1Nlc3Npb24gPSBhd2FpdCBzdGFydFRpbWVvdXRTZXNzaW9uKDAuMjUpO1xuICAgICAgICBuZXdTZXNzaW9uLnNlc3Npb25JZC5zaG91bGQuZXF1YWwoZC5zZXNzaW9uSWQpO1xuICAgICAgICBzaG91bGQuZXhpc3QoZC5ub0NvbW1hbmRUaW1lcik7XG4gICAgICAgIGF3YWl0IGVuZFNlc3Npb24obmV3U2Vzc2lvbi5zZXNzaW9uSWQpO1xuICAgICAgICBzaG91bGQubm90LmV4aXN0KGQubm9Db21tYW5kVGltZXIpO1xuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzZXR0aW5ncyBhcGknLCBmdW5jdGlvbiAoKSB7XG4gICAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICAgICBkLnNldHRpbmdzID0gbmV3IERldmljZVNldHRpbmdzKHtpZ25vcmVVbmltcG9ydGFudFZpZXdzOiBmYWxzZX0pO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIGJlIGFibGUgdG8gZ2V0IHNldHRpbmdzIG9iamVjdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZC5zZXR0aW5ncy5nZXRTZXR0aW5ncygpLmlnbm9yZVVuaW1wb3J0YW50Vmlld3Muc2hvdWxkLmJlLmZhbHNlO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIHRocm93IGVycm9yIHdoZW4gdXBkYXRlU2V0dGluZ3MgbWV0aG9kIGlzIG5vdCBkZWZpbmVkJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICBhd2FpdCBkLnNldHRpbmdzLnVwZGF0ZSh7aWdub3JlVW5pbXBvcnRhbnRWaWV3czogdHJ1ZX0pLnNob3VsZC5ldmVudHVhbGx5XG4gICAgICAgICAgICAgICAgLmJlLnJlamVjdGVkV2l0aCgnb25TZXR0aW5nc1VwZGF0ZScpO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIHRocm93IGVycm9yIGZvciBpbnZhbGlkIHVwZGF0ZSBvYmplY3QnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGF3YWl0IGQuc2V0dGluZ3MudXBkYXRlKCdpbnZhbGlkIGpzb24nKS5zaG91bGQuZXZlbnR1YWxseVxuICAgICAgICAgICAgICAgIC5iZS5yZWplY3RlZFdpdGgoJ0pTT04nKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3VuZXhwZWN0ZWQgZXhpdHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpdCgnc2hvdWxkIHJlamVjdCBhIGN1cnJlbnQgY29tbWFuZCB3aGVuIHRoZSBkcml2ZXIgY3Jhc2hlcycsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZC5fb2xkR2V0U3RhdHVzID0gZC5nZXRTdGF0dXM7XG4gICAgICAgIGQuZ2V0U3RhdHVzID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGF3YWl0IEIuZGVsYXkoNTAwMCk7XG4gICAgICAgIH0uYmluZChkKTtcbiAgICAgICAgbGV0IHAgPSByZXF1ZXN0KHtcbiAgICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjgxODEvd2QvaHViL3N0YXR1cycsXG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgIHNpbXBsZTogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIG1ha2Ugc3VyZSB0aGF0IHRoZSByZXF1ZXN0IGdldHMgdG8gdGhlIHNlcnZlciBiZWZvcmUgb3VyIHNodXRkb3duXG4gICAgICAgIGF3YWl0IEIuZGVsYXkoMTAwKTtcbiAgICAgICAgZC5zdGFydFVuZXhwZWN0ZWRTaHV0ZG93bihuZXcgRXJyb3IoJ0NyYXNoeXRpbWVzJykpO1xuICAgICAgICBsZXQgcmVzID0gYXdhaXQgcDtcbiAgICAgICAgcmVzLnN0YXR1cy5zaG91bGQuZXF1YWwoMTMpO1xuICAgICAgICByZXMudmFsdWUubWVzc2FnZS5zaG91bGQuY29udGFpbignQ3Jhc2h5dGltZXMnKTtcbiAgICAgICAgYXdhaXQgZC5vblVuZXhwZWN0ZWRTaHV0ZG93bi5zaG91bGQuYmUucmVqZWN0ZWRXaXRoKCdDcmFzaHl0aW1lcycpO1xuICAgICAgICBkLmdldFN0YXR1cyA9IGQuX29sZEdldFN0YXR1cztcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2V2ZW50IHRpbWluZ3MnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpdCgnc2hvdWxkIG5vdCBhZGQgdGltaW5ncyBpZiBub3QgdXNpbmcgb3B0LWluIGNhcCcsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHNlc3Npb24gPSBhd2FpdCBzdGFydFNlc3Npb24oZGVmYXVsdENhcHMpO1xuICAgICAgICBsZXQgcmVzID0gYXdhaXQgZ2V0U2Vzc2lvbihzZXNzaW9uLnNlc3Npb25JZCk7XG4gICAgICAgIHNob3VsZC5ub3QuZXhpc3QocmVzLmV2ZW50cyk7XG4gICAgICAgIGF3YWl0IGVuZFNlc3Npb24oc2Vzc2lvbi5zZXNzaW9uSWQpO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIGFkZCBzdGFydCBzZXNzaW9uIHRpbWluZ3MnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBjYXBzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdENhcHMsIHtldmVudFRpbWluZ3M6IHRydWV9KTtcbiAgICAgICAgbGV0IHNlc3Npb24gPSBhd2FpdCBzdGFydFNlc3Npb24oY2Fwcyk7XG4gICAgICAgIGxldCByZXMgPSAoYXdhaXQgZ2V0U2Vzc2lvbihzZXNzaW9uLnNlc3Npb25JZCkpLnZhbHVlO1xuICAgICAgICBzaG91bGQuZXhpc3QocmVzLmV2ZW50cyk7XG4gICAgICAgIHNob3VsZC5leGlzdChyZXMuZXZlbnRzLm5ld1Nlc3Npb25SZXF1ZXN0ZWQpO1xuICAgICAgICBzaG91bGQuZXhpc3QocmVzLmV2ZW50cy5uZXdTZXNzaW9uU3RhcnRlZCk7XG4gICAgICAgIHJlcy5ldmVudHMubmV3U2Vzc2lvblJlcXVlc3RlZFswXS5zaG91bGQuYmUuYSgnbnVtYmVyJyk7XG4gICAgICAgIHJlcy5ldmVudHMubmV3U2Vzc2lvblN0YXJ0ZWRbMF0uc2hvdWxkLmJlLmEoJ251bWJlcicpO1xuICAgICAgICBhd2FpdCBlbmRTZXNzaW9uKHNlc3Npb24uc2Vzc2lvbklkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2V4ZWN1dGUgZHJpdmVyIHNjcmlwdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIG1vY2sgc29tZSBtZXRob2RzIG9uIEJhc2VEcml2ZXIgdGhhdCBhcmVuJ3Qgbm9ybWFsbHkgdGhlcmUgZXhjZXB0IGluXG4gICAgICAvLyBhIGZ1bGx5IGJsb3duIGRyaXZlclxuICAgICAgbGV0IG9yaWdpbmFsRmluZEVsZW1lbnQsIHNlc3Npb25JZDtcbiAgICAgIGJlZm9yZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGQuYWxsb3dJbnNlY3VyZSA9IFsnZXhlY3V0ZV9kcml2ZXJfc2NyaXB0J107XG4gICAgICAgIG9yaWdpbmFsRmluZEVsZW1lbnQgPSBkLmZpbmRFbGVtZW50O1xuICAgICAgICBkLmZpbmRFbGVtZW50ID0gKGZ1bmN0aW9uIChzdHJhdGVneSwgc2VsZWN0b3IpIHtcbiAgICAgICAgICBpZiAoc3RyYXRlZ3kgPT09ICdhY2Nlc3NpYmlsaXR5IGlkJyAmJiBzZWxlY3RvciA9PT0gJ2FtYXppbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4ge1tXM0NfRUxFTUVOVF9LRVldOiAnZWxlbWVudC1pZC0xJ307XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhyb3cgbmV3IGVycm9ycy5Ob1N1Y2hFbGVtZW50RXJyb3IoJ25vdCBmb3VuZCcpO1xuICAgICAgICB9KS5iaW5kKGQpO1xuICAgICAgfSk7XG5cbiAgICAgIGJlZm9yZUVhY2goYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAoe3Nlc3Npb25JZH0gPSBhd2FpdCBzdGFydFNlc3Npb24oZGVmYXVsdENhcHMpKTtcbiAgICAgIH0pO1xuXG4gICAgICBhZnRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGQuZmluZEVsZW1lbnQgPSBvcmlnaW5hbEZpbmRFbGVtZW50O1xuICAgICAgfSk7XG5cbiAgICAgIGFmdGVyRWFjaChhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGF3YWl0IGVuZFNlc3Npb24oc2Vzc2lvbklkKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIG5vdCB3b3JrIHVubGVzcyB0aGUgYWxsb3dJbnNlY3VyZSBmZWF0dXJlIGZsYWcgaXMgc2V0JywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICBkLl9hbGxvd0luc2VjdXJlID0gZC5hbGxvd0luc2VjdXJlO1xuICAgICAgICBkLmFsbG93SW5zZWN1cmUgPSBbXTtcbiAgICAgICAgY29uc3Qgc2NyaXB0ID0gYHJldHVybiAnZm9vJ2A7XG4gICAgICAgIGF3YWl0IHJlcXVlc3Qoe1xuICAgICAgICAgIHVybDogYGh0dHA6Ly9sb2NhbGhvc3Q6ODE4MS93ZC9odWIvc2Vzc2lvbi8ke3Nlc3Npb25JZH0vYXBwaXVtL2V4ZWN1dGVfZHJpdmVyYCxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBqc29uOiB7c2NyaXB0LCB0eXBlOiAnd2QnfSxcbiAgICAgICAgfSkuc2hvdWxkLmV2ZW50dWFsbHkuYmUucmVqZWN0ZWRXaXRoKC9hbGxvdy1pbnNlY3VyZS8pO1xuICAgICAgICBhd2FpdCBlbmRTZXNzaW9uKHNlc3Npb25JZCk7XG4gICAgICAgIGQuYWxsb3dJbnNlY3VyZSA9IGQuX2FsbG93SW5zZWN1cmU7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBleGVjdXRlIGEgd2ViZHJpdmVyaW8gc2NyaXB0IGluIHRoZSBjb250ZXh0IG9mIHNlc3Npb24nLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IHNjcmlwdCA9IGBcbiAgICAgICAgICBjb25zdCB0aW1lb3V0cyA9IGF3YWl0IGRyaXZlci5nZXRUaW1lb3V0cygpO1xuICAgICAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IGRyaXZlci5zdGF0dXMoKTtcbiAgICAgICAgICByZXR1cm4gW3RpbWVvdXRzLCBzdGF0dXNdO1xuICAgICAgICBgO1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0KHtcbiAgICAgICAgICB1cmw6IGBodHRwOi8vbG9jYWxob3N0OjgxODEvd2QvaHViL3Nlc3Npb24vJHtzZXNzaW9uSWR9L2FwcGl1bS9leGVjdXRlX2RyaXZlcmAsXG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAganNvbjoge3NjcmlwdCwgdHlwZTogJ3dlYmRyaXZlcmlvJ30sXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBleHBlY3RlZFRpbWVvdXRzID0ge2NvbW1hbmQ6IDI1MCwgaW1wbGljaXQ6IDB9O1xuICAgICAgICBjb25zdCBleHBlY3RlZFN0YXR1cyA9IHt9O1xuICAgICAgICByZXMudmFsdWUucmVzdWx0LnNob3VsZC5lcWwoW2V4cGVjdGVkVGltZW91dHMsIGV4cGVjdGVkU3RhdHVzXSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBmYWlsIHdpdGggYW55IHNjcmlwdCB0eXBlIG90aGVyIHRoYW4gd2ViZHJpdmVyaW8gY3VycmVudGx5JywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBzY3JpcHQgPSBgcmV0dXJuICdmb28nYDtcbiAgICAgICAgYXdhaXQgcmVxdWVzdCh7XG4gICAgICAgICAgdXJsOiBgaHR0cDovL2xvY2FsaG9zdDo4MTgxL3dkL2h1Yi9zZXNzaW9uLyR7c2Vzc2lvbklkfS9hcHBpdW0vZXhlY3V0ZV9kcml2ZXJgLFxuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGpzb246IHtzY3JpcHQsIHR5cGU6ICd3ZCd9LFxuICAgICAgICB9KS5zaG91bGQuZXZlbnR1YWxseS5iZS5yZWplY3RlZFdpdGgoL3NjcmlwdCB0eXBlLyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBleGVjdXRlIGEgd2ViZHJpdmVyaW8gc2NyaXB0IHRoYXQgcmV0dXJucyBlbGVtZW50cyBjb3JyZWN0bHknLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IHNjcmlwdCA9IGBcbiAgICAgICAgICByZXR1cm4gYXdhaXQgZHJpdmVyLiQoXCJ+YW1hemluZ1wiKTtcbiAgICAgICAgYDtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdCh7XG4gICAgICAgICAgdXJsOiBgaHR0cDovL2xvY2FsaG9zdDo4MTgxL3dkL2h1Yi9zZXNzaW9uLyR7c2Vzc2lvbklkfS9hcHBpdW0vZXhlY3V0ZV9kcml2ZXJgLFxuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGpzb246IHtzY3JpcHR9LFxuICAgICAgICB9KTtcbiAgICAgICAgcmVzLnZhbHVlLnJlc3VsdC5zaG91bGQuZXFsKHtcbiAgICAgICAgICBbVzNDX0VMRU1FTlRfS0VZXTogJ2VsZW1lbnQtaWQtMScsXG4gICAgICAgICAgW01KU09OV1BfRUxFTUVOVF9LRVldOiAnZWxlbWVudC1pZC0xJ1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGV4ZWN1dGUgYSB3ZWJkcml2ZXJpbyBzY3JpcHQgdGhhdCByZXR1cm5zIGVsZW1lbnRzIGluIGRlZXAgc3RydWN0dXJlJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBzY3JpcHQgPSBgXG4gICAgICAgICAgY29uc3QgZWwgPSBhd2FpdCBkcml2ZXIuJChcIn5hbWF6aW5nXCIpO1xuICAgICAgICAgIHJldHVybiB7ZWxlbWVudDogZWwsIGVsZW1lbnRzOiBbZWwsIGVsXX07XG4gICAgICAgIGA7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3Qoe1xuICAgICAgICAgIHVybDogYGh0dHA6Ly9sb2NhbGhvc3Q6ODE4MS93ZC9odWIvc2Vzc2lvbi8ke3Nlc3Npb25JZH0vYXBwaXVtL2V4ZWN1dGVfZHJpdmVyYCxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBqc29uOiB7c2NyaXB0fSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGVsT2JqID0ge1xuICAgICAgICAgIFtXM0NfRUxFTUVOVF9LRVldOiAnZWxlbWVudC1pZC0xJyxcbiAgICAgICAgICBbTUpTT05XUF9FTEVNRU5UX0tFWV06ICdlbGVtZW50LWlkLTEnXG4gICAgICAgIH07XG4gICAgICAgIHJlcy52YWx1ZS5yZXN1bHQuc2hvdWxkLmVxbCh7ZWxlbWVudDogZWxPYmosIGVsZW1lbnRzOiBbZWxPYmosIGVsT2JqXX0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgc3RvcmUgYW5kIHJldHVybiBsb2dzIHRvIHRoZSB1c2VyJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBzY3JpcHQgPSBgXG4gICAgICAgICAgY29uc29sZS5sb2coXCJmb29cIik7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJmb28yXCIpO1xuICAgICAgICAgIGNvbnNvbGUud2FybihcImJhclwiKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiYmF6XCIpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBgO1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0KHtcbiAgICAgICAgICB1cmw6IGBodHRwOi8vbG9jYWxob3N0OjgxODEvd2QvaHViL3Nlc3Npb24vJHtzZXNzaW9uSWR9L2FwcGl1bS9leGVjdXRlX2RyaXZlcmAsXG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAganNvbjoge3NjcmlwdH0sXG4gICAgICAgIH0pO1xuICAgICAgICByZXMudmFsdWUubG9ncy5zaG91bGQuZXFsKHtsb2c6IFsnZm9vJywgJ2ZvbzInXSwgd2FybjogWydiYXInXSwgZXJyb3I6IFsnYmF6J119KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGhhdmUgYXBwaXVtIHNwZWNpZmljIGNvbW1hbmRzIGF2YWlsYWJsZScsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3Qgc2NyaXB0ID0gYFxuICAgICAgICAgIHJldHVybiB0eXBlb2YgZHJpdmVyLmxvY2s7XG4gICAgICAgIGA7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3Qoe1xuICAgICAgICAgIHVybDogYGh0dHA6Ly9sb2NhbGhvc3Q6ODE4MS93ZC9odWIvc2Vzc2lvbi8ke3Nlc3Npb25JZH0vYXBwaXVtL2V4ZWN1dGVfZHJpdmVyYCxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBqc29uOiB7c2NyaXB0fSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcy52YWx1ZS5yZXN1bHQuc2hvdWxkLmVxbCgnZnVuY3Rpb24nKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGNvcnJlY3RseSBoYW5kbGUgZXJyb3JzIHRoYXQgaGFwcGVuIGluIGEgd2ViZHJpdmVyaW8gc2NyaXB0JywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBzY3JpcHQgPSBgXG4gICAgICAgICAgcmV0dXJuIGF3YWl0IGRyaXZlci4kKFwifm5vdGZvdW5kXCIpO1xuICAgICAgICBgO1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0KHtcbiAgICAgICAgICB1cmw6IGBodHRwOi8vbG9jYWxob3N0OjgxODEvd2QvaHViL3Nlc3Npb24vJHtzZXNzaW9uSWR9L2FwcGl1bS9leGVjdXRlX2RyaXZlcmAsXG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAganNvbjoge3NjcmlwdH0sXG4gICAgICAgICAgc2ltcGxlOiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcy5zaG91bGQuZXFsKHtcbiAgICAgICAgICBzZXNzaW9uSWQsXG4gICAgICAgICAgc3RhdHVzOiAxMyxcbiAgICAgICAgICB2YWx1ZToge21lc3NhZ2U6ICdBbiB1bmtub3duIHNlcnZlci1zaWRlIGVycm9yIG9jY3VycmVkIHdoaWxlIHByb2Nlc3NpbmcgdGhlIGNvbW1hbmQuIE9yaWdpbmFsIGVycm9yOiBDb3VsZCBub3QgZXhlY3V0ZSBkcml2ZXIgc2NyaXB0LiBPcmlnaW5hbCBlcnJvciB3YXM6IEVycm9yOiBub3QgZm91bmQnfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGNvcnJlY3RseSBoYW5kbGUgZXJyb3JzIHRoYXQgaGFwcGVuIHdoZW4gYSBzY3JpcHQgY2Fubm90IGJlIGNvbXBpbGVkJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBzY3JpcHQgPSBgXG4gICAgICAgICAgcmV0dXJuIHs7XG4gICAgICAgIGA7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3Qoe1xuICAgICAgICAgIHVybDogYGh0dHA6Ly9sb2NhbGhvc3Q6ODE4MS93ZC9odWIvc2Vzc2lvbi8ke3Nlc3Npb25JZH0vYXBwaXVtL2V4ZWN1dGVfZHJpdmVyYCxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBqc29uOiB7c2NyaXB0fSxcbiAgICAgICAgICBzaW1wbGU6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICAgICAgcmVzLnNlc3Npb25JZC5zaG91bGQuZXFsKHNlc3Npb25JZCk7XG4gICAgICAgIHJlcy5zdGF0dXMuc2hvdWxkLmVxbCgxMyk7XG4gICAgICAgIHJlcy52YWx1ZS5zaG91bGQuaGF2ZS5wcm9wZXJ0eSgnbWVzc2FnZScpO1xuICAgICAgICByZXMudmFsdWUubWVzc2FnZS5zaG91bGQubWF0Y2goL0FuIHVua25vd24gc2VydmVyLXNpZGUgZXJyb3Igb2NjdXJyZWQgd2hpbGUgcHJvY2Vzc2luZyB0aGUgY29tbWFuZC4gT3JpZ2luYWwgZXJyb3I6IENvdWxkIG5vdCBleGVjdXRlIGRyaXZlciBzY3JpcHQuIE9yaWdpbmFsIGVycm9yIHdhczogRXJyb3I6IFVuZXhwZWN0ZWQgdG9rZW4gJz87Jz8vKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGJlIGFibGUgdG8gc2V0IGEgdGltZW91dCBvbiBhIGRyaXZlciBzY3JpcHQnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IHNjcmlwdCA9IGBcbiAgICAgICAgICBhd2FpdCBQcm9taXNlLmRlbGF5KDEwMDApO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBgO1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0KHtcbiAgICAgICAgICB1cmw6IGBodHRwOi8vbG9jYWxob3N0OjgxODEvd2QvaHViL3Nlc3Npb24vJHtzZXNzaW9uSWR9L2FwcGl1bS9leGVjdXRlX2RyaXZlcmAsXG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAganNvbjoge3NjcmlwdCwgdGltZW91dDogNTB9LFxuICAgICAgICAgIHNpbXBsZTogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgICAgICByZXMudmFsdWUubWVzc2FnZS5zaG91bGQubWF0Y2goLy4rNTAuK3RpbWVvdXQuKy8pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlRHJpdmVyRTJFVGVzdHM7XG4iXSwiZmlsZSI6InRlc3QvYmFzZWRyaXZlci9kcml2ZXItZTJlLXRlc3RzLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uIn0=
