"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppiumDriver = void 0;

require("source-map-support/register");

var _lodash = _interopRequireDefault(require("lodash"));

var _logger = _interopRequireDefault(require("./logger"));

var _config = require("./config");

var _appiumBaseDriver = require("appium-base-driver");

var _bluebird = _interopRequireDefault(require("bluebird"));

var _asyncLock = _interopRequireDefault(require("async-lock"));

var _utils = require("./utils");

var _semver = _interopRequireDefault(require("semver"));

var _wordWrap = _interopRequireDefault(require("word-wrap"));

var _os = require("os");

var _appiumSupport = require("appium-support");

const PLATFORMS = {
  FAKE: 'fake',
  ANDROID: 'android',
  IOS: 'ios',
  APPLE_TVOS: 'tvos',
  WINDOWS: 'windows',
  MAC: 'mac',
  TIZEN: 'tizen',
  LINUX: 'linux',
  ROKU: 'roku',
  WEBOS: 'webos'
};
const AUTOMATION_NAMES = {
  APPIUM: 'Appium',
  UIAUTOMATOR2: 'UiAutomator2',
  UIAUTOMATOR1: 'UiAutomator1',
  XCUITEST: 'XCUITest',
  YOUIENGINE: 'YouiEngine',
  ESPRESSO: 'Espresso',
  TIZEN: 'Tizen',
  FAKE: 'Fake',
  INSTRUMENTS: 'Instruments',
  WINDOWS: 'Windows',
  MAC: 'Mac',
  MAC2: 'Mac2',
  FLUTTER: 'Flutter',
  SAFARI: 'Safari',
  GECKO: 'Gecko',
  ROKU: 'Roku',
  WEBOS: 'WebOS'
};
const DRIVER_MAP = {
  [AUTOMATION_NAMES.UIAUTOMATOR2.toLowerCase()]: {
    driverClassName: 'AndroidUiautomator2Driver',
    driverPackage: 'appium-uiautomator2-driver'
  },
  [AUTOMATION_NAMES.XCUITEST.toLowerCase()]: {
    driverClassName: 'XCUITestDriver',
    driverPackage: 'appium-xcuitest-driver'
  },
  [AUTOMATION_NAMES.YOUIENGINE.toLowerCase()]: {
    driverClassName: 'YouiEngineDriver',
    driverPackage: 'appium-youiengine-driver'
  },
  [AUTOMATION_NAMES.FAKE.toLowerCase()]: {
    driverClassName: 'FakeDriver',
    driverPackage: 'appium-fake-driver'
  },
  [AUTOMATION_NAMES.UIAUTOMATOR1.toLowerCase()]: {
    driverClassName: 'AndroidDriver',
    driverPackage: 'appium-android-driver'
  },
  [AUTOMATION_NAMES.INSTRUMENTS.toLowerCase()]: {
    driverClassName: 'IosDriver',
    driverPackage: 'appium-ios-driver'
  },
  [AUTOMATION_NAMES.WINDOWS.toLowerCase()]: {
    driverClassName: 'WindowsDriver',
    driverPackage: 'appium-windows-driver'
  },
  [AUTOMATION_NAMES.MAC.toLowerCase()]: {
    driverClassName: 'MacDriver',
    driverPackage: 'appium-mac-driver'
  },
  [AUTOMATION_NAMES.MAC2.toLowerCase()]: {
    driverClassName: 'Mac2Driver',
    driverPackage: 'appium-mac2-driver'
  },
  [AUTOMATION_NAMES.ESPRESSO.toLowerCase()]: {
    driverClassName: 'EspressoDriver',
    driverPackage: 'appium-espresso-driver'
  },
  [AUTOMATION_NAMES.TIZEN.toLowerCase()]: {
    driverClassName: 'TizenDriver',
    driverPackage: 'appium-tizen-driver'
  },
  [AUTOMATION_NAMES.FLUTTER.toLowerCase()]: {
    driverClassName: 'FlutterDriver',
    driverPackage: 'appium-flutter-driver'
  },
  [AUTOMATION_NAMES.SAFARI.toLowerCase()]: {
    driverClassName: 'SafariDriver',
    driverPackage: 'appium-safari-driver'
  },
  [AUTOMATION_NAMES.GECKO.toLowerCase()]: {
    driverClassName: 'GeckoDriver',
    driverPackage: 'appium-geckodriver'
  },
  [AUTOMATION_NAMES.ROKU.toLowerCase()]: {
    driverClassName: 'RokuDriver',
    driverPackage: 'appium-roku-driver'
  },
  [AUTOMATION_NAMES.WEBOS.toLowerCase()]: {
    driverClassName: 'WebOSDriver',
    driverPackage: 'appium-webos-driver'
  }
};
const PLATFORMS_MAP = {
  [PLATFORMS.FAKE]: () => AUTOMATION_NAMES.FAKE,
  [PLATFORMS.ANDROID]: () => {
    const logDividerLength = 70;
    const automationWarning = [`The 'automationName' capability was not provided in the desired capabilities for this Android session`, `Setting 'automationName=UiAutomator2' by default and using the UiAutomator2 Driver`, `The next major version of Appium (2.x) will **require** the 'automationName' capability to be set for all sessions on all platforms`, `In previous versions (Appium <= 1.13.x), the default was 'automationName=UiAutomator1'`, `If you wish to use that automation instead of UiAutomator2, please add 'automationName=UiAutomator1' to your desired capabilities`, `For more information about drivers, please visit http://appium.io/docs/en/about-appium/intro/ and explore the 'Drivers' menu`];
    let divider = `${_os.EOL}${_lodash.default.repeat('=', logDividerLength)}${_os.EOL}`;
    let automationWarningString = divider;
    automationWarningString += `  DEPRECATION WARNING:` + _os.EOL;

    for (let log of automationWarning) {
      automationWarningString += _os.EOL + (0, _wordWrap.default)(log, {
        width: logDividerLength - 2
      }) + _os.EOL;
    }

    automationWarningString += divider;

    _logger.default.warn(automationWarningString);

    return AUTOMATION_NAMES.UIAUTOMATOR2;
  },
  [PLATFORMS.IOS]: caps => {
    const platformVersion = _semver.default.valid(_semver.default.coerce(caps.platformVersion));

    _logger.default.warn(`DeprecationWarning: 'automationName' capability was not provided. ` + `Future versions of Appium will require 'automationName' capability to be set for iOS sessions.`);

    if (platformVersion && _semver.default.satisfies(platformVersion, '>=10.0.0')) {
      _logger.default.info('Requested iOS support with version >= 10, ' + `using '${AUTOMATION_NAMES.XCUITEST}' ` + 'driver instead of UIAutomation-based driver, since the ' + 'latter is unsupported on iOS 10 and up.');

      return AUTOMATION_NAMES.XCUITEST;
    }

    return AUTOMATION_NAMES.INSTRUMENTS;
  },
  [PLATFORMS.APPLE_TVOS]: () => AUTOMATION_NAMES.XCUITEST,
  [PLATFORMS.WINDOWS]: () => AUTOMATION_NAMES.WINDOWS,
  [PLATFORMS.MAC]: () => AUTOMATION_NAMES.MAC,
  [PLATFORMS.TIZEN]: () => AUTOMATION_NAMES.TIZEN,
  [PLATFORMS.LINUX]: () => AUTOMATION_NAMES.GECKO,
  [PLATFORMS.ROKU]: () => AUTOMATION_NAMES.ROKU,
  [PLATFORMS.WEBOS]: () => AUTOMATION_NAMES.WEBOS
};
const desiredCapabilityConstraints = {
  automationName: {
    presence: false,
    isString: true,
    inclusionCaseInsensitive: _lodash.default.values(AUTOMATION_NAMES)
  },
  platformName: {
    presence: true,
    isString: true,
    inclusionCaseInsensitive: _lodash.default.keys(PLATFORMS_MAP)
  }
};
const sessionsListGuard = new _asyncLock.default();
const pendingDriversGuard = new _asyncLock.default();

class AppiumDriver extends _appiumBaseDriver.BaseDriver {
  constructor(args) {
    if (args.tmpDir) {
      process.env.APPIUM_TMP_DIR = args.tmpDir;
    }

    super(args);
    this.desiredCapConstraints = desiredCapabilityConstraints;
    this.newCommandTimeoutMs = 0;
    this.args = Object.assign({}, args);
    this.sessions = {};
    this.pendingDrivers = {};
    (0, _config.updateBuildInfo)();
  }

  get isCommandsQueueEnabled() {
    return false;
  }

  sessionExists(sessionId) {
    const dstSession = this.sessions[sessionId];
    return dstSession && dstSession.sessionId !== null;
  }

  driverForSession(sessionId) {
    return this.sessions[sessionId];
  }

  getDriverAndVersionForCaps(caps) {
    if (!_lodash.default.isString(caps.platformName)) {
      throw new Error('You must include a platformName capability');
    }

    const platformName = caps.platformName.toLowerCase();
    let automationNameCap = caps.automationName;

    if (!_lodash.default.isString(automationNameCap) || automationNameCap.toLowerCase() === 'appium') {
      const driverSelector = PLATFORMS_MAP[platformName];

      if (driverSelector) {
        automationNameCap = driverSelector(caps);
      }
    }

    automationNameCap = _lodash.default.toLower(automationNameCap);
    let failureVerb = 'find';
    let suggestion = 'Please check your desired capabilities';

    if (_lodash.default.isPlainObject(DRIVER_MAP[automationNameCap])) {
      try {
        const {
          driverPackage,
          driverClassName
        } = DRIVER_MAP[automationNameCap];

        const driver = require(driverPackage)[driverClassName];

        return {
          driver,
          version: this.getDriverVersion(driver.name, driverPackage)
        };
      } catch (e) {
        _logger.default.debug(e);

        failureVerb = 'load';
        suggestion = 'Please verify your Appium installation';
      }
    }

    const msg = _lodash.default.isString(caps.automationName) ? `Could not ${failureVerb} a driver for automationName '${caps.automationName}' and platformName ` + `'${caps.platformName}'` : `Could not ${failureVerb} a driver for platformName '${caps.platformName}'`;
    throw new Error(`${msg}. ${suggestion}`);
  }

  getDriverVersion(driverName, driverPackage) {
    const version = (0, _utils.getPackageVersion)(driverPackage);

    if (version) {
      return version;
    }

    _logger.default.warn(`Unable to get version of driver '${driverName}'`);
  }

  async getStatus() {
    return {
      build: _lodash.default.clone((0, _config.getBuildInfo)())
    };
  }

  async getSessions() {
    const sessions = await sessionsListGuard.acquire(AppiumDriver.name, () => this.sessions);
    return _lodash.default.toPairs(sessions).map(([id, driver]) => ({
      id,
      capabilities: driver.caps
    }));
  }

  printNewSessionAnnouncement(driverName, driverVersion) {
    const introString = driverVersion ? `Appium v${_config.APPIUM_VER} creating new ${driverName} (v${driverVersion}) session` : `Appium v${_config.APPIUM_VER} creating new ${driverName} session`;

    _logger.default.info(introString);
  }

  async createSession(jsonwpCaps, reqCaps, w3cCapabilities) {
    const defaultCapabilities = _lodash.default.cloneDeep(this.args.defaultCapabilities);

    const defaultSettings = (0, _utils.pullSettings)(defaultCapabilities);
    jsonwpCaps = _lodash.default.cloneDeep(jsonwpCaps);
    const jwpSettings = Object.assign({}, defaultSettings, (0, _utils.pullSettings)(jsonwpCaps));
    w3cCapabilities = _lodash.default.cloneDeep(w3cCapabilities);
    const w3cSettings = Object.assign({}, jwpSettings);
    Object.assign(w3cSettings, (0, _utils.pullSettings)((w3cCapabilities || {}).alwaysMatch || {}));

    for (const firstMatchEntry of (w3cCapabilities || {}).firstMatch || []) {
      Object.assign(w3cSettings, (0, _utils.pullSettings)(firstMatchEntry));
    }

    let protocol;
    let innerSessionId, dCaps;

    try {
      const parsedCaps = (0, _utils.parseCapsForInnerDriver)(jsonwpCaps, w3cCapabilities, this.desiredCapConstraints, defaultCapabilities);
      const {
        desiredCaps,
        processedJsonwpCapabilities,
        processedW3CCapabilities,
        error
      } = parsedCaps;
      protocol = parsedCaps.protocol;

      if (error) {
        throw error;
      }

      const {
        driver: InnerDriver,
        version: driverVersion
      } = this.getDriverAndVersionForCaps(desiredCaps);
      this.printNewSessionAnnouncement(InnerDriver.name, driverVersion);

      if (this.args.sessionOverride) {
        await this.deleteAllSessions();
      }

      let runningDriversData, otherPendingDriversData;
      const d = new InnerDriver(this.args);

      if (this.args.relaxedSecurityEnabled) {
        _logger.default.info(`Applying relaxed security to '${InnerDriver.name}' as per ` + `server command line argument. All insecure features will be ` + `enabled unless explicitly disabled by --deny-insecure`);

        d.relaxedSecurityEnabled = true;
      }

      if (!_lodash.default.isEmpty(this.args.denyInsecure)) {
        _logger.default.info('Explicitly preventing use of insecure features:');

        this.args.denyInsecure.map(a => _logger.default.info(`    ${a}`));
        d.denyInsecure = this.args.denyInsecure;
      }

      if (!_lodash.default.isEmpty(this.args.allowInsecure)) {
        _logger.default.info('Explicitly enabling use of insecure features:');

        this.args.allowInsecure.map(a => _logger.default.info(`    ${a}`));
        d.allowInsecure = this.args.allowInsecure;
      }

      d.server = this.server;

      try {
        runningDriversData = await this.curSessionDataForDriver(InnerDriver);
      } catch (e) {
        throw new _appiumBaseDriver.errors.SessionNotCreatedError(e.message);
      }

      await pendingDriversGuard.acquire(AppiumDriver.name, () => {
        this.pendingDrivers[InnerDriver.name] = this.pendingDrivers[InnerDriver.name] || [];
        otherPendingDriversData = this.pendingDrivers[InnerDriver.name].map(drv => drv.driverData);
        this.pendingDrivers[InnerDriver.name].push(d);
      });

      try {
        [innerSessionId, dCaps] = await d.createSession(processedJsonwpCapabilities, reqCaps, processedW3CCapabilities, [...runningDriversData, ...otherPendingDriversData]);
        protocol = d.protocol;
        await sessionsListGuard.acquire(AppiumDriver.name, () => {
          this.sessions[innerSessionId] = d;
        });
      } finally {
        await pendingDriversGuard.acquire(AppiumDriver.name, () => {
          _lodash.default.pull(this.pendingDrivers[InnerDriver.name], d);
        });
      }

      this.attachUnexpectedShutdownHandler(d, innerSessionId);

      _logger.default.info(`New ${InnerDriver.name} session created successfully, session ` + `${innerSessionId} added to master session list`);

      d.startNewCommandTimeout();

      if (d.isW3CProtocol() && !_lodash.default.isEmpty(w3cSettings)) {
        _logger.default.info(`Applying the initial values to Appium settings parsed from W3C caps: ` + JSON.stringify(w3cSettings));

        await d.updateSettings(w3cSettings);
      } else if (d.isMjsonwpProtocol() && !_lodash.default.isEmpty(jwpSettings)) {
        _logger.default.info(`Applying the initial values to Appium settings parsed from MJSONWP caps: ` + JSON.stringify(jwpSettings));

        await d.updateSettings(jwpSettings);
      }
    } catch (error) {
      return {
        protocol,
        error
      };
    }

    return {
      protocol,
      value: [innerSessionId, dCaps, protocol]
    };
  }

  attachUnexpectedShutdownHandler(driver, innerSessionId) {
    const removeSessionFromMasterList = (cause = new Error('Unknown error')) => {
      _logger.default.warn(`Closing session, cause was '${cause.message}'`);

      _logger.default.info(`Removing session '${innerSessionId}' from our master session list`);

      delete this.sessions[innerSessionId];
    };

    if (_lodash.default.isFunction((driver.onUnexpectedShutdown || {}).then)) {
      driver.onUnexpectedShutdown.then(() => {
        throw new Error('Unexpected shutdown');
      }).catch(e => {
        if (!(e instanceof _bluebird.default.CancellationError)) {
          removeSessionFromMasterList(e);
        }
      });
    } else if (_lodash.default.isFunction(driver.onUnexpectedShutdown)) {
      driver.onUnexpectedShutdown(removeSessionFromMasterList);
    } else {
      _logger.default.warn(`Failed to attach the unexpected shutdown listener. ` + `Is 'onUnexpectedShutdown' method available for '${driver.constructor.name}'?`);
    }
  }

  async curSessionDataForDriver(InnerDriver) {
    const sessions = await sessionsListGuard.acquire(AppiumDriver.name, () => this.sessions);

    const data = _lodash.default.values(sessions).filter(s => s.constructor.name === InnerDriver.name).map(s => s.driverData);

    for (let datum of data) {
      if (!datum) {
        throw new Error(`Problem getting session data for driver type ` + `${InnerDriver.name}; does it implement 'get ` + `driverData'?`);
      }
    }

    return data;
  }

  async deleteSession(sessionId) {
    let protocol;

    try {
      let otherSessionsData = null;
      let dstSession = null;
      await sessionsListGuard.acquire(AppiumDriver.name, () => {
        if (!this.sessions[sessionId]) {
          return;
        }

        const curConstructorName = this.sessions[sessionId].constructor.name;
        otherSessionsData = _lodash.default.toPairs(this.sessions).filter(([key, value]) => value.constructor.name === curConstructorName && key !== sessionId).map(([, value]) => value.driverData);
        dstSession = this.sessions[sessionId];
        protocol = dstSession.protocol;

        _logger.default.info(`Removing session ${sessionId} from our master session list`);

        delete this.sessions[sessionId];
      });
      return {
        protocol,
        value: await dstSession.deleteSession(sessionId, otherSessionsData)
      };
    } catch (e) {
      _logger.default.error(`Had trouble ending session ${sessionId}: ${e.message}`);

      return {
        protocol,
        error: e
      };
    }
  }

  async deleteAllSessions(opts = {}) {
    const sessionsCount = _lodash.default.size(this.sessions);

    if (0 === sessionsCount) {
      _logger.default.debug('There are no active sessions for cleanup');

      return;
    }

    const {
      force = false,
      reason
    } = opts;

    _logger.default.debug(`Cleaning up ${_appiumSupport.util.pluralize('active session', sessionsCount, true)}`);

    const cleanupPromises = force ? _lodash.default.values(this.sessions).map(drv => drv.startUnexpectedShutdown(reason && new Error(reason))) : _lodash.default.keys(this.sessions).map(id => this.deleteSession(id));

    for (const cleanupPromise of cleanupPromises) {
      try {
        await cleanupPromise;
      } catch (e) {
        _logger.default.debug(e);
      }
    }
  }

  async executeCommand(cmd, ...args) {
    if (cmd === 'getStatus') {
      return await this.getStatus();
    }

    if (isAppiumDriverCommand(cmd)) {
      return await super.executeCommand(cmd, ...args);
    }

    const sessionId = _lodash.default.last(args);

    const dstSession = await sessionsListGuard.acquire(AppiumDriver.name, () => this.sessions[sessionId]);

    if (!dstSession) {
      throw new Error(`The session with id '${sessionId}' does not exist`);
    }

    let res = {
      protocol: dstSession.protocol
    };

    try {
      res.value = await dstSession.executeCommand(cmd, ...args);
    } catch (e) {
      res.error = e;
    }

    return res;
  }

  proxyActive(sessionId) {
    const dstSession = this.sessions[sessionId];
    return dstSession && _lodash.default.isFunction(dstSession.proxyActive) && dstSession.proxyActive(sessionId);
  }

  getProxyAvoidList(sessionId) {
    const dstSession = this.sessions[sessionId];
    return dstSession ? dstSession.getProxyAvoidList() : [];
  }

  canProxy(sessionId) {
    const dstSession = this.sessions[sessionId];
    return dstSession && dstSession.canProxy(sessionId);
  }

}

exports.AppiumDriver = AppiumDriver;

function isAppiumDriverCommand(cmd) {
  return !(0, _appiumBaseDriver.isSessionCommand)(cmd) || cmd === 'deleteSession';
}require('source-map-support').install();


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9hcHBpdW0uanMiXSwibmFtZXMiOlsiUExBVEZPUk1TIiwiRkFLRSIsIkFORFJPSUQiLCJJT1MiLCJBUFBMRV9UVk9TIiwiV0lORE9XUyIsIk1BQyIsIlRJWkVOIiwiTElOVVgiLCJST0tVIiwiV0VCT1MiLCJBVVRPTUFUSU9OX05BTUVTIiwiQVBQSVVNIiwiVUlBVVRPTUFUT1IyIiwiVUlBVVRPTUFUT1IxIiwiWENVSVRFU1QiLCJZT1VJRU5HSU5FIiwiRVNQUkVTU08iLCJJTlNUUlVNRU5UUyIsIk1BQzIiLCJGTFVUVEVSIiwiU0FGQVJJIiwiR0VDS08iLCJEUklWRVJfTUFQIiwidG9Mb3dlckNhc2UiLCJkcml2ZXJDbGFzc05hbWUiLCJkcml2ZXJQYWNrYWdlIiwiUExBVEZPUk1TX01BUCIsImxvZ0RpdmlkZXJMZW5ndGgiLCJhdXRvbWF0aW9uV2FybmluZyIsImRpdmlkZXIiLCJFT0wiLCJfIiwicmVwZWF0IiwiYXV0b21hdGlvbldhcm5pbmdTdHJpbmciLCJsb2ciLCJ3aWR0aCIsIndhcm4iLCJjYXBzIiwicGxhdGZvcm1WZXJzaW9uIiwic2VtdmVyIiwidmFsaWQiLCJjb2VyY2UiLCJzYXRpc2ZpZXMiLCJpbmZvIiwiZGVzaXJlZENhcGFiaWxpdHlDb25zdHJhaW50cyIsImF1dG9tYXRpb25OYW1lIiwicHJlc2VuY2UiLCJpc1N0cmluZyIsImluY2x1c2lvbkNhc2VJbnNlbnNpdGl2ZSIsInZhbHVlcyIsInBsYXRmb3JtTmFtZSIsImtleXMiLCJzZXNzaW9uc0xpc3RHdWFyZCIsIkFzeW5jTG9jayIsInBlbmRpbmdEcml2ZXJzR3VhcmQiLCJBcHBpdW1Ecml2ZXIiLCJCYXNlRHJpdmVyIiwiY29uc3RydWN0b3IiLCJhcmdzIiwidG1wRGlyIiwicHJvY2VzcyIsImVudiIsIkFQUElVTV9UTVBfRElSIiwiZGVzaXJlZENhcENvbnN0cmFpbnRzIiwibmV3Q29tbWFuZFRpbWVvdXRNcyIsIk9iamVjdCIsImFzc2lnbiIsInNlc3Npb25zIiwicGVuZGluZ0RyaXZlcnMiLCJpc0NvbW1hbmRzUXVldWVFbmFibGVkIiwic2Vzc2lvbkV4aXN0cyIsInNlc3Npb25JZCIsImRzdFNlc3Npb24iLCJkcml2ZXJGb3JTZXNzaW9uIiwiZ2V0RHJpdmVyQW5kVmVyc2lvbkZvckNhcHMiLCJFcnJvciIsImF1dG9tYXRpb25OYW1lQ2FwIiwiZHJpdmVyU2VsZWN0b3IiLCJ0b0xvd2VyIiwiZmFpbHVyZVZlcmIiLCJzdWdnZXN0aW9uIiwiaXNQbGFpbk9iamVjdCIsImRyaXZlciIsInJlcXVpcmUiLCJ2ZXJzaW9uIiwiZ2V0RHJpdmVyVmVyc2lvbiIsIm5hbWUiLCJlIiwiZGVidWciLCJtc2ciLCJkcml2ZXJOYW1lIiwiZ2V0U3RhdHVzIiwiYnVpbGQiLCJjbG9uZSIsImdldFNlc3Npb25zIiwiYWNxdWlyZSIsInRvUGFpcnMiLCJtYXAiLCJpZCIsImNhcGFiaWxpdGllcyIsInByaW50TmV3U2Vzc2lvbkFubm91bmNlbWVudCIsImRyaXZlclZlcnNpb24iLCJpbnRyb1N0cmluZyIsIkFQUElVTV9WRVIiLCJjcmVhdGVTZXNzaW9uIiwianNvbndwQ2FwcyIsInJlcUNhcHMiLCJ3M2NDYXBhYmlsaXRpZXMiLCJkZWZhdWx0Q2FwYWJpbGl0aWVzIiwiY2xvbmVEZWVwIiwiZGVmYXVsdFNldHRpbmdzIiwiandwU2V0dGluZ3MiLCJ3M2NTZXR0aW5ncyIsImFsd2F5c01hdGNoIiwiZmlyc3RNYXRjaEVudHJ5IiwiZmlyc3RNYXRjaCIsInByb3RvY29sIiwiaW5uZXJTZXNzaW9uSWQiLCJkQ2FwcyIsInBhcnNlZENhcHMiLCJkZXNpcmVkQ2FwcyIsInByb2Nlc3NlZEpzb253cENhcGFiaWxpdGllcyIsInByb2Nlc3NlZFczQ0NhcGFiaWxpdGllcyIsImVycm9yIiwiSW5uZXJEcml2ZXIiLCJzZXNzaW9uT3ZlcnJpZGUiLCJkZWxldGVBbGxTZXNzaW9ucyIsInJ1bm5pbmdEcml2ZXJzRGF0YSIsIm90aGVyUGVuZGluZ0RyaXZlcnNEYXRhIiwiZCIsInJlbGF4ZWRTZWN1cml0eUVuYWJsZWQiLCJpc0VtcHR5IiwiZGVueUluc2VjdXJlIiwiYSIsImFsbG93SW5zZWN1cmUiLCJzZXJ2ZXIiLCJjdXJTZXNzaW9uRGF0YUZvckRyaXZlciIsImVycm9ycyIsIlNlc3Npb25Ob3RDcmVhdGVkRXJyb3IiLCJtZXNzYWdlIiwiZHJ2IiwiZHJpdmVyRGF0YSIsInB1c2giLCJwdWxsIiwiYXR0YWNoVW5leHBlY3RlZFNodXRkb3duSGFuZGxlciIsInN0YXJ0TmV3Q29tbWFuZFRpbWVvdXQiLCJpc1czQ1Byb3RvY29sIiwiSlNPTiIsInN0cmluZ2lmeSIsInVwZGF0ZVNldHRpbmdzIiwiaXNNanNvbndwUHJvdG9jb2wiLCJ2YWx1ZSIsInJlbW92ZVNlc3Npb25Gcm9tTWFzdGVyTGlzdCIsImNhdXNlIiwiaXNGdW5jdGlvbiIsIm9uVW5leHBlY3RlZFNodXRkb3duIiwidGhlbiIsImNhdGNoIiwiQiIsIkNhbmNlbGxhdGlvbkVycm9yIiwiZGF0YSIsImZpbHRlciIsInMiLCJkYXR1bSIsImRlbGV0ZVNlc3Npb24iLCJvdGhlclNlc3Npb25zRGF0YSIsImN1ckNvbnN0cnVjdG9yTmFtZSIsImtleSIsIm9wdHMiLCJzZXNzaW9uc0NvdW50Iiwic2l6ZSIsImZvcmNlIiwicmVhc29uIiwidXRpbCIsInBsdXJhbGl6ZSIsImNsZWFudXBQcm9taXNlcyIsInN0YXJ0VW5leHBlY3RlZFNodXRkb3duIiwiY2xlYW51cFByb21pc2UiLCJleGVjdXRlQ29tbWFuZCIsImNtZCIsImlzQXBwaXVtRHJpdmVyQ29tbWFuZCIsImxhc3QiLCJyZXMiLCJwcm94eUFjdGl2ZSIsImdldFByb3h5QXZvaWRMaXN0IiwiY2FuUHJveHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBR0EsTUFBTUEsU0FBUyxHQUFHO0FBQ2hCQyxFQUFBQSxJQUFJLEVBQUUsTUFEVTtBQUVoQkMsRUFBQUEsT0FBTyxF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SCxTQUFGLEVBQWE7QUFDdEIsVUFBTUMsVUFBVSxHQUFHLEtBQUtMLFFBQUwsQ0FBY0ksU0FBZCxDQUFuQjtBQUNBLFdBQU9DLFVBQVUsSUFBSXpDLGdCQUFFMkgsVUFBRixDQUFhbEYsVUFBVSxDQUFDK0csV0FBeEIsQ0FBZCxJQUFzRC9HLFVBQVUsQ0FBQytHLFdBQVgsQ0FBdUJoSCxTQUF2QixDQUE3RDtBQUNEOztBQUVEaUgsRUFBQUEsaUJBQWlCLENBQUVqSCxTQUFGLEVBQWE7QUFDNUIsVUFBTUMsVUFBVSxHQUFHLEtBQUtMLFFBQUwsQ0FBY0ksU0FBZCxDQUFuQjtBQUNBLFdBQU9DLFVBQVUsR0FBR0EsVUFBVSxDQUFDZ0gsaUJBQVgsRUFBSCxHQUFvQyxFQUFyRDtBQUNEOztBQUVEQyxFQUFBQSxRQUFRLENBQUVsSCxTQUFGLEVBQWE7QUFDbkIsVUFBTUMsVUFBVSxHQUFHLEtBQUtMLFFBQUwsQ0FBY0ksU0FBZCxDQUFuQjtBQUNBLFdBQU9DLFVBQVUsSUFBSUEsVUFBVSxDQUFDaUgsUUFBWCxDQUFvQmxILFNBQXBCLENBQXJCO0FBQ0Q7O0FBbFptQzs7OztBQXVadEMsU0FBUzZHLHFCQUFULENBQWdDRCxHQUFoQyxFQUFxQztBQUNuQyxTQUFPLENBQUMsd0NBQWlCQSxHQUFqQixDQUFELElBQTBCQSxHQUFHLEtBQUssZUFBekM7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgbG9nIGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7IGdldEJ1aWxkSW5mbywgdXBkYXRlQnVpbGRJbmZvLCBBUFBJVU1fVkVSIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgQmFzZURyaXZlciwgZXJyb3JzLCBpc1Nlc3Npb25Db21tYW5kIH0gZnJvbSAnYXBwaXVtLWJhc2UtZHJpdmVyJztcbmltcG9ydCBCIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBBc3luY0xvY2sgZnJvbSAnYXN5bmMtbG9jayc7XG5pbXBvcnQgeyBwYXJzZUNhcHNGb3JJbm5lckRyaXZlciwgZ2V0UGFja2FnZVZlcnNpb24sIHB1bGxTZXR0aW5ncyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHNlbXZlciBmcm9tICdzZW12ZXInO1xuaW1wb3J0IHdyYXAgZnJvbSAnd29yZC13cmFwJztcbmltcG9ydCB7IEVPTCB9IGZyb20gJ29zJztcbmltcG9ydCB7IHV0aWwgfSBmcm9tICdhcHBpdW0tc3VwcG9ydCc7XG5cblxuY29uc3QgUExBVEZPUk1TID0ge1xuICBGQUtFOiAnZmFrZScsXG4gIEFORFJPSUQ6ICdhbmRyb2lkJyxcbiAgSU9TOiAnaW9zJyxcbiAgQVBQTEVfVFZPUzogJ3R2b3MnLFxuICBXSU5ET1dTOiAnd2luZG93cycsXG4gIE1BQzogJ21hYycsXG4gIFRJWkVOOiAndGl6ZW4nLFxuICBMSU5VWDogJ2xpbnV4JyxcbiAgUk9LVTogJ3Jva3UnLFxuICBXRUJPUzogJ3dlYm9zJ1xufTtcblxuY29uc3QgQVVUT01BVElPTl9OQU1FUyA9IHtcbiAgQVBQSVVNOiAnQXBwaXVtJyxcbiAgVUlBVVRPTUFUT1IyOiAnVWlBdXRvbWF0b3IyJyxcbiAgVUlBVVRPTUFUT1IxOiAnVWlBdXRvbWF0b3IxJyxcbiAgWENVSVRFU1Q6ICdYQ1VJVGVzdCcsXG4gIFlPVUlFTkdJTkU6ICdZb3VpRW5naW5lJyxcbiAgRVNQUkVTU086ICdFc3ByZXNzbycsXG4gIFRJWkVOOiAnVGl6ZW4nLFxuICBGQUtFOiAnRmFrZScsXG4gIElOU1RSVU1FTlRTOiAnSW5zdHJ1bWVudHMnLFxuICBXSU5ET1dTOiAnV2luZG93cycsXG4gIE1BQzogJ01hYycsXG4gIE1BQzI6ICdNYWMyJyxcbiAgRkxVVFRFUjogJ0ZsdXR0ZXInLFxuICBTQUZBUkk6ICdTYWZhcmknLFxuICBHRUNLTzogJ0dlY2tvJyxcbiAgUk9LVTogJ1Jva3UnLFxuICBXRUJPUzogJ1dlYk9TJ1xufTtcbmNvbnN0IERSSVZFUl9NQVAgPSB7XG4gIFtBVVRPTUFUSU9OX05BTUVTLlVJQVVUT01BVE9SMi50b0xvd2VyQ2FzZSgpXToge1xuICAgIGRyaXZlckNsYXNzTmFtZTogJ0FuZHJvaWRVaWF1dG9tYXRvcjJEcml2ZXInLFxuICAgIGRyaXZlclBhY2thZ2U6ICdhcHBpdW0tdWlhdXRvbWF0b3IyLWRyaXZlcicsXG4gIH0sXG4gIFtBVVRPTUFUSU9OX05BTUVTLlhDVUlURVNULnRvTG93ZXJDYXNlKCldOiB7XG4gICAgZHJpdmVyQ2xhc3NOYW1lOiAnWENVSVRlc3REcml2ZXInLFxuICAgIGRyaXZlclBhY2thZ2U6ICdhcHBpdW0teGN1aXRlc3QtZHJpdmVyJyxcbiAgfSxcbiAgW0FVVE9NQVRJT05fTkFNRVMuWU9VSUVOR0lORS50b0xvd2VyQ2FzZSgpXToge1xuICAgIGRyaXZlckNsYXNzTmFtZTogJ1lvdWlFbmdpbmVEcml2ZXInLFxuICAgIGRyaXZlclBhY2thZ2U6ICdhcHBpdW0teW91aWVuZ2luZS1kcml2ZXInLFxuICB9LFxuICBbQVVUT01BVElPTl9OQU1FUy5GQUtFLnRvTG93ZXJDYXNlKCldOiB7XG4gICAgZHJpdmVyQ2xhc3NOYW1lOiAnRmFrZURyaXZlcicsXG4gICAgZHJpdmVyUGFja2FnZTogJ2FwcGl1bS1mYWtlLWRyaXZlcicsXG4gIH0sXG4gIFtBVVRPTUFUSU9OX05BTUVTLlVJQVVUT01BVE9SMS50b0xvd2VyQ2FzZSgpXToge1xuICAgIGRyaXZlckNsYXNzTmFtZTogJ0FuZHJvaWREcml2ZXInLFxuICAgIGRyaXZlclBhY2thZ2U6ICdhcHBpdW0tYW5kcm9pZC1kcml2ZXInLFxuICB9LFxuICBbQVVUT01BVElPTl9OQU1FUy5JTlNUUlVNRU5UUy50b0xvd2VyQ2FzZSgpXToge1xuICAgIGRyaXZlckNsYXNzTmFtZTogJ0lvc0RyaXZlcicsXG4gICAgZHJpdmVyUGFja2FnZTogJ2FwcGl1bS1pb3MtZHJpdmVyJyxcbiAgfSxcbiAgW0FVVE9NQVRJT05fTkFNRVMuV0lORE9XUy50b0xvd2VyQ2FzZSgpXToge1xuICAgIGRyaXZlckNsYXNzTmFtZTogJ1dpbmRvd3NEcml2ZXInLFxuICAgIGRyaXZlclBhY2thZ2U6ICdhcHBpdW0td2luZG93cy1kcml2ZXInLFxuICB9LFxuICBbQVVUT01BVElPTl9OQU1FUy5NQUMudG9Mb3dlckNhc2UoKV06IHtcbiAgICBkcml2ZXJDbGFzc05hbWU6ICdNYWNEcml2ZXInLFxuICAgIGRyaXZlclBhY2thZ2U6ICdhcHBpdW0tbWFjLWRyaXZlcicsXG4gIH0sXG4gIFtBVVRPTUFUSU9OX05BTUVTLk1BQzIudG9Mb3dlckNhc2UoKV06IHtcbiAgICBkcml2ZXJDbGFzc05hbWU6ICdNYWMyRHJpdmVyJyxcbiAgICBkcml2ZXJQYWNrYWdlOiAnYXBwaXVtLW1hYzItZHJpdmVyJyxcbiAgfSxcbiAgW0FVVE9NQVRJT05fTkFNRVMuRVNQUkVTU08udG9Mb3dlckNhc2UoKV06IHtcbiAgICBkcml2ZXJDbGFzc05hbWU6ICdFc3ByZXNzb0RyaXZlcicsXG4gICAgZHJpdmVyUGFja2FnZTogJ2FwcGl1bS1lc3ByZXNzby1kcml2ZXInLFxuICB9LFxuICBbQVVUT01BVElPTl9OQU1FUy5USVpFTi50b0xvd2VyQ2FzZSgpXToge1xuICAgIGRyaXZlckNsYXNzTmFtZTogJ1RpemVuRHJpdmVyJyxcbiAgICBkcml2ZXJQYWNrYWdlOiAnYXBwaXVtLXRpemVuLWRyaXZlcicsXG4gIH0sXG4gIFtBVVRPTUFUSU9OX05BTUVTLkZMVVRURVIudG9Mb3dlckNhc2UoKV06IHtcbiAgICBkcml2ZXJDbGFzc05hbWU6ICdGbHV0dGVyRHJpdmVyJyxcbiAgICBkcml2ZXJQYWNrYWdlOiAnYXBwaXVtLWZsdXR0ZXItZHJpdmVyJ1xuICB9LFxuICBbQVVUT01BVElPTl9OQU1FUy5TQUZBUkkudG9Mb3dlckNhc2UoKV06IHtcbiAgICBkcml2ZXJDbGFzc05hbWU6ICdTYWZhcmlEcml2ZXInLFxuICAgIGRyaXZlclBhY2thZ2U6ICdhcHBpdW0tc2FmYXJpLWRyaXZlcidcbiAgfSxcbiAgW0FVVE9NQVRJT05fTkFNRVMuR0VDS08udG9Mb3dlckNhc2UoKV06IHtcbiAgICBkcml2ZXJDbGFzc05hbWU6ICdHZWNrb0RyaXZlcicsXG4gICAgZHJpdmVyUGFja2FnZTogJ2FwcGl1bS1nZWNrb2RyaXZlcidcbiAgfSxcbiAgW0FVVE9NQVRJT05fTkFNRVMuUk9LVS50b0xvd2VyQ2FzZSgpXToge1xuICAgIGRyaXZlckNsYXNzTmFtZTogJ1Jva3VEcml2ZXInLFxuICAgIGRyaXZlclBhY2thZ2U6ICdhcHBpdW0tcm9rdS1kcml2ZXInXG4gIH0sXG4gIFtBVVRPTUFUSU9OX05BTUVTLldFQk9TLnRvTG93ZXJDYXNlKCldOiB7XG4gICAgZHJpdmVyQ2xhc3NOYW1lOiAnV2ViT1NEcml2ZXInLFxuICAgIGRyaXZlclBhY2thZ2U6ICdhcHBpdW0td2Vib3MtZHJpdmVyJ1xuICB9LFxufTtcblxuY29uc3QgUExBVEZPUk1TX01BUCA9IHtcbiAgW1BMQVRGT1JNUy5GQUtFXTogKCkgPT4gQVVUT01BVElPTl9OQU1FUy5GQUtFLFxuICBbUExBVEZPUk1TLkFORFJPSURdOiAoKSA9PiB7XG4gICAgLy8gV2FybiB1c2VycyB0aGF0IGRlZmF1bHQgYXV0b21hdGlvbiBpcyBnb2luZyB0byBjaGFuZ2UgdG8gVWlBdXRvbWF0b3IyIGZvciAxLjE0XG4gICAgLy8gYW5kIHdpbGwgYmVjb21lIHJlcXVpcmVkIG9uIEFwcGl1bSAyLjBcbiAgICBjb25zdCBsb2dEaXZpZGVyTGVuZ3RoID0gNzA7IC8vIEZpdCBpbiBjb21tYW5kIGxpbmVcblxuICAgIGNvbnN0IGF1dG9tYXRpb25XYXJuaW5nID0gW1xuICAgICAgYFRoZSAnYXV0b21hdGlvbk5hbWUnIGNhcGFiaWxpdHkgd2FzIG5vdCBwcm92aWRlZCBpbiB0aGUgZGVzaXJlZCBjYXBhYmlsaXRpZXMgZm9yIHRoaXMgQW5kcm9pZCBzZXNzaW9uYCxcbiAgICAgIGBTZXR0aW5nICdhdXRvbWF0aW9uTmFtZT1VaUF1dG9tYXRvcjInIGJ5IGRlZmF1bHQgYW5kIHVzaW5nIHRoZSBVaUF1dG9tYXRvcjIgRHJpdmVyYCxcbiAgICAgIGBUaGUgbmV4dCBtYWpvciB2ZXJzaW9uIG9mIEFwcGl1bSAoMi54KSB3aWxsICoqcmVxdWlyZSoqIHRoZSAnYXV0b21hdGlvbk5hbWUnIGNhcGFiaWxpdHkgdG8gYmUgc2V0IGZvciBhbGwgc2Vzc2lvbnMgb24gYWxsIHBsYXRmb3Jtc2AsXG4gICAgICBgSW4gcHJldmlvdXMgdmVyc2lvbnMgKEFwcGl1bSA8PSAxLjEzLngpLCB0aGUgZGVmYXVsdCB3YXMgJ2F1dG9tYXRpb25OYW1lPVVpQXV0b21hdG9yMSdgLFxuICAgICAgYElmIHlvdSB3aXNoIHRvIHVzZSB0aGF0IGF1dG9tYXRpb24gaW5zdGVhZCBvZiBVaUF1dG9tYXRvcjIsIHBsZWFzZSBhZGQgJ2F1dG9tYXRpb25OYW1lPVVpQXV0b21hdG9yMScgdG8geW91ciBkZXNpcmVkIGNhcGFiaWxpdGllc2AsXG4gICAgICBgRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgZHJpdmVycywgcGxlYXNlIHZpc2l0IGh0dHA6Ly9hcHBpdW0uaW8vZG9jcy9lbi9hYm91dC1hcHBpdW0vaW50cm8vIGFuZCBleHBsb3JlIHRoZSAnRHJpdmVycycgbWVudWBcbiAgICBdO1xuXG4gICAgbGV0IGRpdmlkZXIgPSBgJHtFT0x9JHtfLnJlcGVhdCgnPScsIGxvZ0RpdmlkZXJMZW5ndGgpfSR7RU9MfWA7XG4gICAgbGV0IGF1dG9tYXRpb25XYXJuaW5nU3RyaW5nID0gZGl2aWRlcjtcbiAgICBhdXRvbWF0aW9uV2FybmluZ1N0cmluZyArPSBgICBERVBSRUNBVElPTiBXQVJOSU5HOmAgKyBFT0w7XG4gICAgZm9yIChsZXQgbG9nIG9mIGF1dG9tYXRpb25XYXJuaW5nKSB7XG4gICAgICBhdXRvbWF0aW9uV2FybmluZ1N0cmluZyArPSBFT0wgKyB3cmFwKGxvZywge3dpZHRoOiBsb2dEaXZpZGVyTGVuZ3RoIC0gMn0pICsgRU9MO1xuICAgIH1cbiAgICBhdXRvbWF0aW9uV2FybmluZ1N0cmluZyArPSBkaXZpZGVyO1xuXG4gICAgLy8gUmVjb21tZW5kIHVzZXJzIHRvIHVwZ3JhZGUgdG8gVWlBdXRvbWF0b3IyIGlmIHRoZXkncmUgdXNpbmcgQW5kcm9pZCA+PSA2XG4gICAgbG9nLndhcm4oYXV0b21hdGlvbldhcm5pbmdTdHJpbmcpO1xuXG4gICAgcmV0dXJuIEFVVE9NQVRJT05fTkFNRVMuVUlBVVRPTUFUT1IyO1xuICB9LFxuICBbUExBVEZPUk1TLklPU106IChjYXBzKSA9PiB7XG4gICAgY29uc3QgcGxhdGZvcm1WZXJzaW9uID0gc2VtdmVyLnZhbGlkKHNlbXZlci5jb2VyY2UoY2Fwcy5wbGF0Zm9ybVZlcnNpb24pKTtcbiAgICBsb2cud2FybihgRGVwcmVjYXRpb25XYXJuaW5nOiAnYXV0b21hdGlvbk5hbWUnIGNhcGFiaWxpdHkgd2FzIG5vdCBwcm92aWRlZC4gYCArXG4gICAgICBgRnV0dXJlIHZlcnNpb25zIG9mIEFwcGl1bSB3aWxsIHJlcXVpcmUgJ2F1dG9tYXRpb25OYW1lJyBjYXBhYmlsaXR5IHRvIGJlIHNldCBmb3IgaU9TIHNlc3Npb25zLmApO1xuICAgIGlmIChwbGF0Zm9ybVZlcnNpb24gJiYgc2VtdmVyLnNhdGlzZmllcyhwbGF0Zm9ybVZlcnNpb24sICc+PTEwLjAuMCcpKSB7XG4gICAgICBsb2cuaW5mbygnUmVxdWVzdGVkIGlPUyBzdXBwb3J0IHdpdGggdmVyc2lvbiA+PSAxMCwgJyArXG4gICAgICAgIGB1c2luZyAnJHtBVVRPTUFUSU9OX05BTUVTLlhDVUlURVNUfScgYCArXG4gICAgICAgICdkcml2ZXIgaW5zdGVhZCBvZiBVSUF1dG9tYXRpb24tYmFzZWQgZHJpdmVyLCBzaW5jZSB0aGUgJyArXG4gICAgICAgICdsYXR0ZXIgaXMgdW5zdXBwb3J0ZWQgb24gaU9TIDEwIGFuZCB1cC4nKTtcbiAgICAgIHJldHVybiBBVVRPTUFUSU9OX05BTUVTLlhDVUlURVNUO1xuICAgIH1cblxuICAgIHJldHVybiBBVVRPTUFUSU9OX05BTUVTLklOU1RSVU1FTlRTO1xuICB9LFxuICBbUExBVEZPUk1TLkFQUExFX1RWT1NdOiAoKSA9PiBBVVRPTUFUSU9OX05BTUVTLlhDVUlURVNULFxuICBbUExBVEZPUk1TLldJTkRPV1NdOiAoKSA9PiBBVVRPTUFUSU9OX05BTUVTLldJTkRPV1MsXG4gIFtQTEFURk9STVMuTUFDXTogKCkgPT4gQVVUT01BVElPTl9OQU1FUy5NQUMsXG4gIFtQTEFURk9STVMuVElaRU5dOiAoKSA9PiBBVVRPTUFUSU9OX05BTUVTLlRJWkVOLFxuICBbUExBVEZPUk1TLkxJTlVYXTogKCkgPT4gQVVUT01BVElPTl9OQU1FUy5HRUNLTyxcbiAgW1BMQVRGT1JNUy5ST0tVXTogKCkgPT4gQVVUT01BVElPTl9OQU1FUy5ST0tVLFxuICBbUExBVEZPUk1TLldFQk9TXTogKCkgPT4gQVVUT01BVElPTl9OQU1FUy5XRUJPU1xufTtcblxuY29uc3QgZGVzaXJlZENhcGFiaWxpdHlDb25zdHJhaW50cyA9IHtcbiAgYXV0b21hdGlvbk5hbWU6IHtcbiAgICBwcmVzZW5jZTogZmFsc2UsXG4gICAgaXNTdHJpbmc6IHRydWUsXG4gICAgaW5jbHVzaW9uQ2FzZUluc2Vuc2l0aXZlOiBfLnZhbHVlcyhBVVRPTUFUSU9OX05BTUVTKSxcbiAgfSxcbiAgcGxhdGZvcm1OYW1lOiB7XG4gICAgcHJlc2VuY2U6IHRydWUsXG4gICAgaXNTdHJpbmc6IHRydWUsXG4gICAgaW5jbHVzaW9uQ2FzZUluc2Vuc2l0aXZlOiBfLmtleXMoUExBVEZPUk1TX01BUCksXG4gIH0sXG59O1xuXG5jb25zdCBzZXNzaW9uc0xpc3RHdWFyZCA9IG5ldyBBc3luY0xvY2soKTtcbmNvbnN0IHBlbmRpbmdEcml2ZXJzR3VhcmQgPSBuZXcgQXN5bmNMb2NrKCk7XG5cbmNsYXNzIEFwcGl1bURyaXZlciBleHRlbmRzIEJhc2VEcml2ZXIge1xuICBjb25zdHJ1Y3RvciAoYXJncykge1xuICAgIC8vIEl0IGlzIG5lY2Vzc2FyeSB0byBzZXQgYC0tdG1wYCBoZXJlIHNpbmNlIGl0IHNob3VsZCBiZSBzZXQgdG9cbiAgICAvLyBwcm9jZXNzLmVudi5BUFBJVU1fVE1QX0RJUiBvbmNlIGF0IGFuIGluaXRpYWwgcG9pbnQgaW4gdGhlIEFwcGl1bSBsaWZlY3ljbGUuXG4gICAgLy8gVGhlIHByb2Nlc3MgYXJndW1lbnQgd2lsbCBiZSByZWZlcmVuY2VkIGJ5IEJhc2VEcml2ZXIuXG4gICAgLy8gUGxlYXNlIGNhbGwgYXBwaXVtLXN1cHBvcnQudGVtcERpciBtb2R1bGUgdG8gYXBwbHkgdGhpcyBiZW5lZml0LlxuICAgIGlmIChhcmdzLnRtcERpcikge1xuICAgICAgcHJvY2Vzcy5lbnYuQVBQSVVNX1RNUF9ESVIgPSBhcmdzLnRtcERpcjtcbiAgICB9XG5cbiAgICBzdXBlcihhcmdzKTtcblxuICAgIHRoaXMuZGVzaXJlZENhcENvbnN0cmFpbnRzID0gZGVzaXJlZENhcGFiaWxpdHlDb25zdHJhaW50cztcblxuICAgIC8vIHRoZSBtYWluIEFwcGl1bSBEcml2ZXIgaGFzIG5vIG5ldyBjb21tYW5kIHRpbWVvdXRcbiAgICB0aGlzLm5ld0NvbW1hbmRUaW1lb3V0TXMgPSAwO1xuXG4gICAgdGhpcy5hcmdzID0gT2JqZWN0LmFzc2lnbih7fSwgYXJncyk7XG5cbiAgICAvLyBBY2Nlc3MgdG8gc2Vzc2lvbnMgbGlzdCBtdXN0IGJlIGd1YXJkZWQgd2l0aCBhIFNlbWFwaG9yZSwgYmVjYXVzZVxuICAgIC8vIGl0IG1pZ2h0IGJlIGNoYW5nZWQgYnkgb3RoZXIgYXN5bmMgY2FsbHMgYXQgYW55IHRpbWVcbiAgICAvLyBJdCBpcyBub3QgcmVjb21tZW5kZWQgdG8gYWNjZXNzIHRoaXMgcHJvcGVydHkgZGlyZWN0bHkgZnJvbSB0aGUgb3V0c2lkZVxuICAgIHRoaXMuc2Vzc2lvbnMgPSB7fTtcblxuICAgIC8vIEFjY2VzcyB0byBwZW5kaW5nIGRyaXZlcnMgbGlzdCBtdXN0IGJlIGd1YXJkZWQgd2l0aCBhIFNlbWFwaG9yZSwgYmVjYXVzZVxuICAgIC8vIGl0IG1pZ2h0IGJlIGNoYW5nZWQgYnkgb3RoZXIgYXN5bmMgY2FsbHMgYXQgYW55IHRpbWVcbiAgICAvLyBJdCBpcyBub3QgcmVjb21tZW5kZWQgdG8gYWNjZXNzIHRoaXMgcHJvcGVydHkgZGlyZWN0bHkgZnJvbSB0aGUgb3V0c2lkZVxuICAgIHRoaXMucGVuZGluZ0RyaXZlcnMgPSB7fTtcblxuICAgIC8vIGFsbG93IHRoaXMgdG8gaGFwcGVuIGluIHRoZSBiYWNrZ3JvdW5kLCBzbyBubyBgYXdhaXRgXG4gICAgdXBkYXRlQnVpbGRJbmZvKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FuY2VsIGNvbW1hbmRzIHF1ZXVlaW5nIGZvciB0aGUgdW1icmVsbGEgQXBwaXVtIGRyaXZlclxuICAgKi9cbiAgZ2V0IGlzQ29tbWFuZHNRdWV1ZUVuYWJsZWQgKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHNlc3Npb25FeGlzdHMgKHNlc3Npb25JZCkge1xuICAgIGNvbnN0IGRzdFNlc3Npb24gPSB0aGlzLnNlc3Npb25zW3Nlc3Npb25JZF07XG4gICAgcmV0dXJuIGRzdFNlc3Npb24gJiYgZHN0U2Vzc2lvbi5zZXNzaW9uSWQgIT09IG51bGw7XG4gIH1cblxuICBkcml2ZXJGb3JTZXNzaW9uIChzZXNzaW9uSWQpIHtcbiAgICByZXR1cm4gdGhpcy5zZXNzaW9uc1tzZXNzaW9uSWRdO1xuICB9XG5cbiAgZ2V0RHJpdmVyQW5kVmVyc2lvbkZvckNhcHMgKGNhcHMpIHtcbiAgICBpZiAoIV8uaXNTdHJpbmcoY2Fwcy5wbGF0Zm9ybU5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IGluY2x1ZGUgYSBwbGF0Zm9ybU5hbWUgY2FwYWJpbGl0eScpO1xuICAgIH1cblxuICAgIGNvbnN0IHBsYXRmb3JtTmFtZSA9IGNhcHMucGxhdGZvcm1OYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAvLyB3ZSBkb24ndCBuZWNlc3NhcmlseSBoYXZlIGFuIGBhdXRvbWF0aW9uTmFtZWAgY2FwYWJpbGl0eVxuICAgIGxldCBhdXRvbWF0aW9uTmFtZUNhcCA9IGNhcHMuYXV0b21hdGlvbk5hbWU7XG4gICAgaWYgKCFfLmlzU3RyaW5nKGF1dG9tYXRpb25OYW1lQ2FwKSB8fCBhdXRvbWF0aW9uTmFtZUNhcC50b0xvd2VyQ2FzZSgpID09PSAnYXBwaXVtJykge1xuICAgICAgY29uc3QgZHJpdmVyU2VsZWN0b3IgPSBQTEFURk9STVNfTUFQW3BsYXRmb3JtTmFtZV07XG4gICAgICBpZiAoZHJpdmVyU2VsZWN0b3IpIHtcbiAgICAgICAgYXV0b21hdGlvbk5hbWVDYXAgPSBkcml2ZXJTZWxlY3RvcihjYXBzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgYXV0b21hdGlvbk5hbWVDYXAgPSBfLnRvTG93ZXIoYXV0b21hdGlvbk5hbWVDYXApO1xuXG4gICAgbGV0IGZhaWx1cmVWZXJiID0gJ2ZpbmQnO1xuICAgIGxldCBzdWdnZXN0aW9uID0gJ1BsZWFzZSBjaGVjayB5b3VyIGRlc2lyZWQgY2FwYWJpbGl0aWVzJztcbiAgICBpZiAoXy5pc1BsYWluT2JqZWN0KERSSVZFUl9NQVBbYXV0b21hdGlvbk5hbWVDYXBdKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qge2RyaXZlclBhY2thZ2UsIGRyaXZlckNsYXNzTmFtZX0gPSBEUklWRVJfTUFQW2F1dG9tYXRpb25OYW1lQ2FwXTtcbiAgICAgICAgY29uc3QgZHJpdmVyID0gcmVxdWlyZShkcml2ZXJQYWNrYWdlKVtkcml2ZXJDbGFzc05hbWVdO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGRyaXZlcixcbiAgICAgICAgICB2ZXJzaW9uOiB0aGlzLmdldERyaXZlclZlcnNpb24oZHJpdmVyLm5hbWUsIGRyaXZlclBhY2thZ2UpLFxuICAgICAgICB9O1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2cuZGVidWcoZSk7XG4gICAgICAgIGZhaWx1cmVWZXJiID0gJ2xvYWQnO1xuICAgICAgICBzdWdnZXN0aW9uID0gJ1BsZWFzZSB2ZXJpZnkgeW91ciBBcHBpdW0gaW5zdGFsbGF0aW9uJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBtc2cgPSBfLmlzU3RyaW5nKGNhcHMuYXV0b21hdGlvbk5hbWUpXG4gICAgICA/IGBDb3VsZCBub3QgJHtmYWlsdXJlVmVyYn0gYSBkcml2ZXIgZm9yIGF1dG9tYXRpb25OYW1lICcke2NhcHMuYXV0b21hdGlvbk5hbWV9JyBhbmQgcGxhdGZvcm1OYW1lIGAgK1xuICAgICAgICAgICAgYCcke2NhcHMucGxhdGZvcm1OYW1lfSdgXG4gICAgICA6IGBDb3VsZCBub3QgJHtmYWlsdXJlVmVyYn0gYSBkcml2ZXIgZm9yIHBsYXRmb3JtTmFtZSAnJHtjYXBzLnBsYXRmb3JtTmFtZX0nYDtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bXNnfS4gJHtzdWdnZXN0aW9ufWApO1xuICB9XG5cbiAgZ2V0RHJpdmVyVmVyc2lvbiAoZHJpdmVyTmFtZSwgZHJpdmVyUGFja2FnZSkge1xuICAgIGNvbnN0IHZlcnNpb24gPSBnZXRQYWNrYWdlVmVyc2lvbihkcml2ZXJQYWNrYWdlKTtcbiAgICBpZiAodmVyc2lvbikge1xuICAgICAgcmV0dXJuIHZlcnNpb247XG4gICAgfVxuICAgIGxvZy53YXJuKGBVbmFibGUgdG8gZ2V0IHZlcnNpb24gb2YgZHJpdmVyICcke2RyaXZlck5hbWV9J2ApO1xuICB9XG5cbiAgYXN5bmMgZ2V0U3RhdHVzICgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSByZXF1aXJlLWF3YWl0XG4gICAgcmV0dXJuIHtcbiAgICAgIGJ1aWxkOiBfLmNsb25lKGdldEJ1aWxkSW5mbygpKSxcbiAgICB9O1xuICB9XG5cbiAgYXN5bmMgZ2V0U2Vzc2lvbnMgKCkge1xuICAgIGNvbnN0IHNlc3Npb25zID0gYXdhaXQgc2Vzc2lvbnNMaXN0R3VhcmQuYWNxdWlyZShBcHBpdW1Ecml2ZXIubmFtZSwgKCkgPT4gdGhpcy5zZXNzaW9ucyk7XG4gICAgcmV0dXJuIF8udG9QYWlycyhzZXNzaW9ucylcbiAgICAgIC5tYXAoKFtpZCwgZHJpdmVyXSkgPT4gKHtpZCwgY2FwYWJpbGl0aWVzOiBkcml2ZXIuY2Fwc30pKTtcbiAgfVxuXG4gIHByaW50TmV3U2Vzc2lvbkFubm91bmNlbWVudCAoZHJpdmVyTmFtZSwgZHJpdmVyVmVyc2lvbikge1xuICAgIGNvbnN0IGludHJvU3RyaW5nID0gZHJpdmVyVmVyc2lvblxuICAgICAgPyBgQXBwaXVtIHYke0FQUElVTV9WRVJ9IGNyZWF0aW5nIG5ldyAke2RyaXZlck5hbWV9ICh2JHtkcml2ZXJWZXJzaW9ufSkgc2Vzc2lvbmBcbiAgICAgIDogYEFwcGl1bSB2JHtBUFBJVU1fVkVSfSBjcmVhdGluZyBuZXcgJHtkcml2ZXJOYW1lfSBzZXNzaW9uYDtcbiAgICBsb2cuaW5mbyhpbnRyb1N0cmluZyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IHNlc3Npb25cbiAgICogQHBhcmFtIHtPYmplY3R9IGpzb253cENhcHMgSlNPTldQIGZvcm1hdHRlZCBkZXNpcmVkIGNhcGFiaWxpdGllc1xuICAgKiBAcGFyYW0ge09iamVjdH0gcmVxQ2FwcyBSZXF1aXJlZCBjYXBhYmlsaXRpZXMgKEpTT05XUCBzdGFuZGFyZClcbiAgICogQHBhcmFtIHtPYmplY3R9IHczY0NhcGFiaWxpdGllcyBXM0MgY2FwYWJpbGl0aWVzXG4gICAqIEByZXR1cm4ge0FycmF5fSBVbmlxdWUgc2Vzc2lvbiBJRCBhbmQgY2FwYWJpbGl0aWVzXG4gICAqL1xuICBhc3luYyBjcmVhdGVTZXNzaW9uIChqc29ud3BDYXBzLCByZXFDYXBzLCB3M2NDYXBhYmlsaXRpZXMpIHtcbiAgICBjb25zdCBkZWZhdWx0Q2FwYWJpbGl0aWVzID0gXy5jbG9uZURlZXAodGhpcy5hcmdzLmRlZmF1bHRDYXBhYmlsaXRpZXMpO1xuICAgIGNvbnN0IGRlZmF1bHRTZXR0aW5ncyA9IHB1bGxTZXR0aW5ncyhkZWZhdWx0Q2FwYWJpbGl0aWVzKTtcbiAgICBqc29ud3BDYXBzID0gXy5jbG9uZURlZXAoanNvbndwQ2Fwcyk7XG4gICAgY29uc3QgandwU2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0U2V0dGluZ3MsIHB1bGxTZXR0aW5ncyhqc29ud3BDYXBzKSk7XG4gICAgdzNjQ2FwYWJpbGl0aWVzID0gXy5jbG9uZURlZXAodzNjQ2FwYWJpbGl0aWVzKTtcbiAgICAvLyBJdCBpcyBwb3NzaWJsZSB0aGF0IHRoZSBjbGllbnQgb25seSBwcm92aWRlcyBjYXBzIHVzaW5nIEpTT05XUCBzdGFuZGFyZCxcbiAgICAvLyBhbHRob3VnaCBmaXJzdE1hdGNoL2Fsd2F5c01hdGNoIHByb3BlcnRpZXMgYXJlIHN0aWxsIHByZXNlbnQuXG4gICAgLy8gSW4gc3VjaCBjYXNlIHdlIGFzc3VtZSB0aGUgY2xpZW50IHVuZGVyc3RhbmRzIFczQyBwcm90b2NvbCBhbmQgbWVyZ2UgdGhlIGdpdmVuXG4gICAgLy8gSlNPTldQIGNhcHMgdG8gVzNDIGNhcHNcbiAgICBjb25zdCB3M2NTZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIGp3cFNldHRpbmdzKTtcbiAgICBPYmplY3QuYXNzaWduKHczY1NldHRpbmdzLCBwdWxsU2V0dGluZ3MoKHczY0NhcGFiaWxpdGllcyB8fCB7fSkuYWx3YXlzTWF0Y2ggfHwge30pKTtcbiAgICBmb3IgKGNvbnN0IGZpcnN0TWF0Y2hFbnRyeSBvZiAoKHczY0NhcGFiaWxpdGllcyB8fCB7fSkuZmlyc3RNYXRjaCB8fCBbXSkpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24odzNjU2V0dGluZ3MsIHB1bGxTZXR0aW5ncyhmaXJzdE1hdGNoRW50cnkpKTtcbiAgICB9XG5cbiAgICBsZXQgcHJvdG9jb2w7XG4gICAgbGV0IGlubmVyU2Vzc2lvbklkLCBkQ2FwcztcbiAgICB0cnkge1xuICAgICAgLy8gUGFyc2UgdGhlIGNhcHMgaW50byBhIGZvcm1hdCB0aGF0IHRoZSBJbm5lckRyaXZlciB3aWxsIGFjY2VwdFxuICAgICAgY29uc3QgcGFyc2VkQ2FwcyA9IHBhcnNlQ2Fwc0ZvcklubmVyRHJpdmVyKFxuICAgICAgICBqc29ud3BDYXBzLFxuICAgICAgICB3M2NDYXBhYmlsaXRpZXMsXG4gICAgICAgIHRoaXMuZGVzaXJlZENhcENvbnN0cmFpbnRzLFxuICAgICAgICBkZWZhdWx0Q2FwYWJpbGl0aWVzXG4gICAgICApO1xuXG4gICAgICBjb25zdCB7ZGVzaXJlZENhcHMsIHByb2Nlc3NlZEpzb253cENhcGFiaWxpdGllcywgcHJvY2Vzc2VkVzNDQ2FwYWJpbGl0aWVzLCBlcnJvcn0gPSBwYXJzZWRDYXBzO1xuICAgICAgcHJvdG9jb2wgPSBwYXJzZWRDYXBzLnByb3RvY29sO1xuXG4gICAgICAvLyBJZiB0aGUgcGFyc2luZyBvZiB0aGUgY2FwcyBwcm9kdWNlZCBhbiBlcnJvciwgdGhyb3cgaXQgaW4gaGVyZVxuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7ZHJpdmVyOiBJbm5lckRyaXZlciwgdmVyc2lvbjogZHJpdmVyVmVyc2lvbn0gPSB0aGlzLmdldERyaXZlckFuZFZlcnNpb25Gb3JDYXBzKGRlc2lyZWRDYXBzKTtcbiAgICAgIHRoaXMucHJpbnROZXdTZXNzaW9uQW5ub3VuY2VtZW50KElubmVyRHJpdmVyLm5hbWUsIGRyaXZlclZlcnNpb24pO1xuXG4gICAgICBpZiAodGhpcy5hcmdzLnNlc3Npb25PdmVycmlkZSkge1xuICAgICAgICBhd2FpdCB0aGlzLmRlbGV0ZUFsbFNlc3Npb25zKCk7XG4gICAgICB9XG5cbiAgICAgIGxldCBydW5uaW5nRHJpdmVyc0RhdGEsIG90aGVyUGVuZGluZ0RyaXZlcnNEYXRhO1xuICAgICAgY29uc3QgZCA9IG5ldyBJbm5lckRyaXZlcih0aGlzLmFyZ3MpO1xuXG4gICAgICAvLyBXZSB3YW50IHRvIGFzc2lnbiBzZWN1cml0eSB2YWx1ZXMgZGlyZWN0bHkgb24gdGhlIGRyaXZlci4gVGhlIGRyaXZlclxuICAgICAgLy8gc2hvdWxkIG5vdCByZWFkIHNlY3VyaXR5IHZhbHVlcyBmcm9tIGB0aGlzLm9wdHNgIGJlY2F1c2UgdGhvc2UgdmFsdWVzXG4gICAgICAvLyBjb3VsZCBoYXZlIGJlZW4gc2V0IGJ5IGEgbWFsaWNpb3VzIHVzZXIgdmlhIGNhcGFiaWxpdGllcywgd2hlcmVhcyB3ZVxuICAgICAgLy8gd2FudCBhIGd1YXJhbnRlZSB0aGUgdmFsdWVzIHdlcmUgc2V0IGJ5IHRoZSBhcHBpdW0gc2VydmVyIGFkbWluXG4gICAgICBpZiAodGhpcy5hcmdzLnJlbGF4ZWRTZWN1cml0eUVuYWJsZWQpIHtcbiAgICAgICAgbG9nLmluZm8oYEFwcGx5aW5nIHJlbGF4ZWQgc2VjdXJpdHkgdG8gJyR7SW5uZXJEcml2ZXIubmFtZX0nIGFzIHBlciBgICtcbiAgICAgICAgICAgICAgICAgYHNlcnZlciBjb21tYW5kIGxpbmUgYXJndW1lbnQuIEFsbCBpbnNlY3VyZSBmZWF0dXJlcyB3aWxsIGJlIGAgK1xuICAgICAgICAgICAgICAgICBgZW5hYmxlZCB1bmxlc3MgZXhwbGljaXRseSBkaXNhYmxlZCBieSAtLWRlbnktaW5zZWN1cmVgKTtcbiAgICAgICAgZC5yZWxheGVkU2VjdXJpdHlFbmFibGVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFfLmlzRW1wdHkodGhpcy5hcmdzLmRlbnlJbnNlY3VyZSkpIHtcbiAgICAgICAgbG9nLmluZm8oJ0V4cGxpY2l0bHkgcHJldmVudGluZyB1c2Ugb2YgaW5zZWN1cmUgZmVhdHVyZXM6Jyk7XG4gICAgICAgIHRoaXMuYXJncy5kZW55SW5zZWN1cmUubWFwKChhKSA9PiBsb2cuaW5mbyhgICAgICR7YX1gKSk7XG4gICAgICAgIGQuZGVueUluc2VjdXJlID0gdGhpcy5hcmdzLmRlbnlJbnNlY3VyZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFfLmlzRW1wdHkodGhpcy5hcmdzLmFsbG93SW5zZWN1cmUpKSB7XG4gICAgICAgIGxvZy5pbmZvKCdFeHBsaWNpdGx5IGVuYWJsaW5nIHVzZSBvZiBpbnNlY3VyZSBmZWF0dXJlczonKTtcbiAgICAgICAgdGhpcy5hcmdzLmFsbG93SW5zZWN1cmUubWFwKChhKSA9PiBsb2cuaW5mbyhgICAgICR7YX1gKSk7XG4gICAgICAgIGQuYWxsb3dJbnNlY3VyZSA9IHRoaXMuYXJncy5hbGxvd0luc2VjdXJlO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGlzIGFzc2lnbm1lbnQgaXMgcmVxdWlyZWQgZm9yIGNvcnJlY3Qgd2ViIHNvY2tldHMgZnVuY3Rpb25hbGl0eSBpbnNpZGUgdGhlIGRyaXZlclxuICAgICAgZC5zZXJ2ZXIgPSB0aGlzLnNlcnZlcjtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJ1bm5pbmdEcml2ZXJzRGF0YSA9IGF3YWl0IHRoaXMuY3VyU2Vzc2lvbkRhdGFGb3JEcml2ZXIoSW5uZXJEcml2ZXIpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aHJvdyBuZXcgZXJyb3JzLlNlc3Npb25Ob3RDcmVhdGVkRXJyb3IoZS5tZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IHBlbmRpbmdEcml2ZXJzR3VhcmQuYWNxdWlyZShBcHBpdW1Ecml2ZXIubmFtZSwgKCkgPT4ge1xuICAgICAgICB0aGlzLnBlbmRpbmdEcml2ZXJzW0lubmVyRHJpdmVyLm5hbWVdID0gdGhpcy5wZW5kaW5nRHJpdmVyc1tJbm5lckRyaXZlci5uYW1lXSB8fCBbXTtcbiAgICAgICAgb3RoZXJQZW5kaW5nRHJpdmVyc0RhdGEgPSB0aGlzLnBlbmRpbmdEcml2ZXJzW0lubmVyRHJpdmVyLm5hbWVdLm1hcCgoZHJ2KSA9PiBkcnYuZHJpdmVyRGF0YSk7XG4gICAgICAgIHRoaXMucGVuZGluZ0RyaXZlcnNbSW5uZXJEcml2ZXIubmFtZV0ucHVzaChkKTtcbiAgICAgIH0pO1xuXG4gICAgICB0cnkge1xuICAgICAgICBbaW5uZXJTZXNzaW9uSWQsIGRDYXBzXSA9IGF3YWl0IGQuY3JlYXRlU2Vzc2lvbihcbiAgICAgICAgICBwcm9jZXNzZWRKc29ud3BDYXBhYmlsaXRpZXMsXG4gICAgICAgICAgcmVxQ2FwcyxcbiAgICAgICAgICBwcm9jZXNzZWRXM0NDYXBhYmlsaXRpZXMsXG4gICAgICAgICAgWy4uLnJ1bm5pbmdEcml2ZXJzRGF0YSwgLi4ub3RoZXJQZW5kaW5nRHJpdmVyc0RhdGFdXG4gICAgICAgICk7XG4gICAgICAgIHByb3RvY29sID0gZC5wcm90b2NvbDtcbiAgICAgICAgYXdhaXQgc2Vzc2lvbnNMaXN0R3VhcmQuYWNxdWlyZShBcHBpdW1Ecml2ZXIubmFtZSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2Vzc2lvbnNbaW5uZXJTZXNzaW9uSWRdID0gZDtcbiAgICAgICAgfSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBhd2FpdCBwZW5kaW5nRHJpdmVyc0d1YXJkLmFjcXVpcmUoQXBwaXVtRHJpdmVyLm5hbWUsICgpID0+IHtcbiAgICAgICAgICBfLnB1bGwodGhpcy5wZW5kaW5nRHJpdmVyc1tJbm5lckRyaXZlci5uYW1lXSwgZCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmF0dGFjaFVuZXhwZWN0ZWRTaHV0ZG93bkhhbmRsZXIoZCwgaW5uZXJTZXNzaW9uSWQpO1xuXG4gICAgICBsb2cuaW5mbyhgTmV3ICR7SW5uZXJEcml2ZXIubmFtZX0gc2Vzc2lvbiBjcmVhdGVkIHN1Y2Nlc3NmdWxseSwgc2Vzc2lvbiBgICtcbiAgICAgICAgICAgICAgYCR7aW5uZXJTZXNzaW9uSWR9IGFkZGVkIHRvIG1hc3RlciBzZXNzaW9uIGxpc3RgKTtcblxuICAgICAgLy8gc2V0IHRoZSBOZXcgQ29tbWFuZCBUaW1lb3V0IGZvciB0aGUgaW5uZXIgZHJpdmVyXG4gICAgICBkLnN0YXJ0TmV3Q29tbWFuZFRpbWVvdXQoKTtcblxuICAgICAgLy8gYXBwbHkgaW5pdGlhbCB2YWx1ZXMgdG8gQXBwaXVtIHNldHRpbmdzIChpZiBwcm92aWRlZClcbiAgICAgIGlmIChkLmlzVzNDUHJvdG9jb2woKSAmJiAhXy5pc0VtcHR5KHczY1NldHRpbmdzKSkge1xuICAgICAgICBsb2cuaW5mbyhgQXBwbHlpbmcgdGhlIGluaXRpYWwgdmFsdWVzIHRvIEFwcGl1bSBzZXR0aW5ncyBwYXJzZWQgZnJvbSBXM0MgY2FwczogYCArXG4gICAgICAgICAgSlNPTi5zdHJpbmdpZnkodzNjU2V0dGluZ3MpKTtcbiAgICAgICAgYXdhaXQgZC51cGRhdGVTZXR0aW5ncyh3M2NTZXR0aW5ncyk7XG4gICAgICB9IGVsc2UgaWYgKGQuaXNNanNvbndwUHJvdG9jb2woKSAmJiAhXy5pc0VtcHR5KGp3cFNldHRpbmdzKSkge1xuICAgICAgICBsb2cuaW5mbyhgQXBwbHlpbmcgdGhlIGluaXRpYWwgdmFsdWVzIHRvIEFwcGl1bSBzZXR0aW5ncyBwYXJzZWQgZnJvbSBNSlNPTldQIGNhcHM6IGAgK1xuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGp3cFNldHRpbmdzKSk7XG4gICAgICAgIGF3YWl0IGQudXBkYXRlU2V0dGluZ3MoandwU2V0dGluZ3MpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwcm90b2NvbCxcbiAgICAgICAgZXJyb3IsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBwcm90b2NvbCxcbiAgICAgIHZhbHVlOiBbaW5uZXJTZXNzaW9uSWQsIGRDYXBzLCBwcm90b2NvbF1cbiAgICB9O1xuICB9XG5cbiAgYXR0YWNoVW5leHBlY3RlZFNodXRkb3duSGFuZGxlciAoZHJpdmVyLCBpbm5lclNlc3Npb25JZCkge1xuICAgIGNvbnN0IHJlbW92ZVNlc3Npb25Gcm9tTWFzdGVyTGlzdCA9IChjYXVzZSA9IG5ldyBFcnJvcignVW5rbm93biBlcnJvcicpKSA9PiB7XG4gICAgICBsb2cud2FybihgQ2xvc2luZyBzZXNzaW9uLCBjYXVzZSB3YXMgJyR7Y2F1c2UubWVzc2FnZX0nYCk7XG4gICAgICBsb2cuaW5mbyhgUmVtb3Zpbmcgc2Vzc2lvbiAnJHtpbm5lclNlc3Npb25JZH0nIGZyb20gb3VyIG1hc3RlciBzZXNzaW9uIGxpc3RgKTtcbiAgICAgIGRlbGV0ZSB0aGlzLnNlc3Npb25zW2lubmVyU2Vzc2lvbklkXTtcbiAgICB9O1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByb21pc2UvcHJlZmVyLWF3YWl0LXRvLXRoZW5cbiAgICBpZiAoXy5pc0Z1bmN0aW9uKChkcml2ZXIub25VbmV4cGVjdGVkU2h1dGRvd24gfHwge30pLnRoZW4pKSB7XG4gICAgICAvLyBUT0RPOiBSZW1vdmUgdGhpcyBibG9jayBhZnRlciBhbGwgdGhlIGRyaXZlcnMgdXNlIGJhc2UgZHJpdmVyIGFib3ZlIHYgNS4wLjBcbiAgICAgIC8vIFJlbW92ZSB0aGUgc2Vzc2lvbiBvbiB1bmV4cGVjdGVkIHNodXRkb3duLCBzbyB0aGF0IHdlIGFyZSBpbiBhIHBvc2l0aW9uXG4gICAgICAvLyB0byBvcGVuIGFub3RoZXIgc2Vzc2lvbiBsYXRlciBvbi5cbiAgICAgIGRyaXZlci5vblVuZXhwZWN0ZWRTaHV0ZG93blxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJvbWlzZS9wcmVmZXItYXdhaXQtdG8tdGhlblxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgLy8gaWYgd2UgZ2V0IGhlcmUsIHdlJ3ZlIGhhZCBhbiB1bmV4cGVjdGVkIHNodXRkb3duLCBzbyBlcnJvclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5leHBlY3RlZCBzaHV0ZG93bicpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAvLyBpZiB3ZSBjYW5jZWxsZWQgdGhlIHVuZXhwZWN0ZWQgc2h1dGRvd24gcHJvbWlzZSwgdGhhdCBtZWFucyB3ZVxuICAgICAgICAgIC8vIG5vIGxvbmdlciBjYXJlIGFib3V0IGl0LCBhbmQgY2FuIHNhZmVseSBpZ25vcmUgaXRcbiAgICAgICAgICBpZiAoIShlIGluc3RhbmNlb2YgQi5DYW5jZWxsYXRpb25FcnJvcikpIHtcbiAgICAgICAgICAgIHJlbW92ZVNlc3Npb25Gcm9tTWFzdGVyTGlzdChlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pOyAvLyB0aGlzIGlzIGEgY2FuY2VsbGFibGUgcHJvbWlzZVxuICAgIH0gZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKGRyaXZlci5vblVuZXhwZWN0ZWRTaHV0ZG93bikpIHtcbiAgICAgIC8vIHNpbmNlIGJhc2UgZHJpdmVyIHYgNS4wLjBcbiAgICAgIGRyaXZlci5vblVuZXhwZWN0ZWRTaHV0ZG93bihyZW1vdmVTZXNzaW9uRnJvbU1hc3Rlckxpc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2FybihgRmFpbGVkIHRvIGF0dGFjaCB0aGUgdW5leHBlY3RlZCBzaHV0ZG93biBsaXN0ZW5lci4gYCArXG4gICAgICAgIGBJcyAnb25VbmV4cGVjdGVkU2h1dGRvd24nIG1ldGhvZCBhdmFpbGFibGUgZm9yICcke2RyaXZlci5jb25zdHJ1Y3Rvci5uYW1lfSc/YCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgY3VyU2Vzc2lvbkRhdGFGb3JEcml2ZXIgKElubmVyRHJpdmVyKSB7XG4gICAgY29uc3Qgc2Vzc2lvbnMgPSBhd2FpdCBzZXNzaW9uc0xpc3RHdWFyZC5hY3F1aXJlKEFwcGl1bURyaXZlci5uYW1lLCAoKSA9PiB0aGlzLnNlc3Npb25zKTtcbiAgICBjb25zdCBkYXRhID0gXy52YWx1ZXMoc2Vzc2lvbnMpXG4gICAgICAgICAgICAgICAgICAgLmZpbHRlcigocykgPT4gcy5jb25zdHJ1Y3Rvci5uYW1lID09PSBJbm5lckRyaXZlci5uYW1lKVxuICAgICAgICAgICAgICAgICAgIC5tYXAoKHMpID0+IHMuZHJpdmVyRGF0YSk7XG4gICAgZm9yIChsZXQgZGF0dW0gb2YgZGF0YSkge1xuICAgICAgaWYgKCFkYXR1bSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFByb2JsZW0gZ2V0dGluZyBzZXNzaW9uIGRhdGEgZm9yIGRyaXZlciB0eXBlIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYCR7SW5uZXJEcml2ZXIubmFtZX07IGRvZXMgaXQgaW1wbGVtZW50ICdnZXQgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICBgZHJpdmVyRGF0YSc/YCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgYXN5bmMgZGVsZXRlU2Vzc2lvbiAoc2Vzc2lvbklkKSB7XG4gICAgbGV0IHByb3RvY29sO1xuICAgIHRyeSB7XG4gICAgICBsZXQgb3RoZXJTZXNzaW9uc0RhdGEgPSBudWxsO1xuICAgICAgbGV0IGRzdFNlc3Npb24gPSBudWxsO1xuICAgICAgYXdhaXQgc2Vzc2lvbnNMaXN0R3VhcmQuYWNxdWlyZShBcHBpdW1Ecml2ZXIubmFtZSwgKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuc2Vzc2lvbnNbc2Vzc2lvbklkXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjdXJDb25zdHJ1Y3Rvck5hbWUgPSB0aGlzLnNlc3Npb25zW3Nlc3Npb25JZF0uY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgb3RoZXJTZXNzaW9uc0RhdGEgPSBfLnRvUGFpcnModGhpcy5zZXNzaW9ucylcbiAgICAgICAgICAgICAgLmZpbHRlcigoW2tleSwgdmFsdWVdKSA9PiB2YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lID09PSBjdXJDb25zdHJ1Y3Rvck5hbWUgJiYga2V5ICE9PSBzZXNzaW9uSWQpXG4gICAgICAgICAgICAgIC5tYXAoKFssIHZhbHVlXSkgPT4gdmFsdWUuZHJpdmVyRGF0YSk7XG4gICAgICAgIGRzdFNlc3Npb24gPSB0aGlzLnNlc3Npb25zW3Nlc3Npb25JZF07XG4gICAgICAgIHByb3RvY29sID0gZHN0U2Vzc2lvbi5wcm90b2NvbDtcbiAgICAgICAgbG9nLmluZm8oYFJlbW92aW5nIHNlc3Npb24gJHtzZXNzaW9uSWR9IGZyb20gb3VyIG1hc3RlciBzZXNzaW9uIGxpc3RgKTtcbiAgICAgICAgLy8gcmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoZSBkZWxldGVTZXNzaW9uIGNvbXBsZXRlcyBzdWNjZXNzZnVsbHkgb3Igbm90XG4gICAgICAgIC8vIG1ha2UgdGhlIHNlc3Npb24gdW5hdmFpbGFibGUsIGJlY2F1c2Ugd2hvIGtub3dzIHdoYXQgc3RhdGUgaXQgbWlnaHRcbiAgICAgICAgLy8gYmUgaW4gb3RoZXJ3aXNlXG4gICAgICAgIGRlbGV0ZSB0aGlzLnNlc3Npb25zW3Nlc3Npb25JZF07XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHByb3RvY29sLFxuICAgICAgICB2YWx1ZTogYXdhaXQgZHN0U2Vzc2lvbi5kZWxldGVTZXNzaW9uKHNlc3Npb25JZCwgb3RoZXJTZXNzaW9uc0RhdGEpLFxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBsb2cuZXJyb3IoYEhhZCB0cm91YmxlIGVuZGluZyBzZXNzaW9uICR7c2Vzc2lvbklkfTogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwcm90b2NvbCxcbiAgICAgICAgZXJyb3I6IGUsXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGRlbGV0ZUFsbFNlc3Npb25zIChvcHRzID0ge30pIHtcbiAgICBjb25zdCBzZXNzaW9uc0NvdW50ID0gXy5zaXplKHRoaXMuc2Vzc2lvbnMpO1xuICAgIGlmICgwID09PSBzZXNzaW9uc0NvdW50KSB7XG4gICAgICBsb2cuZGVidWcoJ1RoZXJlIGFyZSBubyBhY3RpdmUgc2Vzc2lvbnMgZm9yIGNsZWFudXAnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICBmb3JjZSA9IGZhbHNlLFxuICAgICAgcmVhc29uLFxuICAgIH0gPSBvcHRzO1xuICAgIGxvZy5kZWJ1ZyhgQ2xlYW5pbmcgdXAgJHt1dGlsLnBsdXJhbGl6ZSgnYWN0aXZlIHNlc3Npb24nLCBzZXNzaW9uc0NvdW50LCB0cnVlKX1gKTtcbiAgICBjb25zdCBjbGVhbnVwUHJvbWlzZXMgPSBmb3JjZVxuICAgICAgPyBfLnZhbHVlcyh0aGlzLnNlc3Npb25zKS5tYXAoKGRydikgPT4gZHJ2LnN0YXJ0VW5leHBlY3RlZFNodXRkb3duKHJlYXNvbiAmJiBuZXcgRXJyb3IocmVhc29uKSkpXG4gICAgICA6IF8ua2V5cyh0aGlzLnNlc3Npb25zKS5tYXAoKGlkKSA9PiB0aGlzLmRlbGV0ZVNlc3Npb24oaWQpKTtcbiAgICBmb3IgKGNvbnN0IGNsZWFudXBQcm9taXNlIG9mIGNsZWFudXBQcm9taXNlcykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY2xlYW51cFByb21pc2U7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZy5kZWJ1ZyhlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBleGVjdXRlQ29tbWFuZCAoY21kLCAuLi5hcmdzKSB7XG4gICAgLy8gZ2V0U3RhdHVzIGNvbW1hbmQgc2hvdWxkIG5vdCBiZSBwdXQgaW50byBxdWV1ZS4gSWYgd2UgZG8gaXQgYXMgcGFydCBvZiBzdXBlci5leGVjdXRlQ29tbWFuZCwgaXQgd2lsbCBiZSBhZGRlZCB0byBxdWV1ZS5cbiAgICAvLyBUaGVyZSB3aWxsIGJlIGxvdCBvZiBzdGF0dXMgY29tbWFuZHMgaW4gcXVldWUgZHVyaW5nIGNyZWF0ZVNlc3Npb24gY29tbWFuZCwgYXMgY3JlYXRlU2Vzc2lvbiBjYW4gdGFrZSB1cCB0byBvciBtb3JlIHRoYW4gYSBtaW51dGUuXG4gICAgaWYgKGNtZCA9PT0gJ2dldFN0YXR1cycpIHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldFN0YXR1cygpO1xuICAgIH1cblxuICAgIGlmIChpc0FwcGl1bURyaXZlckNvbW1hbmQoY21kKSkge1xuICAgICAgcmV0dXJuIGF3YWl0IHN1cGVyLmV4ZWN1dGVDb21tYW5kKGNtZCwgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2Vzc2lvbklkID0gXy5sYXN0KGFyZ3MpO1xuICAgIGNvbnN0IGRzdFNlc3Npb24gPSBhd2FpdCBzZXNzaW9uc0xpc3RHdWFyZC5hY3F1aXJlKEFwcGl1bURyaXZlci5uYW1lLCAoKSA9PiB0aGlzLnNlc3Npb25zW3Nlc3Npb25JZF0pO1xuICAgIGlmICghZHN0U2Vzc2lvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgc2Vzc2lvbiB3aXRoIGlkICcke3Nlc3Npb25JZH0nIGRvZXMgbm90IGV4aXN0YCk7XG4gICAgfVxuXG4gICAgbGV0IHJlcyA9IHtcbiAgICAgIHByb3RvY29sOiBkc3RTZXNzaW9uLnByb3RvY29sXG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICByZXMudmFsdWUgPSBhd2FpdCBkc3RTZXNzaW9uLmV4ZWN1dGVDb21tYW5kKGNtZCwgLi4uYXJncyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVzLmVycm9yID0gZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHByb3h5QWN0aXZlIChzZXNzaW9uSWQpIHtcbiAgICBjb25zdCBkc3RTZXNzaW9uID0gdGhpcy5zZXNzaW9uc1tzZXNzaW9uSWRdO1xuICAgIHJldHVybiBkc3RTZXNzaW9uICYmIF8uaXNGdW5jdGlvbihkc3RTZXNzaW9uLnByb3h5QWN0aXZlKSAmJiBkc3RTZXNzaW9uLnByb3h5QWN0aXZlKHNlc3Npb25JZCk7XG4gIH1cblxuICBnZXRQcm94eUF2b2lkTGlzdCAoc2Vzc2lvbklkKSB7XG4gICAgY29uc3QgZHN0U2Vzc2lvbiA9IHRoaXMuc2Vzc2lvbnNbc2Vzc2lvbklkXTtcbiAgICByZXR1cm4gZHN0U2Vzc2lvbiA/IGRzdFNlc3Npb24uZ2V0UHJveHlBdm9pZExpc3QoKSA6IFtdO1xuICB9XG5cbiAgY2FuUHJveHkgKHNlc3Npb25JZCkge1xuICAgIGNvbnN0IGRzdFNlc3Npb24gPSB0aGlzLnNlc3Npb25zW3Nlc3Npb25JZF07XG4gICAgcmV0dXJuIGRzdFNlc3Npb24gJiYgZHN0U2Vzc2lvbi5jYW5Qcm94eShzZXNzaW9uSWQpO1xuICB9XG59XG5cbi8vIGhlbHAgZGVjaWRlIHdoaWNoIGNvbW1hbmRzIHNob3VsZCBiZSBwcm94aWVkIHRvIHN1Yi1kcml2ZXJzIGFuZCB3aGljaFxuLy8gc2hvdWxkIGJlIGhhbmRsZWQgYnkgdGhpcywgb3VyIHVtYnJlbGxhIGRyaXZlclxuZnVuY3Rpb24gaXNBcHBpdW1Ecml2ZXJDb21tYW5kIChjbWQpIHtcbiAgcmV0dXJuICFpc1Nlc3Npb25Db21tYW5kKGNtZCkgfHwgY21kID09PSAnZGVsZXRlU2Vzc2lvbic7XG59XG5cbmV4cG9ydCB7IEFwcGl1bURyaXZlciB9O1xuIl0sImZpbGUiOiJsaWIvYXBwaXVtLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uIn0=
