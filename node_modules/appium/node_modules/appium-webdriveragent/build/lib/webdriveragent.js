"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.WebDriverAgent = void 0;

require("source-map-support/register");

var _lodash = _interopRequireDefault(require("lodash"));

var _path = _interopRequireDefault(require("path"));

var _url2 = _interopRequireDefault(require("url"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _appiumBaseDriver = require("appium-base-driver");

var _appiumSupport = require("appium-support");

var _logger = _interopRequireDefault(require("./logger"));

var _noSessionProxy = require("./no-session-proxy");

var _utils = require("./utils");

var _xcodebuild = _interopRequireDefault(require("./xcodebuild"));

var _asyncLock = _interopRequireDefault(require("async-lock"));

var _teen_process = require("teen_process");

var _checkDependencies = require("./check-dependencies");

var _constants = require("./constants");

const WDA_LAUNCH_TIMEOUT = 60 * 1000;
const WDA_AGENT_PORT = 8100;
const WDA_CF_BUNDLE_NAME = 'WebDriverAgentRunner-Runner';
const SHARED_RESOURCES_GUARD = new _asyncLock.default();

class WebDriverAgent {
  constructor(xcodeVersion, args = {}) {
    this.xcodeVersion = xcodeVersion;
    this.args = _lodash.default.clone(args);
    this.device = args.device;
    this.platformVersion = args.platformVersion;
    this.platformName = args.platformName;
    this.iosSdkVersion = args.iosSdkVersion;
    this.host = args.host;
    this.isRealDevice = !!args.realDevice;
    this.idb = (args.device || {}).idb;
    this.wdaBundlePath = args.wdaBundlePath;
    this.setWDAPaths(args.bootstrapPath, args.agentPath);
    this.wdaLocalPort = args.wdaLocalPort;
    this.wdaRemotePort = args.wdaLocalPort || WDA_AGENT_PORT;
    this.wdaBaseUrl = args.wdaBaseUrl || _constants.WDA_BASE_URL;
    this.prebuildWDA = args.prebuildWDA;
    this.webDriverAgentUrl = args.webDriverAgentUrl;
    this.started = false;
    this.wdaConnectionTimeout = args.wdaConnectionTimeout;
    this.useXctestrunFile = args.useXctestrunFile;
    this.usePrebuiltWDA = args.usePrebuiltWDA;
    this.derivedDataPath = args.derivedDataPath;
    this.mjpegServerPort = args.mjpegServerPort;
    this.updatedWDABundleId = args.updatedWDABundleId;
    this.xcodebuild = new _xcodebuild.default(this.xcodeVersion, this.device, {
      platformVersion: this.platformVersion,
      platformName: this.platformName,
      iosSdkVersion: this.iosSdkVersion,
      agentPath: this.agentPath,
      bootstrapPath: this.bootstrapPath,
      realDevice: this.isRealDevice,
      showXcodeLog: args.showXcodeLog,
      xcodeConfigFile: args.xcodeConfigFile,
      xcodeOrgId: args.xcodeOrgId,
      xcodeSigningId: args.xcodeSigningId,
      keychainPath: args.keychainPath,
      keychainPassword: args.keychainPassword,
      useSimpleBuildTest: args.useSimpleBuildTest,
      usePrebuiltWDA: args.usePrebuiltWDA,
      updatedWDABundleId: this.updatedWDABundleId,
      launchTimeout: args.wdaLaunchTimeout || WDA_LAUNCH_TIMEOUT,
      wdaRemotePort: this.wdaRemotePort,
      useXctestrunFile: this.useXctestrunFile,
      derivedDataPath: args.derivedDataPath,
      mjpegServerPort: this.mjpegServerPort,
      allowProvisioningDeviceRegistration: args.allowProvisioningDeviceRegistration,
      resultBundlePath: args.resultBundlePath,
      resultBundleVersion: args.resultBundleVersion
    });
  }

  setWDAPaths(bootstrapPath, agentPath) {
    this.bootstrapPath = bootstrapPath || _constants.BOOTSTRAP_PATH;

    _logger.default.info(`Using WDA path: '${this.bootstrapPath}'`);

    this.agentPath = agentPath || _path.default.resolve(this.bootstrapPath, 'WebDriverAgent.xcodeproj');

    _logger.default.info(`Using WDA agent: '${this.agentPath}'`);
  }

  async cleanupObsoleteProcesses() {
    const obsoletePids = await (0, _utils.getPIDsListeningOnPort)(this.url.port, cmdLine => cmdLine.includes('/WebDriverAgentRunner') && !cmdLine.toLowerCase().includes(this.device.udid.toLowerCase()));

    if (_lodash.default.isEmpty(obsoletePids)) {
      _logger.default.debug(`No obsolete cached processes from previous WDA sessions ` + `listening on port ${this.url.port} have been found`);

      return;
    }

    _logger.default.info(`Detected ${obsoletePids.length} obsolete cached process${obsoletePids.length === 1 ? '' : 'es'} ` + `from previous WDA sessions. Cleaning them up`);

    try {
      await (0, _teen_process.exec)('kill', obsoletePids);
    } catch (e) {
      _logger.default.warn(`Failed to kill obsolete cached process${obsoletePids.length === 1 ? '' : 'es'} '${obsoletePids}'. ` + `Original error: ${e.message}`);
    }
  }

  async isRunning() {
    return !!(await this.getStatus());
  }

  get basePath() {
    if (this.url.path === '/') {
      return '';
    }

    return this.url.path || '';
  }

  async getStatus() {
    const noSessionProxy = new _noSessionProxy.NoSessionProxy({
      server: this.url.hostname,
      port: this.url.port,
      base: this.basePath,
      timeout: 3000
    });

    try {
      return await noSessionProxy.command('/status', 'GET');
    } catch (err) {
      _logger.default.debug(`WDA is not listening at '${this.url.href}'`);

      return null;
    }
  }

  async uninstall() {
    try {
      const bundleIds = await this.device.getUserInstalledBundleIdsByBundleName(WDA_CF_BUNDLE_NAME);

      if (_lodash.default.isEmpty(bundleIds)) {
        _logger.default.debug('No WDAs on the device.');

        return;
      }

      _logger.default.debug(`Uninstalling WDAs: '${bundleIds}'`);

      for (const bundleId of bundleIds) {
        await this.device.removeApp(bundleId);
      }
    } catch (e) {
      _logger.default.debug(e);

      _logger.default.warn(`WebDriverAgent uninstall failed. Perhaps, it is already uninstalled? ` + `Original error: ${e.message}`);
    }
  }

  async _cleanupProjectIfFresh() {
    const homeFolder = process.env.HOME;

    if (!homeFolder) {
      _logger.default.info('The HOME folder path cannot be determined');

      return;
    }

    const currentUpgradeTimestamp = await (0, _utils.getWDAUpgradeTimestamp)();

    if (!_lodash.default.isInteger(currentUpgradeTimestamp)) {
      _logger.default.info('It is impossible to determine the timestamp of the package');

      return;
    }

    const timestampPath = _path.default.resolve(homeFolder, _constants.WDA_UPGRADE_TIMESTAMP_PATH);

    if (await _appiumSupport.fs.exists(timestampPath)) {
      try {
        await _appiumSupport.fs.access(timestampPath, _appiumSupport.fs.W_OK);
      } catch (ign) {
        _logger.default.info(`WebDriverAgent upgrade timestamp at '${timestampPath}' is not writeable. ` + `Skipping sources cleanup`);

        return;
      }

      const recentUpgradeTimestamp = parseInt(await _appiumSupport.fs.readFile(timestampPath, 'utf8'), 10);

      if (_lodash.default.isInteger(recentUpgradeTimestamp)) {
        if (recentUpgradeTimestamp >= currentUpgradeTimestamp) {
          _logger.default.info(`WebDriverAgent does not need a cleanup. The sources are up to date ` + `(${recentUpgradeTimestamp} >= ${currentUpgradeTimestamp})`);

          return;
        }

        _logger.default.info(`WebDriverAgent sources have been upgraded ` + `(${recentUpgradeTimestamp} < ${currentUpgradeTimestamp})`);
      } else {
        _logger.default.warn(`The recent upgrade timestamp at '${timestampPath}' is corrupted. Trying to fix it`);
      }
    }

    try {
      await (0, _appiumSupport.mkdirp)(_path.default.dirname(timestampPath));
      await _appiumSupport.fs.writeFile(timestampPath, `${currentUpgradeTimestamp}`, 'utf8');

      _logger.default.debug(`Stored the recent WebDriverAgent upgrade timestamp ${currentUpgradeTimestamp} ` + `at '${timestampPath}'`);
    } catch (e) {
      _logger.default.info(`Unable to create the recent WebDriverAgent upgrade timestamp at '${timestampPath}'. ` + `Original error: ${e.message}`);

      return;
    }

    try {
      await this.xcodebuild.cleanProject();
    } catch (e) {
      _logger.default.warn(`Cannot perform WebDriverAgent project cleanup. Original error: ${e.message}`);
    }
  }

  async launch(sessionId) {
    if (this.webDriverAgentUrl) {
      _logger.default.info(`Using provided WebdriverAgent at '${this.webDriverAgentUrl}'`);

      this.url = this.webDriverAgentUrl;
      this.setupProxies(sessionId);
      return await this.getStatus();
    }

    _logger.default.info('Launching WebDriverAgent on the device');

    this.setupProxies(sessionId);

    if (!this.useXctestrunFile && !(await _appiumSupport.fs.exists(this.agentPath))) {
      throw new Error(`Trying to use WebDriverAgent project at '${this.agentPath}' but the ` + 'file does not exist');
    }

    if (this.idb || this.useXctestrunFile || this.derivedDataPath && this.usePrebuiltWDA) {
      _logger.default.info('Skipped WDA project cleanup according to the provided capabilities');
    } else {
      const synchronizationKey = _path.default.normalize(this.bootstrapPath);

      await SHARED_RESOURCES_GUARD.acquire(synchronizationKey, async () => await this._cleanupProjectIfFresh());
    }

    await (0, _utils.resetTestProcesses)(this.device.udid, !this.isRealDevice);

    if (this.idb) {
      return await this.startWithIDB();
    }

    await this.xcodebuild.init(this.noSessionProxy);

    if (this.prebuildWDA) {
      await this.xcodebuild.prebuild();
    }

    return await this.xcodebuild.start();
  }

  async startWithIDB() {
    _logger.default.info('Will launch WDA with idb instead of xcodebuild since the corresponding flag is enabled');

    const {
      wdaBundleId,
      testBundleId
    } = await this.prepareWDA();
    const env = {
      USE_PORT: this.wdaRemotePort,
      WDA_PRODUCT_BUNDLE_IDENTIFIER: this.updatedWDABundleId
    };

    if (this.mjpegServerPort) {
      env.MJPEG_SERVER_PORT = this.mjpegServerPort;
    }

    return await this.idb.runXCUITest(wdaBundleId, wdaBundleId, testBundleId, {
      env
    });
  }

  async parseBundleId(wdaBundlePath) {
    const infoPlistPath = _path.default.join(wdaBundlePath, 'Info.plist');

    const infoPlist = await _appiumSupport.plist.parsePlist(await _appiumSupport.fs.readFile(infoPlistPath));

    if (!infoPlist.CFBundleIdentifier) {
      throw new Error(`Could not find bundle id in '${infoPlistPath}'`);
    }

    return infoPlist.CFBundleIdentifier;
  }

  async prepareWDA() {
    const wdaBundlePath = this.wdaBundlePath || (await this.fetchWDABundle());
    const wdaBundleId = await this.parseBundleId(wdaBundlePath);

    if (!(await this.device.isAppInstalled(wdaBundleId))) {
      await this.device.installApp(wdaBundlePath);
    }

    const testBundleId = await this.idb.installXCTestBundle(_path.default.join(wdaBundlePath, 'PlugIns', 'WebDriverAgentRunner.xctest'));
    return {
      wdaBundleId,
      testBundleId,
      wdaBundlePath
    };
  }

  async fetchWDABundle() {
    if (!this.derivedDataPath) {
      return await (0, _checkDependencies.bundleWDASim)(this.xcodebuild);
    }

    const wdaBundlePaths = await _appiumSupport.fs.glob(`${this.derivedDataPath}/**/*${_constants.WDA_RUNNER_APP}/`, {
      absolute: true
    });

    if (_lodash.default.isEmpty(wdaBundlePaths)) {
      throw new Error(`Could not find the WDA bundle in '${this.derivedDataPath}'`);
    }

    return wdaBundlePaths[0];
  }

  async isSourceFresh() {
    const existsPromises = ['Resources', `Resources${_path.default.sep}WebDriverAgent.bundle`].map(subPath => _appiumSupport.fs.exists(_path.default.resolve(this.bootstrapPath, subPath)));
    return (await _bluebird.default.all(existsPromises)).some(v => v === false);
  }

  setupProxies(sessionId) {
    const proxyOpts = {
      server: this.url.hostname,
      port: this.url.port,
      base: this.basePath,
      timeout: this.wdaConnectionTimeout,
      keepAlive: true
    };
    this.jwproxy = new _appiumBaseDriver.JWProxy(proxyOpts);
    this.jwproxy.sessionId = sessionId;
    this.proxyReqRes = this.jwproxy.proxyReqRes.bind(this.jwproxy);
    this.noSessionProxy = new _noSessionProxy.NoSessionProxy(proxyOpts);
  }

  async quit() {
    _logger.default.info('Shutting down sub-processes');

    await this.xcodebuild.quit();
    await this.xcodebuild.reset();

    if (this.jwproxy) {
      this.jwproxy.sessionId = null;
    }

    this.started = false;

    if (!this.args.webDriverAgentUrl) {
      this.webDriverAgentUrl = null;
    }
  }

  get url() {
    if (!this._url) {
      if (this.webDriverAgentUrl) {
        this._url = _url2.default.parse(this.webDriverAgentUrl);
      } else {
        const port = this.wdaLocalPort || WDA_AGENT_PORT;

        const {
          protocol,
          hostname
        } = _url2.default.parse(this.wdaBaseUrl || _constants.WDA_BASE_URL);

        this._url = _url2.default.parse(`${protocol}//${hostname}:${port}`);
      }
    }

    return this._url;
  }

  set url(_url) {
    this._url = _url2.default.parse(_url);
  }

  get fullyStarted() {
    return this.started;
  }

  set fullyStarted(started = false) {
    this.started = started;
  }

  async retrieveDerivedDataPath() {
    return await this.xcodebuild.retrieveDerivedDataPath();
  }

  async setupCaching() {
    const status = await this.getStatus();

    if (!status || !status.build) {
      _logger.default.debug('WDA is currently not running. There is nothing to cache');

      return;
    }

    const {
      productBundleIdentifier,
      upgradedAt
    } = status.build;

    if (_appiumSupport.util.hasValue(productBundleIdentifier) && _appiumSupport.util.hasValue(this.updatedWDABundleId) && this.updatedWDABundleId !== productBundleIdentifier) {
      _logger.default.info(`Will uninstall running WDA since it has different bundle id. The actual value is '${productBundleIdentifier}'.`);

      return await this.uninstall();
    }

    if (_appiumSupport.util.hasValue(productBundleIdentifier) && !_appiumSupport.util.hasValue(this.updatedWDABundleId) && _constants.WDA_RUNNER_BUNDLE_ID !== productBundleIdentifier) {
      _logger.default.info(`Will uninstall running WDA since its bundle id is not equal to the default value ${_constants.WDA_RUNNER_BUNDLE_ID}`);

      return await this.uninstall();
    }

    const actualUpgradeTimestamp = await (0, _utils.getWDAUpgradeTimestamp)();

    _logger.default.debug(`Upgrade timestamp of the currently bundled WDA: ${actualUpgradeTimestamp}`);

    _logger.default.debug(`Upgrade timestamp of the WDA on the device: ${upgradedAt}`);

    if (actualUpgradeTimestamp && upgradedAt && _lodash.default.toLower(`${actualUpgradeTimestamp}`) !== _lodash.default.toLower(`${upgradedAt}`)) {
      _logger.default.info('Will uninstall running WDA since it has different version in comparison to the one ' + `which is bundled with appium-xcuitest-driver module (${actualUpgradeTimestamp} != ${upgradedAt})`);

      return await this.uninstall();
    }

    const message = _appiumSupport.util.hasValue(productBundleIdentifier) ? `Will reuse previously cached WDA instance at '${this.url.href}' with '${productBundleIdentifier}'` : `Will reuse previously cached WDA instance at '${this.url.href}'`;

    _logger.default.info(`${message}. Set the wdaLocalPort capability to a value different from ${this.url.port} if this is an undesired behavior.`);

    this.webDriverAgentUrl = this.url.href;
  }

  async quitAndUninstall() {
    await this.quit();
    await this.uninstall();
  }

}

exports.WebDriverAgent = WebDriverAgent;
var _default = WebDriverAgent;
exports.default = _default;require('source-map-support').install();


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi93ZWJkcml2ZXJhZ2VudC5qcyJdLCJuYW1lcyI6WyJXREFfTEFVTkNIX1RJTUVPVVQiLCJXREFfQUdFTlRfUE9SVCIsIldEQV9DRl9CVU5ETEVfTkFNRSIsIlNIQVJFRF9SRVNPVVJDRVNfR1VBUkQiLCJBc3luY0xvY2siLCJXZWJEcml2ZXJBZ2VudCIsImNvbnN0cnVjdG9yIiwieGNvZGVWZXJzaW9uIiwiYXJncyIsIl8iLCJjbG9uZSIsImRldmljZSIsInBsYXRmb3JtVmVyc2lvbiIsInBsYXRmb3JtTmFtZSIsImlvc1Nka1ZlcnNpb24iLCJob3N0IiwiaXNSZWFsRGV2aWNlIiwicmVhbERldmljZSIsImlkYiIsIndkYUJ1bmRsZVBhdGgiLCJzZXRXREFQYXRocyIsImJvb3RzdHJhcFBhdGgiLCJhZ2VudFBhdGgiLCJ3ZGFMb2NhbFBvcnQiLCJ3ZGFSZW1vdGVQb3J0Iiwid2RhQmFzZVVybCIsIldEQV9CQVNFX1VSTCIsInByZWJ1aWxkV0RBIiwid2ViRHJpdmVyQWdlbnRVcmwiLCJzdGFydGVkIiwid2RhQ29ubmVjdGlvblRpbWVvdXQiLCJ1c2VYY3Rlc3RydW5GaWxlIiwidXNlUHJlYnVpbHRXREEiLCJkZXJpdmVkRGF0YVBhdGgiLCJtanBlZ1NlcnZlclBvcnQiLCJ1cGRhdGVkV0RBQnVuZGxlSWQiLCJ4Y29kZWJ1aWxkIiwiWGNvZGVCdWlsZCIsInNob3dYY29kZUxvZyIsInhjb2RlQ29uZmlnRmlsZSIsInhjb2RlT3JnSWQiLCJ4Y29kZVNpZ25pbmdJZCIsImtleWNoYWluUGF0aCIsImtleWNoYWluUGFzc3dvcmQiLCJ1c2VTaW1wbGVCdWlsZFRlc3QiLCJsYXVuY2hUaW1lb3V0Iiwid2RhTGF1bmNoVGltZW91dCIsImFsbG93UHJvdmlzaW9uaW5nRGV2aWNlUmVnaXN0cmF0aW9uIiwicmVzdWx0QnVuZGxlUGF0aCIsInJlc3VsdEJ1bmRsZVZlcnNpb24iLCJCT09UU1RSQVBfUEFUSCIsImxvZyIsImluZm8iLCJwYXRoIiwicmVzb2x2ZSIsImNsZWFudXBPYnNvbGV0ZVByb2Nlc3NlcyIsIm9ic29sZXRlUGlkcyIsInVybCIsInBvcnQiLCJjbWRMaW5lIiwiaW5jbHVkZXMiLCJ0b0xvd2VyQ2FzZSIsInVkaWQiLCJpc0VtcHR5IiwiZGVidWciLCJsZW5ndGgiLCJlIiwid2FybiIsIm1lc3NhZ2UiLCJpc1J1bm5pbmciLCJnZXRTdGF0dXMiLCJiYXNlUGF0aCIsIm5vU2Vzc2lvblByb3h5IiwiTm9TZXNzaW9uUHJveHkiLCJzZXJ2ZXIiLCJob3N0bmFtZSIsImJhc2UiLCJ0aW1lb3V0IiwiY29tbWFuZCIsImVyciIsImhyZWYiLCJ1bmluc3RhbGwiLCJidW5kbGVJZHMiLCJnZXRVc2VySW5zdGFsbGVkQnVuZGxlSWRzQnlCdW5kbGVOYW1lIiwiYnVuZGxlSWQiLCJyZW1vdmVBcHAiLCJfY2xlYW51cFByb2plY3RJZkZyZXNoIiwiaG9tZUZvbGRlciIsInByb2Nlc3MiLCJlbnYiLCJIT01FIiwiY3VycmVudFVwZ3JhZGVUaW1lc3RhbXAiLCJpc0ludGVnZXIiLCJ0aW1lc3RhbXBQYXRoIiwiV0RBX1VQR1JBREVfVElNRVNUQU1QX1BBVEgiLCJmcyIsImV4aXN0cyIsImFjY2VzcyIsIldfT0siLCJpZ24iLCJyZWNlbnRVcGdyYWRlVGltZXN0YW1wIiwicGFyc2VJbnQiLCJyZWFkRmlsZSIsImRpcm5hbWUiLCJ3cml0ZUZpbGUiLCJjbGVhblByb2plY3QiLCJsYXVuY2giLCJzZXNzaW9uSWQiLCJzZXR1cFByb3hpZXMiLCJFcnJvciIsInN5bmNocm9uaXphdGlvbktleSIsIm5vcm1hbGl6ZSIsImFjcXVpcmUiLCJzdGFydFdpdGhJREIiLCJpbml0IiwicHJlYnVpbGQiLCJzdGFydCIsIndkYUJ1bmRsZUlkIiwidGVzdEJ1bmRsZUlkIiwicHJlcGFyZVdEQSIsIlVTRV9QT1JUIiwiV0RBX1BST0RVQ1RfQlVORExFX0lERU5USUZJRVIiLCJNSlBFR19TRVJWRVJfUE9SVCIsInJ1blhDVUlUZXN0IiwicGFyc2VCdW5kbGVJZCIsImluZm9QbGlzdFBhdGgiLCJqb2luIiwiaW5mb1BsaXN0IiwicGxpc3QiLCJwYXJzZVBsaXN0IiwiQ0ZCdW5kbGVJZGVudGlmaWVyIiwiZmV0Y2hXREFCdW5kbGUiLCJpc0FwcEluc3RhbGxlZCIsImluc3RhbGxBcHAiLCJpbnN0YWxsWENUZXN0QnVuZGxlIiwid2RhQnVuZGxlUGF0aHMiLCJnbG9iIiwiV0RBX1JVTk5FUl9BUFAiLCJhYnNvbHV0ZSIsImlzU291cmNlRnJlc2giLCJleGlzdHNQcm9taXNlcyIsInNlcCIsIm1hcCIsInN1YlBhdGgiLCJCIiwiYWxsIiwic29tZSIsInYiLCJwcm94eU9wdHMiLCJrZWVwQWxpdmUiLCJqd3Byb3h5IiwiSldQcm94eSIsInByb3h5UmVxUmVzIiwiYmluZCIsInF1aXQiLCJyZXNldCIsIl91cmwiLCJwYXJzZSIsInByb3RvY29sIiwiZnVsbHlTdGFydGVkIiwicmV0cmlldmVEZXJpdmVkRGF0YVBhdGgiLCJzZXR1cENhY2hpbmciLCJzdGF0dXMiLCJidWlsZCIsInByb2R1Y3RCdW5kbGVJZGVudGlmaWVyIiwidXBncmFkZWRBdCIsInV0aWwiLCJoYXNWYWx1ZSIsIldEQV9SVU5ORVJfQlVORExFX0lEIiwiYWN0dWFsVXBncmFkZVRpbWVzdGFtcCIsInRvTG93ZXIiLCJxdWl0QW5kVW5pbnN0YWxsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUtBLE1BQU1BLGtCQUFrQixHQUFHLEtBQUssSUFBaEM7QUFDQSxNQUFNQyxjQUFjLEdBQUcsSUFBdkI7QUFDQSxNQUFNQyxrQkFBa0IsR0FBRyw2QkFBM0I7QUFDQSxNQUFNQyxzQkFBc0IsR0FBRyxJQUFJQyxrQkFBSixFQUEvQjs7QUFFQSxNQUFNQyxjQUFOLENBQXFCO0FBQ25CQyxFQUFBQSxXQUFXLENBQUVDLFlBQUYsRUFBZ0JDLElBQUksR0FBRyxFQUF2QixFQUEyQjtBQUNw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RCxVQUFNd0Ysc0JBQXNCLEdBQUcsTUFBTSxvQ0FBckM7O0FBQ0F0SCxvQkFBSWEsS0FBSixDQUFXLG1EQUFrRHlHLHNCQUF1QixFQUFwRjs7QUFDQXRILG9CQUFJYSxLQUFKLENBQVcsK0NBQThDcUcsVUFBVyxFQUFwRTs7QUFDQSxRQUFJSSxzQkFBc0IsSUFBSUosVUFBMUIsSUFBd0M1SixnQkFBRWlLLE9BQUYsQ0FBVyxHQUFFRCxzQkFBdUIsRUFBcEMsTUFBMkNoSyxnQkFBRWlLLE9BQUYsQ0FBVyxHQUFFTCxVQUFXLEVBQXhCLENBQXZGLEVBQW1IO0FBQ2pIbEgsc0JBQUlDLElBQUosQ0FBUyx3RkFDTix3REFBdURxSCxzQkFBdUIsT0FBTUosVUFBVyxHQURsRzs7QUFFQSxhQUFPLE1BQU0sS0FBS3BGLFNBQUwsRUFBYjtBQUNEOztBQUVELFVBQU1iLE9BQU8sR0FBR2tHLG9CQUFLQyxRQUFMLENBQWNILHVCQUFkLElBQ1gsaURBQWdELEtBQUszRyxHQUFMLENBQVN1QixJQUFLLFdBQVVvRix1QkFBd0IsR0FEckYsR0FFWCxpREFBZ0QsS0FBSzNHLEdBQUwsQ0FBU3VCLElBQUssR0FGbkU7O0FBR0E3QixvQkFBSUMsSUFBSixDQUFVLEdBQUVnQixPQUFRLCtEQUE4RCxLQUFLWCxHQUFMLENBQVNDLElBQUssb0NBQWhHOztBQUNBLFNBQUs5QixpQkFBTCxHQUF5QixLQUFLNkIsR0FBTCxDQUFTdUIsSUFBbEM7QUFDRDs7QUFLcUIsUUFBaEIyRixnQkFBZ0IsR0FBSTtBQUN4QixVQUFNLEtBQUtqQixJQUFMLEVBQU47QUFDQSxVQUFNLEtBQUt6RSxTQUFMLEVBQU47QUFDRDs7QUE3Y2tCOzs7ZUFnZE41RSxjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHVybCBmcm9tICd1cmwnO1xuaW1wb3J0IEIgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgSldQcm94eSB9IGZyb20gJ2FwcGl1bS1iYXNlLWRyaXZlcic7XG5pbXBvcnQgeyBmcywgdXRpbCwgcGxpc3QsIG1rZGlycCB9IGZyb20gJ2FwcGl1bS1zdXBwb3J0JztcbmltcG9ydCBsb2cgZnJvbSAnLi9sb2dnZXInO1xuaW1wb3J0IHsgTm9TZXNzaW9uUHJveHkgfSBmcm9tICcuL25vLXNlc3Npb24tcHJveHknO1xuaW1wb3J0IHtcbiAgZ2V0V0RBVXBncmFkZVRpbWVzdGFtcCwgcmVzZXRUZXN0UHJvY2Vzc2VzLCBnZXRQSURzTGlzdGVuaW5nT25Qb3J0XG59IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IFhjb2RlQnVpbGQgZnJvbSAnLi94Y29kZWJ1aWxkJztcbmltcG9ydCBBc3luY0xvY2sgZnJvbSAnYXN5bmMtbG9jayc7XG5pbXBvcnQgeyBleGVjIH0gZnJvbSAndGVlbl9wcm9jZXNzJztcbmltcG9ydCB7IGJ1bmRsZVdEQVNpbSB9IGZyb20gJy4vY2hlY2stZGVwZW5kZW5jaWVzJztcbmltcG9ydCB7XG4gIEJPT1RTVFJBUF9QQVRILCBXREFfUlVOTkVSX0JVTkRMRV9JRCwgV0RBX1JVTk5FUl9BUFAsXG4gIFdEQV9CQVNFX1VSTCwgV0RBX1VQR1JBREVfVElNRVNUQU1QX1BBVEgsXG59IGZyb20gJy4vY29uc3RhbnRzJztcblxuY29uc3QgV0RBX0xBVU5DSF9USU1FT1VUID0gNjAgKiAxMDAwO1xuY29uc3QgV0RBX0FHRU5UX1BPUlQgPSA4MTAwO1xuY29uc3QgV0RBX0NGX0JVTkRMRV9OQU1FID0gJ1dlYkRyaXZlckFnZW50UnVubmVyLVJ1bm5lcic7XG5jb25zdCBTSEFSRURfUkVTT1VSQ0VTX0dVQVJEID0gbmV3IEFzeW5jTG9jaygpO1xuXG5jbGFzcyBXZWJEcml2ZXJBZ2VudCB7XG4gIGNvbnN0cnVjdG9yICh4Y29kZVZlcnNpb24sIGFyZ3MgPSB7fSkge1xuICAgIHRoaXMueGNvZGVWZXJzaW9uID0geGNvZGVWZXJzaW9uO1xuXG4gICAgdGhpcy5hcmdzID0gXy5jbG9uZShhcmdzKTtcblxuICAgIHRoaXMuZGV2aWNlID0gYXJncy5kZXZpY2U7XG4gICAgdGhpcy5wbGF0Zm9ybVZlcnNpb24gPSBhcmdzLnBsYXRmb3JtVmVyc2lvbjtcbiAgICB0aGlzLnBsYXRmb3JtTmFtZSA9IGFyZ3MucGxhdGZvcm1OYW1lO1xuICAgIHRoaXMuaW9zU2RrVmVyc2lvbiA9IGFyZ3MuaW9zU2RrVmVyc2lvbjtcbiAgICB0aGlzLmhvc3QgPSBhcmdzLmhvc3Q7XG4gICAgdGhpcy5pc1JlYWxEZXZpY2UgPSAhIWFyZ3MucmVhbERldmljZTtcbiAgICB0aGlzLmlkYiA9IChhcmdzLmRldmljZSB8fCB7fSkuaWRiO1xuICAgIHRoaXMud2RhQnVuZGxlUGF0aCA9IGFyZ3Mud2RhQnVuZGxlUGF0aDtcblxuICAgIHRoaXMuc2V0V0RBUGF0aHMoYXJncy5ib290c3RyYXBQYXRoLCBhcmdzLmFnZW50UGF0aCk7XG5cbiAgICB0aGlzLndkYUxvY2FsUG9ydCA9IGFyZ3Mud2RhTG9jYWxQb3J0O1xuICAgIHRoaXMud2RhUmVtb3RlUG9ydCA9IGFyZ3Mud2RhTG9jYWxQb3J0IHx8IFdEQV9BR0VOVF9QT1JUO1xuICAgIHRoaXMud2RhQmFzZVVybCA9IGFyZ3Mud2RhQmFzZVVybCB8fCBXREFfQkFTRV9VUkw7XG5cbiAgICB0aGlzLnByZWJ1aWxkV0RBID0gYXJncy5wcmVidWlsZFdEQTtcblxuICAgIHRoaXMud2ViRHJpdmVyQWdlbnRVcmwgPSBhcmdzLndlYkRyaXZlckFnZW50VXJsO1xuXG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLndkYUNvbm5lY3Rpb25UaW1lb3V0ID0gYXJncy53ZGFDb25uZWN0aW9uVGltZW91dDtcblxuICAgIHRoaXMudXNlWGN0ZXN0cnVuRmlsZSA9IGFyZ3MudXNlWGN0ZXN0cnVuRmlsZTtcbiAgICB0aGlzLnVzZVByZWJ1aWx0V0RBID0gYXJncy51c2VQcmVidWlsdFdEQTtcbiAgICB0aGlzLmRlcml2ZWREYXRhUGF0aCA9IGFyZ3MuZGVyaXZlZERhdGFQYXRoO1xuICAgIHRoaXMubWpwZWdTZXJ2ZXJQb3J0ID0gYXJncy5tanBlZ1NlcnZlclBvcnQ7XG5cbiAgICB0aGlzLnVwZGF0ZWRXREFCdW5kbGVJZCA9IGFyZ3MudXBkYXRlZFdEQUJ1bmRsZUlkO1xuXG4gICAgdGhpcy54Y29kZWJ1aWxkID0gbmV3IFhjb2RlQnVpbGQodGhpcy54Y29kZVZlcnNpb24sIHRoaXMuZGV2aWNlLCB7XG4gICAgICBwbGF0Zm9ybVZlcnNpb246IHRoaXMucGxhdGZvcm1WZXJzaW9uLFxuICAgICAgcGxhdGZvcm1OYW1lOiB0aGlzLnBsYXRmb3JtTmFtZSxcbiAgICAgIGlvc1Nka1ZlcnNpb246IHRoaXMuaW9zU2RrVmVyc2lvbixcbiAgICAgIGFnZW50UGF0aDogdGhpcy5hZ2VudFBhdGgsXG4gICAgICBib290c3RyYXBQYXRoOiB0aGlzLmJvb3RzdHJhcFBhdGgsXG4gICAgICByZWFsRGV2aWNlOiB0aGlzLmlzUmVhbERldmljZSxcbiAgICAgIHNob3dYY29kZUxvZzogYXJncy5zaG93WGNvZGVMb2csXG4gICAgICB4Y29kZUNvbmZpZ0ZpbGU6IGFyZ3MueGNvZGVDb25maWdGaWxlLFxuICAgICAgeGNvZGVPcmdJZDogYXJncy54Y29kZU9yZ0lkLFxuICAgICAgeGNvZGVTaWduaW5nSWQ6IGFyZ3MueGNvZGVTaWduaW5nSWQsXG4gICAgICBrZXljaGFpblBhdGg6IGFyZ3Mua2V5Y2hhaW5QYXRoLFxuICAgICAga2V5Y2hhaW5QYXNzd29yZDogYXJncy5rZXljaGFpblBhc3N3b3JkLFxuICAgICAgdXNlU2ltcGxlQnVpbGRUZXN0OiBhcmdzLnVzZVNpbXBsZUJ1aWxkVGVzdCxcbiAgICAgIHVzZVByZWJ1aWx0V0RBOiBhcmdzLnVzZVByZWJ1aWx0V0RBLFxuICAgICAgdXBkYXRlZFdEQUJ1bmRsZUlkOiB0aGlzLnVwZGF0ZWRXREFCdW5kbGVJZCxcbiAgICAgIGxhdW5jaFRpbWVvdXQ6IGFyZ3Mud2RhTGF1bmNoVGltZW91dCB8fCBXREFfTEFVTkNIX1RJTUVPVVQsXG4gICAgICB3ZGFSZW1vdGVQb3J0OiB0aGlzLndkYVJlbW90ZVBvcnQsXG4gICAgICB1c2VYY3Rlc3RydW5GaWxlOiB0aGlzLnVzZVhjdGVzdHJ1bkZpbGUsXG4gICAgICBkZXJpdmVkRGF0YVBhdGg6IGFyZ3MuZGVyaXZlZERhdGFQYXRoLFxuICAgICAgbWpwZWdTZXJ2ZXJQb3J0OiB0aGlzLm1qcGVnU2VydmVyUG9ydCxcbiAgICAgIGFsbG93UHJvdmlzaW9uaW5nRGV2aWNlUmVnaXN0cmF0aW9uOiBhcmdzLmFsbG93UHJvdmlzaW9uaW5nRGV2aWNlUmVnaXN0cmF0aW9uLFxuICAgICAgcmVzdWx0QnVuZGxlUGF0aDogYXJncy5yZXN1bHRCdW5kbGVQYXRoLFxuICAgICAgcmVzdWx0QnVuZGxlVmVyc2lvbjogYXJncy5yZXN1bHRCdW5kbGVWZXJzaW9uLFxuICAgIH0pO1xuICB9XG5cbiAgc2V0V0RBUGF0aHMgKGJvb3RzdHJhcFBhdGgsIGFnZW50UGF0aCkge1xuICAgIC8vIGFsbG93IHRoZSB1c2VyIHRvIHNwZWNpZnkgYSBwbGFjZSBmb3IgV0RBLiBUaGlzIGlzIHVuZG9jdW1lbnRlZCBhbmRcbiAgICAvLyBvbmx5IGhlcmUgZm9yIHRoZSBwdXJwb3NlcyBvZiB0ZXN0aW5nIGRldmVsb3BtZW50IG9mIFdEQVxuICAgIHRoaXMuYm9vdHN0cmFwUGF0aCA9IGJvb3RzdHJhcFBhdGggfHwgQk9PVFNUUkFQX1BBVEg7XG4gICAgbG9nLmluZm8oYFVzaW5nIFdEQSBwYXRoOiAnJHt0aGlzLmJvb3RzdHJhcFBhdGh9J2ApO1xuXG4gICAgLy8gZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2UgbmVlZCB0byBiZSBhYmxlIHRvIHNwZWNpZnkgYWdlbnRQYXRoIHRvb1xuICAgIHRoaXMuYWdlbnRQYXRoID0gYWdlbnRQYXRoIHx8IHBhdGgucmVzb2x2ZSh0aGlzLmJvb3RzdHJhcFBhdGgsICdXZWJEcml2ZXJBZ2VudC54Y29kZXByb2onKTtcbiAgICBsb2cuaW5mbyhgVXNpbmcgV0RBIGFnZW50OiAnJHt0aGlzLmFnZW50UGF0aH0nYCk7XG4gIH1cblxuICBhc3luYyBjbGVhbnVwT2Jzb2xldGVQcm9jZXNzZXMgKCkge1xuICAgIGNvbnN0IG9ic29sZXRlUGlkcyA9IGF3YWl0IGdldFBJRHNMaXN0ZW5pbmdPblBvcnQodGhpcy51cmwucG9ydCxcbiAgICAgIChjbWRMaW5lKSA9PiBjbWRMaW5lLmluY2x1ZGVzKCcvV2ViRHJpdmVyQWdlbnRSdW5uZXInKSAmJlxuICAgICAgICAhY21kTGluZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHRoaXMuZGV2aWNlLnVkaWQudG9Mb3dlckNhc2UoKSkpO1xuXG4gICAgaWYgKF8uaXNFbXB0eShvYnNvbGV0ZVBpZHMpKSB7XG4gICAgICBsb2cuZGVidWcoYE5vIG9ic29sZXRlIGNhY2hlZCBwcm9jZXNzZXMgZnJvbSBwcmV2aW91cyBXREEgc2Vzc2lvbnMgYCArXG4gICAgICAgIGBsaXN0ZW5pbmcgb24gcG9ydCAke3RoaXMudXJsLnBvcnR9IGhhdmUgYmVlbiBmb3VuZGApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZy5pbmZvKGBEZXRlY3RlZCAke29ic29sZXRlUGlkcy5sZW5ndGh9IG9ic29sZXRlIGNhY2hlZCBwcm9jZXNzJHtvYnNvbGV0ZVBpZHMubGVuZ3RoID09PSAxID8gJycgOiAnZXMnfSBgICtcbiAgICAgIGBmcm9tIHByZXZpb3VzIFdEQSBzZXNzaW9ucy4gQ2xlYW5pbmcgdGhlbSB1cGApO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBleGVjKCdraWxsJywgb2Jzb2xldGVQaWRzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBsb2cud2FybihgRmFpbGVkIHRvIGtpbGwgb2Jzb2xldGUgY2FjaGVkIHByb2Nlc3Mke29ic29sZXRlUGlkcy5sZW5ndGggPT09IDEgPyAnJyA6ICdlcyd9ICcke29ic29sZXRlUGlkc30nLiBgICtcbiAgICAgICAgYE9yaWdpbmFsIGVycm9yOiAke2UubWVzc2FnZX1gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGJvb2xlYW4gaWYgV0RBIGlzIHJ1bm5pbmcgb3Igbm90XG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgV0RBIGlzIHJ1bm5pbmdcbiAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZXJlIHdhcyBpbnZhbGlkIHJlc3BvbnNlIGNvZGUgb3IgYm9keVxuICAgKi9cbiAgYXN5bmMgaXNSdW5uaW5nICgpIHtcbiAgICByZXR1cm4gISEoYXdhaXQgdGhpcy5nZXRTdGF0dXMoKSk7XG4gIH1cblxuICBnZXQgYmFzZVBhdGggKCkge1xuICAgIGlmICh0aGlzLnVybC5wYXRoID09PSAnLycpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudXJsLnBhdGggfHwgJyc7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGN1cnJlbnQgcnVubmluZyBXREEncyBzdGF0dXMgbGlrZSBiZWxvd1xuICAgKiB7XG4gICAqICAgXCJzdGF0ZVwiOiBcInN1Y2Nlc3NcIixcbiAgICogICBcIm9zXCI6IHtcbiAgICogICAgIFwibmFtZVwiOiBcImlPU1wiLFxuICAgKiAgICAgXCJ2ZXJzaW9uXCI6IFwiMTEuNFwiLFxuICAgKiAgICAgXCJzZGtWZXJzaW9uXCI6IFwiMTEuM1wiXG4gICAqICAgfSxcbiAgICogICBcImlvc1wiOiB7XG4gICAqICAgICBcInNpbXVsYXRvclZlcnNpb25cIjogXCIxMS40XCIsXG4gICAqICAgICBcImlwXCI6IFwiMTcyLjI1NC45OS4zNFwiXG4gICAqICAgfSxcbiAgICogICBcImJ1aWxkXCI6IHtcbiAgICogICAgIFwidGltZVwiOiBcIkp1biAyNCAyMDE4IDE3OjA4OjIxXCIsXG4gICAqICAgICBcInByb2R1Y3RCdW5kbGVJZGVudGlmaWVyXCI6IFwiY29tLmZhY2Vib29rLldlYkRyaXZlckFnZW50UnVubmVyXCJcbiAgICogICB9XG4gICAqIH1cbiAgICpcbiAgICogQHJldHVybiB7P29iamVjdH0gU3RhdGUgT2JqZWN0XG4gICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGVyZSB3YXMgaW52YWxpZCByZXNwb25zZSBjb2RlIG9yIGJvZHlcbiAgICovXG4gIGFzeW5jIGdldFN0YXR1cyAoKSB7XG4gICAgY29uc3Qgbm9TZXNzaW9uUHJveHkgPSBuZXcgTm9TZXNzaW9uUHJveHkoe1xuICAgICAgc2VydmVyOiB0aGlzLnVybC5ob3N0bmFtZSxcbiAgICAgIHBvcnQ6IHRoaXMudXJsLnBvcnQsXG4gICAgICBiYXNlOiB0aGlzLmJhc2VQYXRoLFxuICAgICAgdGltZW91dDogMzAwMCxcbiAgICB9KTtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IG5vU2Vzc2lvblByb3h5LmNvbW1hbmQoJy9zdGF0dXMnLCAnR0VUJyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBsb2cuZGVidWcoYFdEQSBpcyBub3QgbGlzdGVuaW5nIGF0ICcke3RoaXMudXJsLmhyZWZ9J2ApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVuaW5zdGFsbCBXREFzIGZyb20gdGhlIHRlc3QgZGV2aWNlLlxuICAgKiBPdmVyIFhjb2RlIDExLCBtdWx0aXBsZSBXREEgY2FuIGJlIGluIHRoZSBkZXZpY2Ugc2luY2UgWGNvZGUgMTEgZ2VuZXJhdGVzIGRpZmZlcmVudCBXREEuXG4gICAqIEFwcGl1bSBkb2VzIG5vdCBleHBlY3QgbXVsdGlwbGUgV0RBcyBhcmUgcnVubmluZyBvbiBhIGRldmljZS5cbiAgICovXG4gIGFzeW5jIHVuaW5zdGFsbCAoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJ1bmRsZUlkcyA9IGF3YWl0IHRoaXMuZGV2aWNlLmdldFVzZXJJbnN0YWxsZWRCdW5kbGVJZHNCeUJ1bmRsZU5hbWUoV0RBX0NGX0JVTkRMRV9OQU1FKTtcbiAgICAgIGlmIChfLmlzRW1wdHkoYnVuZGxlSWRzKSkge1xuICAgICAgICBsb2cuZGVidWcoJ05vIFdEQXMgb24gdGhlIGRldmljZS4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsb2cuZGVidWcoYFVuaW5zdGFsbGluZyBXREFzOiAnJHtidW5kbGVJZHN9J2ApO1xuICAgICAgZm9yIChjb25zdCBidW5kbGVJZCBvZiBidW5kbGVJZHMpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5kZXZpY2UucmVtb3ZlQXBwKGJ1bmRsZUlkKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBsb2cuZGVidWcoZSk7XG4gICAgICBsb2cud2FybihgV2ViRHJpdmVyQWdlbnQgdW5pbnN0YWxsIGZhaWxlZC4gUGVyaGFwcywgaXQgaXMgYWxyZWFkeSB1bmluc3RhbGxlZD8gYCArXG4gICAgICAgIGBPcmlnaW5hbCBlcnJvcjogJHtlLm1lc3NhZ2V9YCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgX2NsZWFudXBQcm9qZWN0SWZGcmVzaCAoKSB7XG4gICAgY29uc3QgaG9tZUZvbGRlciA9IHByb2Nlc3MuZW52LkhPTUU7XG4gICAgaWYgKCFob21lRm9sZGVyKSB7XG4gICAgICBsb2cuaW5mbygnVGhlIEhPTUUgZm9sZGVyIHBhdGggY2Fubm90IGJlIGRldGVybWluZWQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50VXBncmFkZVRpbWVzdGFtcCA9IGF3YWl0IGdldFdEQVVwZ3JhZGVUaW1lc3RhbXAoKTtcbiAgICBpZiAoIV8uaXNJbnRlZ2VyKGN1cnJlbnRVcGdyYWRlVGltZXN0YW1wKSkge1xuICAgICAgbG9nLmluZm8oJ0l0IGlzIGltcG9zc2libGUgdG8gZGV0ZXJtaW5lIHRoZSB0aW1lc3RhbXAgb2YgdGhlIHBhY2thZ2UnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0aW1lc3RhbXBQYXRoID0gcGF0aC5yZXNvbHZlKGhvbWVGb2xkZXIsIFdEQV9VUEdSQURFX1RJTUVTVEFNUF9QQVRIKTtcbiAgICBpZiAoYXdhaXQgZnMuZXhpc3RzKHRpbWVzdGFtcFBhdGgpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBmcy5hY2Nlc3ModGltZXN0YW1wUGF0aCwgZnMuV19PSyk7XG4gICAgICB9IGNhdGNoIChpZ24pIHtcbiAgICAgICAgbG9nLmluZm8oYFdlYkRyaXZlckFnZW50IHVwZ3JhZGUgdGltZXN0YW1wIGF0ICcke3RpbWVzdGFtcFBhdGh9JyBpcyBub3Qgd3JpdGVhYmxlLiBgICtcbiAgICAgICAgICBgU2tpcHBpbmcgc291cmNlcyBjbGVhbnVwYCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlY2VudFVwZ3JhZGVUaW1lc3RhbXAgPSBwYXJzZUludChhd2FpdCBmcy5yZWFkRmlsZSh0aW1lc3RhbXBQYXRoLCAndXRmOCcpLCAxMCk7XG4gICAgICBpZiAoXy5pc0ludGVnZXIocmVjZW50VXBncmFkZVRpbWVzdGFtcCkpIHtcbiAgICAgICAgaWYgKHJlY2VudFVwZ3JhZGVUaW1lc3RhbXAgPj0gY3VycmVudFVwZ3JhZGVUaW1lc3RhbXApIHtcbiAgICAgICAgICBsb2cuaW5mbyhgV2ViRHJpdmVyQWdlbnQgZG9lcyBub3QgbmVlZCBhIGNsZWFudXAuIFRoZSBzb3VyY2VzIGFyZSB1cCB0byBkYXRlIGAgK1xuICAgICAgICAgICAgYCgke3JlY2VudFVwZ3JhZGVUaW1lc3RhbXB9ID49ICR7Y3VycmVudFVwZ3JhZGVUaW1lc3RhbXB9KWApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsb2cuaW5mbyhgV2ViRHJpdmVyQWdlbnQgc291cmNlcyBoYXZlIGJlZW4gdXBncmFkZWQgYCArXG4gICAgICAgICAgYCgke3JlY2VudFVwZ3JhZGVUaW1lc3RhbXB9IDwgJHtjdXJyZW50VXBncmFkZVRpbWVzdGFtcH0pYCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2cud2FybihgVGhlIHJlY2VudCB1cGdyYWRlIHRpbWVzdGFtcCBhdCAnJHt0aW1lc3RhbXBQYXRofScgaXMgY29ycnVwdGVkLiBUcnlpbmcgdG8gZml4IGl0YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG1rZGlycChwYXRoLmRpcm5hbWUodGltZXN0YW1wUGF0aCkpO1xuICAgICAgYXdhaXQgZnMud3JpdGVGaWxlKHRpbWVzdGFtcFBhdGgsIGAke2N1cnJlbnRVcGdyYWRlVGltZXN0YW1wfWAsICd1dGY4Jyk7XG4gICAgICBsb2cuZGVidWcoYFN0b3JlZCB0aGUgcmVjZW50IFdlYkRyaXZlckFnZW50IHVwZ3JhZGUgdGltZXN0YW1wICR7Y3VycmVudFVwZ3JhZGVUaW1lc3RhbXB9IGAgK1xuICAgICAgICBgYXQgJyR7dGltZXN0YW1wUGF0aH0nYCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nLmluZm8oYFVuYWJsZSB0byBjcmVhdGUgdGhlIHJlY2VudCBXZWJEcml2ZXJBZ2VudCB1cGdyYWRlIHRpbWVzdGFtcCBhdCAnJHt0aW1lc3RhbXBQYXRofScuIGAgK1xuICAgICAgICBgT3JpZ2luYWwgZXJyb3I6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLnhjb2RlYnVpbGQuY2xlYW5Qcm9qZWN0KCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nLndhcm4oYENhbm5vdCBwZXJmb3JtIFdlYkRyaXZlckFnZW50IHByb2plY3QgY2xlYW51cC4gT3JpZ2luYWwgZXJyb3I6ICR7ZS5tZXNzYWdlfWApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gY3VycmVudCBydW5uaW5nIFdEQSdzIHN0YXR1cyBsaWtlIGJlbG93IGFmdGVyIGxhdW5jaGluZyBXREFcbiAgICoge1xuICAgKiAgIFwic3RhdGVcIjogXCJzdWNjZXNzXCIsXG4gICAqICAgXCJvc1wiOiB7XG4gICAqICAgICBcIm5hbWVcIjogXCJpT1NcIixcbiAgICogICAgIFwidmVyc2lvblwiOiBcIjExLjRcIixcbiAgICogICAgIFwic2RrVmVyc2lvblwiOiBcIjExLjNcIlxuICAgKiAgIH0sXG4gICAqICAgXCJpb3NcIjoge1xuICAgKiAgICAgXCJzaW11bGF0b3JWZXJzaW9uXCI6IFwiMTEuNFwiLFxuICAgKiAgICAgXCJpcFwiOiBcIjE3Mi4yNTQuOTkuMzRcIlxuICAgKiAgIH0sXG4gICAqICAgXCJidWlsZFwiOiB7XG4gICAqICAgICBcInRpbWVcIjogXCJKdW4gMjQgMjAxOCAxNzowODoyMVwiLFxuICAgKiAgICAgXCJwcm9kdWN0QnVuZGxlSWRlbnRpZmllclwiOiBcImNvbS5mYWNlYm9vay5XZWJEcml2ZXJBZ2VudFJ1bm5lclwiXG4gICAqICAgfVxuICAgKiB9XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZXNzaW9uSWQgTGF1bmNoIFdEQSBhbmQgZXN0YWJsaXNoIHRoZSBzZXNzaW9uIHdpdGggdGhpcyBzZXNzaW9uSWRcbiAgICogQHJldHVybiB7P29iamVjdH0gU3RhdGUgT2JqZWN0XG4gICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGVyZSB3YXMgaW52YWxpZCByZXNwb25zZSBjb2RlIG9yIGJvZHlcbiAgICovXG4gIGFzeW5jIGxhdW5jaCAoc2Vzc2lvbklkKSB7XG4gICAgaWYgKHRoaXMud2ViRHJpdmVyQWdlbnRVcmwpIHtcbiAgICAgIGxvZy5pbmZvKGBVc2luZyBwcm92aWRlZCBXZWJkcml2ZXJBZ2VudCBhdCAnJHt0aGlzLndlYkRyaXZlckFnZW50VXJsfSdgKTtcbiAgICAgIHRoaXMudXJsID0gdGhpcy53ZWJEcml2ZXJBZ2VudFVybDtcbiAgICAgIHRoaXMuc2V0dXBQcm94aWVzKHNlc3Npb25JZCk7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRTdGF0dXMoKTtcbiAgICB9XG5cbiAgICBsb2cuaW5mbygnTGF1bmNoaW5nIFdlYkRyaXZlckFnZW50IG9uIHRoZSBkZXZpY2UnKTtcblxuICAgIHRoaXMuc2V0dXBQcm94aWVzKHNlc3Npb25JZCk7XG5cbiAgICBpZiAoIXRoaXMudXNlWGN0ZXN0cnVuRmlsZSAmJiAhYXdhaXQgZnMuZXhpc3RzKHRoaXMuYWdlbnRQYXRoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUcnlpbmcgdG8gdXNlIFdlYkRyaXZlckFnZW50IHByb2plY3QgYXQgJyR7dGhpcy5hZ2VudFBhdGh9JyBidXQgdGhlIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICdmaWxlIGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgfVxuXG4gICAgLy8gdXNlWGN0ZXN0cnVuRmlsZSBhbmQgdXNlUHJlYnVpbHRXREEgdXNlIGV4aXN0aW5nIGRlcGVuZGVuY2llc1xuICAgIC8vIEl0IGRlcGVuZHMgb24gdXNlciBzaWRlXG4gICAgaWYgKHRoaXMuaWRiIHx8IHRoaXMudXNlWGN0ZXN0cnVuRmlsZSB8fCAodGhpcy5kZXJpdmVkRGF0YVBhdGggJiYgdGhpcy51c2VQcmVidWlsdFdEQSkpIHtcbiAgICAgIGxvZy5pbmZvKCdTa2lwcGVkIFdEQSBwcm9qZWN0IGNsZWFudXAgYWNjb3JkaW5nIHRvIHRoZSBwcm92aWRlZCBjYXBhYmlsaXRpZXMnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc3luY2hyb25pemF0aW9uS2V5ID0gcGF0aC5ub3JtYWxpemUodGhpcy5ib290c3RyYXBQYXRoKTtcbiAgICAgIGF3YWl0IFNIQVJFRF9SRVNPVVJDRVNfR1VBUkQuYWNxdWlyZShzeW5jaHJvbml6YXRpb25LZXksXG4gICAgICAgIGFzeW5jICgpID0+IGF3YWl0IHRoaXMuX2NsZWFudXBQcm9qZWN0SWZGcmVzaCgpKTtcbiAgICB9XG5cbiAgICAvLyBXZSBuZWVkIHRvIHByb3ZpZGUgV0RBIGxvY2FsIHBvcnQsIGJlY2F1c2UgaXQgbWlnaHQgYmUgb2NjdXBpZWRcbiAgICBhd2FpdCByZXNldFRlc3RQcm9jZXNzZXModGhpcy5kZXZpY2UudWRpZCwgIXRoaXMuaXNSZWFsRGV2aWNlKTtcblxuICAgIGlmICh0aGlzLmlkYikge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc3RhcnRXaXRoSURCKCk7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy54Y29kZWJ1aWxkLmluaXQodGhpcy5ub1Nlc3Npb25Qcm94eSk7XG5cbiAgICAvLyBTdGFydCB0aGUgeGNvZGVidWlsZCBwcm9jZXNzXG4gICAgaWYgKHRoaXMucHJlYnVpbGRXREEpIHtcbiAgICAgIGF3YWl0IHRoaXMueGNvZGVidWlsZC5wcmVidWlsZCgpO1xuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgdGhpcy54Y29kZWJ1aWxkLnN0YXJ0KCk7XG4gIH1cblxuICBhc3luYyBzdGFydFdpdGhJREIgKCkge1xuICAgIGxvZy5pbmZvKCdXaWxsIGxhdW5jaCBXREEgd2l0aCBpZGIgaW5zdGVhZCBvZiB4Y29kZWJ1aWxkIHNpbmNlIHRoZSBjb3JyZXNwb25kaW5nIGZsYWcgaXMgZW5hYmxlZCcpO1xuICAgIGNvbnN0IHt3ZGFCdW5kbGVJZCwgdGVzdEJ1bmRsZUlkfSA9IGF3YWl0IHRoaXMucHJlcGFyZVdEQSgpO1xuICAgIGNvbnN0IGVudiA9IHtcbiAgICAgIFVTRV9QT1JUOiB0aGlzLndkYVJlbW90ZVBvcnQsXG4gICAgICBXREFfUFJPRFVDVF9CVU5ETEVfSURFTlRJRklFUjogdGhpcy51cGRhdGVkV0RBQnVuZGxlSWQsXG4gICAgfTtcbiAgICBpZiAodGhpcy5tanBlZ1NlcnZlclBvcnQpIHtcbiAgICAgIGVudi5NSlBFR19TRVJWRVJfUE9SVCA9IHRoaXMubWpwZWdTZXJ2ZXJQb3J0O1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCB0aGlzLmlkYi5ydW5YQ1VJVGVzdCh3ZGFCdW5kbGVJZCwgd2RhQnVuZGxlSWQsIHRlc3RCdW5kbGVJZCwge2Vudn0pO1xuICB9XG5cbiAgYXN5bmMgcGFyc2VCdW5kbGVJZCAod2RhQnVuZGxlUGF0aCkge1xuICAgIGNvbnN0IGluZm9QbGlzdFBhdGggPSBwYXRoLmpvaW4od2RhQnVuZGxlUGF0aCwgJ0luZm8ucGxpc3QnKTtcbiAgICBjb25zdCBpbmZvUGxpc3QgPSBhd2FpdCBwbGlzdC5wYXJzZVBsaXN0KGF3YWl0IGZzLnJlYWRGaWxlKGluZm9QbGlzdFBhdGgpKTtcbiAgICBpZiAoIWluZm9QbGlzdC5DRkJ1bmRsZUlkZW50aWZpZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYnVuZGxlIGlkIGluICcke2luZm9QbGlzdFBhdGh9J2ApO1xuICAgIH1cbiAgICByZXR1cm4gaW5mb1BsaXN0LkNGQnVuZGxlSWRlbnRpZmllcjtcbiAgfVxuXG4gIGFzeW5jIHByZXBhcmVXREEgKCkge1xuICAgIGNvbnN0IHdkYUJ1bmRsZVBhdGggPSB0aGlzLndkYUJ1bmRsZVBhdGggfHwgYXdhaXQgdGhpcy5mZXRjaFdEQUJ1bmRsZSgpO1xuICAgIGNvbnN0IHdkYUJ1bmRsZUlkID0gYXdhaXQgdGhpcy5wYXJzZUJ1bmRsZUlkKHdkYUJ1bmRsZVBhdGgpO1xuICAgIGlmICghYXdhaXQgdGhpcy5kZXZpY2UuaXNBcHBJbnN0YWxsZWQod2RhQnVuZGxlSWQpKSB7XG4gICAgICBhd2FpdCB0aGlzLmRldmljZS5pbnN0YWxsQXBwKHdkYUJ1bmRsZVBhdGgpO1xuICAgIH1cbiAgICBjb25zdCB0ZXN0QnVuZGxlSWQgPSBhd2FpdCB0aGlzLmlkYi5pbnN0YWxsWENUZXN0QnVuZGxlKHBhdGguam9pbih3ZGFCdW5kbGVQYXRoLCAnUGx1Z0lucycsICdXZWJEcml2ZXJBZ2VudFJ1bm5lci54Y3Rlc3QnKSk7XG4gICAgcmV0dXJuIHt3ZGFCdW5kbGVJZCwgdGVzdEJ1bmRsZUlkLCB3ZGFCdW5kbGVQYXRofTtcbiAgfVxuXG4gIGFzeW5jIGZldGNoV0RBQnVuZGxlICgpIHtcbiAgICBpZiAoIXRoaXMuZGVyaXZlZERhdGFQYXRoKSB7XG4gICAgICByZXR1cm4gYXdhaXQgYnVuZGxlV0RBU2ltKHRoaXMueGNvZGVidWlsZCk7XG4gICAgfVxuICAgIGNvbnN0IHdkYUJ1bmRsZVBhdGhzID0gYXdhaXQgZnMuZ2xvYihgJHt0aGlzLmRlcml2ZWREYXRhUGF0aH0vKiovKiR7V0RBX1JVTk5FUl9BUFB9L2AsIHtcbiAgICAgIGFic29sdXRlOiB0cnVlLFxuICAgIH0pO1xuICAgIGlmIChfLmlzRW1wdHkod2RhQnVuZGxlUGF0aHMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHRoZSBXREEgYnVuZGxlIGluICcke3RoaXMuZGVyaXZlZERhdGFQYXRofSdgKTtcbiAgICB9XG4gICAgcmV0dXJuIHdkYUJ1bmRsZVBhdGhzWzBdO1xuICB9XG5cbiAgYXN5bmMgaXNTb3VyY2VGcmVzaCAoKSB7XG4gICAgY29uc3QgZXhpc3RzUHJvbWlzZXMgPSBbXG4gICAgICAnUmVzb3VyY2VzJyxcbiAgICAgIGBSZXNvdXJjZXMke3BhdGguc2VwfVdlYkRyaXZlckFnZW50LmJ1bmRsZWAsXG4gICAgXS5tYXAoKHN1YlBhdGgpID0+IGZzLmV4aXN0cyhwYXRoLnJlc29sdmUodGhpcy5ib290c3RyYXBQYXRoLCBzdWJQYXRoKSkpO1xuICAgIHJldHVybiAoYXdhaXQgQi5hbGwoZXhpc3RzUHJvbWlzZXMpKS5zb21lKCh2KSA9PiB2ID09PSBmYWxzZSk7XG4gIH1cblxuICBzZXR1cFByb3hpZXMgKHNlc3Npb25JZCkge1xuICAgIGNvbnN0IHByb3h5T3B0cyA9IHtcbiAgICAgIHNlcnZlcjogdGhpcy51cmwuaG9zdG5hbWUsXG4gICAgICBwb3J0OiB0aGlzLnVybC5wb3J0LFxuICAgICAgYmFzZTogdGhpcy5iYXNlUGF0aCxcbiAgICAgIHRpbWVvdXQ6IHRoaXMud2RhQ29ubmVjdGlvblRpbWVvdXQsXG4gICAgICBrZWVwQWxpdmU6IHRydWUsXG4gICAgfTtcblxuICAgIHRoaXMuandwcm94eSA9IG5ldyBKV1Byb3h5KHByb3h5T3B0cyk7XG4gICAgdGhpcy5qd3Byb3h5LnNlc3Npb25JZCA9IHNlc3Npb25JZDtcbiAgICB0aGlzLnByb3h5UmVxUmVzID0gdGhpcy5qd3Byb3h5LnByb3h5UmVxUmVzLmJpbmQodGhpcy5qd3Byb3h5KTtcblxuICAgIHRoaXMubm9TZXNzaW9uUHJveHkgPSBuZXcgTm9TZXNzaW9uUHJveHkocHJveHlPcHRzKTtcbiAgfVxuXG4gIGFzeW5jIHF1aXQgKCkge1xuICAgIGxvZy5pbmZvKCdTaHV0dGluZyBkb3duIHN1Yi1wcm9jZXNzZXMnKTtcblxuICAgIGF3YWl0IHRoaXMueGNvZGVidWlsZC5xdWl0KCk7XG4gICAgYXdhaXQgdGhpcy54Y29kZWJ1aWxkLnJlc2V0KCk7XG5cbiAgICBpZiAodGhpcy5qd3Byb3h5KSB7XG4gICAgICB0aGlzLmp3cHJveHkuc2Vzc2lvbklkID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIGlmICghdGhpcy5hcmdzLndlYkRyaXZlckFnZW50VXJsKSB7XG4gICAgICAvLyBpZiB3ZSBwb3B1bGF0ZWQgdGhlIHVybCBvdXJzZWx2ZXMgKGR1cmluZyBgc2V0dXBDYWNoaW5nYCBjYWxsLCBmb3IgaW5zdGFuY2UpXG4gICAgICAvLyB0aGVuIGNsZWFuIHRoYXQgdXAuIElmIHRoZSB1cmwgd2FzIHN1cHBsaWVkLCB3ZSB3YW50IHRvIGtlZXAgaXRcbiAgICAgIHRoaXMud2ViRHJpdmVyQWdlbnRVcmwgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGdldCB1cmwgKCkge1xuICAgIGlmICghdGhpcy5fdXJsKSB7XG4gICAgICBpZiAodGhpcy53ZWJEcml2ZXJBZ2VudFVybCkge1xuICAgICAgICB0aGlzLl91cmwgPSB1cmwucGFyc2UodGhpcy53ZWJEcml2ZXJBZ2VudFVybCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBwb3J0ID0gdGhpcy53ZGFMb2NhbFBvcnQgfHwgV0RBX0FHRU5UX1BPUlQ7XG4gICAgICAgIGNvbnN0IHtwcm90b2NvbCwgaG9zdG5hbWV9ID0gdXJsLnBhcnNlKHRoaXMud2RhQmFzZVVybCB8fCBXREFfQkFTRV9VUkwpO1xuICAgICAgICB0aGlzLl91cmwgPSB1cmwucGFyc2UoYCR7cHJvdG9jb2x9Ly8ke2hvc3RuYW1lfToke3BvcnR9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl91cmw7XG4gIH1cblxuICBzZXQgdXJsIChfdXJsKSB7XG4gICAgdGhpcy5fdXJsID0gdXJsLnBhcnNlKF91cmwpO1xuICB9XG5cbiAgZ2V0IGZ1bGx5U3RhcnRlZCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRlZDtcbiAgfVxuXG4gIHNldCBmdWxseVN0YXJ0ZWQgKHN0YXJ0ZWQgPSBmYWxzZSkge1xuICAgIHRoaXMuc3RhcnRlZCA9IHN0YXJ0ZWQ7XG4gIH1cblxuICBhc3luYyByZXRyaWV2ZURlcml2ZWREYXRhUGF0aCAoKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMueGNvZGVidWlsZC5yZXRyaWV2ZURlcml2ZWREYXRhUGF0aCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldXNlIHJ1bm5pbmcgV0RBIGlmIGl0IGhhcyB0aGUgc2FtZSBidW5kbGUgaWQgd2l0aCB1cGRhdGVkV0RBQnVuZGxlSWQuXG4gICAqIE9yIHJldXNlIGl0IGlmIGl0IGhhcyB0aGUgZGVmYXVsdCBpZCB3aXRob3V0IHVwZGF0ZWRXREFCdW5kbGVJZC5cbiAgICogVW5pbnN0YWxsIGl0IGlmIHRoZSBtZXRob2QgZmFjZXMgYW4gZXhjZXB0aW9uIGZvciB0aGUgYWJvdmUgc2l0dWF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXBkYXRlZFdEQUJ1bmRsZUlkIEJ1bmRsZUlkIHlvdSdkIGxpa2UgdG8gdXNlXG4gICAqL1xuICBhc3luYyBzZXR1cENhY2hpbmcgKCkge1xuICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IHRoaXMuZ2V0U3RhdHVzKCk7XG4gICAgaWYgKCFzdGF0dXMgfHwgIXN0YXR1cy5idWlsZCkge1xuICAgICAgbG9nLmRlYnVnKCdXREEgaXMgY3VycmVudGx5IG5vdCBydW5uaW5nLiBUaGVyZSBpcyBub3RoaW5nIHRvIGNhY2hlJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge1xuICAgICAgcHJvZHVjdEJ1bmRsZUlkZW50aWZpZXIsXG4gICAgICB1cGdyYWRlZEF0LFxuICAgIH0gPSBzdGF0dXMuYnVpbGQ7XG4gICAgLy8gZm9yIHJlYWwgZGV2aWNlXG4gICAgaWYgKHV0aWwuaGFzVmFsdWUocHJvZHVjdEJ1bmRsZUlkZW50aWZpZXIpICYmIHV0aWwuaGFzVmFsdWUodGhpcy51cGRhdGVkV0RBQnVuZGxlSWQpICYmIHRoaXMudXBkYXRlZFdEQUJ1bmRsZUlkICE9PSBwcm9kdWN0QnVuZGxlSWRlbnRpZmllcikge1xuICAgICAgbG9nLmluZm8oYFdpbGwgdW5pbnN0YWxsIHJ1bm5pbmcgV0RBIHNpbmNlIGl0IGhhcyBkaWZmZXJlbnQgYnVuZGxlIGlkLiBUaGUgYWN0dWFsIHZhbHVlIGlzICcke3Byb2R1Y3RCdW5kbGVJZGVudGlmaWVyfScuYCk7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy51bmluc3RhbGwoKTtcbiAgICB9XG4gICAgLy8gZm9yIHNpbXVsYXRvclxuICAgIGlmICh1dGlsLmhhc1ZhbHVlKHByb2R1Y3RCdW5kbGVJZGVudGlmaWVyKSAmJiAhdXRpbC5oYXNWYWx1ZSh0aGlzLnVwZGF0ZWRXREFCdW5kbGVJZCkgJiYgV0RBX1JVTk5FUl9CVU5ETEVfSUQgIT09IHByb2R1Y3RCdW5kbGVJZGVudGlmaWVyKSB7XG4gICAgICBsb2cuaW5mbyhgV2lsbCB1bmluc3RhbGwgcnVubmluZyBXREEgc2luY2UgaXRzIGJ1bmRsZSBpZCBpcyBub3QgZXF1YWwgdG8gdGhlIGRlZmF1bHQgdmFsdWUgJHtXREFfUlVOTkVSX0JVTkRMRV9JRH1gKTtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLnVuaW5zdGFsbCgpO1xuICAgIH1cblxuICAgIGNvbnN0IGFjdHVhbFVwZ3JhZGVUaW1lc3RhbXAgPSBhd2FpdCBnZXRXREFVcGdyYWRlVGltZXN0YW1wKCk7XG4gICAgbG9nLmRlYnVnKGBVcGdyYWRlIHRpbWVzdGFtcCBvZiB0aGUgY3VycmVudGx5IGJ1bmRsZWQgV0RBOiAke2FjdHVhbFVwZ3JhZGVUaW1lc3RhbXB9YCk7XG4gICAgbG9nLmRlYnVnKGBVcGdyYWRlIHRpbWVzdGFtcCBvZiB0aGUgV0RBIG9uIHRoZSBkZXZpY2U6ICR7dXBncmFkZWRBdH1gKTtcbiAgICBpZiAoYWN0dWFsVXBncmFkZVRpbWVzdGFtcCAmJiB1cGdyYWRlZEF0ICYmIF8udG9Mb3dlcihgJHthY3R1YWxVcGdyYWRlVGltZXN0YW1wfWApICE9PSBfLnRvTG93ZXIoYCR7dXBncmFkZWRBdH1gKSkge1xuICAgICAgbG9nLmluZm8oJ1dpbGwgdW5pbnN0YWxsIHJ1bm5pbmcgV0RBIHNpbmNlIGl0IGhhcyBkaWZmZXJlbnQgdmVyc2lvbiBpbiBjb21wYXJpc29uIHRvIHRoZSBvbmUgJyArXG4gICAgICAgIGB3aGljaCBpcyBidW5kbGVkIHdpdGggYXBwaXVtLXhjdWl0ZXN0LWRyaXZlciBtb2R1bGUgKCR7YWN0dWFsVXBncmFkZVRpbWVzdGFtcH0gIT0gJHt1cGdyYWRlZEF0fSlgKTtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLnVuaW5zdGFsbCgpO1xuICAgIH1cblxuICAgIGNvbnN0IG1lc3NhZ2UgPSB1dGlsLmhhc1ZhbHVlKHByb2R1Y3RCdW5kbGVJZGVudGlmaWVyKVxuICAgICAgPyBgV2lsbCByZXVzZSBwcmV2aW91c2x5IGNhY2hlZCBXREEgaW5zdGFuY2UgYXQgJyR7dGhpcy51cmwuaHJlZn0nIHdpdGggJyR7cHJvZHVjdEJ1bmRsZUlkZW50aWZpZXJ9J2BcbiAgICAgIDogYFdpbGwgcmV1c2UgcHJldmlvdXNseSBjYWNoZWQgV0RBIGluc3RhbmNlIGF0ICcke3RoaXMudXJsLmhyZWZ9J2A7XG4gICAgbG9nLmluZm8oYCR7bWVzc2FnZX0uIFNldCB0aGUgd2RhTG9jYWxQb3J0IGNhcGFiaWxpdHkgdG8gYSB2YWx1ZSBkaWZmZXJlbnQgZnJvbSAke3RoaXMudXJsLnBvcnR9IGlmIHRoaXMgaXMgYW4gdW5kZXNpcmVkIGJlaGF2aW9yLmApO1xuICAgIHRoaXMud2ViRHJpdmVyQWdlbnRVcmwgPSB0aGlzLnVybC5ocmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIFF1aXQgYW5kIHVuaW5zdGFsbCBydW5uaW5nIFdEQS5cbiAgICovXG4gIGFzeW5jIHF1aXRBbmRVbmluc3RhbGwgKCkge1xuICAgIGF3YWl0IHRoaXMucXVpdCgpO1xuICAgIGF3YWl0IHRoaXMudW5pbnN0YWxsKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV2ViRHJpdmVyQWdlbnQ7XG5leHBvcnQgeyBXZWJEcml2ZXJBZ2VudCB9O1xuIl0sImZpbGUiOiJsaWIvd2ViZHJpdmVyYWdlbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4ifQ==
