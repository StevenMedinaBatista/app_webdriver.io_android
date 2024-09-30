"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.XcodeBuild = void 0;

require("source-map-support/register");

var _asyncbox = require("asyncbox");

var _teen_process = require("teen_process");

var _appiumSupport = require("appium-support");

var _logger = _interopRequireDefault(require("./logger"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _utils = require("./utils");

var _lodash = _interopRequireDefault(require("lodash"));

var _path = _interopRequireDefault(require("path"));

var _os = require("os");

var _constants = require("./constants");

const DEFAULT_SIGNING_ID = 'iPhone Developer';
const PREBUILD_DELAY = 0;
const RUNNER_SCHEME_IOS = 'WebDriverAgentRunner';
const LIB_SCHEME_IOS = 'WebDriverAgentLib';
const ERROR_WRITING_ATTACHMENT = 'Error writing attachment data to file';
const ERROR_COPYING_ATTACHMENT = 'Error copying testing attachment';
const IGNORED_ERRORS = [ERROR_WRITING_ATTACHMENT, ERROR_COPYING_ATTACHMENT, 'Failed to remove screenshot at path'];
const RUNNER_SCHEME_TV = 'WebDriverAgentRunner_tvOS';
const LIB_SCHEME_TV = 'WebDriverAgentLib_tvOS';

const xcodeLog = _appiumSupport.logger.getLogger('Xcode');

class XcodeBuild {
  constructor(xcodeVersion, device, args = {}) {
    this.xcodeVersion = xcodeVersion;
    this.device = device;
    this.realDevice = args.realDevice;
    this.agentPath = args.agentPath;
    this.bootstrapPath = args.bootstrapPath;
    this.platformVersion = args.platformVersion;
    this.platformName = args.platformName;
    this.iosSdkVersion = args.iosSdkVersion;
    this.showXcodeLog = args.showXcodeLog;
    this.xcodeConfigFile = args.xcodeConfigFile;
    this.xcodeOrgId = args.xcodeOrgId;
    this.xcodeSigningId = args.xcodeSigningId || DEFAULT_SIGNING_ID;
    this.keychainPath = args.keychainPath;
    this.keychainPassword = args.keychainPassword;
    this.prebuildWDA = args.prebuildWDA;
    this.usePrebuiltWDA = args.usePrebuiltWDA;
    this.useSimpleBuildTest = args.useSimpleBuildTest;
    this.useXctestrunFile = args.useXctestrunFile;
    this.launchTimeout = args.launchTimeout;
    this.wdaRemotePort = args.wdaRemotePort;
    this.updatedWDABundleId = args.updatedWDABundleId;
    this.derivedDataPath = args.derivedDataPath;
    this.mjpegServerPort = args.mjpegServerPort;
    this.prebuildDelay = _lodash.default.isNumber(args.prebuildDelay) ? args.prebuildDelay : PREBUILD_DELAY;
    this.allowProvisioningDeviceRegistration = args.allowProvisioningDeviceRegistration;
    this.resultBundlePath = args.resultBundlePath;
    this.resultBundleVersion = args.resultBundleVersion;
  }

  async init(noSessionProxy) {
    this.noSessionProxy = noSessionProxy;

    if (this.useXctestrunFile) {
      const deviveInfo = {
        isRealDevice: this.realDevice,
        udid: this.device.udid,
        platformVersion: this.platformVersion,
        platformName: this.platformName
      };
      this.xctestrunFilePath = await (0, _utils.setXctestrunFile)(deviveInfo, this.iosSdkVersion, this.bootstrapPath, this.wdaRemotePort);
      return;
    }

    if (this.realDevice) {
      await (0, _utils.resetProjectFile)(this.agentPath);

      if (this.updatedWDABundleId) {
        await (0, _utils.updateProjectFile)(this.agentPath, this.updatedWDABundleId);
      }
    }
  }

  async retrieveDerivedDataPath() {
    if (this.derivedDataPath) {
      return this.derivedDataPath;
    }

    if (this._derivedDataPathPromise) {
      return await this._derivedDataPathPromise;
    }

    this._derivedDataPathPromise = (async () => {
      let stdout;

      try {
        ({
          stdout
        } = await (0, _teen_process.exec)('xcodebuild', ['-project', this.agentPath, '-showBuildSettings']));
      } catch (err) {
        _logger.default.warn(`Cannot retrieve WDA build settings. Original error: ${err.message}`);

        return;
      }

      const pattern = /^\s*BUILD_DIR\s+=\s+(\/.*)/m;
      const match = pattern.exec(stdout);

      if (!match) {
        _logger.default.warn(`Cannot parse WDA build dir from ${_lodash.default.truncate(stdout, {
          length: 300
        })}`);

        return;
      }

      _logger.default.debug(`Parsed BUILD_DIR configuration value: '${match[1]}'`);

      this.derivedDataPath = _path.default.dirname(_path.default.dirname(_path.default.normalize(match[1])));

      _logger.default.debug(`Got derived data root: '${this.derivedDataPath}'`);

      return this.derivedDataPath;
    })();

    return await this._derivedDataPathPromise;
  }

  async reset() {
    if (this.realDevice && this.updatedWDABundleId) {
      await (0, _utils.resetProjectFile)(this.agentPath);
    }
  }

  async prebuild() {
    _logger.default.debug('Pre-building WDA before launching test');

    this.usePrebuiltWDA = true;
    await this.start(true);
    this.xcodebuild = null;
    await _bluebird.default.delay(this.prebuildDelay);
  }

  async cleanProject() {
    const tmpIsTvOS = (0, _utils.isTvOS)(this.platformName);
    const libScheme = tmpIsTvOS ? LIB_SCHEME_TV : LIB_SCHEME_IOS;
    const runnerScheme = tmpIsTvOS ? RUNNER_SCHEME_TV : RUNNER_SCHEME_IOS;

    for (const scheme of [libScheme, runnerScheme]) {
      _logger.default.debug(`Cleaning the project scheme '${scheme}' to make sure there are no leftovers from previous installs`);

      await (0, _teen_process.exec)('xcodebuild', ['clean', '-project', this.agentPath, '-scheme', scheme]);
    }
  }

  getCommand(buildOnly = false) {
    let cmd = 'xcodebuild';
    let args;
    const [buildCmd, testCmd] = this.useSimpleBuildTest ? ['build', 'test'] : ['build-for-testing', 'test-without-building'];

    if (buildOnly) {
      args = [buildCmd];
    } else if (this.usePrebuiltWDA || this.useXctestrunFile) {
      args = [testCmd];
    } else {
      args = [buildCmd, testCmd];
    }

    if (this.allowProvisioningDeviceRegistration) {
      args.push('-allowProvisioningUpdates', '-allowProvisioningDeviceRegistration');
    }

    if (this.resultBundlePath) {
      args.push('-resultBundlePath', this.resultBundlePath);
    }

    if (this.resultBundleVersion) {
      args.push('-resultBundleVersion', this.resultBundleVersion);
    }

    if (this.useXctestrunFile) {
      args.push('-xctestrun', this.xctestrunFilePath);
    } else {
      const runnerScheme = (0, _utils.isTvOS)(this.platformName) ? RUNNER_SCHEME_TV : RUNNER_SCHEME_IOS;
      args.push('-project', this.agentPath, '-scheme', runnerScheme);

      if (this.derivedDataPath) {
        args.push('-derivedDataPath', this.derivedDataPath);
      }
    }

    args.push('-destination', `id=${this.device.udid}`);
    const versionMatch = new RegExp(/^(\d+)\.(\d+)/).exec(this.platformVersion);

    if (versionMatch) {
      args.push(`IPHONEOS_DEPLOYMENT_TARGET=${versionMatch[1]}.${versionMatch[2]}`);
    } else {
      _logger.default.warn(`Cannot parse major and minor version numbers from platformVersion "${this.platformVersion}". ` + 'Will build for the default platform instead');
    }

    if (this.realDevice && this.xcodeConfigFile) {
      _logger.default.debug(`Using Xcode configuration file: '${this.xcodeConfigFile}'`);

      args.push('-xcconfig', this.xcodeConfigFile);
    }

    if (!process.env.APPIUM_XCUITEST_TREAT_WARNINGS_AS_ERRORS) {
      args.push('GCC_TREAT_WARNINGS_AS_ERRORS=0');
    }

    args.push('COMPILER_INDEX_STORE_ENABLE=NO');
    return {
      cmd,
      args
    };
  }

  async createSubProcess(buildOnly = false) {
    if (!this.useXctestrunFile && this.realDevice) {
      if (this.keychainPath && this.keychainPassword) {
        await (0, _utils.setRealDeviceSecurity)(this.keychainPath, this.keychainPassword);
      }

      if (this.xcodeOrgId && this.xcodeSigningId && !this.xcodeConfigFile) {
        this.xcodeConfigFile = await (0, _utils.generateXcodeConfigFile)(this.xcodeOrgId, this.xcodeSigningId);
      }
    }

    const {
      cmd,
      args
    } = this.getCommand(buildOnly);

    _logger.default.debug(`Beginning ${buildOnly ? 'build' : 'test'} with command '${cmd} ${args.join(' ')}' ` + `in directory '${this.bootstrapPath}'`);

    const env = Object.assign({}, process.env, {
      USE_PORT: this.wdaRemotePort,
      WDA_PRODUCT_BUNDLE_IDENTIFIER: this.updatedWDABundleId || _constants.WDA_RUNNER_BUNDLE_ID
    });

    if (this.mjpegServerPort) {
      env.MJPEG_SERVER_PORT = this.mjpegServerPort;
    }

    const upgradeTimestamp = await (0, _utils.getWDAUpgradeTimestamp)(this.bootstrapPath);

    if (upgradeTimestamp) {
      env.UPGRADE_TIMESTAMP = upgradeTimestamp;
    }

    const xcodebuild = new _teen_process.SubProcess(cmd, args, {
      cwd: this.bootstrapPath,
      env,
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let logXcodeOutput = !!this.showXcodeLog;
    const logMsg = _lodash.default.isBoolean(this.showXcodeLog) ? `Output from xcodebuild ${this.showXcodeLog ? 'will' : 'will not'} be logged` : 'Output from xcodebuild will only be logged if any errors are present there';

    _logger.default.debug(`${logMsg}. To change this, use 'showXcodeLog' desired capability`);

    xcodebuild.on('output', (stdout, stderr) => {
      let out = stdout || stderr;

      if (out.includes('Writing diagnostic log for test session to')) {
        xcodebuild.logLocation = _lodash.default.first(_lodash.default.remove(out.trim().split('\n'), v => v.startsWith(_path.default.sep)));

        _logger.default.debug(`Log file for xcodebuild test: ${xcodebuild.logLocation}`);
      }

      const ignoreError = IGNORED_ERRORS.some(x => out.includes(x));

      if (this.showXcodeLog !== false && out.includes('Error Domain=') && !ignoreError) {
        logXcodeOutput = true;
        xcodebuild._wda_error_occurred = true;
      }

      if (logXcodeOutput && !ignoreError) {
        for (const line of out.split(_os.EOL)) {
          xcodeLog.error(line);

          if (line) {
            xcodebuild._wda_error_message += `${_os.EOL}${line}`;
          }
        }
      }
    });
    return xcodebuild;
  }

  async start(buildOnly = false) {
    this.xcodebuild = await this.createSubProcess(buildOnly);
    this.xcodebuild._wda_error_message = '';
    return await new _bluebird.default((resolve, reject) => {
      this.xcodebuild.on('exit', async (code, signal) => {
        _logger.default.error(`xcodebuild exited with code '${code}' and signal '${signal}'`);

        if (this.showXcodeLog && this.xcodebuild.logLocation) {
          xcodeLog.error(`Contents of xcodebuild log file '${this.xcodebuild.logLocation}':`);

          try {
            let data = await _appiumSupport.fs.readFile(this.xcodebuild.logLocation, 'utf8');

            for (let line of data.split('\n')) {
              xcodeLog.error(line);
            }
          } catch (err) {
            _logger.default.error(`Unable to access xcodebuild log file: '${err.message}'`);
          }
        }

        this.xcodebuild.processExited = true;

        if (this.xcodebuild._wda_error_occurred || !signal && code !== 0) {
          return reject(new Error(`xcodebuild failed with code ${code}${_os.EOL}` + `xcodebuild error message:${_os.EOL}${this.xcodebuild._wda_error_message}`));
        }

        if (buildOnly) {
          return resolve();
        }
      });
      return (async () => {
        try {
          const timer = new _appiumSupport.timing.Timer().start();
          await this.xcodebuild.start(true);

          if (!buildOnly) {
            let status = await this.waitForStart(timer);
            resolve(status);
          }
        } catch (err) {
          let msg = `Unable to start WebDriverAgent: ${err}`;

          _logger.default.error(msg);

          reject(new Error(msg));
        }
      })();
    });
  }

  async waitForStart(timer) {
    _logger.default.debug(`Waiting up to ${this.launchTimeout}ms for WebDriverAgent to start`);

    let currentStatus = null;

    try {
      let retries = parseInt(this.launchTimeout / 500, 10);
      await (0, _asyncbox.retryInterval)(retries, 1000, async () => {
        if (this.xcodebuild.processExited) {
          return;
        }

        const proxyTimeout = this.noSessionProxy.timeout;
        this.noSessionProxy.timeout = 1000;

        try {
          currentStatus = await this.noSessionProxy.command('/status', 'GET');

          if (currentStatus && currentStatus.ios && currentStatus.ios.ip) {
            this.agentUrl = currentStatus.ios.ip;
          }

          _logger.default.debug(`WebDriverAgent information:`);

          _logger.default.debug(JSON.stringify(currentStatus, null, 2));
        } catch (err) {
          throw new Error(`Unable to connect to running WebDriverAgent: ${err.message}`);
        } finally {
          this.noSessionProxy.timeout = proxyTimeout;
        }
      });

      if (this.xcodebuild.processExited) {
        return currentStatus;
      }

      _logger.default.debug(`WebDriverAgent successfully started after ${timer.getDuration().asMilliSeconds.toFixed(0)}ms`);
    } catch (err) {
      _logger.default.debug(err.message);

      _logger.default.warn(`Getting status of WebDriverAgent on device timed out. Continuing`);
    }

    return currentStatus;
  }

  async quit() {
    await (0, _utils.killProcess)('xcodebuild', this.xcodebuild);
  }

}

exports.XcodeBuild = XcodeBuild;
var _default = XcodeBuild;
exports.default = _default;require('source-map-support').install();


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi94Y29kZWJ1aWxkLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfU0lHTklOR19JRCIsIlBSRUJVSUxEX0RFTEFZIiwiUlVOTkVSX1NDSEVNRV9JT1MiLCJMSUJfU0NIRU1FX0lPUyIsIkVSUk9SX1dSSVRJTkdfQVRUQUNITUVOVCIsIkVSUk9SX0NPUFlJTkdfQVRUQUNITUVOVCIsIklHTk9SRURfRVJST1JTIiwiUlVOTkVSX1NDSEVNRV9UViIsIkxJQl9TQ0hFTUVfVFYiLCJ4Y29kZUxvZyIsImxvZ2dlciIsImdldExvZ2dlciIsIlhjb2RlQnVpbGQiLCJjb25zdHJ1Y3RvciIsInhjb2RlVmVyc2lvbiIsImRldmljZSIsImFyZ3MiLCJyZWFsRGV2aWNlIiwiYWdlbnRQYXRoIiwiYm9vdHN0cmFwUGF0aCIsInBsYXRmb3JtVmVyc2lvbiIsInBsYXRmb3JtTmFtZSIsImlvc1Nka1ZlcnNpb24iLCJzaG93WGNvZGVMb2ciLCJ4Y29kZUNvbmZpZ0ZpbGUiLCJ4Y29kZU9yZ0lkIiwieGNvZGVTaWduaW5nSWQiLCJrZXljaGFpblBhdGgiLCJrZXljaGFpblBhc3N3b3JkIiwicHJlYnVpbGRXREEiLCJ1c2VQcmVidWlsdFdEQSIsInVzZVNpbXBsZUJ1aWxkVGVzdCIsInVzZVhjdGVzdHJ1bkZpbGUiLCJsYXVuY2hUaW1lb3V0Iiwid2RhUmVtb3RlUG9ydCIsInVwZGF0ZWRXREFCdW5kbGVJZCIsImRlcml2ZWREYXRhUGF0aCIsIm1qcGVnU2VydmVyUG9ydCIsInByZWJ1aWxkRGVsYXkiLCJfIiwiaXNOdW1iZXIiLCJhbGxvd1Byb3Zpc2lvbmluZ0RldmljZVJlZ2lzdHJhdGlvbiIsInJlc3VsdEJ1bmRsZVBhdGgiLCJyZXN1bHRCdW5kbGVWZXJzaW9uIiwiaW5pdCIsIm5vU2Vzc2lvblByb3h5IiwiZGV2aXZlSW5mbyIsImlzUmVhbERldmljZSIsInVkaWQiLCJ4Y3Rlc3RydW5GaWxlUGF0aCIsInJldHJpZXZlRGVyaXZlZERhdGFQYXRoIiwiX2Rlcml2ZWREYXRhUGF0aFByb21pc2UiLCJzdGRvdXQiLCJlcnIiLCJsb2ciLCJ3YXJuIiwibWVzc2FnZSIsInBhdHRlcm4iLCJtYXRjaCIsImV4ZWMiLCJ0cnVuY2F0ZSIsImxlbmd0aCIsImRlYnVnIiwicGF0aCIsImRpcm5hbWUiLCJub3JtYWxpemUiLCJyZXNldCIsInByZWJ1aWxkIiwic3RhcnQiLCJ4Y29kZWJ1aWxkIiwiQiIsImRlbGF5IiwiY2xlYW5Qcm9qZWN0IiwidG1wSXNUdk9TIiwibGliU2NoZW1lIiwicnVubmVyU2NoZW1lIiwic2NoZW1lIiwiZ2V0Q29tbWFuZCIsImJ1aWxkT25seSIsImNtZCIsImJ1aWxkQ21kIiwidGVzdENtZCIsInB1c2giLCJ2ZXJzaW9uTWF0Y2giLCJSZWdFeHAiLCJwcm9jZXNzIiwiZW52IiwiQVBQSVVNX1hDVUlURVNUX1RSRUFUX1dBUk5JTkdTX0FTX0VSUk9SUyIsImNyZWF0ZVN1YlByb2Nlc3MiLCJqb2luIiwiT2JqZWN0IiwiYXNzaWduIiwiVVNFX1BPUlQiLCJXREFfUFJPRFVDVF9CVU5ETEVfSURFTlRJRklFUiIsIldEQV9SVU5ORVJfQlVORExFX0lEIiwiTUpQRUdfU0VSVkVSX1BPUlQiLCJ1cGdyYWRlVGltZXN0YW1wIiwiVVBHUkFERV9USU1FU1RBTVAiLCJTdWJQcm9jZXNzIiwiY3dkIiwiZGV0YWNoZWQiLCJzdGRpbyIsImxvZ1hjb2RlT3V0cHV0IiwibG9nTXNnIiwiaXNCb29sZWFuIiwib24iLCJzdGRlcnIiLCJvdXQiLCJpbmNsdWRlcyIsImxvZ0xvY2F0aW9uIiwiZmlyc3QiLCJyZW1vdmUiLCJ0cmltIiwic3BsaXQiLCJ2Iiwic3RhcnRzV2l0aCIsInNlcCIsImlnbm9yZUVycm9yIiwic29tZSIsIngiLCJfd2RhX2Vycm9yX29jY3VycmVkIiwibGluZSIsIkVPTCIsImVycm9yIiwiX3dkYV9lcnJvcl9tZXNzYWdlIiwicmVzb2x2ZSIsInJlamVjdCIsImNvZGUiLCJzaWduYWwiLCJkYXRhIiwiZnMiLCJyZWFkRmlsZSIsInByb2Nlc3NFeGl0ZWQiLCJFcnJvciIsInRpbWVyIiwidGltaW5nIiwiVGltZXIiLCJzdGF0dXMiLCJ3YWl0Rm9yU3RhcnQiLCJtc2ciLCJjdXJyZW50U3RhdHVzIiwicmV0cmllcyIsInBhcnNlSW50IiwicHJveHlUaW1lb3V0IiwidGltZW91dCIsImNvbW1hbmQiLCJpb3MiLCJpcCIsImFnZW50VXJsIiwiSlNPTiIsInN0cmluZ2lmeSIsImdldER1cmF0aW9uIiwiYXNNaWxsaVNlY29uZHMiLCJ0b0ZpeGVkIiwicXVpdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFJQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFHQSxNQUFNQSxrQkFBa0IsR0FBRyxrQkFBM0I7QUFDQSxNQUFNQyxjQUFjLEdBQUcsQ0FBdkI7QUFDQSxNQUFNQyxpQkFBaUIsR0FBRyxzQkFBMUI7QUFDQSxNQUFNQyxjQUFjLEdBQUcsbUJBQXZCO0FBRUEsTUFBTUMsd0JBQXdCLEdBQUcsdUNBQWpDO0FBQ0EsTUFBTUMsd0JBQXdCLEdBQUcsa0NBQWpDO0FBQ0EsTUFBTUMsY0FBYyxHQUFHLENBQ3JCRix3QkFEcUIsRUFFckJDLHdCQUZxQixFQUdyQixxQ0FIcUIsQ0FBdkI7QUFNQSxNQUFNRSxnQkFBZ0IsR0FBRywyQkFBekI7QUFDQSxNQUFNQyxhQUFhLEdBQUcsd0JBQXRCOztBQUVBLE1BQU1DLFFBQVEsR0FBR0Msc0JBQU9DLFNBQVAsQ0FBaUIsT0FBakIsQ0FBakI7O0FBR0EsTUFBTUMsVUFBTixDQUFpQjtBQUNmQyxFQUFBQSxXQUFXLENBQUVDLFlBQUYsRUFBZ0JDLE1BQWhCLEVBQXdCQyxJQUFJLEdBQUcsRUFBL0IsRUFBbUM7QUFDNUMsU0FBS0YsWUFBTCxHQUFvQkEsWUFBcEI7QUFFQSxTQUFLQyxNQUFMLEdBQWNBLE1BQWQ7QUFFQSxTQUFLRSxVQUFMLEdBQWtCRCxJQUFJLENBQUNDLFVBQXZCO0FBRUEsU0FBS0MsU0FBTCxHQUFpQkYsSUFBSSxDQUFDRSxTQUF0QjtBQUNBLFNBQUtD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QThCRCxZQUE5QjtBQUNEO0FBQ0YsT0FuQkssQ0FBTjs7QUFxQkEsVUFBSSxLQUFLMUUsVUFBTCxDQUFnQitELGFBQXBCLEVBQW1DO0FBRWpDLGVBQU9RLGFBQVA7QUFDRDs7QUFFRHRGLHNCQUFJUSxLQUFKLENBQVcsNkNBQTRDd0UsS0FBSyxDQUFDaUIsV0FBTixHQUFvQkMsY0FBcEIsQ0FBbUNDLE9BQW5DLENBQTJDLENBQTNDLENBQThDLElBQXJHO0FBQ0QsS0E3QkQsQ0E2QkUsT0FBT3BHLEdBQVAsRUFBWTtBQUdaQyxzQkFBSVEsS0FBSixDQUFVVCxHQUFHLENBQUNHLE9BQWQ7O0FBQ0FGLHNCQUFJQyxJQUFKLENBQVUsa0VBQVY7QUFDRDs7QUFDRCxXQUFPcUYsYUFBUDtBQUNEOztBQUVTLFFBQUpjLElBQUksR0FBSTtBQUNaLFVBQU0sd0JBQVksWUFBWixFQUEwQixLQUFLckYsVUFBL0IsQ0FBTjtBQUNEOztBQXBYYzs7O2VBd1hGekQsVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJldHJ5SW50ZXJ2YWwgfSBmcm9tICdhc3luY2JveCc7XG5pbXBvcnQgeyBTdWJQcm9jZXNzLCBleGVjIH0gZnJvbSAndGVlbl9wcm9jZXNzJztcbmltcG9ydCB7IGZzLCBsb2dnZXIsIHRpbWluZyB9IGZyb20gJ2FwcGl1bS1zdXBwb3J0JztcbmltcG9ydCBsb2cgZnJvbSAnLi9sb2dnZXInO1xuaW1wb3J0IEIgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHtcbiAgc2V0UmVhbERldmljZVNlY3VyaXR5LCBnZW5lcmF0ZVhjb2RlQ29uZmlnRmlsZSwgc2V0WGN0ZXN0cnVuRmlsZSxcbiAgdXBkYXRlUHJvamVjdEZpbGUsIHJlc2V0UHJvamVjdEZpbGUsIGtpbGxQcm9jZXNzLFxuICBnZXRXREFVcGdyYWRlVGltZXN0YW1wLCBpc1R2T1MgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEVPTCB9IGZyb20gJ29zJztcbmltcG9ydCB7IFdEQV9SVU5ORVJfQlVORExFX0lEIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5cbmNvbnN0IERFRkFVTFRfU0lHTklOR19JRCA9ICdpUGhvbmUgRGV2ZWxvcGVyJztcbmNvbnN0IFBSRUJVSUxEX0RFTEFZID0gMDtcbmNvbnN0IFJVTk5FUl9TQ0hFTUVfSU9TID0gJ1dlYkRyaXZlckFnZW50UnVubmVyJztcbmNvbnN0IExJQl9TQ0hFTUVfSU9TID0gJ1dlYkRyaXZlckFnZW50TGliJztcblxuY29uc3QgRVJST1JfV1JJVElOR19BVFRBQ0hNRU5UID0gJ0Vycm9yIHdyaXRpbmcgYXR0YWNobWVudCBkYXRhIHRvIGZpbGUnO1xuY29uc3QgRVJST1JfQ09QWUlOR19BVFRBQ0hNRU5UID0gJ0Vycm9yIGNvcHlpbmcgdGVzdGluZyBhdHRhY2htZW50JztcbmNvbnN0IElHTk9SRURfRVJST1JTID0gW1xuICBFUlJPUl9XUklUSU5HX0FUVEFDSE1FTlQsXG4gIEVSUk9SX0NPUFlJTkdfQVRUQUNITUVOVCxcbiAgJ0ZhaWxlZCB0byByZW1vdmUgc2NyZWVuc2hvdCBhdCBwYXRoJyxcbl07XG5cbmNvbnN0IFJVTk5FUl9TQ0hFTUVfVFYgPSAnV2ViRHJpdmVyQWdlbnRSdW5uZXJfdHZPUyc7XG5jb25zdCBMSUJfU0NIRU1FX1RWID0gJ1dlYkRyaXZlckFnZW50TGliX3R2T1MnO1xuXG5jb25zdCB4Y29kZUxvZyA9IGxvZ2dlci5nZXRMb2dnZXIoJ1hjb2RlJyk7XG5cblxuY2xhc3MgWGNvZGVCdWlsZCB7XG4gIGNvbnN0cnVjdG9yICh4Y29kZVZlcnNpb24sIGRldmljZSwgYXJncyA9IHt9KSB7XG4gICAgdGhpcy54Y29kZVZlcnNpb24gPSB4Y29kZVZlcnNpb247XG5cbiAgICB0aGlzLmRldmljZSA9IGRldmljZTtcblxuICAgIHRoaXMucmVhbERldmljZSA9IGFyZ3MucmVhbERldmljZTtcblxuICAgIHRoaXMuYWdlbnRQYXRoID0gYXJncy5hZ2VudFBhdGg7XG4gICAgdGhpcy5ib290c3RyYXBQYXRoID0gYXJncy5ib290c3RyYXBQYXRoO1xuXG4gICAgdGhpcy5wbGF0Zm9ybVZlcnNpb24gPSBhcmdzLnBsYXRmb3JtVmVyc2lvbjtcbiAgICB0aGlzLnBsYXRmb3JtTmFtZSA9IGFyZ3MucGxhdGZvcm1OYW1lO1xuICAgIHRoaXMuaW9zU2RrVmVyc2lvbiA9IGFyZ3MuaW9zU2RrVmVyc2lvbjtcblxuICAgIHRoaXMuc2hvd1hjb2RlTG9nID0gYXJncy5zaG93WGNvZGVMb2c7XG5cbiAgICB0aGlzLnhjb2RlQ29uZmlnRmlsZSA9IGFyZ3MueGNvZGVDb25maWdGaWxlO1xuICAgIHRoaXMueGNvZGVPcmdJZCA9IGFyZ3MueGNvZGVPcmdJZDtcbiAgICB0aGlzLnhjb2RlU2lnbmluZ0lkID0gYXJncy54Y29kZVNpZ25pbmdJZCB8fCBERUZBVUxUX1NJR05JTkdfSUQ7XG4gICAgdGhpcy5rZXljaGFpblBhdGggPSBhcmdzLmtleWNoYWluUGF0aDtcbiAgICB0aGlzLmtleWNoYWluUGFzc3dvcmQgPSBhcmdzLmtleWNoYWluUGFzc3dvcmQ7XG5cbiAgICB0aGlzLnByZWJ1aWxkV0RBID0gYXJncy5wcmVidWlsZFdEQTtcbiAgICB0aGlzLnVzZVByZWJ1aWx0V0RBID0gYXJncy51c2VQcmVidWlsdFdEQTtcbiAgICB0aGlzLnVzZVNpbXBsZUJ1aWxkVGVzdCA9IGFyZ3MudXNlU2ltcGxlQnVpbGRUZXN0O1xuXG4gICAgdGhpcy51c2VYY3Rlc3RydW5GaWxlID0gYXJncy51c2VYY3Rlc3RydW5GaWxlO1xuXG4gICAgdGhpcy5sYXVuY2hUaW1lb3V0ID0gYXJncy5sYXVuY2hUaW1lb3V0O1xuXG4gICAgdGhpcy53ZGFSZW1vdGVQb3J0ID0gYXJncy53ZGFSZW1vdGVQb3J0O1xuXG4gICAgdGhpcy51cGRhdGVkV0RBQnVuZGxlSWQgPSBhcmdzLnVwZGF0ZWRXREFCdW5kbGVJZDtcbiAgICB0aGlzLmRlcml2ZWREYXRhUGF0aCA9IGFyZ3MuZGVyaXZlZERhdGFQYXRoO1xuXG4gICAgdGhpcy5tanBlZ1NlcnZlclBvcnQgPSBhcmdzLm1qcGVnU2VydmVyUG9ydDtcblxuICAgIHRoaXMucHJlYnVpbGREZWxheSA9IF8uaXNOdW1iZXIoYXJncy5wcmVidWlsZERlbGF5KSA/IGFyZ3MucHJlYnVpbGREZWxheSA6IFBSRUJVSUxEX0RFTEFZO1xuXG4gICAgdGhpcy5hbGxvd1Byb3Zpc2lvbmluZ0RldmljZVJlZ2lzdHJhdGlvbiA9IGFyZ3MuYWxsb3dQcm92aXNpb25pbmdEZXZpY2VSZWdpc3RyYXRpb247XG5cbiAgICB0aGlzLnJlc3VsdEJ1bmRsZVBhdGggPSBhcmdzLnJlc3VsdEJ1bmRsZVBhdGg7XG4gICAgdGhpcy5yZXN1bHRCdW5kbGVWZXJzaW9uID0gYXJncy5yZXN1bHRCdW5kbGVWZXJzaW9uO1xuICB9XG5cbiAgYXN5bmMgaW5pdCAobm9TZXNzaW9uUHJveHkpIHtcbiAgICB0aGlzLm5vU2Vzc2lvblByb3h5ID0gbm9TZXNzaW9uUHJveHk7XG5cbiAgICBpZiAodGhpcy51c2VYY3Rlc3RydW5GaWxlKSB7XG4gICAgICBjb25zdCBkZXZpdmVJbmZvID0ge1xuICAgICAgICBpc1JlYWxEZXZpY2U6IHRoaXMucmVhbERldmljZSxcbiAgICAgICAgdWRpZDogdGhpcy5kZXZpY2UudWRpZCxcbiAgICAgICAgcGxhdGZvcm1WZXJzaW9uOiB0aGlzLnBsYXRmb3JtVmVyc2lvbixcbiAgICAgICAgcGxhdGZvcm1OYW1lOiB0aGlzLnBsYXRmb3JtTmFtZVxuICAgICAgfTtcbiAgICAgIHRoaXMueGN0ZXN0cnVuRmlsZVBhdGggPSBhd2FpdCBzZXRYY3Rlc3RydW5GaWxlKGRldml2ZUluZm8sIHRoaXMuaW9zU2RrVmVyc2lvbiwgdGhpcy5ib290c3RyYXBQYXRoLCB0aGlzLndkYVJlbW90ZVBvcnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGlmIG5lY2Vzc2FyeSwgdXBkYXRlIHRoZSBidW5kbGVJZCB0byB1c2VyJ3Mgc3BlY2lmaWNhdGlvblxuICAgIGlmICh0aGlzLnJlYWxEZXZpY2UpIHtcbiAgICAgIC8vIEluIGNhc2UgdGhlIHByb2plY3Qgc3RpbGwgaGFzIHRoZSB1c2VyIHNwZWNpZmljIGJ1bmRsZSBJRCwgcmVzZXQgdGhlIHByb2plY3QgZmlsZSBmaXJzdC5cbiAgICAgIC8vIC0gV2UgZG8gdGhpcyByZXNldCBldmVuIGlmIHVwZGF0ZWRXREFCdW5kbGVJZCBpcyBub3Qgc3BlY2lmaWVkLFxuICAgICAgLy8gICBzaW5jZSB0aGUgcHJldmlvdXMgdXBkYXRlZFdEQUJ1bmRsZUlkIHRlc3QgaGFzIGdlbmVyYXRlZCB0aGUgdXNlciBzcGVjaWZpYyBidW5kbGUgSUQgcHJvamVjdCBmaWxlLlxuICAgICAgLy8gLSBXZSBkb24ndCBjYWxsIHJlc2V0UHJvamVjdEZpbGUgZm9yIHNpbXVsYXRvcixcbiAgICAgIC8vICAgc2luY2Ugc2ltdWxhdG9yIHRlc3QgcnVuIHdpbGwgd29yayB3aXRoIGFueSB1c2VyIHNwZWNpZmljIGJ1bmRsZSBJRC5cbiAgICAgIGF3YWl0IHJlc2V0UHJvamVjdEZpbGUodGhpcy5hZ2VudFBhdGgpO1xuICAgICAgaWYgKHRoaXMudXBkYXRlZFdEQUJ1bmRsZUlkKSB7XG4gICAgICAgIGF3YWl0IHVwZGF0ZVByb2plY3RGaWxlKHRoaXMuYWdlbnRQYXRoLCB0aGlzLnVwZGF0ZWRXREFCdW5kbGVJZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcmV0cmlldmVEZXJpdmVkRGF0YVBhdGggKCkge1xuICAgIGlmICh0aGlzLmRlcml2ZWREYXRhUGF0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVyaXZlZERhdGFQYXRoO1xuICAgIH1cblxuICAgIC8vIGF2b2lkIHJhY2UgY29uZGl0aW9uc1xuICAgIGlmICh0aGlzLl9kZXJpdmVkRGF0YVBhdGhQcm9taXNlKSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fZGVyaXZlZERhdGFQYXRoUHJvbWlzZTtcbiAgICB9XG5cbiAgICB0aGlzLl9kZXJpdmVkRGF0YVBhdGhQcm9taXNlID0gKGFzeW5jICgpID0+IHtcbiAgICAgIGxldCBzdGRvdXQ7XG4gICAgICB0cnkge1xuICAgICAgICAoe3N0ZG91dH0gPSBhd2FpdCBleGVjKCd4Y29kZWJ1aWxkJywgWyctcHJvamVjdCcsIHRoaXMuYWdlbnRQYXRoLCAnLXNob3dCdWlsZFNldHRpbmdzJ10pKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBsb2cud2FybihgQ2Fubm90IHJldHJpZXZlIFdEQSBidWlsZCBzZXR0aW5ncy4gT3JpZ2luYWwgZXJyb3I6ICR7ZXJyLm1lc3NhZ2V9YCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcGF0dGVybiA9IC9eXFxzKkJVSUxEX0RJUlxccys9XFxzKyhcXC8uKikvbTtcbiAgICAgIGNvbnN0IG1hdGNoID0gcGF0dGVybi5leGVjKHN0ZG91dCk7XG4gICAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgIGxvZy53YXJuKGBDYW5ub3QgcGFyc2UgV0RBIGJ1aWxkIGRpciBmcm9tICR7Xy50cnVuY2F0ZShzdGRvdXQsIHtsZW5ndGg6IDMwMH0pfWApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsb2cuZGVidWcoYFBhcnNlZCBCVUlMRF9ESVIgY29uZmlndXJhdGlvbiB2YWx1ZTogJyR7bWF0Y2hbMV19J2ApO1xuICAgICAgLy8gRGVyaXZlZCBkYXRhIHJvb3QgaXMgdHdvIGxldmVscyBoaWdoZXIgb3ZlciB0aGUgYnVpbGQgZGlyXG4gICAgICB0aGlzLmRlcml2ZWREYXRhUGF0aCA9IHBhdGguZGlybmFtZShwYXRoLmRpcm5hbWUocGF0aC5ub3JtYWxpemUobWF0Y2hbMV0pKSk7XG4gICAgICBsb2cuZGVidWcoYEdvdCBkZXJpdmVkIGRhdGEgcm9vdDogJyR7dGhpcy5kZXJpdmVkRGF0YVBhdGh9J2ApO1xuICAgICAgcmV0dXJuIHRoaXMuZGVyaXZlZERhdGFQYXRoO1xuICAgIH0pKCk7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX2Rlcml2ZWREYXRhUGF0aFByb21pc2U7XG4gIH1cblxuICBhc3luYyByZXNldCAoKSB7XG4gICAgLy8gaWYgbmVjZXNzYXJ5LCByZXNldCB0aGUgYnVuZGxlSWQgdG8gb3JpZ2luYWwgdmFsdWVcbiAgICBpZiAodGhpcy5yZWFsRGV2aWNlICYmIHRoaXMudXBkYXRlZFdEQUJ1bmRsZUlkKSB7XG4gICAgICBhd2FpdCByZXNldFByb2plY3RGaWxlKHRoaXMuYWdlbnRQYXRoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBwcmVidWlsZCAoKSB7XG4gICAgLy8gZmlyc3QgZG8gYSBidWlsZCBwaGFzZVxuICAgIGxvZy5kZWJ1ZygnUHJlLWJ1aWxkaW5nIFdEQSBiZWZvcmUgbGF1bmNoaW5nIHRlc3QnKTtcbiAgICB0aGlzLnVzZVByZWJ1aWx0V0RBID0gdHJ1ZTtcbiAgICBhd2FpdCB0aGlzLnN0YXJ0KHRydWUpO1xuXG4gICAgdGhpcy54Y29kZWJ1aWxkID0gbnVsbDtcblxuICAgIC8vIHBhdXNlIGEgbW9tZW50XG4gICAgYXdhaXQgQi5kZWxheSh0aGlzLnByZWJ1aWxkRGVsYXkpO1xuICB9XG5cbiAgYXN5bmMgY2xlYW5Qcm9qZWN0ICgpIHtcbiAgICBjb25zdCB0bXBJc1R2T1MgPSBpc1R2T1ModGhpcy5wbGF0Zm9ybU5hbWUpO1xuICAgIGNvbnN0IGxpYlNjaGVtZSA9IHRtcElzVHZPUyA/IExJQl9TQ0hFTUVfVFYgOiBMSUJfU0NIRU1FX0lPUztcbiAgICBjb25zdCBydW5uZXJTY2hlbWUgPSB0bXBJc1R2T1MgPyBSVU5ORVJfU0NIRU1FX1RWIDogUlVOTkVSX1NDSEVNRV9JT1M7XG5cbiAgICBmb3IgKGNvbnN0IHNjaGVtZSBvZiBbbGliU2NoZW1lLCBydW5uZXJTY2hlbWVdKSB7XG4gICAgICBsb2cuZGVidWcoYENsZWFuaW5nIHRoZSBwcm9qZWN0IHNjaGVtZSAnJHtzY2hlbWV9JyB0byBtYWtlIHN1cmUgdGhlcmUgYXJlIG5vIGxlZnRvdmVycyBmcm9tIHByZXZpb3VzIGluc3RhbGxzYCk7XG4gICAgICBhd2FpdCBleGVjKCd4Y29kZWJ1aWxkJywgW1xuICAgICAgICAnY2xlYW4nLFxuICAgICAgICAnLXByb2plY3QnLCB0aGlzLmFnZW50UGF0aCxcbiAgICAgICAgJy1zY2hlbWUnLCBzY2hlbWUsXG4gICAgICBdKTtcbiAgICB9XG4gIH1cblxuICBnZXRDb21tYW5kIChidWlsZE9ubHkgPSBmYWxzZSkge1xuICAgIGxldCBjbWQgPSAneGNvZGVidWlsZCc7XG4gICAgbGV0IGFyZ3M7XG5cbiAgICAvLyBmaWd1cmUgb3V0IHRoZSB0YXJnZXRzIGZvciB4Y29kZWJ1aWxkXG4gICAgY29uc3QgW2J1aWxkQ21kLCB0ZXN0Q21kXSA9IHRoaXMudXNlU2ltcGxlQnVpbGRUZXN0ID8gWydidWlsZCcsICd0ZXN0J10gOiBbJ2J1aWxkLWZvci10ZXN0aW5nJywgJ3Rlc3Qtd2l0aG91dC1idWlsZGluZyddO1xuICAgIGlmIChidWlsZE9ubHkpIHtcbiAgICAgIGFyZ3MgPSBbYnVpbGRDbWRdO1xuICAgIH0gZWxzZSBpZiAodGhpcy51c2VQcmVidWlsdFdEQSB8fCB0aGlzLnVzZVhjdGVzdHJ1bkZpbGUpIHtcbiAgICAgIGFyZ3MgPSBbdGVzdENtZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGFyZ3MgPSBbYnVpbGRDbWQsIHRlc3RDbWRdO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFsbG93UHJvdmlzaW9uaW5nRGV2aWNlUmVnaXN0cmF0aW9uKSB7XG4gICAgICAvLyBUbyAtYWxsb3dQcm92aXNpb25pbmdEZXZpY2VSZWdpc3RyYXRpb24gZmxhZyB0YWtlcyBlZmZlY3QsIC1hbGxvd1Byb3Zpc2lvbmluZ1VwZGF0ZXMgbmVlZHMgdG8gYmUgcGFzc2VkIGFzIHdlbGwuXG4gICAgICBhcmdzLnB1c2goJy1hbGxvd1Byb3Zpc2lvbmluZ1VwZGF0ZXMnLCAnLWFsbG93UHJvdmlzaW9uaW5nRGV2aWNlUmVnaXN0cmF0aW9uJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVzdWx0QnVuZGxlUGF0aCkge1xuICAgICAgYXJncy5wdXNoKCctcmVzdWx0QnVuZGxlUGF0aCcsIHRoaXMucmVzdWx0QnVuZGxlUGF0aCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVzdWx0QnVuZGxlVmVyc2lvbikge1xuICAgICAgYXJncy5wdXNoKCctcmVzdWx0QnVuZGxlVmVyc2lvbicsIHRoaXMucmVzdWx0QnVuZGxlVmVyc2lvbik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudXNlWGN0ZXN0cnVuRmlsZSkge1xuICAgICAgYXJncy5wdXNoKCcteGN0ZXN0cnVuJywgdGhpcy54Y3Rlc3RydW5GaWxlUGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJ1bm5lclNjaGVtZSA9IGlzVHZPUyh0aGlzLnBsYXRmb3JtTmFtZSkgPyBSVU5ORVJfU0NIRU1FX1RWIDogUlVOTkVSX1NDSEVNRV9JT1M7XG4gICAgICBhcmdzLnB1c2goJy1wcm9qZWN0JywgdGhpcy5hZ2VudFBhdGgsICctc2NoZW1lJywgcnVubmVyU2NoZW1lKTtcbiAgICAgIGlmICh0aGlzLmRlcml2ZWREYXRhUGF0aCkge1xuICAgICAgICBhcmdzLnB1c2goJy1kZXJpdmVkRGF0YVBhdGgnLCB0aGlzLmRlcml2ZWREYXRhUGF0aCk7XG4gICAgICB9XG4gICAgfVxuICAgIGFyZ3MucHVzaCgnLWRlc3RpbmF0aW9uJywgYGlkPSR7dGhpcy5kZXZpY2UudWRpZH1gKTtcblxuICAgIGNvbnN0IHZlcnNpb25NYXRjaCA9IG5ldyBSZWdFeHAoL14oXFxkKylcXC4oXFxkKykvKS5leGVjKHRoaXMucGxhdGZvcm1WZXJzaW9uKTtcbiAgICBpZiAodmVyc2lvbk1hdGNoKSB7XG4gICAgICBhcmdzLnB1c2goYElQSE9ORU9TX0RFUExPWU1FTlRfVEFSR0VUPSR7dmVyc2lvbk1hdGNoWzFdfS4ke3ZlcnNpb25NYXRjaFsyXX1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLndhcm4oYENhbm5vdCBwYXJzZSBtYWpvciBhbmQgbWlub3IgdmVyc2lvbiBudW1iZXJzIGZyb20gcGxhdGZvcm1WZXJzaW9uIFwiJHt0aGlzLnBsYXRmb3JtVmVyc2lvbn1cIi4gYCArXG4gICAgICAgICdXaWxsIGJ1aWxkIGZvciB0aGUgZGVmYXVsdCBwbGF0Zm9ybSBpbnN0ZWFkJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVhbERldmljZSAmJiB0aGlzLnhjb2RlQ29uZmlnRmlsZSkge1xuICAgICAgbG9nLmRlYnVnKGBVc2luZyBYY29kZSBjb25maWd1cmF0aW9uIGZpbGU6ICcke3RoaXMueGNvZGVDb25maWdGaWxlfSdgKTtcbiAgICAgIGFyZ3MucHVzaCgnLXhjY29uZmlnJywgdGhpcy54Y29kZUNvbmZpZ0ZpbGUpO1xuICAgIH1cblxuICAgIGlmICghcHJvY2Vzcy5lbnYuQVBQSVVNX1hDVUlURVNUX1RSRUFUX1dBUk5JTkdTX0FTX0VSUk9SUykge1xuICAgICAgLy8gVGhpcyBzb21ldGltZXMgaGVscHMgdG8gc3Vydml2ZSBYY29kZSB1cGRhdGVzXG4gICAgICBhcmdzLnB1c2goJ0dDQ19UUkVBVF9XQVJOSU5HU19BU19FUlJPUlM9MCcpO1xuICAgIH1cblxuICAgIC8vIEJlbG93IG9wdGlvbiBzbGlnaHRseSByZWR1Y2VzIGJ1aWxkIHRpbWUgaW4gZGVidWcgYnVpbGRcbiAgICAvLyB3aXRoIHByZXZlbnRpbmcgdG8gZ2VuZXJhdGUgYC9JbmRleC9EYXRhU3RvcmVgIHdoaWNoIGlzIHVzZWQgYnkgZGV2ZWxvcG1lbnRcbiAgICBhcmdzLnB1c2goJ0NPTVBJTEVSX0lOREVYX1NUT1JFX0VOQUJMRT1OTycpO1xuXG4gICAgcmV0dXJuIHtjbWQsIGFyZ3N9O1xuICB9XG5cbiAgYXN5bmMgY3JlYXRlU3ViUHJvY2VzcyAoYnVpbGRPbmx5ID0gZmFsc2UpIHtcbiAgICBpZiAoIXRoaXMudXNlWGN0ZXN0cnVuRmlsZSAmJiB0aGlzLnJlYWxEZXZpY2UpIHtcbiAgICAgIGlmICh0aGlzLmtleWNoYWluUGF0aCAmJiB0aGlzLmtleWNoYWluUGFzc3dvcmQpIHtcbiAgICAgICAgYXdhaXQgc2V0UmVhbERldmljZVNlY3VyaXR5KHRoaXMua2V5Y2hhaW5QYXRoLCB0aGlzLmtleWNoYWluUGFzc3dvcmQpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMueGNvZGVPcmdJZCAmJiB0aGlzLnhjb2RlU2lnbmluZ0lkICYmICF0aGlzLnhjb2RlQ29uZmlnRmlsZSkge1xuICAgICAgICB0aGlzLnhjb2RlQ29uZmlnRmlsZSA9IGF3YWl0IGdlbmVyYXRlWGNvZGVDb25maWdGaWxlKHRoaXMueGNvZGVPcmdJZCwgdGhpcy54Y29kZVNpZ25pbmdJZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qge2NtZCwgYXJnc30gPSB0aGlzLmdldENvbW1hbmQoYnVpbGRPbmx5KTtcbiAgICBsb2cuZGVidWcoYEJlZ2lubmluZyAke2J1aWxkT25seSA/ICdidWlsZCcgOiAndGVzdCd9IHdpdGggY29tbWFuZCAnJHtjbWR9ICR7YXJncy5qb2luKCcgJyl9JyBgICtcbiAgICAgICAgICAgICAgYGluIGRpcmVjdG9yeSAnJHt0aGlzLmJvb3RzdHJhcFBhdGh9J2ApO1xuICAgIGNvbnN0IGVudiA9IE9iamVjdC5hc3NpZ24oe30sIHByb2Nlc3MuZW52LCB7XG4gICAgICBVU0VfUE9SVDogdGhpcy53ZGFSZW1vdGVQb3J0LFxuICAgICAgV0RBX1BST0RVQ1RfQlVORExFX0lERU5USUZJRVI6IHRoaXMudXBkYXRlZFdEQUJ1bmRsZUlkIHx8IFdEQV9SVU5ORVJfQlVORExFX0lELFxuICAgIH0pO1xuICAgIGlmICh0aGlzLm1qcGVnU2VydmVyUG9ydCkge1xuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FwcGl1bS9XZWJEcml2ZXJBZ2VudC9wdWxsLzEwNVxuICAgICAgZW52Lk1KUEVHX1NFUlZFUl9QT1JUID0gdGhpcy5tanBlZ1NlcnZlclBvcnQ7XG4gICAgfVxuICAgIGNvbnN0IHVwZ3JhZGVUaW1lc3RhbXAgPSBhd2FpdCBnZXRXREFVcGdyYWRlVGltZXN0YW1wKHRoaXMuYm9vdHN0cmFwUGF0aCk7XG4gICAgaWYgKHVwZ3JhZGVUaW1lc3RhbXApIHtcbiAgICAgIGVudi5VUEdSQURFX1RJTUVTVEFNUCA9IHVwZ3JhZGVUaW1lc3RhbXA7XG4gICAgfVxuICAgIGNvbnN0IHhjb2RlYnVpbGQgPSBuZXcgU3ViUHJvY2VzcyhjbWQsIGFyZ3MsIHtcbiAgICAgIGN3ZDogdGhpcy5ib290c3RyYXBQYXRoLFxuICAgICAgZW52LFxuICAgICAgZGV0YWNoZWQ6IHRydWUsXG4gICAgICBzdGRpbzogWydpZ25vcmUnLCAncGlwZScsICdwaXBlJ10sXG4gICAgfSk7XG5cbiAgICBsZXQgbG9nWGNvZGVPdXRwdXQgPSAhIXRoaXMuc2hvd1hjb2RlTG9nO1xuICAgIGNvbnN0IGxvZ01zZyA9IF8uaXNCb29sZWFuKHRoaXMuc2hvd1hjb2RlTG9nKVxuICAgICAgPyBgT3V0cHV0IGZyb20geGNvZGVidWlsZCAke3RoaXMuc2hvd1hjb2RlTG9nID8gJ3dpbGwnIDogJ3dpbGwgbm90J30gYmUgbG9nZ2VkYFxuICAgICAgOiAnT3V0cHV0IGZyb20geGNvZGVidWlsZCB3aWxsIG9ubHkgYmUgbG9nZ2VkIGlmIGFueSBlcnJvcnMgYXJlIHByZXNlbnQgdGhlcmUnO1xuICAgIGxvZy5kZWJ1ZyhgJHtsb2dNc2d9LiBUbyBjaGFuZ2UgdGhpcywgdXNlICdzaG93WGNvZGVMb2cnIGRlc2lyZWQgY2FwYWJpbGl0eWApO1xuICAgIHhjb2RlYnVpbGQub24oJ291dHB1dCcsIChzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgbGV0IG91dCA9IHN0ZG91dCB8fCBzdGRlcnI7XG4gICAgICAvLyB3ZSB3YW50IHRvIHB1bGwgb3V0IHRoZSBsb2cgZmlsZSB0aGF0IGlzIGNyZWF0ZWQsIGFuZCBoaWdobGlnaHQgaXRcbiAgICAgIC8vIGZvciBkaWFnbm9zdGljIHB1cnBvc2VzXG4gICAgICBpZiAob3V0LmluY2x1ZGVzKCdXcml0aW5nIGRpYWdub3N0aWMgbG9nIGZvciB0ZXN0IHNlc3Npb24gdG8nKSkge1xuICAgICAgICAvLyBwdWxsIG91dCB0aGUgZmlyc3QgbGluZSB0aGF0IGJlZ2lucyB3aXRoIHRoZSBwYXRoIHNlcGFyYXRvclxuICAgICAgICAvLyB3aGljaCAqc2hvdWxkKiBiZSB0aGUgbGluZSBpbmRpY2F0aW5nIHRoZSBsb2cgZmlsZSBnZW5lcmF0ZWRcbiAgICAgICAgeGNvZGVidWlsZC5sb2dMb2NhdGlvbiA9IF8uZmlyc3QoXy5yZW1vdmUob3V0LnRyaW0oKS5zcGxpdCgnXFxuJyksICh2KSA9PiB2LnN0YXJ0c1dpdGgocGF0aC5zZXApKSk7XG4gICAgICAgIGxvZy5kZWJ1ZyhgTG9nIGZpbGUgZm9yIHhjb2RlYnVpbGQgdGVzdDogJHt4Y29kZWJ1aWxkLmxvZ0xvY2F0aW9ufWApO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiB3ZSBoYXZlIGFuIGVycm9yIHdlIHdhbnQgdG8gb3V0cHV0IHRoZSBsb2dzXG4gICAgICAvLyBvdGhlcndpc2UgdGhlIGZhaWx1cmUgaXMgaW5zY3J1dGlibGVcbiAgICAgIC8vIGJ1dCBkbyBub3QgbG9nIHBlcm1pc3Npb24gZXJyb3JzIGZyb20gdHJ5aW5nIHRvIHdyaXRlIHRvIGF0dGFjaG1lbnRzIGZvbGRlclxuICAgICAgY29uc3QgaWdub3JlRXJyb3IgPSBJR05PUkVEX0VSUk9SUy5zb21lKCh4KSA9PiBvdXQuaW5jbHVkZXMoeCkpO1xuICAgICAgaWYgKHRoaXMuc2hvd1hjb2RlTG9nICE9PSBmYWxzZSAmJiBvdXQuaW5jbHVkZXMoJ0Vycm9yIERvbWFpbj0nKSAmJiAhaWdub3JlRXJyb3IpIHtcbiAgICAgICAgbG9nWGNvZGVPdXRwdXQgPSB0cnVlO1xuXG4gICAgICAgIC8vIHRlcnJpYmxlIGhhY2sgdG8gaGFuZGxlIGNhc2Ugd2hlcmUgeGNvZGUgcmV0dXJuIDAgYnV0IGlzIGZhaWxpbmdcbiAgICAgICAgeGNvZGVidWlsZC5fd2RhX2Vycm9yX29jY3VycmVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gZG8gbm90IGxvZyBwZXJtaXNzaW9uIGVycm9ycyBmcm9tIHRyeWluZyB0byB3cml0ZSB0byBhdHRhY2htZW50cyBmb2xkZXJcbiAgICAgIGlmIChsb2dYY29kZU91dHB1dCAmJiAhaWdub3JlRXJyb3IpIHtcbiAgICAgICAgZm9yIChjb25zdCBsaW5lIG9mIG91dC5zcGxpdChFT0wpKSB7XG4gICAgICAgICAgeGNvZGVMb2cuZXJyb3IobGluZSk7XG4gICAgICAgICAgaWYgKGxpbmUpIHtcbiAgICAgICAgICAgIHhjb2RlYnVpbGQuX3dkYV9lcnJvcl9tZXNzYWdlICs9IGAke0VPTH0ke2xpbmV9YDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB4Y29kZWJ1aWxkO1xuICB9XG5cbiAgYXN5bmMgc3RhcnQgKGJ1aWxkT25seSA9IGZhbHNlKSB7XG4gICAgdGhpcy54Y29kZWJ1aWxkID0gYXdhaXQgdGhpcy5jcmVhdGVTdWJQcm9jZXNzKGJ1aWxkT25seSk7XG4gICAgLy8gU3RvcmUgeGNvZGVidWlsZCBtZXNzYWdlXG4gICAgdGhpcy54Y29kZWJ1aWxkLl93ZGFfZXJyb3JfbWVzc2FnZSA9ICcnO1xuXG4gICAgLy8gd3JhcCB0aGUgc3RhcnQgcHJvY2VkdXJlIGluIGEgcHJvbWlzZSBzbyB0aGF0IHdlIGNhbiBjYXRjaCwgYW5kIHJlcG9ydCxcbiAgICAvLyBhbnkgc3RhcnR1cCBlcnJvcnMgdGhhdCBhcmUgdGhyb3duIGFzIGV2ZW50c1xuICAgIHJldHVybiBhd2FpdCBuZXcgQigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnhjb2RlYnVpbGQub24oJ2V4aXQnLCBhc3luYyAoY29kZSwgc2lnbmFsKSA9PiB7XG4gICAgICAgIGxvZy5lcnJvcihgeGNvZGVidWlsZCBleGl0ZWQgd2l0aCBjb2RlICcke2NvZGV9JyBhbmQgc2lnbmFsICcke3NpZ25hbH0nYCk7XG4gICAgICAgIC8vIHByaW50IG91dCB0aGUgeGNvZGVidWlsZCBmaWxlIGlmIHVzZXJzIGhhdmUgYXNrZWQgZm9yIGl0XG4gICAgICAgIGlmICh0aGlzLnNob3dYY29kZUxvZyAmJiB0aGlzLnhjb2RlYnVpbGQubG9nTG9jYXRpb24pIHtcbiAgICAgICAgICB4Y29kZUxvZy5lcnJvcihgQ29udGVudHMgb2YgeGNvZGVidWlsZCBsb2cgZmlsZSAnJHt0aGlzLnhjb2RlYnVpbGQubG9nTG9jYXRpb259JzpgKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCBmcy5yZWFkRmlsZSh0aGlzLnhjb2RlYnVpbGQubG9nTG9jYXRpb24sICd1dGY4Jyk7XG4gICAgICAgICAgICBmb3IgKGxldCBsaW5lIG9mIGRhdGEuc3BsaXQoJ1xcbicpKSB7XG4gICAgICAgICAgICAgIHhjb2RlTG9nLmVycm9yKGxpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nLmVycm9yKGBVbmFibGUgdG8gYWNjZXNzIHhjb2RlYnVpbGQgbG9nIGZpbGU6ICcke2Vyci5tZXNzYWdlfSdgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy54Y29kZWJ1aWxkLnByb2Nlc3NFeGl0ZWQgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy54Y29kZWJ1aWxkLl93ZGFfZXJyb3Jfb2NjdXJyZWQgfHwgKCFzaWduYWwgJiYgY29kZSAhPT0gMCkpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihgeGNvZGVidWlsZCBmYWlsZWQgd2l0aCBjb2RlICR7Y29kZX0ke0VPTH1gICtcbiAgICAgICAgICAgIGB4Y29kZWJ1aWxkIGVycm9yIG1lc3NhZ2U6JHtFT0x9JHt0aGlzLnhjb2RlYnVpbGQuX3dkYV9lcnJvcl9tZXNzYWdlfWApKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpbiB0aGUgY2FzZSBvZiBqdXN0IGJ1aWxkaW5nLCB0aGUgcHJvY2VzcyB3aWxsIGV4aXQgYW5kIHRoYXQgaXMgb3VyIGZpbmlzaFxuICAgICAgICBpZiAoYnVpbGRPbmx5KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiAoYXN5bmMgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHRpbWVyID0gbmV3IHRpbWluZy5UaW1lcigpLnN0YXJ0KCk7XG4gICAgICAgICAgYXdhaXQgdGhpcy54Y29kZWJ1aWxkLnN0YXJ0KHRydWUpO1xuICAgICAgICAgIGlmICghYnVpbGRPbmx5KSB7XG4gICAgICAgICAgICBsZXQgc3RhdHVzID0gYXdhaXQgdGhpcy53YWl0Rm9yU3RhcnQodGltZXIpO1xuICAgICAgICAgICAgcmVzb2x2ZShzdGF0dXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgbGV0IG1zZyA9IGBVbmFibGUgdG8gc3RhcnQgV2ViRHJpdmVyQWdlbnQ6ICR7ZXJyfWA7XG4gICAgICAgICAgbG9nLmVycm9yKG1zZyk7XG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihtc2cpKTtcbiAgICAgICAgfVxuICAgICAgfSkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHdhaXRGb3JTdGFydCAodGltZXIpIHtcbiAgICAvLyB0cnkgdG8gY29ubmVjdCBvbmNlIGV2ZXJ5IDAuNSBzZWNvbmRzLCB1bnRpbCBgbGF1bmNoVGltZW91dGAgaXMgdXBcbiAgICBsb2cuZGVidWcoYFdhaXRpbmcgdXAgdG8gJHt0aGlzLmxhdW5jaFRpbWVvdXR9bXMgZm9yIFdlYkRyaXZlckFnZW50IHRvIHN0YXJ0YCk7XG4gICAgbGV0IGN1cnJlbnRTdGF0dXMgPSBudWxsO1xuICAgIHRyeSB7XG4gICAgICBsZXQgcmV0cmllcyA9IHBhcnNlSW50KHRoaXMubGF1bmNoVGltZW91dCAvIDUwMCwgMTApO1xuICAgICAgYXdhaXQgcmV0cnlJbnRlcnZhbChyZXRyaWVzLCAxMDAwLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnhjb2RlYnVpbGQucHJvY2Vzc0V4aXRlZCkge1xuICAgICAgICAgIC8vIHRoZXJlIGhhcyBiZWVuIGFuIGVycm9yIGVsc2V3aGVyZSBhbmQgd2UgbmVlZCB0byBzaG9ydC1jaXJjdWl0XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByb3h5VGltZW91dCA9IHRoaXMubm9TZXNzaW9uUHJveHkudGltZW91dDtcbiAgICAgICAgdGhpcy5ub1Nlc3Npb25Qcm94eS50aW1lb3V0ID0gMTAwMDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjdXJyZW50U3RhdHVzID0gYXdhaXQgdGhpcy5ub1Nlc3Npb25Qcm94eS5jb21tYW5kKCcvc3RhdHVzJywgJ0dFVCcpO1xuICAgICAgICAgIGlmIChjdXJyZW50U3RhdHVzICYmIGN1cnJlbnRTdGF0dXMuaW9zICYmIGN1cnJlbnRTdGF0dXMuaW9zLmlwKSB7XG4gICAgICAgICAgICB0aGlzLmFnZW50VXJsID0gY3VycmVudFN0YXR1cy5pb3MuaXA7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxvZy5kZWJ1ZyhgV2ViRHJpdmVyQWdlbnQgaW5mb3JtYXRpb246YCk7XG4gICAgICAgICAgbG9nLmRlYnVnKEpTT04uc3RyaW5naWZ5KGN1cnJlbnRTdGF0dXMsIG51bGwsIDIpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gY29ubmVjdCB0byBydW5uaW5nIFdlYkRyaXZlckFnZW50OiAke2Vyci5tZXNzYWdlfWApO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIHRoaXMubm9TZXNzaW9uUHJveHkudGltZW91dCA9IHByb3h5VGltZW91dDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLnhjb2RlYnVpbGQucHJvY2Vzc0V4aXRlZCkge1xuICAgICAgICAvLyB0aGVyZSBoYXMgYmVlbiBhbiBlcnJvciBlbHNld2hlcmUgYW5kIHdlIG5lZWQgdG8gc2hvcnQtY2lyY3VpdFxuICAgICAgICByZXR1cm4gY3VycmVudFN0YXR1cztcbiAgICAgIH1cblxuICAgICAgbG9nLmRlYnVnKGBXZWJEcml2ZXJBZ2VudCBzdWNjZXNzZnVsbHkgc3RhcnRlZCBhZnRlciAke3RpbWVyLmdldER1cmF0aW9uKCkuYXNNaWxsaVNlY29uZHMudG9GaXhlZCgwKX1tc2ApO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gYXQgdGhpcyBwb2ludCwgaWYgd2UgaGF2ZSBub3QgaGFkIGFueSBlcnJvcnMgZnJvbSB4Y29kZSBpdHNlbGYgKHJlcG9ydGVkXG4gICAgICAvLyBlbHNld2hlcmUpLCB3ZSBjYW4gbGV0IHRoaXMgZ28gdGhyb3VnaCBhbmQgdHJ5IHRvIGNyZWF0ZSB0aGUgc2Vzc2lvblxuICAgICAgbG9nLmRlYnVnKGVyci5tZXNzYWdlKTtcbiAgICAgIGxvZy53YXJuKGBHZXR0aW5nIHN0YXR1cyBvZiBXZWJEcml2ZXJBZ2VudCBvbiBkZXZpY2UgdGltZWQgb3V0LiBDb250aW51aW5nYCk7XG4gICAgfVxuICAgIHJldHVybiBjdXJyZW50U3RhdHVzO1xuICB9XG5cbiAgYXN5bmMgcXVpdCAoKSB7XG4gICAgYXdhaXQga2lsbFByb2Nlc3MoJ3hjb2RlYnVpbGQnLCB0aGlzLnhjb2RlYnVpbGQpO1xuICB9XG59XG5cbmV4cG9ydCB7IFhjb2RlQnVpbGQgfTtcbmV4cG9ydCBkZWZhdWx0IFhjb2RlQnVpbGQ7XG4iXSwiZmlsZSI6ImxpYi94Y29kZWJ1aWxkLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uIn0=
