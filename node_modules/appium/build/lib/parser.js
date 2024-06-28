"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.getDefaultArgs = getDefaultArgs;
exports.getParser = getParser;

require("source-map-support/register");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _lodash = _interopRequireDefault(require("lodash"));

var _argparse = require("argparse");

var _utils = require("./utils");

var _appiumBaseDriver = require("appium-base-driver");

var _argsparseActions = require("./argsparse-actions");

const args = [[['--shell'], {
  required: false,
  default: false,
  action: 'store_true',
  help: 'Enter REPL mode',
  dest: 'shell'
}], [['--allow-cors'], {
  required: false,
  default: false,
  action: 'store_true',
  help: 'Whether the Appium server should allow web browser connections from any host',
  dest: 'allowCors'
}], [['--reboot'], {
  default: false,
  dest: 'reboot',
  action: 'store_true',
  required: false,
  help: '(Android-only) reboot emulator after each session and kill it at the end'
}], [['--ipa'], {
  required: false,
  default: null,
  help: '(IOS-only) abs path to compiled .ipa file',
  dest: 'ipa'
}], [['-a', '--address'], {
  default: '0.0.0.0',
  required: false,
  help: 'IP Address to listen on',
  dest: 'address'
}], [['-p', '--port'], {
  default: 4723,
  required: false,
  type: 'int',
  help: 'port to listen on',
  dest: 'port'
}], [['-pa', '--base-path'], {
  required: false,
  default: _appiumBaseDriver.DEFAULT_BASE_PATH,
  dest: 'basePath',
  help: 'Base path to use as the prefix for all webdriver routes running' + 'on this server'
}], [['-ka', '--keep-alive-timeout'], {
  required: false,
  default: null,
  dest: 'keepAliveTimeout',
  type: 'int',
  help: 'Number of seconds the Appium server should apply as both the keep-alive timeout ' + 'and the connection timeout for all requests. Defaults to 600 (10 minutes).'
}], [['-ca', '--callback-address'], {
  required: false,
  dest: 'callbackAddress',
  default: null,
  help: 'callback IP Address (default: same as --address)'
}], [['-cp', '--callback-port'], {
  required: false,
  dest: 'callbackPort',
  default: null,
  type: 'int',
  help: 'callback port (default: same as port)'
}], [['-bp', '--bootstrap-port'], {
  default: 4724,
  dest: 'bootstrapPort',
  required: false,
  type: 'int',
  help: '(Android-only) port to use on device to talk to Appium'
}], [['-r', '--backend-retries'], {
  default: 3,
  dest: 'backendRetries',
  required: false,
  type: 'int',
  help: '(iOS-only) How many times to retry launching Instruments ' + 'before saying it crashed or timed out'
}], [['--session-override'], {
  default: false,
  dest: 'sessionOverride',
  action: 'store_true',
  required: false,
  help: 'Enables session override (clobbering)'
}], [['-l', '--pre-launch'], {
  default: false,
  dest: 'launch',
  action: 'store_true',
  required: false,
  help: 'Pre-launch the application before allowing the first session ' + '(Requires --app and, for Android, --app-pkg and --app-activity)'
}], [['-g', '--log'], {
  default: null,
  dest: 'logFile',
  required: false,
  help: 'Also send log output to this file'
}], [['--log-level'], {
  choices: ['info', 'info:debug', 'info:info', 'info:warn', 'info:error', 'warn', 'warn:debug', 'warn:info', 'warn:warn', 'warn:error', 'error', 'error:debug', 'error:info', 'error:warn', 'error:error', 'debug', 'debug:debug', 'debug:info', 'debug:warn', 'debug:error'],
  default: 'debug',
  dest: 'loglevel',
  required: false,
  help: 'log level; default (console[:file]): debug[:debug]'
}], [['--log-timestamp'], {
  default: false,
  required: false,
  help: 'Show timestamps in console output',
  action: 'store_true',
  dest: 'logTimestamp'
}], [['--local-timezone'], {
  default: false,
  required: false,
  help: 'Use local timezone for timestamps',
  action: 'store_true',
  dest: 'localTimezone'
}], [['--log-no-colors'], {
  default: false,
  required: false,
  help: 'Do not use colors in console output',
  action: 'store_true',
  dest: 'logNoColors'
}], [['-G', '--webhook'], {
  default: null,
  required: false,
  dest: 'webhook',
  help: 'Also send log output to this HTTP listener, for example localhost:9876'
}], [['--safari'], {
  default: false,
  action: 'store_true',
  dest: 'safari',
  required: false,
  help: '(IOS-Only) Use the safari app'
}], [['--default-device', '-dd'], {
  dest: 'defaultDevice',
  default: false,
  action: 'store_true',
  required: false,
  help: '(IOS-Simulator-only) use the default simulator that instruments ' + 'launches on its own'
}], [['--force-iphone'], {
  default: false,
  dest: 'forceIphone',
  action: 'store_true',
  required: false,
  help: '(IOS-only) Use the iPhone Simulator no matter what the app wants'
}], [['--force-ipad'], {
  default: false,
  dest: 'forceIpad',
  action: 'store_true',
  required: false,
  help: '(IOS-only) Use the iPad Simulator no matter what the app wants'
}], [['--tracetemplate'], {
  default: null,
  dest: 'automationTraceTemplatePath',
  required: false,
  help: '(IOS-only) .tracetemplate file to use with Instruments'
}], [['--instruments'], {
  default: null,
  dest: 'instrumentsPath',
  required: false,
  help: '(IOS-only) path to instruments binary'
}], [['--nodeconfig'], {
  required: false,
  default: null,
  dest: 'nodeconfig',
  help: 'Configuration JSON file to register appium with selenium grid'
}], [['-ra', '--robot-address'], {
  default: '0.0.0.0',
  dest: 'robotAddress',
  required: false,
  help: 'IP Address of robot'
}], [['-rp', '--robot-port'], {
  default: -1,
  dest: 'robotPort',
  required: false,
  type: 'int',
  help: 'port for robot'
}], [['--chromedriver-executable'], {
  default: null,
  dest: 'chromedriverExecutable',
  required: false,
  help: 'ChromeDriver executable full path'
}], [['--show-config'], {
  default: false,
  dest: 'showConfig',
  action: 'store_true',
  required: false,
  help: 'Show info about the appium server configuration and exit'
}], [['--no-perms-check'], {
  default: false,
  dest: 'noPermsCheck',
  action: 'store_true',
  required: false,
  help: 'Bypass Appium\'s checks to ensure we can read/write necessary files'
}], [['--strict-caps'], {
  default: false,
  dest: 'enforceStrictCaps',
  action: 'store_true',
  required: false,
  help: 'Cause sessions to fail if desired caps are sent in that Appium ' + 'does not recognize as valid for the selected device'
}], [['--isolate-sim-device'], {
  default: false,
  dest: 'isolateSimDevice',
  action: 'store_true',
  required: false,
  help: 'Xcode 6 has a bug on some platforms where a certain simulator ' + 'can only be launched without error if all other simulator devices ' + 'are first deleted. This option causes Appium to delete all ' + 'devices other than the one being used by Appium. Note that this ' + 'is a permanent deletion, and you are responsible for using simctl ' + 'or xcode to manage the categories of devices used with Appium.'
}], [['--tmp'], {
  default: null,
  dest: 'tmpDir',
  required: false,
  help: 'Absolute path to directory Appium can use to manage temporary ' + 'files, like built-in iOS apps it needs to move around. On *nix/Mac ' + 'defaults to /tmp, on Windows defaults to C:\\Windows\\Temp'
}], [['--trace-dir'], {
  default: null,
  dest: 'traceDir',
  required: false,
  help: 'Absolute path to directory Appium use to save ios instruments ' + 'traces, defaults to <tmp dir>/appium-instruments'
}], [['--debug-log-spacing'], {
  dest: 'debugLogSpacing',
  default: false,
  action: 'store_true',
  required: false,
  help: 'Add exaggerated spacing in logs to help with visual inspection'
}], [['--suppress-adb-kill-server'], {
  dest: 'suppressKillServer',
  default: false,
  action: 'store_true',
  required: false,
  help: '(Android-only) If set, prevents Appium from killing the adb server instance'
}], [['--long-stacktrace'], {
  dest: 'longStacktrace',
  default: false,
  required: false,
  action: 'store_true',
  help: 'Add long stack traces to log entries. Recommended for debugging only.'
}], [['--webkit-debug-proxy-port'], {
  default: 27753,
  dest: 'webkitDebugProxyPort',
  required: false,
  type: 'int',
  help: '(IOS-only) Local port used for communication with ios-webkit-debug-proxy'
}], [['--webdriveragent-port'], {
  default: 8100,
  dest: 'wdaLocalPort',
  required: false,
  type: 'int',
  help: '(IOS-only, XCUITest-only) Local port used for communication with WebDriverAgent'
}], [['-dc', _argsparseActions.DEFAULT_CAPS_ARG], {
  dest: 'defaultCapabilities',
  default: {},
  type: parseDefaultCaps,
  required: false,
  help: 'Set the default desired capabilities, which will be set on each ' + 'session unless overridden by received capabilities. For example: ' + '[ \'{"app": "myapp.app", "deviceName": "iPhone Simulator"}\' ' + '| /path/to/caps.json ]'
}], [['--relaxed-security'], {
  default: false,
  dest: 'relaxedSecurityEnabled',
  action: 'store_true',
  required: false,
  help: 'Disable additional security checks, so it is possible to use some advanced features, provided ' + 'by drivers supporting this option. Only enable it if all the ' + 'clients are in the trusted network and it\'s not the case if a client could potentially ' + 'break out of the session sandbox. Specific features can be overridden by ' + 'using the --deny-insecure flag'
}], [['--allow-insecure'], {
  dest: 'allowInsecure',
  default: [],
  type: parseSecurityFeatures,
  required: false,
  help: 'Set which insecure features are allowed to run in this server\'s sessions. ' + 'Features are defined on a driver level; see documentation for more details. ' + 'This should be either a comma-separated list of feature names, or a path to ' + 'a file where each feature name is on a line. Note that features defined via ' + '--deny-insecure will be disabled, even if also listed here. For example: ' + 'execute_driver_script,adb_shell'
}], [['--deny-insecure'], {
  dest: 'denyInsecure',
  default: [],
  type: parseSecurityFeatures,
  required: false,
  help: 'Set which insecure features are not allowed to run in this server\'s sessions. ' + 'Features are defined on a driver level; see documentation for more details. ' + 'This should be either a comma-separated list of feature names, or a path to ' + 'a file where each feature name is on a line. Features listed here will not be ' + 'enabled even if also listed in --allow-insecure, and even if --relaxed-security ' + 'is turned on. For example: execute_driver_script,adb_shell'
}], [['--command-timeout'], {
  default: 60,
  dest: 'defaultCommandTimeout',
  type: 'int',
  required: false,
  deprecated_for: 'newCommandTimeout capability',
  action: _argsparseActions.StoreDeprecatedAction,
  help: 'No effect. This used to be the default command ' + 'timeout for the server to use for all sessions (in seconds and ' + 'should be less than 2147483). Use newCommandTimeout cap instead'
}], [['-k', '--keep-artifacts'], {
  default: false,
  dest: 'keepArtifacts',
  action: _argsparseActions.StoreDeprecatedTrueAction,
  required: false,
  help: 'No effect, trace is now in tmp dir by default and is ' + 'cleared before each run. Please also refer to the --trace-dir flag.'
}], [['--platform-name'], {
  dest: 'platformName',
  default: null,
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: 'Name of the mobile platform: iOS, Android, or FirefoxOS'
}], [['--platform-version'], {
  dest: 'platformVersion',
  default: null,
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: 'Version of the mobile platform'
}], [['--automation-name'], {
  dest: 'automationName',
  default: null,
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: 'Name of the automation tool: Appium, XCUITest, etc.'
}], [['--device-name'], {
  dest: 'deviceName',
  default: null,
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: 'Name of the mobile device to use, for example: ' + 'iPhone Retina (4-inch), Android Emulator'
}], [['--browser-name'], {
  dest: 'browserName',
  default: null,
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: 'Name of the mobile browser: Safari or Chrome'
}], [['--app'], {
  dest: 'app',
  required: false,
  default: null,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: 'IOS: abs path to simulator-compiled .app file or the ' + 'bundle_id of the desired target on device; Android: abs path to .apk file'
}], [['-lt', '--launch-timeout'], {
  default: 90000,
  dest: 'launchTimeout',
  type: 'int',
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(iOS-only) how long in ms to wait for Instruments to launch'
}], [['--language'], {
  default: null,
  dest: 'language',
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: 'Language for the iOS simulator / Android Emulator, like: en, es'
}], [['--locale'], {
  default: null,
  dest: 'locale',
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: 'Locale for the iOS simulator / Android Emulator, like en_US, de_DE'
}], [['-U', '--udid'], {
  dest: 'udid',
  required: false,
  default: null,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: 'Unique device identifier of the connected physical device'
}], [['--orientation'], {
  dest: 'orientation',
  default: null,
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(IOS-only) use LANDSCAPE or PORTRAIT to initialize all requests ' + 'to this orientation'
}], [['--no-reset'], {
  default: false,
  dest: 'noReset',
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityTrueAction,
  required: false,
  help: 'Do not reset app state between sessions (IOS: do not delete app ' + 'plist files; Android: do not uninstall app before new session)'
}], [['--full-reset'], {
  default: false,
  dest: 'fullReset',
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityTrueAction,
  required: false,
  help: '(iOS) Delete the entire simulator folder. (Android) Reset app ' + 'state by uninstalling app instead of clearing app data. On ' + 'Android, this will also remove the app after the session is complete.'
}], [['--app-pkg'], {
  dest: 'appPackage',
  default: null,
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(Android-only) Java package of the Android app you want to run ' + '(e.g., com.example.android.myApp)'
}], [['--app-activity'], {
  dest: 'appActivity',
  default: null,
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(Android-only) Activity name for the Android activity you want ' + 'to launch from your package (e.g., MainActivity)'
}], [['--app-wait-package'], {
  dest: 'appWaitPackage',
  default: false,
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(Android-only) Package name for the Android activity you want ' + 'to wait for (e.g., com.example.android.myApp)'
}], [['--app-wait-activity'], {
  dest: 'appWaitActivity',
  default: false,
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(Android-only) Activity name for the Android activity you want ' + 'to wait for (e.g., SplashActivity)'
}], [['--device-ready-timeout'], {
  dest: 'deviceReadyTimeout',
  default: 5,
  required: false,
  type: 'int',
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(Android-only) Timeout in seconds while waiting for device to become ready'
}], [['--android-coverage'], {
  dest: 'androidCoverage',
  default: false,
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(Android-only) Fully qualified instrumentation class. Passed to -w in ' + 'adb shell am instrument -e coverage true -w ' + '(e.g. com.my.Pkg/com.my.Pkg.instrumentation.MyInstrumentation)'
}], [['--avd'], {
  dest: 'avd',
  default: null,
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(Android-only) Name of the avd to launch (e.g. @Nexus_5)'
}], [['--avd-args'], {
  dest: 'avdArgs',
  default: null,
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(Android-only) Additional emulator arguments to launch the avd (e.g. -no-snapshot-load)'
}], [['--use-keystore'], {
  default: false,
  dest: 'useKeystore',
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityTrueAction,
  required: false,
  help: '(Android-only) When set the keystore will be used to sign apks.'
}], [['--keystore-path'], {
  default: _path.default.resolve(process.env.HOME || process.env.USERPROFILE || '', '.android', 'debug.keystore'),
  dest: 'keystorePath',
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(Android-only) Path to keystore'
}], [['--keystore-password'], {
  default: 'android',
  dest: 'keystorePassword',
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(Android-only) Password to keystore'
}], [['--key-alias'], {
  default: 'androiddebugkey',
  dest: 'keyAlias',
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(Android-only) Key alias'
}], [['--key-password'], {
  default: 'android',
  dest: 'keyPassword',
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(Android-only) Key password'
}], [['--intent-action'], {
  dest: 'intentAction',
  default: 'android.intent.action.MAIN',
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(Android-only) Intent action which will be used to start activity (e.g. android.intent.action.MAIN)'
}], [['--intent-category'], {
  dest: 'intentCategory',
  default: 'android.intent.category.LAUNCHER',
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(Android-only) Intent category which will be used to start activity ' + '(e.g. android.intent.category.APP_CONTACTS)'
}], [['--intent-flags'], {
  dest: 'intentFlags',
  default: '0x10200000',
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(Android-only) Flags that will be used to start activity (e.g. 0x10200000)'
}], [['--intent-args'], {
  dest: 'optionalIntentArguments',
  default: null,
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(Android-only) Additional intent arguments that will be used to start activity  (e.g. 0x10200000)'
}], [['--dont-stop-app-on-reset'], {
  dest: 'dontStopAppOnReset',
  default: false,
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityTrueAction,
  help: '(Android-only) When included, refrains from stopping the app before restart'
}], [['--calendar-format'], {
  default: null,
  dest: 'calendarFormat',
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(IOS-only) calendar format for the iOS simulator (e.g. gregorian)'
}], [['--native-instruments-lib'], {
  default: false,
  dest: 'nativeInstrumentsLib',
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityTrueAction,
  required: false,
  help: '(IOS-only) IOS has a weird built-in unavoidable ' + 'delay. We patch this in appium. If you do not want it patched, pass in this flag.'
}], [['--keep-keychains'], {
  default: false,
  dest: 'keepKeyChains',
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityTrueAction,
  required: false,
  help: '(iOS-only) Whether to keep keychains ' + '(Library/Keychains) when reset app between sessions'
}], [['--localizable-strings-dir'], {
  required: false,
  dest: 'localizableStringsDir',
  default: 'en.lproj',
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: '(IOS-only) the relative path of the dir where Localizable.strings file resides (e.g. en.lproj)'
}], [['--show-ios-log'], {
  default: false,
  dest: 'showIOSLog',
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityTrueAction,
  required: false,
  help: '(IOS-only) if set, the iOS system log will be written to the console'
}], [['--async-trace'], {
  dest: 'longStacktrace',
  default: false,
  required: false,
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityTrueAction,
  help: 'Add long stack traces to log entries. Recommended for debugging only.'
}], [['--chromedriver-port'], {
  default: null,
  dest: 'chromedriverPort',
  required: false,
  type: 'int',
  action: _argsparseActions.StoreDeprecatedDefaultCapabilityAction,
  help: 'Port upon which ChromeDriver will run. If not given, ' + 'Android driver will pick a random available port.'
}], [['--log-filters'], {
  dest: 'logFilters',
  default: null,
  required: false,
  help: 'Set the full path to a JSON file containing one or more log filtering rules'
}]];

function parseSecurityFeatures(features) {
  const splitter = (splitOn, str) => `${str}`.split(splitOn).map(s => s.trim()).filter(Boolean);

  let parsedFeatures;

  try {
    parsedFeatures = splitter(',', features);
  } catch (err) {
    throw new TypeError('Could not parse value of --allow/deny-insecure. Should be ' + 'a list of strings separated by commas, or a path to a file ' + 'listing one feature name per line.');
  }

  if (parsedFeatures.length === 1 && _fs.default.existsSync(parsedFeatures[0])) {
    try {
      const fileFeatures = _fs.default.readFileSync(parsedFeatures[0], 'utf8');

      parsedFeatures = splitter('\n', fileFeatures);
    } catch (err) {
      throw new TypeError(`Attempted to read --allow/deny-insecure feature names ` + `from file ${parsedFeatures[0]} but got error: ${err.message}`);
    }
  }

  return parsedFeatures;
}

function parseDefaultCaps(capsOrPath) {
  let caps = capsOrPath;
  let loadedFromFile = false;

  try {
    if (_lodash.default.isString(capsOrPath) && _fs.default.statSync(capsOrPath).isFile()) {
      caps = _fs.default.readFileSync(capsOrPath, 'utf8');
      loadedFromFile = true;
    }
  } catch (err) {}

  try {
    const result = JSON.parse(caps);

    if (!_lodash.default.isPlainObject(result)) {
      throw new Error(`'${_lodash.default.truncate(result, {
        length: 100
      })}' is not an object`);
    }

    return result;
  } catch (e) {
    const msg = loadedFromFile ? `Default capabilities in '${capsOrPath}' must be a valid JSON` : `Default capabilities must be a valid JSON`;
    throw new TypeError(`${msg}. Original error: ${e.message}`);
  }
}

function getParser() {
  const parser = new _argparse.ArgumentParser({
    add_help: true,
    description: 'A webdriver-compatible server for use with native and hybrid iOS and Android applications.',
    prog: process.argv[1] || 'Appium'
  });
  parser.rawArgs = args;

  for (const [flagsOrNames, options] of args) {
    parser.add_argument(...flagsOrNames, options);
  }

  parser.add_argument('-v', '--version', {
    action: 'version',
    version: require(_path.default.resolve(_utils.rootDir, 'package.json')).version
  });
  return parser;
}

function getDefaultArgs() {
  return args.reduce((acc, [, {
    dest,
    default: defaultValue
  }]) => {
    acc[dest] = defaultValue;
    return acc;
  }, {});
}

var _default = getParser;
exports.default = _default;require('source-map-support').install();


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9wYXJzZXIuanMiXSwibmFtZXMiOlsiYXJncyIsInJlcXVpcmVkIiwiZGVmYXVsdCIsImFjdGlvbiIsImhlbHAiLCJkZXN0IiwidHlwZSIsIkRFRkFVTFRfQkFTRV9QQVRIIiwiY2hvaWNlcyIsIkRFRkFVTFRfQ0FQU19BUkciLCJwYXJzZURlZmF1bHRDYXBzIiwicGFyc2VTZWN1cml0eUZlYXR1cmVzIiwiZGVwcmVjYXRlZF9mb3IiLCJTdG9yZURlcHJlY2F0ZWRBY3Rpb24iLCJTdG9yZURlcHJlY2F0ZWRUcnVlQWN0aW9uIiwiU3RvcmVEZXByZWNhdGVkRGVmYXVsdENhcGFiaWxpdHlBY3Rpb24iLCJTdG9yZURlcHJlY2F0ZWREZWZhdWx0Q2FwYWJpbGl0eVRydWVBY3Rpb24iLCJwYXRoIiwicmVzb2x2ZSIsInByb2Nlc3MiLCJlbnYiLCJIT01FIiwiVVNFUlBST0ZJTEUiLCJmZWF0dXJlcyIsInNwbGl0dGVyIiwic3BsaXRPbiIsInN0ciIsInNwbGl0IiwibWFwIiwicyIsInRyaW0iLCJmaWx0ZXIiLCJCb29sZWFuIiwicGFyc2VkRmVhdHVyZXMiLCJlcnIiLCJUeXBlRXJyb3IiLCJsZW5ndGgiLCJmcyIsImV4aXN0c1N5bmMiLCJmaWxlRmVhdHVyZXMiLCJyZWFkRmlsZVN5bmMiLCJtZXNzYWdlIiwiY2Fwc09yUGF0aCIsImNhcHMiLCJsb2FkZWRGcm9tRmlsZSIsIl8iLCJpc1N0cmluZyIsInN0YXRTeW5jIiwiaXNGaWxlIiwicmVzdWx0IiwiSlNPTiIsInBhcnNlIiwiaXNQbGFpbk9iamVjdCIsIkVycm9yIiwidHJ1bmNhdGUiLCJlIiwibXNnIiwiZ2V0UGFyc2VyIiwicGFyc2VyIiwiQXJndW1lbnRQYXJzZXIiLCJhZGRfaGVscCIsImRlc2NyaXB0aW9uIiwicHJvZyIsImFyZ3YiLCJyYXdBcmdzIiwiZmxhZ3NPck5hbWVzIiwib3B0aW9ucyIsImFkZF9hcmd1bWVudCIsInZlcnNpb24iLCJyZXF1aXJlIiwicm9vdERpciIsImdldERlZmF1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QUF1QztBQUNyQ2hFLElBQUFBLE1BQU0sRUFBRSxTQUQ2QjtBQUVyQ2lFLElBQUFBLE9BQU8sRUFBRUMsT0FBTyxDQUFDcEQsY0FBS0MsT0FBTCxDQUFhb0QsY0FBYixFQUFzQixjQUF0QixDQUFELENBQVAsQ0FBK0NGO0FBRm5CLEdBQXZDO0FBSUEsU0FBT1YsTUFBUDtBQUNEOztBQUVELFNBQVNhLGNBQVQsR0FBMkI7QUFDekIsU0FBT3ZFLElBQUksQ0FBQ3dFLE1BQUwsQ0FBWSxDQUFDQyxHQUFELEVBQU0sR0FBRztBQUFDcEUsSUFBQUEsSUFBRDtBQUFPSCxJQUFBQSxPQUFPLEVBQUV3RTtBQUFoQixHQUFILENBQU4sS0FBNEM7QUFDN0RELElBQUFBLEdBQUcsQ0FBQ3BFLElBQUQsQ0FBSCxHQUFZcUUsWUFBWjtBQUNBLFdBQU9ELEdBQVA7QUFDRCxHQUhNLEVBR0osRUFISSxDQUFQO0FBSUQ7O2VBRWNoQixTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IEFyZ3VtZW50UGFyc2VyIH0gZnJvbSAnYXJncGFyc2UnO1xuaW1wb3J0IHsgcm9vdERpciB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgREVGQVVMVF9CQVNFX1BBVEggfSBmcm9tICdhcHBpdW0tYmFzZS1kcml2ZXInO1xuaW1wb3J0IHtcbiAgU3RvcmVEZXByZWNhdGVkQWN0aW9uLCBTdG9yZURlcHJlY2F0ZWRUcnVlQWN0aW9uLFxuICBTdG9yZURlcHJlY2F0ZWREZWZhdWx0Q2FwYWJpbGl0eUFjdGlvbiwgU3RvcmVEZXByZWNhdGVkRGVmYXVsdENhcGFiaWxpdHlUcnVlQWN0aW9uLFxuICBERUZBVUxUX0NBUFNfQVJHLFxufSBmcm9tICcuL2FyZ3NwYXJzZS1hY3Rpb25zJztcblxuXG5jb25zdCBhcmdzID0gW1xuICBbWyctLXNoZWxsJ10sIHtcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgYWN0aW9uOiAnc3RvcmVfdHJ1ZScsXG4gICAgaGVscDogJ0VudGVyIFJFUEwgbW9kZScsXG4gICAgZGVzdDogJ3NoZWxsJyxcbiAgfV0sXG5cbiAgW1snLS1hbGxvdy1jb3JzJ10sIHtcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgYWN0aW9uOiAnc3RvcmVfdHJ1ZScsXG4gICAgaGVscDogJ1doZXRoZXIgdGhlIEFwcGl1bSBzZXJ2ZXIgc2hvdWxkIGFsbG93IHdlYiBicm93c2VyIGNvbm5lY3Rpb25zIGZyb20gYW55IGhvc3QnLFxuICAgIGRlc3Q6ICdhbGxvd0NvcnMnLFxuICB9XSxcblxuICBbWyctLXJlYm9vdCddLCB7XG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgZGVzdDogJ3JlYm9vdCcsXG4gICAgYWN0aW9uOiAnc3RvcmVfdHJ1ZScsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICcoQW5kcm9pZC1vbmx5KSByZWJvb3QgZW11bGF0b3IgYWZ0ZXIgZWFjaCBzZXNzaW9uIGFuZCBraWxsIGl0IGF0IHRoZSBlbmQnLFxuICB9XSxcblxuICBbWyctLWlwYSddLCB7XG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgaGVscDogJyhJT1Mtb25seSkgYWJzIHBhdGggdG8gY29tcGlsZWQgLmlwYSBmaWxlJyxcbiAgICBkZXN0OiAnaXBhJyxcbiAgfV0sXG5cbiAgW1snLWEnLCAnLS1hZGRyZXNzJ10sIHtcbiAgICBkZWZhdWx0OiAnMC4wLjAuMCcsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICdJUCBBZGRyZXNzIHRvIGxpc3RlbiBvbicsXG4gICAgZGVzdDogJ2FkZHJlc3MnLFxuICB9XSxcblxuICBbWyctcCcsICctLXBvcnQnXSwge1xuICAgIGRlZmF1bHQ6IDQ3MjMsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIHR5cGU6ICdpbnQnLFxuICAgIGhlbHA6ICdwb3J0IHRvIGxpc3RlbiBvbicsXG4gICAgZGVzdDogJ3BvcnQnLFxuICB9XSxcblxuICBbWyctcGEnLCAnLS1iYXNlLXBhdGgnXSwge1xuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBkZWZhdWx0OiBERUZBVUxUX0JBU0VfUEFUSCxcbiAgICBkZXN0OiAnYmFzZVBhdGgnLFxuICAgIGhlbHA6ICdCYXNlIHBhdGggdG8gdXNlIGFzIHRoZSBwcmVmaXggZm9yIGFsbCB3ZWJkcml2ZXIgcm91dGVzIHJ1bm5pbmcnICtcbiAgICAgICAgICAnb24gdGhpcyBzZXJ2ZXInXG4gIH1dLFxuXG4gIFtbJy1rYScsICctLWtlZXAtYWxpdmUtdGltZW91dCddLCB7XG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgZGVzdDogJ2tlZXBBbGl2ZVRpbWVvdXQnLFxuICAgIHR5cGU6ICdpbnQnLFxuICAgIGhlbHA6ICdOdW1iZXIgb2Ygc2Vjb25kcyB0aGUgQXBwaXVtIHNlcnZlciBzaG91bGQgYXBwbHkgYXMgYm90aCB0aGUga2VlcC1hbGl2ZSB0aW1lb3V0ICcgK1xuICAgICAgICAgICdhbmQgdGhlIGNvbm5lY3Rpb24gdGltZW91dCBmb3IgYWxsIHJlcXVlc3RzLiBEZWZhdWx0cyB0byA2MDAgKDEwIG1pbnV0ZXMpLidcbiAgfV0sXG5cbiAgW1snLWNhJywgJy0tY2FsbGJhY2stYWRkcmVzcyddLCB7XG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlc3Q6ICdjYWxsYmFja0FkZHJlc3MnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgaGVscDogJ2NhbGxiYWNrIElQIEFkZHJlc3MgKGRlZmF1bHQ6IHNhbWUgYXMgLS1hZGRyZXNzKScsXG4gIH1dLFxuXG4gIFtbJy1jcCcsICctLWNhbGxiYWNrLXBvcnQnXSwge1xuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBkZXN0OiAnY2FsbGJhY2tQb3J0JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIHR5cGU6ICdpbnQnLFxuICAgIGhlbHA6ICdjYWxsYmFjayBwb3J0IChkZWZhdWx0OiBzYW1lIGFzIHBvcnQpJyxcbiAgfV0sXG5cbiAgW1snLWJwJywgJy0tYm9vdHN0cmFwLXBvcnQnXSwge1xuICAgIGRlZmF1bHQ6IDQ3MjQsXG4gICAgZGVzdDogJ2Jvb3RzdHJhcFBvcnQnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICB0eXBlOiAnaW50JyxcbiAgICBoZWxwOiAnKEFuZHJvaWQtb25seSkgcG9ydCB0byB1c2Ugb24gZGV2aWNlIHRvIHRhbGsgdG8gQXBwaXVtJyxcbiAgfV0sXG5cbiAgW1snLXInLCAnLS1iYWNrZW5kLXJldHJpZXMnXSwge1xuICAgIGRlZmF1bHQ6IDMsXG4gICAgZGVzdDogJ2JhY2tlbmRSZXRyaWVzJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgdHlwZTogJ2ludCcsXG4gICAgaGVscDogJyhpT1Mtb25seSkgSG93IG1hbnkgdGltZXMgdG8gcmV0cnkgbGF1bmNoaW5nIEluc3RydW1lbnRzICcgK1xuICAgICAgICAgICdiZWZvcmUgc2F5aW5nIGl0IGNyYXNoZWQgb3IgdGltZWQgb3V0JyxcbiAgfV0sXG5cbiAgW1snLS1zZXNzaW9uLW92ZXJyaWRlJ10sIHtcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBkZXN0OiAnc2Vzc2lvbk92ZXJyaWRlJyxcbiAgICBhY3Rpb246ICdzdG9yZV90cnVlJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJ0VuYWJsZXMgc2Vzc2lvbiBvdmVycmlkZSAoY2xvYmJlcmluZyknLFxuICB9XSxcblxuICBbWyctbCcsICctLXByZS1sYXVuY2gnXSwge1xuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGRlc3Q6ICdsYXVuY2gnLFxuICAgIGFjdGlvbjogJ3N0b3JlX3RydWUnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiAnUHJlLWxhdW5jaCB0aGUgYXBwbGljYXRpb24gYmVmb3JlIGFsbG93aW5nIHRoZSBmaXJzdCBzZXNzaW9uICcgK1xuICAgICAgICAgICcoUmVxdWlyZXMgLS1hcHAgYW5kLCBmb3IgQW5kcm9pZCwgLS1hcHAtcGtnIGFuZCAtLWFwcC1hY3Rpdml0eSknLFxuICB9XSxcblxuICBbWyctZycsICctLWxvZyddLCB7XG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBkZXN0OiAnbG9nRmlsZScsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICdBbHNvIHNlbmQgbG9nIG91dHB1dCB0byB0aGlzIGZpbGUnLFxuICB9XSxcblxuICBbWyctLWxvZy1sZXZlbCddLCB7XG4gICAgY2hvaWNlczogW1xuICAgICAgJ2luZm8nLCAnaW5mbzpkZWJ1ZycsICdpbmZvOmluZm8nLCAnaW5mbzp3YXJuJywgJ2luZm86ZXJyb3InLFxuICAgICAgJ3dhcm4nLCAnd2FybjpkZWJ1ZycsICd3YXJuOmluZm8nLCAnd2Fybjp3YXJuJywgJ3dhcm46ZXJyb3InLFxuICAgICAgJ2Vycm9yJywgJ2Vycm9yOmRlYnVnJywgJ2Vycm9yOmluZm8nLCAnZXJyb3I6d2FybicsICdlcnJvcjplcnJvcicsXG4gICAgICAnZGVidWcnLCAnZGVidWc6ZGVidWcnLCAnZGVidWc6aW5mbycsICdkZWJ1Zzp3YXJuJywgJ2RlYnVnOmVycm9yJyxcbiAgICBdLFxuICAgIGRlZmF1bHQ6ICdkZWJ1ZycsXG4gICAgZGVzdDogJ2xvZ2xldmVsJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJ2xvZyBsZXZlbDsgZGVmYXVsdCAoY29uc29sZVs6ZmlsZV0pOiBkZWJ1Z1s6ZGVidWddJyxcbiAgfV0sXG5cbiAgW1snLS1sb2ctdGltZXN0YW1wJ10sIHtcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJ1Nob3cgdGltZXN0YW1wcyBpbiBjb25zb2xlIG91dHB1dCcsXG4gICAgYWN0aW9uOiAnc3RvcmVfdHJ1ZScsXG4gICAgZGVzdDogJ2xvZ1RpbWVzdGFtcCcsXG4gIH1dLFxuXG4gIFtbJy0tbG9jYWwtdGltZXpvbmUnXSwge1xuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiAnVXNlIGxvY2FsIHRpbWV6b25lIGZvciB0aW1lc3RhbXBzJyxcbiAgICBhY3Rpb246ICdzdG9yZV90cnVlJyxcbiAgICBkZXN0OiAnbG9jYWxUaW1lem9uZScsXG4gIH1dLFxuXG4gIFtbJy0tbG9nLW5vLWNvbG9ycyddLCB7XG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICdEbyBub3QgdXNlIGNvbG9ycyBpbiBjb25zb2xlIG91dHB1dCcsXG4gICAgYWN0aW9uOiAnc3RvcmVfdHJ1ZScsXG4gICAgZGVzdDogJ2xvZ05vQ29sb3JzJyxcbiAgfV0sXG5cbiAgW1snLUcnLCAnLS13ZWJob29rJ10sIHtcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBkZXN0OiAnd2ViaG9vaycsXG4gICAgaGVscDogJ0Fsc28gc2VuZCBsb2cgb3V0cHV0IHRvIHRoaXMgSFRUUCBsaXN0ZW5lciwgZm9yIGV4YW1wbGUgbG9jYWxob3N0Ojk4NzYnLFxuICB9XSxcblxuICBbWyctLXNhZmFyaSddLCB7XG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgYWN0aW9uOiAnc3RvcmVfdHJ1ZScsXG4gICAgZGVzdDogJ3NhZmFyaScsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICcoSU9TLU9ubHkpIFVzZSB0aGUgc2FmYXJpIGFwcCcsXG4gIH1dLFxuXG4gIFtbJy0tZGVmYXVsdC1kZXZpY2UnLCAnLWRkJ10sIHtcbiAgICBkZXN0OiAnZGVmYXVsdERldmljZScsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgYWN0aW9uOiAnc3RvcmVfdHJ1ZScsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICcoSU9TLVNpbXVsYXRvci1vbmx5KSB1c2UgdGhlIGRlZmF1bHQgc2ltdWxhdG9yIHRoYXQgaW5zdHJ1bWVudHMgJyArXG4gICAgICAgICAgJ2xhdW5jaGVzIG9uIGl0cyBvd24nLFxuICB9XSxcblxuICBbWyctLWZvcmNlLWlwaG9uZSddLCB7XG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgZGVzdDogJ2ZvcmNlSXBob25lJyxcbiAgICBhY3Rpb246ICdzdG9yZV90cnVlJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJyhJT1Mtb25seSkgVXNlIHRoZSBpUGhvbmUgU2ltdWxhdG9yIG5vIG1hdHRlciB3aGF0IHRoZSBhcHAgd2FudHMnLFxuICB9XSxcblxuICBbWyctLWZvcmNlLWlwYWQnXSwge1xuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGRlc3Q6ICdmb3JjZUlwYWQnLFxuICAgIGFjdGlvbjogJ3N0b3JlX3RydWUnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiAnKElPUy1vbmx5KSBVc2UgdGhlIGlQYWQgU2ltdWxhdG9yIG5vIG1hdHRlciB3aGF0IHRoZSBhcHAgd2FudHMnLFxuICB9XSxcblxuICBbWyctLXRyYWNldGVtcGxhdGUnXSwge1xuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgZGVzdDogJ2F1dG9tYXRpb25UcmFjZVRlbXBsYXRlUGF0aCcsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICcoSU9TLW9ubHkpIC50cmFjZXRlbXBsYXRlIGZpbGUgdG8gdXNlIHdpdGggSW5zdHJ1bWVudHMnLFxuICB9XSxcblxuICBbWyctLWluc3RydW1lbnRzJ10sIHtcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGRlc3Q6ICdpbnN0cnVtZW50c1BhdGgnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiAnKElPUy1vbmx5KSBwYXRoIHRvIGluc3RydW1lbnRzIGJpbmFyeScsXG4gIH1dLFxuXG4gIFtbJy0tbm9kZWNvbmZpZyddLCB7XG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgZGVzdDogJ25vZGVjb25maWcnLFxuICAgIGhlbHA6ICdDb25maWd1cmF0aW9uIEpTT04gZmlsZSB0byByZWdpc3RlciBhcHBpdW0gd2l0aCBzZWxlbml1bSBncmlkJyxcbiAgfV0sXG5cbiAgW1snLXJhJywgJy0tcm9ib3QtYWRkcmVzcyddLCB7XG4gICAgZGVmYXVsdDogJzAuMC4wLjAnLFxuICAgIGRlc3Q6ICdyb2JvdEFkZHJlc3MnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiAnSVAgQWRkcmVzcyBvZiByb2JvdCcsXG4gIH1dLFxuXG4gIFtbJy1ycCcsICctLXJvYm90LXBvcnQnXSwge1xuICAgIGRlZmF1bHQ6IC0xLFxuICAgIGRlc3Q6ICdyb2JvdFBvcnQnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICB0eXBlOiAnaW50JyxcbiAgICBoZWxwOiAncG9ydCBmb3Igcm9ib3QnLFxuICB9XSxcblxuICBbWyctLWNocm9tZWRyaXZlci1leGVjdXRhYmxlJ10sIHtcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGRlc3Q6ICdjaHJvbWVkcml2ZXJFeGVjdXRhYmxlJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJ0Nocm9tZURyaXZlciBleGVjdXRhYmxlIGZ1bGwgcGF0aCcsXG4gIH1dLFxuXG4gIFtbJy0tc2hvdy1jb25maWcnXSwge1xuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGRlc3Q6ICdzaG93Q29uZmlnJyxcbiAgICBhY3Rpb246ICdzdG9yZV90cnVlJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJ1Nob3cgaW5mbyBhYm91dCB0aGUgYXBwaXVtIHNlcnZlciBjb25maWd1cmF0aW9uIGFuZCBleGl0JyxcbiAgfV0sXG5cbiAgW1snLS1uby1wZXJtcy1jaGVjayddLCB7XG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgZGVzdDogJ25vUGVybXNDaGVjaycsXG4gICAgYWN0aW9uOiAnc3RvcmVfdHJ1ZScsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICdCeXBhc3MgQXBwaXVtXFwncyBjaGVja3MgdG8gZW5zdXJlIHdlIGNhbiByZWFkL3dyaXRlIG5lY2Vzc2FyeSBmaWxlcycsXG4gIH1dLFxuXG4gIFtbJy0tc3RyaWN0LWNhcHMnXSwge1xuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGRlc3Q6ICdlbmZvcmNlU3RyaWN0Q2FwcycsXG4gICAgYWN0aW9uOiAnc3RvcmVfdHJ1ZScsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICdDYXVzZSBzZXNzaW9ucyB0byBmYWlsIGlmIGRlc2lyZWQgY2FwcyBhcmUgc2VudCBpbiB0aGF0IEFwcGl1bSAnICtcbiAgICAgICAgICAnZG9lcyBub3QgcmVjb2duaXplIGFzIHZhbGlkIGZvciB0aGUgc2VsZWN0ZWQgZGV2aWNlJyxcbiAgfV0sXG5cbiAgW1snLS1pc29sYXRlLXNpbS1kZXZpY2UnXSwge1xuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGRlc3Q6ICdpc29sYXRlU2ltRGV2aWNlJyxcbiAgICBhY3Rpb246ICdzdG9yZV90cnVlJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJ1hjb2RlIDYgaGFzIGEgYnVnIG9uIHNvbWUgcGxhdGZvcm1zIHdoZXJlIGEgY2VydGFpbiBzaW11bGF0b3IgJyArXG4gICAgICAgICAgJ2NhbiBvbmx5IGJlIGxhdW5jaGVkIHdpdGhvdXQgZXJyb3IgaWYgYWxsIG90aGVyIHNpbXVsYXRvciBkZXZpY2VzICcgK1xuICAgICAgICAgICdhcmUgZmlyc3QgZGVsZXRlZC4gVGhpcyBvcHRpb24gY2F1c2VzIEFwcGl1bSB0byBkZWxldGUgYWxsICcgK1xuICAgICAgICAgICdkZXZpY2VzIG90aGVyIHRoYW4gdGhlIG9uZSBiZWluZyB1c2VkIGJ5IEFwcGl1bS4gTm90ZSB0aGF0IHRoaXMgJyArXG4gICAgICAgICAgJ2lzIGEgcGVybWFuZW50IGRlbGV0aW9uLCBhbmQgeW91IGFyZSByZXNwb25zaWJsZSBmb3IgdXNpbmcgc2ltY3RsICcgK1xuICAgICAgICAgICdvciB4Y29kZSB0byBtYW5hZ2UgdGhlIGNhdGVnb3JpZXMgb2YgZGV2aWNlcyB1c2VkIHdpdGggQXBwaXVtLicsXG4gIH1dLFxuXG4gIFtbJy0tdG1wJ10sIHtcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGRlc3Q6ICd0bXBEaXInLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiAnQWJzb2x1dGUgcGF0aCB0byBkaXJlY3RvcnkgQXBwaXVtIGNhbiB1c2UgdG8gbWFuYWdlIHRlbXBvcmFyeSAnICtcbiAgICAgICAgICAnZmlsZXMsIGxpa2UgYnVpbHQtaW4gaU9TIGFwcHMgaXQgbmVlZHMgdG8gbW92ZSBhcm91bmQuIE9uICpuaXgvTWFjICcgK1xuICAgICAgICAgICdkZWZhdWx0cyB0byAvdG1wLCBvbiBXaW5kb3dzIGRlZmF1bHRzIHRvIEM6XFxcXFdpbmRvd3NcXFxcVGVtcCcsXG4gIH1dLFxuXG4gIFtbJy0tdHJhY2UtZGlyJ10sIHtcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGRlc3Q6ICd0cmFjZURpcicsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICdBYnNvbHV0ZSBwYXRoIHRvIGRpcmVjdG9yeSBBcHBpdW0gdXNlIHRvIHNhdmUgaW9zIGluc3RydW1lbnRzICcgK1xuICAgICAgICAgICd0cmFjZXMsIGRlZmF1bHRzIHRvIDx0bXAgZGlyPi9hcHBpdW0taW5zdHJ1bWVudHMnLFxuICB9XSxcblxuICBbWyctLWRlYnVnLWxvZy1zcGFjaW5nJ10sIHtcbiAgICBkZXN0OiAnZGVidWdMb2dTcGFjaW5nJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBhY3Rpb246ICdzdG9yZV90cnVlJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJ0FkZCBleGFnZ2VyYXRlZCBzcGFjaW5nIGluIGxvZ3MgdG8gaGVscCB3aXRoIHZpc3VhbCBpbnNwZWN0aW9uJyxcbiAgfV0sXG5cbiAgW1snLS1zdXBwcmVzcy1hZGIta2lsbC1zZXJ2ZXInXSwge1xuICAgIGRlc3Q6ICdzdXBwcmVzc0tpbGxTZXJ2ZXInLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGFjdGlvbjogJ3N0b3JlX3RydWUnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiAnKEFuZHJvaWQtb25seSkgSWYgc2V0LCBwcmV2ZW50cyBBcHBpdW0gZnJvbSBraWxsaW5nIHRoZSBhZGIgc2VydmVyIGluc3RhbmNlJyxcbiAgfV0sXG5cbiAgW1snLS1sb25nLXN0YWNrdHJhY2UnXSwge1xuICAgIGRlc3Q6ICdsb25nU3RhY2t0cmFjZScsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogJ3N0b3JlX3RydWUnLFxuICAgIGhlbHA6ICdBZGQgbG9uZyBzdGFjayB0cmFjZXMgdG8gbG9nIGVudHJpZXMuIFJlY29tbWVuZGVkIGZvciBkZWJ1Z2dpbmcgb25seS4nLFxuICB9XSxcblxuICBbWyctLXdlYmtpdC1kZWJ1Zy1wcm94eS1wb3J0J10sIHtcbiAgICBkZWZhdWx0OiAyNzc1MyxcbiAgICBkZXN0OiAnd2Via2l0RGVidWdQcm94eVBvcnQnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICB0eXBlOiAnaW50JyxcbiAgICBoZWxwOiAnKElPUy1vbmx5KSBMb2NhbCBwb3J0IHVzZWQgZm9yIGNvbW11bmljYXRpb24gd2l0aCBpb3Mtd2Via2l0LWRlYnVnLXByb3h5J1xuICB9XSxcblxuICBbWyctLXdlYmRyaXZlcmFnZW50LXBvcnQnXSwge1xuICAgIGRlZmF1bHQ6IDgxMDAsXG4gICAgZGVzdDogJ3dkYUxvY2FsUG9ydCcsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIHR5cGU6ICdpbnQnLFxuICAgIGhlbHA6ICcoSU9TLW9ubHksIFhDVUlUZXN0LW9ubHkpIExvY2FsIHBvcnQgdXNlZCBmb3IgY29tbXVuaWNhdGlvbiB3aXRoIFdlYkRyaXZlckFnZW50J1xuICB9XSxcblxuICBbWyctZGMnLCBERUZBVUxUX0NBUFNfQVJHXSwge1xuICAgIGRlc3Q6ICdkZWZhdWx0Q2FwYWJpbGl0aWVzJyxcbiAgICBkZWZhdWx0OiB7fSxcbiAgICB0eXBlOiBwYXJzZURlZmF1bHRDYXBzLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiAnU2V0IHRoZSBkZWZhdWx0IGRlc2lyZWQgY2FwYWJpbGl0aWVzLCB3aGljaCB3aWxsIGJlIHNldCBvbiBlYWNoICcgK1xuICAgICAgICAgICdzZXNzaW9uIHVubGVzcyBvdmVycmlkZGVuIGJ5IHJlY2VpdmVkIGNhcGFiaWxpdGllcy4gRm9yIGV4YW1wbGU6ICcgK1xuICAgICAgICAgICdbIFxcJ3tcImFwcFwiOiBcIm15YXBwLmFwcFwiLCBcImRldmljZU5hbWVcIjogXCJpUGhvbmUgU2ltdWxhdG9yXCJ9XFwnICcgK1xuICAgICAgICAgICd8IC9wYXRoL3RvL2NhcHMuanNvbiBdJ1xuICB9XSxcblxuICBbWyctLXJlbGF4ZWQtc2VjdXJpdHknXSwge1xuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGRlc3Q6ICdyZWxheGVkU2VjdXJpdHlFbmFibGVkJyxcbiAgICBhY3Rpb246ICdzdG9yZV90cnVlJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJ0Rpc2FibGUgYWRkaXRpb25hbCBzZWN1cml0eSBjaGVja3MsIHNvIGl0IGlzIHBvc3NpYmxlIHRvIHVzZSBzb21lIGFkdmFuY2VkIGZlYXR1cmVzLCBwcm92aWRlZCAnICtcbiAgICAgICAgICAnYnkgZHJpdmVycyBzdXBwb3J0aW5nIHRoaXMgb3B0aW9uLiBPbmx5IGVuYWJsZSBpdCBpZiBhbGwgdGhlICcgK1xuICAgICAgICAgICdjbGllbnRzIGFyZSBpbiB0aGUgdHJ1c3RlZCBuZXR3b3JrIGFuZCBpdFxcJ3Mgbm90IHRoZSBjYXNlIGlmIGEgY2xpZW50IGNvdWxkIHBvdGVudGlhbGx5ICcgK1xuICAgICAgICAgICdicmVhayBvdXQgb2YgdGhlIHNlc3Npb24gc2FuZGJveC4gU3BlY2lmaWMgZmVhdHVyZXMgY2FuIGJlIG92ZXJyaWRkZW4gYnkgJyArXG4gICAgICAgICAgJ3VzaW5nIHRoZSAtLWRlbnktaW5zZWN1cmUgZmxhZycsXG4gIH1dLFxuXG4gIFtbJy0tYWxsb3ctaW5zZWN1cmUnXSwge1xuICAgIGRlc3Q6ICdhbGxvd0luc2VjdXJlJyxcbiAgICBkZWZhdWx0OiBbXSxcbiAgICB0eXBlOiBwYXJzZVNlY3VyaXR5RmVhdHVyZXMsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICdTZXQgd2hpY2ggaW5zZWN1cmUgZmVhdHVyZXMgYXJlIGFsbG93ZWQgdG8gcnVuIGluIHRoaXMgc2VydmVyXFwncyBzZXNzaW9ucy4gJyArXG4gICAgICAgICAgJ0ZlYXR1cmVzIGFyZSBkZWZpbmVkIG9uIGEgZHJpdmVyIGxldmVsOyBzZWUgZG9jdW1lbnRhdGlvbiBmb3IgbW9yZSBkZXRhaWxzLiAnICtcbiAgICAgICAgICAnVGhpcyBzaG91bGQgYmUgZWl0aGVyIGEgY29tbWEtc2VwYXJhdGVkIGxpc3Qgb2YgZmVhdHVyZSBuYW1lcywgb3IgYSBwYXRoIHRvICcgK1xuICAgICAgICAgICdhIGZpbGUgd2hlcmUgZWFjaCBmZWF0dXJlIG5hbWUgaXMgb24gYSBsaW5lLiBOb3RlIHRoYXQgZmVhdHVyZXMgZGVmaW5lZCB2aWEgJyArXG4gICAgICAgICAgJy0tZGVueS1pbnNlY3VyZSB3aWxsIGJlIGRpc2FibGVkLCBldmVuIGlmIGFsc28gbGlzdGVkIGhlcmUuIEZvciBleGFtcGxlOiAnICtcbiAgICAgICAgICAnZXhlY3V0ZV9kcml2ZXJfc2NyaXB0LGFkYl9zaGVsbCcsXG4gIH1dLFxuXG4gIFtbJy0tZGVueS1pbnNlY3VyZSddLCB7XG4gICAgZGVzdDogJ2RlbnlJbnNlY3VyZScsXG4gICAgZGVmYXVsdDogW10sXG4gICAgdHlwZTogcGFyc2VTZWN1cml0eUZlYXR1cmVzLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiAnU2V0IHdoaWNoIGluc2VjdXJlIGZlYXR1cmVzIGFyZSBub3QgYWxsb3dlZCB0byBydW4gaW4gdGhpcyBzZXJ2ZXJcXCdzIHNlc3Npb25zLiAnICtcbiAgICAgICAgICAnRmVhdHVyZXMgYXJlIGRlZmluZWQgb24gYSBkcml2ZXIgbGV2ZWw7IHNlZSBkb2N1bWVudGF0aW9uIGZvciBtb3JlIGRldGFpbHMuICcgK1xuICAgICAgICAgICdUaGlzIHNob3VsZCBiZSBlaXRoZXIgYSBjb21tYS1zZXBhcmF0ZWQgbGlzdCBvZiBmZWF0dXJlIG5hbWVzLCBvciBhIHBhdGggdG8gJyArXG4gICAgICAgICAgJ2EgZmlsZSB3aGVyZSBlYWNoIGZlYXR1cmUgbmFtZSBpcyBvbiBhIGxpbmUuIEZlYXR1cmVzIGxpc3RlZCBoZXJlIHdpbGwgbm90IGJlICcgK1xuICAgICAgICAgICdlbmFibGVkIGV2ZW4gaWYgYWxzbyBsaXN0ZWQgaW4gLS1hbGxvdy1pbnNlY3VyZSwgYW5kIGV2ZW4gaWYgLS1yZWxheGVkLXNlY3VyaXR5ICcgK1xuICAgICAgICAgICdpcyB0dXJuZWQgb24uIEZvciBleGFtcGxlOiBleGVjdXRlX2RyaXZlcl9zY3JpcHQsYWRiX3NoZWxsJyxcbiAgfV0sXG5cbiAgW1snLS1jb21tYW5kLXRpbWVvdXQnXSwge1xuICAgIGRlZmF1bHQ6IDYwLFxuICAgIGRlc3Q6ICdkZWZhdWx0Q29tbWFuZFRpbWVvdXQnLFxuICAgIHR5cGU6ICdpbnQnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBkZXByZWNhdGVkX2ZvcjogJ25ld0NvbW1hbmRUaW1lb3V0IGNhcGFiaWxpdHknLFxuICAgIGFjdGlvbjogU3RvcmVEZXByZWNhdGVkQWN0aW9uLFxuICAgIGhlbHA6ICdObyBlZmZlY3QuIFRoaXMgdXNlZCB0byBiZSB0aGUgZGVmYXVsdCBjb21tYW5kICcgK1xuICAgICAgICAgICd0aW1lb3V0IGZvciB0aGUgc2VydmVyIHRvIHVzZSBmb3IgYWxsIHNlc3Npb25zIChpbiBzZWNvbmRzIGFuZCAnICtcbiAgICAgICAgICAnc2hvdWxkIGJlIGxlc3MgdGhhbiAyMTQ3NDgzKS4gVXNlIG5ld0NvbW1hbmRUaW1lb3V0IGNhcCBpbnN0ZWFkJ1xuICB9XSxcblxuICBbWyctaycsICctLWtlZXAtYXJ0aWZhY3RzJ10sIHtcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBkZXN0OiAna2VlcEFydGlmYWN0cycsXG4gICAgYWN0aW9uOiBTdG9yZURlcHJlY2F0ZWRUcnVlQWN0aW9uLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiAnTm8gZWZmZWN0LCB0cmFjZSBpcyBub3cgaW4gdG1wIGRpciBieSBkZWZhdWx0IGFuZCBpcyAnICtcbiAgICAgICAgICAnY2xlYXJlZCBiZWZvcmUgZWFjaCBydW4uIFBsZWFzZSBhbHNvIHJlZmVyIHRvIHRoZSAtLXRyYWNlLWRpciBmbGFnLicsXG4gIH1dLFxuXG4gIFtbJy0tcGxhdGZvcm0tbmFtZSddLCB7XG4gICAgZGVzdDogJ3BsYXRmb3JtTmFtZScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgYWN0aW9uOiBTdG9yZURlcHJlY2F0ZWREZWZhdWx0Q2FwYWJpbGl0eUFjdGlvbixcbiAgICBoZWxwOiAnTmFtZSBvZiB0aGUgbW9iaWxlIHBsYXRmb3JtOiBpT1MsIEFuZHJvaWQsIG9yIEZpcmVmb3hPUycsXG4gIH1dLFxuXG4gIFtbJy0tcGxhdGZvcm0tdmVyc2lvbiddLCB7XG4gICAgZGVzdDogJ3BsYXRmb3JtVmVyc2lvbicsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgYWN0aW9uOiBTdG9yZURlcHJlY2F0ZWREZWZhdWx0Q2FwYWJpbGl0eUFjdGlvbixcbiAgICBoZWxwOiAnVmVyc2lvbiBvZiB0aGUgbW9iaWxlIHBsYXRmb3JtJyxcbiAgfV0sXG5cbiAgW1snLS1hdXRvbWF0aW9uLW5hbWUnXSwge1xuICAgIGRlc3Q6ICdhdXRvbWF0aW9uTmFtZScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgYWN0aW9uOiBTdG9yZURlcHJlY2F0ZWREZWZhdWx0Q2FwYWJpbGl0eUFjdGlvbixcbiAgICBoZWxwOiAnTmFtZSBvZiB0aGUgYXV0b21hdGlvbiB0b29sOiBBcHBpdW0sIFhDVUlUZXN0LCBldGMuJyxcbiAgfV0sXG5cbiAgW1snLS1kZXZpY2UtbmFtZSddLCB7XG4gICAgZGVzdDogJ2RldmljZU5hbWUnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogU3RvcmVEZXByZWNhdGVkRGVmYXVsdENhcGFiaWxpdHlBY3Rpb24sXG4gICAgaGVscDogJ05hbWUgb2YgdGhlIG1vYmlsZSBkZXZpY2UgdG8gdXNlLCBmb3IgZXhhbXBsZTogJyArXG4gICAgICAgICAgJ2lQaG9uZSBSZXRpbmEgKDQtaW5jaCksIEFuZHJvaWQgRW11bGF0b3InLFxuICB9XSxcblxuICBbWyctLWJyb3dzZXItbmFtZSddLCB7XG4gICAgZGVzdDogJ2Jyb3dzZXJOYW1lJyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBhY3Rpb246IFN0b3JlRGVwcmVjYXRlZERlZmF1bHRDYXBhYmlsaXR5QWN0aW9uLFxuICAgIGhlbHA6ICdOYW1lIG9mIHRoZSBtb2JpbGUgYnJvd3NlcjogU2FmYXJpIG9yIENocm9tZScsXG4gIH1dLFxuXG4gIFtbJy0tYXBwJ10sIHtcbiAgICBkZXN0OiAnYXBwJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBhY3Rpb246IFN0b3JlRGVwcmVjYXRlZERlZmF1bHRDYXBhYmlsaXR5QWN0aW9uLFxuICAgIGhlbHA6ICdJT1M6IGFicyBwYXRoIHRvIHNpbXVsYXRvci1jb21waWxlZCAuYXBwIGZpbGUgb3IgdGhlICcgK1xuICAgICAgICAgICdidW5kbGVfaWQgb2YgdGhlIGRlc2lyZWQgdGFyZ2V0IG9uIGRldmljZTsgQW5kcm9pZDogYWJzIHBhdGggdG8gLmFwayBmaWxlJyxcbiAgfV0sXG5cbiAgW1snLWx0JywgJy0tbGF1bmNoLXRpbWVvdXQnXSwge1xuICAgIGRlZmF1bHQ6IDkwMDAwLFxuICAgIGRlc3Q6ICdsYXVuY2hUaW1lb3V0JyxcbiAgICB0eXBlOiAnaW50JyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgYWN0aW9uOiBTdG9yZURlcHJlY2F0ZWREZWZhdWx0Q2FwYWJpbGl0eUFjdGlvbixcbiAgICBoZWxwOiAnKGlPUy1vbmx5KSBob3cgbG9uZyBpbiBtcyB0byB3YWl0IGZvciBJbnN0cnVtZW50cyB0byBsYXVuY2gnLFxuICB9XSxcblxuICBbWyctLWxhbmd1YWdlJ10sIHtcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGRlc3Q6ICdsYW5ndWFnZScsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogU3RvcmVEZXByZWNhdGVkRGVmYXVsdENhcGFiaWxpdHlBY3Rpb24sXG4gICAgaGVscDogJ0xhbmd1YWdlIGZvciB0aGUgaU9TIHNpbXVsYXRvciAvIEFuZHJvaWQgRW11bGF0b3IsIGxpa2U6IGVuLCBlcycsXG4gIH1dLFxuXG4gIFtbJy0tbG9jYWxlJ10sIHtcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGRlc3Q6ICdsb2NhbGUnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBhY3Rpb246IFN0b3JlRGVwcmVjYXRlZERlZmF1bHRDYXBhYmlsaXR5QWN0aW9uLFxuICAgIGhlbHA6ICdMb2NhbGUgZm9yIHRoZSBpT1Mgc2ltdWxhdG9yIC8gQW5kcm9pZCBFbXVsYXRvciwgbGlrZSBlbl9VUywgZGVfREUnLFxuICB9XSxcblxuICBbWyctVScsICctLXVkaWQnXSwge1xuICAgIGRlc3Q6ICd1ZGlkJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBhY3Rpb246IFN0b3JlRGVwcmVjYXRlZERlZmF1bHRDYXBhYmlsaXR5QWN0aW9uLFxuICAgIGhlbHA6ICdVbmlxdWUgZGV2aWNlIGlkZW50aWZpZXIgb2YgdGhlIGNvbm5lY3RlZCBwaHlzaWNhbCBkZXZpY2UnLFxuICB9XSxcblxuICBbWyctLW9yaWVudGF0aW9uJ10sIHtcbiAgICBkZXN0OiAnb3JpZW50YXRpb24nLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogU3RvcmVEZXByZWNhdGVkRGVmYXVsdENhcGFiaWxpdHlBY3Rpb24sXG4gICAgaGVscDogJyhJT1Mtb25seSkgdXNlIExBTkRTQ0FQRSBvciBQT1JUUkFJVCB0byBpbml0aWFsaXplIGFsbCByZXF1ZXN0cyAnICtcbiAgICAgICAgICAndG8gdGhpcyBvcmllbnRhdGlvbicsXG4gIH1dLFxuXG4gIFtbJy0tbm8tcmVzZXQnXSwge1xuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGRlc3Q6ICdub1Jlc2V0JyxcbiAgICBhY3Rpb246IFN0b3JlRGVwcmVjYXRlZERlZmF1bHRDYXBhYmlsaXR5VHJ1ZUFjdGlvbixcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJ0RvIG5vdCByZXNldCBhcHAgc3RhdGUgYmV0d2VlbiBzZXNzaW9ucyAoSU9TOiBkbyBub3QgZGVsZXRlIGFwcCAnICtcbiAgICAgICAgICAncGxpc3QgZmlsZXM7IEFuZHJvaWQ6IGRvIG5vdCB1bmluc3RhbGwgYXBwIGJlZm9yZSBuZXcgc2Vzc2lvbiknLFxuICB9XSxcblxuICBbWyctLWZ1bGwtcmVzZXQnXSwge1xuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGRlc3Q6ICdmdWxsUmVzZXQnLFxuICAgIGFjdGlvbjogU3RvcmVEZXByZWNhdGVkRGVmYXVsdENhcGFiaWxpdHlUcnVlQWN0aW9uLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiAnKGlPUykgRGVsZXRlIHRoZSBlbnRpcmUgc2ltdWxhdG9yIGZvbGRlci4gKEFuZHJvaWQpIFJlc2V0IGFwcCAnICtcbiAgICAgICAgICAnc3RhdGUgYnkgdW5pbnN0YWxsaW5nIGFwcCBpbnN0ZWFkIG9mIGNsZWFyaW5nIGFwcCBkYXRhLiBPbiAnICtcbiAgICAgICAgICAnQW5kcm9pZCwgdGhpcyB3aWxsIGFsc28gcmVtb3ZlIHRoZSBhcHAgYWZ0ZXIgdGhlIHNlc3Npb24gaXMgY29tcGxldGUuJyxcbiAgfV0sXG5cbiAgW1snLS1hcHAtcGtnJ10sIHtcbiAgICBkZXN0OiAnYXBwUGFja2FnZScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgYWN0aW9uOiBTdG9yZURlcHJlY2F0ZWREZWZhdWx0Q2FwYWJpbGl0eUFjdGlvbixcbiAgICBoZWxwOiAnKEFuZHJvaWQtb25seSkgSmF2YSBwYWNrYWdlIG9mIHRoZSBBbmRyb2lkIGFwcCB5b3Ugd2FudCB0byBydW4gJyArXG4gICAgICAgICAgJyhlLmcuLCBjb20uZXhhbXBsZS5hbmRyb2lkLm15QXBwKScsXG4gIH1dLFxuXG4gIFtbJy0tYXBwLWFjdGl2aXR5J10sIHtcbiAgICBkZXN0OiAnYXBwQWN0aXZpdHknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogU3RvcmVEZXByZWNhdGVkRGVmYXVsdENhcGFiaWxpdHlBY3Rpb24sXG4gICAgaGVscDogJyhBbmRyb2lkLW9ubHkpIEFjdGl2aXR5IG5hbWUgZm9yIHRoZSBBbmRyb2lkIGFjdGl2aXR5IHlvdSB3YW50ICcgK1xuICAgICAgICAgICd0byBsYXVuY2ggZnJvbSB5b3VyIHBhY2thZ2UgKGUuZy4sIE1haW5BY3Rpdml0eSknLFxuICB9XSxcblxuICBbWyctLWFwcC13YWl0LXBhY2thZ2UnXSwge1xuICAgIGRlc3Q6ICdhcHBXYWl0UGFja2FnZScsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogU3RvcmVEZXByZWNhdGVkRGVmYXVsdENhcGFiaWxpdHlBY3Rpb24sXG4gICAgaGVscDogJyhBbmRyb2lkLW9ubHkpIFBhY2thZ2UgbmFtZSBmb3IgdGhlIEFuZHJvaWQgYWN0aXZpdHkgeW91IHdhbnQgJyArXG4gICAgICAgICAgJ3RvIHdhaXQgZm9yIChlLmcuLCBjb20uZXhhbXBsZS5hbmRyb2lkLm15QXBwKScsXG4gIH1dLFxuXG4gIFtbJy0tYXBwLXdhaXQtYWN0aXZpdHknXSwge1xuICAgIGRlc3Q6ICdhcHBXYWl0QWN0aXZpdHknLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBhY3Rpb246IFN0b3JlRGVwcmVjYXRlZERlZmF1bHRDYXBhYmlsaXR5QWN0aW9uLFxuICAgIGhlbHA6ICcoQW5kcm9pZC1vbmx5KSBBY3Rpdml0eSBuYW1lIGZvciB0aGUgQW5kcm9pZCBhY3Rpdml0eSB5b3Ugd2FudCAnICtcbiAgICAgICAgICAndG8gd2FpdCBmb3IgKGUuZy4sIFNwbGFzaEFjdGl2aXR5KScsXG4gIH1dLFxuXG4gIFtbJy0tZGV2aWNlLXJlYWR5LXRpbWVvdXQnXSwge1xuICAgIGRlc3Q6ICdkZXZpY2VSZWFkeVRpbWVvdXQnLFxuICAgIGRlZmF1bHQ6IDUsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIHR5cGU6ICdpbnQnLFxuICAgIGFjdGlvbjogU3RvcmVEZXByZWNhdGVkRGVmYXVsdENhcGFiaWxpdHlBY3Rpb24sXG4gICAgaGVscDogJyhBbmRyb2lkLW9ubHkpIFRpbWVvdXQgaW4gc2Vjb25kcyB3aGlsZSB3YWl0aW5nIGZvciBkZXZpY2UgdG8gYmVjb21lIHJlYWR5JyxcbiAgfV0sXG5cbiAgW1snLS1hbmRyb2lkLWNvdmVyYWdlJ10sIHtcbiAgICBkZXN0OiAnYW5kcm9pZENvdmVyYWdlJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgYWN0aW9uOiBTdG9yZURlcHJlY2F0ZWREZWZhdWx0Q2FwYWJpbGl0eUFjdGlvbixcbiAgICBoZWxwOiAnKEFuZHJvaWQtb25seSkgRnVsbHkgcXVhbGlmaWVkIGluc3RydW1lbnRhdGlvbiBjbGFzcy4gUGFzc2VkIHRvIC13IGluICcgK1xuICAgICAgICAgICdhZGIgc2hlbGwgYW0gaW5zdHJ1bWVudCAtZSBjb3ZlcmFnZSB0cnVlIC13ICcgK1xuICAgICAgICAgICcoZS5nLiBjb20ubXkuUGtnL2NvbS5teS5Qa2cuaW5zdHJ1bWVudGF0aW9uLk15SW5zdHJ1bWVudGF0aW9uKScsXG4gIH1dLFxuXG4gIFtbJy0tYXZkJ10sIHtcbiAgICBkZXN0OiAnYXZkJyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBhY3Rpb246IFN0b3JlRGVwcmVjYXRlZERlZmF1bHRDYXBhYmlsaXR5QWN0aW9uLFxuICAgIGhlbHA6ICcoQW5kcm9pZC1vbmx5KSBOYW1lIG9mIHRoZSBhdmQgdG8gbGF1bmNoIChlLmcuIEBOZXh1c181KScsXG4gIH1dLFxuXG4gIFtbJy0tYXZkLWFyZ3MnXSwge1xuICAgIGRlc3Q6ICdhdmRBcmdzJyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBhY3Rpb246IFN0b3JlRGVwcmVjYXRlZERlZmF1bHRDYXBhYmlsaXR5QWN0aW9uLFxuICAgIGhlbHA6ICcoQW5kcm9pZC1vbmx5KSBBZGRpdGlvbmFsIGVtdWxhdG9yIGFyZ3VtZW50cyB0byBsYXVuY2ggdGhlIGF2ZCAoZS5nLiAtbm8tc25hcHNob3QtbG9hZCknLFxuICB9XSxcblxuICBbWyctLXVzZS1rZXlzdG9yZSddLCB7XG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgZGVzdDogJ3VzZUtleXN0b3JlJyxcbiAgICBhY3Rpb246IFN0b3JlRGVwcmVjYXRlZERlZmF1bHRDYXBhYmlsaXR5VHJ1ZUFjdGlvbixcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJyhBbmRyb2lkLW9ubHkpIFdoZW4gc2V0IHRoZSBrZXlzdG9yZSB3aWxsIGJlIHVzZWQgdG8gc2lnbiBhcGtzLicsXG4gIH1dLFxuXG4gIFtbJy0ta2V5c3RvcmUtcGF0aCddLCB7XG4gICAgZGVmYXVsdDogcGF0aC5yZXNvbHZlKHByb2Nlc3MuZW52LkhPTUUgfHwgcHJvY2Vzcy5lbnYuVVNFUlBST0ZJTEUgfHwgJycsICcuYW5kcm9pZCcsICdkZWJ1Zy5rZXlzdG9yZScpLFxuICAgIGRlc3Q6ICdrZXlzdG9yZVBhdGgnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBhY3Rpb246IFN0b3JlRGVwcmVjYXRlZERlZmF1bHRDYXBhYmlsaXR5QWN0aW9uLFxuICAgIGhlbHA6ICcoQW5kcm9pZC1vbmx5KSBQYXRoIHRvIGtleXN0b3JlJyxcbiAgfV0sXG5cbiAgW1snLS1rZXlzdG9yZS1wYXNzd29yZCddLCB7XG4gICAgZGVmYXVsdDogJ2FuZHJvaWQnLFxuICAgIGRlc3Q6ICdrZXlzdG9yZVBhc3N3b3JkJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgYWN0aW9uOiBTdG9yZURlcHJlY2F0ZWREZWZhdWx0Q2FwYWJpbGl0eUFjdGlvbixcbiAgICBoZWxwOiAnKEFuZHJvaWQtb25seSkgUGFzc3dvcmQgdG8ga2V5c3RvcmUnLFxuICB9XSxcblxuICBbWyctLWtleS1hbGlhcyddLCB7XG4gICAgZGVmYXVsdDogJ2FuZHJvaWRkZWJ1Z2tleScsXG4gICAgZGVzdDogJ2tleUFsaWFzJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgYWN0aW9uOiBTdG9yZURlcHJlY2F0ZWREZWZhdWx0Q2FwYWJpbGl0eUFjdGlvbixcbiAgICBoZWxwOiAnKEFuZHJvaWQtb25seSkgS2V5IGFsaWFzJyxcbiAgfV0sXG5cbiAgW1snLS1rZXktcGFzc3dvcmQnXSwge1xuICAgIGRlZmF1bHQ6ICdhbmRyb2lkJyxcbiAgICBkZXN0OiAna2V5UGFzc3dvcmQnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBhY3Rpb246IFN0b3JlRGVwcmVjYXRlZERlZmF1bHRDYXBhYmlsaXR5QWN0aW9uLFxuICAgIGhlbHA6ICcoQW5kcm9pZC1vbmx5KSBLZXkgcGFzc3dvcmQnLFxuICB9XSxcblxuICBbWyctLWludGVudC1hY3Rpb24nXSwge1xuICAgIGRlc3Q6ICdpbnRlbnRBY3Rpb24nLFxuICAgIGRlZmF1bHQ6ICdhbmRyb2lkLmludGVudC5hY3Rpb24uTUFJTicsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogU3RvcmVEZXByZWNhdGVkRGVmYXVsdENhcGFiaWxpdHlBY3Rpb24sXG4gICAgaGVscDogJyhBbmRyb2lkLW9ubHkpIEludGVudCBhY3Rpb24gd2hpY2ggd2lsbCBiZSB1c2VkIHRvIHN0YXJ0IGFjdGl2aXR5IChlLmcuIGFuZHJvaWQuaW50ZW50LmFjdGlvbi5NQUlOKScsXG4gIH1dLFxuXG4gIFtbJy0taW50ZW50LWNhdGVnb3J5J10sIHtcbiAgICBkZXN0OiAnaW50ZW50Q2F0ZWdvcnknLFxuICAgIGRlZmF1bHQ6ICdhbmRyb2lkLmludGVudC5jYXRlZ29yeS5MQVVOQ0hFUicsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogU3RvcmVEZXByZWNhdGVkRGVmYXVsdENhcGFiaWxpdHlBY3Rpb24sXG4gICAgaGVscDogJyhBbmRyb2lkLW9ubHkpIEludGVudCBjYXRlZ29yeSB3aGljaCB3aWxsIGJlIHVzZWQgdG8gc3RhcnQgYWN0aXZpdHkgJyArXG4gICAgICAgICAgJyhlLmcuIGFuZHJvaWQuaW50ZW50LmNhdGVnb3J5LkFQUF9DT05UQUNUUyknLFxuICB9XSxcblxuICBbWyctLWludGVudC1mbGFncyddLCB7XG4gICAgZGVzdDogJ2ludGVudEZsYWdzJyxcbiAgICBkZWZhdWx0OiAnMHgxMDIwMDAwMCcsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogU3RvcmVEZXByZWNhdGVkRGVmYXVsdENhcGFiaWxpdHlBY3Rpb24sXG4gICAgaGVscDogJyhBbmRyb2lkLW9ubHkpIEZsYWdzIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHN0YXJ0IGFjdGl2aXR5IChlLmcuIDB4MTAyMDAwMDApJyxcbiAgfV0sXG5cbiAgW1snLS1pbnRlbnQtYXJncyddLCB7XG4gICAgZGVzdDogJ29wdGlvbmFsSW50ZW50QXJndW1lbnRzJyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBhY3Rpb246IFN0b3JlRGVwcmVjYXRlZERlZmF1bHRDYXBhYmlsaXR5QWN0aW9uLFxuICAgIGhlbHA6ICcoQW5kcm9pZC1vbmx5KSBBZGRpdGlvbmFsIGludGVudCBhcmd1bWVudHMgdGhhdCB3aWxsIGJlIHVzZWQgdG8gc3RhcnQgYWN0aXZpdHkgIChlLmcuIDB4MTAyMDAwMDApJyxcbiAgfV0sXG5cbiAgW1snLS1kb250LXN0b3AtYXBwLW9uLXJlc2V0J10sIHtcbiAgICBkZXN0OiAnZG9udFN0b3BBcHBPblJlc2V0JyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgYWN0aW9uOiBTdG9yZURlcHJlY2F0ZWREZWZhdWx0Q2FwYWJpbGl0eVRydWVBY3Rpb24sXG4gICAgaGVscDogJyhBbmRyb2lkLW9ubHkpIFdoZW4gaW5jbHVkZWQsIHJlZnJhaW5zIGZyb20gc3RvcHBpbmcgdGhlIGFwcCBiZWZvcmUgcmVzdGFydCcsXG4gIH1dLFxuXG4gIFtbJy0tY2FsZW5kYXItZm9ybWF0J10sIHtcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGRlc3Q6ICdjYWxlbmRhckZvcm1hdCcsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogU3RvcmVEZXByZWNhdGVkRGVmYXVsdENhcGFiaWxpdHlBY3Rpb24sXG4gICAgaGVscDogJyhJT1Mtb25seSkgY2FsZW5kYXIgZm9ybWF0IGZvciB0aGUgaU9TIHNpbXVsYXRvciAoZS5nLiBncmVnb3JpYW4pJyxcbiAgfV0sXG5cbiAgW1snLS1uYXRpdmUtaW5zdHJ1bWVudHMtbGliJ10sIHtcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBkZXN0OiAnbmF0aXZlSW5zdHJ1bWVudHNMaWInLFxuICAgIGFjdGlvbjogU3RvcmVEZXByZWNhdGVkRGVmYXVsdENhcGFiaWxpdHlUcnVlQWN0aW9uLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiAnKElPUy1vbmx5KSBJT1MgaGFzIGEgd2VpcmQgYnVpbHQtaW4gdW5hdm9pZGFibGUgJyArXG4gICAgICAgICAgJ2RlbGF5LiBXZSBwYXRjaCB0aGlzIGluIGFwcGl1bS4gSWYgeW91IGRvIG5vdCB3YW50IGl0IHBhdGNoZWQsIHBhc3MgaW4gdGhpcyBmbGFnLicsXG4gIH1dLFxuXG4gIFtbJy0ta2VlcC1rZXljaGFpbnMnXSwge1xuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGRlc3Q6ICdrZWVwS2V5Q2hhaW5zJyxcbiAgICBhY3Rpb246IFN0b3JlRGVwcmVjYXRlZERlZmF1bHRDYXBhYmlsaXR5VHJ1ZUFjdGlvbixcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJyhpT1Mtb25seSkgV2hldGhlciB0byBrZWVwIGtleWNoYWlucyAnICtcbiAgICAgICAgICAnKExpYnJhcnkvS2V5Y2hhaW5zKSB3aGVuIHJlc2V0IGFwcCBiZXR3ZWVuIHNlc3Npb25zJyxcbiAgfV0sXG5cbiAgW1snLS1sb2NhbGl6YWJsZS1zdHJpbmdzLWRpciddLCB7XG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlc3Q6ICdsb2NhbGl6YWJsZVN0cmluZ3NEaXInLFxuICAgIGRlZmF1bHQ6ICdlbi5scHJvaicsXG4gICAgYWN0aW9uOiBTdG9yZURlcHJlY2F0ZWREZWZhdWx0Q2FwYWJpbGl0eUFjdGlvbixcbiAgICBoZWxwOiAnKElPUy1vbmx5KSB0aGUgcmVsYXRpdmUgcGF0aCBvZiB0aGUgZGlyIHdoZXJlIExvY2FsaXphYmxlLnN0cmluZ3MgZmlsZSByZXNpZGVzIChlLmcuIGVuLmxwcm9qKScsXG4gIH1dLFxuXG4gIFtbJy0tc2hvdy1pb3MtbG9nJ10sIHtcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBkZXN0OiAnc2hvd0lPU0xvZycsXG4gICAgYWN0aW9uOiBTdG9yZURlcHJlY2F0ZWREZWZhdWx0Q2FwYWJpbGl0eVRydWVBY3Rpb24sXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICcoSU9TLW9ubHkpIGlmIHNldCwgdGhlIGlPUyBzeXN0ZW0gbG9nIHdpbGwgYmUgd3JpdHRlbiB0byB0aGUgY29uc29sZScsXG4gIH1dLFxuXG4gIFtbJy0tYXN5bmMtdHJhY2UnXSwge1xuICAgIGRlc3Q6ICdsb25nU3RhY2t0cmFjZScsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogU3RvcmVEZXByZWNhdGVkRGVmYXVsdENhcGFiaWxpdHlUcnVlQWN0aW9uLFxuICAgIGhlbHA6ICdBZGQgbG9uZyBzdGFjayB0cmFjZXMgdG8gbG9nIGVudHJpZXMuIFJlY29tbWVuZGVkIGZvciBkZWJ1Z2dpbmcgb25seS4nLFxuICB9XSxcblxuICBbWyctLWNocm9tZWRyaXZlci1wb3J0J10sIHtcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGRlc3Q6ICdjaHJvbWVkcml2ZXJQb3J0JyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgdHlwZTogJ2ludCcsXG4gICAgYWN0aW9uOiBTdG9yZURlcHJlY2F0ZWREZWZhdWx0Q2FwYWJpbGl0eUFjdGlvbixcbiAgICBoZWxwOiAnUG9ydCB1cG9uIHdoaWNoIENocm9tZURyaXZlciB3aWxsIHJ1bi4gSWYgbm90IGdpdmVuLCAnICtcbiAgICAgICAgICAnQW5kcm9pZCBkcml2ZXIgd2lsbCBwaWNrIGEgcmFuZG9tIGF2YWlsYWJsZSBwb3J0LicsXG4gIH1dLFxuXG4gIFtbJy0tbG9nLWZpbHRlcnMnXSwge1xuICAgIGRlc3Q6ICdsb2dGaWx0ZXJzJyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiAnU2V0IHRoZSBmdWxsIHBhdGggdG8gYSBKU09OIGZpbGUgY29udGFpbmluZyBvbmUgb3IgbW9yZSBsb2cgZmlsdGVyaW5nIHJ1bGVzJyxcbiAgfV0sXG5dO1xuXG5mdW5jdGlvbiBwYXJzZVNlY3VyaXR5RmVhdHVyZXMgKGZlYXR1cmVzKSB7XG4gIGNvbnN0IHNwbGl0dGVyID0gKHNwbGl0T24sIHN0cikgPT4gYCR7c3RyfWAuc3BsaXQoc3BsaXRPbilcbiAgICAubWFwKChzKSA9PiBzLnRyaW0oKSlcbiAgICAuZmlsdGVyKEJvb2xlYW4pO1xuICBsZXQgcGFyc2VkRmVhdHVyZXM7XG4gIHRyeSB7XG4gICAgcGFyc2VkRmVhdHVyZXMgPSBzcGxpdHRlcignLCcsIGZlYXR1cmVzKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ291bGQgbm90IHBhcnNlIHZhbHVlIG9mIC0tYWxsb3cvZGVueS1pbnNlY3VyZS4gU2hvdWxkIGJlICcgK1xuICAgICAgJ2EgbGlzdCBvZiBzdHJpbmdzIHNlcGFyYXRlZCBieSBjb21tYXMsIG9yIGEgcGF0aCB0byBhIGZpbGUgJyArXG4gICAgICAnbGlzdGluZyBvbmUgZmVhdHVyZSBuYW1lIHBlciBsaW5lLicpO1xuICB9XG5cbiAgaWYgKHBhcnNlZEZlYXR1cmVzLmxlbmd0aCA9PT0gMSAmJiBmcy5leGlzdHNTeW5jKHBhcnNlZEZlYXR1cmVzWzBdKSkge1xuICAgIC8vIHdlIG1pZ2h0IGhhdmUgYSBmaWxlIHdoaWNoIGlzIGEgbGlzdCBvZiBmZWF0dXJlc1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBmaWxlRmVhdHVyZXMgPSBmcy5yZWFkRmlsZVN5bmMocGFyc2VkRmVhdHVyZXNbMF0sICd1dGY4Jyk7XG4gICAgICBwYXJzZWRGZWF0dXJlcyA9IHNwbGl0dGVyKCdcXG4nLCBmaWxlRmVhdHVyZXMpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgQXR0ZW1wdGVkIHRvIHJlYWQgLS1hbGxvdy9kZW55LWluc2VjdXJlIGZlYXR1cmUgbmFtZXMgYCArXG4gICAgICAgIGBmcm9tIGZpbGUgJHtwYXJzZWRGZWF0dXJlc1swXX0gYnV0IGdvdCBlcnJvcjogJHtlcnIubWVzc2FnZX1gKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFyc2VkRmVhdHVyZXM7XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGVmYXVsdENhcHMgKGNhcHNPclBhdGgpIHtcbiAgbGV0IGNhcHMgPSBjYXBzT3JQYXRoO1xuICBsZXQgbG9hZGVkRnJvbUZpbGUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICAvLyB1c2Ugc3luY2hyb25vdXMgZmlsZSBhY2Nlc3MsIGFzIGBhcmdwYXJzZWAgcHJvdmlkZXMgbm8gd2F5IG9mIGVpdGhlclxuICAgIC8vIGF3YWl0aW5nIG9yIHVzaW5nIGNhbGxiYWNrcy4gVGhpcyBzdGVwIGhhcHBlbnMgaW4gc3RhcnR1cCwgaW4gd2hhdCBpc1xuICAgIC8vIGVmZmVjdGl2ZWx5IGNvbW1hbmQtbGluZSBjb2RlLCBzbyBub3RoaW5nIGlzIGJsb2NrZWQgaW4gdGVybXMgb2ZcbiAgICAvLyBzZXNzaW9ucywgc28gaG9sZGluZyB1cCB0aGUgZXZlbnQgbG9vcCBkb2VzIG5vdCBpbmN1ciB0aGUgdXN1YWxcbiAgICAvLyBkcmF3YmFja3MuXG4gICAgaWYgKF8uaXNTdHJpbmcoY2Fwc09yUGF0aCkgJiYgZnMuc3RhdFN5bmMoY2Fwc09yUGF0aCkuaXNGaWxlKCkpIHtcbiAgICAgIGNhcHMgPSBmcy5yZWFkRmlsZVN5bmMoY2Fwc09yUGF0aCwgJ3V0ZjgnKTtcbiAgICAgIGxvYWRlZEZyb21GaWxlID0gdHJ1ZTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIC8vIG5vdCBhIGZpbGUsIG9yIG5vdCByZWFkYWJsZVxuICB9XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gSlNPTi5wYXJzZShjYXBzKTtcbiAgICBpZiAoIV8uaXNQbGFpbk9iamVjdChyZXN1bHQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCcke18udHJ1bmNhdGUocmVzdWx0LCB7bGVuZ3RoOiAxMDB9KX0nIGlzIG5vdCBhbiBvYmplY3RgKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnN0IG1zZyA9IGxvYWRlZEZyb21GaWxlXG4gICAgICA/IGBEZWZhdWx0IGNhcGFiaWxpdGllcyBpbiAnJHtjYXBzT3JQYXRofScgbXVzdCBiZSBhIHZhbGlkIEpTT05gXG4gICAgICA6IGBEZWZhdWx0IGNhcGFiaWxpdGllcyBtdXN0IGJlIGEgdmFsaWQgSlNPTmA7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHttc2d9LiBPcmlnaW5hbCBlcnJvcjogJHtlLm1lc3NhZ2V9YCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0UGFyc2VyICgpIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IEFyZ3VtZW50UGFyc2VyKHtcbiAgICBhZGRfaGVscDogdHJ1ZSxcbiAgICBkZXNjcmlwdGlvbjogJ0Egd2ViZHJpdmVyLWNvbXBhdGlibGUgc2VydmVyIGZvciB1c2Ugd2l0aCBuYXRpdmUgYW5kIGh5YnJpZCBpT1MgYW5kIEFuZHJvaWQgYXBwbGljYXRpb25zLicsXG4gICAgcHJvZzogcHJvY2Vzcy5hcmd2WzFdIHx8ICdBcHBpdW0nXG4gIH0pO1xuICBwYXJzZXIucmF3QXJncyA9IGFyZ3M7XG4gIGZvciAoY29uc3QgW2ZsYWdzT3JOYW1lcywgb3B0aW9uc10gb2YgYXJncykge1xuICAgIHBhcnNlci5hZGRfYXJndW1lbnQoLi4uZmxhZ3NPck5hbWVzLCBvcHRpb25zKTtcbiAgfVxuICBwYXJzZXIuYWRkX2FyZ3VtZW50KCctdicsICctLXZlcnNpb24nLCB7XG4gICAgYWN0aW9uOiAndmVyc2lvbicsXG4gICAgdmVyc2lvbjogcmVxdWlyZShwYXRoLnJlc29sdmUocm9vdERpciwgJ3BhY2thZ2UuanNvbicpKS52ZXJzaW9uLFxuICB9KTtcbiAgcmV0dXJuIHBhcnNlcjtcbn1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdEFyZ3MgKCkge1xuICByZXR1cm4gYXJncy5yZWR1Y2UoKGFjYywgWywge2Rlc3QsIGRlZmF1bHQ6IGRlZmF1bHRWYWx1ZX1dKSA9PiB7XG4gICAgYWNjW2Rlc3RdID0gZGVmYXVsdFZhbHVlO1xuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UGFyc2VyO1xuZXhwb3J0IHsgZ2V0RGVmYXVsdEFyZ3MsIGdldFBhcnNlciB9O1xuIl0sImZpbGUiOiJsaWIvcGFyc2VyLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uIn0=
