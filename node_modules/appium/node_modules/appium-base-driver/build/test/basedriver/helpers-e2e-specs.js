"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("source-map-support/register");

var _chai = _interopRequireDefault(require("chai"));

var _path = _interopRequireDefault(require("path"));

var _url = _interopRequireDefault(require("url"));

var _chaiAsPromised = _interopRequireDefault(require("chai-as-promised"));

var _appiumSupport = require("appium-support");

var _helpers = require("../../lib/basedriver/helpers");

var _http = _interopRequireDefault(require("http"));

var _finalhandler = _interopRequireDefault(require("finalhandler"));

var _serveStatic = _interopRequireDefault(require("serve-static"));

var _contentDisposition = _interopRequireDefault(require("content-disposition"));

var _bluebird = _interopRequireDefault(require("bluebird"));

_chai.default.should();

_chai.default.use(_chaiAsPromised.default);

function getFixture(file) {
  return _path.default.resolve(__dirname, '..', '..', '..', 'test', 'basedriver', 'fixtures', file);
}

describe('app download and configuration', function () {
  describe('configureApp', function () {
    it('should get the path for a local .app', async function () {
      let newAppPath = await (0, _helpers.configureApp)(getFixture('FakeIOSApp.app'), '.app');
      newAppPath.should.contain('FakeIOSApp.app');
      let contents = await _appiumSupport.fs.readFile(newAppPath, 'utf8');
      contents.should.eql('this is not really an app\n');
    });
    it('should get the path for a local .apk', async function () {
      let newAppPath = await (0, _helpers.configureApp)(getFixture('FakeAndroidApp.apk'), '.apk');
      newAppPath.should.contain('FakeAndroidApp.apk');
      let contents = await _appiumSupport.fs.readFile(newAppPath, 'utf8');
      contents.should.eql('this is not really an apk\n');
    });
    it('should unzip and get the path for a local .app.zip', async function () {
      let newAppPath = await (0, _helpers.configureApp)(getFixture('FakeIOSApp.app.zip'), '.app');
      newAppPath.should.contain('FakeIOSApp.app');
      let contents = await _appiumSupport.fs.readFile(newAppPath, 'utf8');
      contents.should.eql('this is not really an app\n');
    });
    it('should unzip and get the path for a local .ipa', async function () {
      let newAppPath = await (0, _helpers.configureApp)(getFixture('FakeIOSApp.ipa'), '.app');
      newAppPath.should.contain('FakeIOSApp.app');
      let contents = await _appiumSupport.fs.readFile(newAppPath, 'utf8');
      contents.should.eql('this is not really an app\n');
    });
    it('should fail for a bad zip file', async function () {
      await (0, _helpers.configureApp)(getFixture('BadZippedApp.zip'), '.app').should.be.rejectedWith(/PK/);
    });
    it('should fail if extensions do not match', async function () {
      await (0, _helpers.configureApp)(getFixture('FakeIOSApp.app'), '.wrong').should.be.rejectedWith(/did not have extension/);
    });
    it('should fail if zip file does not contain an app whose extension matches', async function () {
      await (0, _helpers.configureApp)(getFixture('FakeIOSApp.app.zip'), '.wrong').should.be.rejectedWith(/did not have extension/);
    });
    describe('should download an app from the web', function () {
      const port = 8000;
      const serverUrl = `http://localhost:${port}`;
      describe('server not available', function () {
        it('should handle server not available', async function () {
          await (0, _helpers.configureApp)(`${serverUrl}/FakeIOSApp.app.zip`, '.app').should.eventually.be.rejectedWith(/ECONNREFUSED/);
        });
      });
      describe('server available', function () {
        let server;
        before(function () {
          const dir = _path.default.resolve(__dirname, '..', '..', '..', 'test', 'basedriver', 'fixtures');

          const serve = (0, _serveStatic.default)(dir, {
            index: false,
            setHeaders: (res, path) => {
              res.setHeader('Content-Disposition', (0, _contentDisposition.default)(path));
            }
          });
          server = _http.default.createServer(function (req, res) {
            if (req.url.indexOf('missing') !== -1) {
              res.writeHead(404);
              res.end();
              return;
            }

            const contentType = new URLSearchParams(_url.default.parse(req.url).search).get('content-type');

            if (contentType !== null) {
              res.setHeader('content-type', contentType);
            }

            serve(req, res, (0, _finalhandler.default)(req, res));
          });
          const close = server.close.bind(server);

          server.close = async function () {
            await _bluebird.default.delay(1000);
            return await new _bluebird.default((resolve, reject) => {
              server.on('close', resolve);
              close(err => {
                if (err) reject(err);
              });
            });
          };

          server.listen(port);
        });
        after(async function () {
          await server.close();
        });
        it('should download zip file', async function () {
          let newAppPath = await (0, _helpers.configureApp)(`${serverUrl}/FakeIOSApp.app.zip`, '.app');
          newAppPath.should.contain('FakeIOSApp.app');
          let contents = await _appiumSupport.fs.readFile(newAppPath, 'utf8');
          contents.should.eql('this is not really an app\n');
        });
        it('should download zip file with query string', async function () {
          let newAppPath = await (0, _helpers.configureApp)(`${serverUrl}/FakeIOSApp.app.zip?sv=abc&sr=def`, '.app');
          newAppPath.should.contain('.app');
          let contents = await _appiumSupport.fs.readFile(newAppPath, 'utf8');
          contents.should.eql('this is not really an app\n');
        });
        it('should download an app file', async function () {
          let newAppPath = await (0, _helpers.configureApp)(`${serverUrl}/FakeIOSApp.app`, '.app');
          newAppPath.should.contain('.app');
          let contents = await _appiumSupport.fs.readFile(newAppPath, 'utf8');
          contents.should.eql('this is not really an app\n');
        });
        it('should accept multiple extensions', async function () {
          let newAppPath = await (0, _helpers.configureApp)(`${serverUrl}/FakeIOSApp.app.zip`, ['.app', '.aab']);
          newAppPath.should.contain('FakeIOSApp.app');
          let contents = await _appiumSupport.fs.readFile(newAppPath, 'utf8');
          contents.should.eql('this is not really an app\n');
        });
        it('should download an apk file', async function () {
          let newAppPath = await (0, _helpers.configureApp)(`${serverUrl}/FakeAndroidApp.apk`, '.apk');
          newAppPath.should.contain('.apk');
          let contents = await _appiumSupport.fs.readFile(newAppPath, 'utf8');
          contents.should.eql('this is not really an apk\n');
        });
        it('should handle zip file that cannot be downloaded', async function () {
          await (0, _helpers.configureApp)(`${serverUrl}/missing/FakeIOSApp.app.zip`, '.app').should.eventually.be.rejected;
        });
        it('should handle invalid protocol', async function () {
          await (0, _helpers.configureApp)('file://C:/missing/FakeIOSApp.app.zip', '.app').should.eventually.be.rejectedWith(/is not supported/);
          await (0, _helpers.configureApp)('ftp://localhost:8000/missing/FakeIOSApp.app.zip', '.app').should.eventually.be.rejectedWith(/is not supported/);
        });
        it('should handle missing file in Windows path format', async function () {
          await (0, _helpers.configureApp)('C:\\missing\\FakeIOSApp.app.zip', '.app').should.eventually.be.rejectedWith(/does not exist or is not accessible/);
        });
        it('should recognize zip mime types and unzip the downloaded file', async function () {
          let newAppPath = await (0, _helpers.configureApp)(`${serverUrl}/FakeAndroidApp.asd?content-type=${encodeURIComponent('application/zip')}`, '.apk');
          newAppPath.should.contain('FakeAndroidApp.apk');
          newAppPath.should.not.contain('.asd');
          let contents = await _appiumSupport.fs.readFile(newAppPath, 'utf8');
          contents.should.eql('this is not really an apk\n');
        });
        it('should recognize zip mime types with parameter and unzip the downloaded file', async function () {
          let newAppPath = await (0, _helpers.configureApp)(`${serverUrl}/FakeAndroidApp.asd?content-type=${encodeURIComponent('application/zip; parameter=value')}`, '.apk');
          newAppPath.should.contain('FakeAndroidApp.apk');
          newAppPath.should.not.contain('.asd');
          let contents = await _appiumSupport.fs.readFile(newAppPath, 'utf8');
          contents.should.eql('this is not really an apk\n');
        });
        it('should recognize zip mime types and unzip the downloaded file with query string', async function () {
          let newAppPath = await (0, _helpers.configureApp)(`${serverUrl}/FakeAndroidApp.asd?content-type=${encodeURIComponent('application/zip')}&sv=abc&sr=def`, '.apk');
          newAppPath.should.contain('FakeAndroidApp.apk');
          newAppPath.should.not.contain('.asd');
          let contents = await _appiumSupport.fs.readFile(newAppPath, 'utf8');
          contents.should.eql('this is not really an apk\n');
        });
        it('should treat an unknown mime type as an app', async function () {
          let newAppPath = await (0, _helpers.configureApp)(`${serverUrl}/FakeAndroidApp.apk?content-type=${encodeURIComponent('application/bip')}`, '.apk');
          newAppPath.should.contain('.apk');
          let contents = await _appiumSupport.fs.readFile(newAppPath, 'utf8');
          contents.should.eql('this is not really an apk\n');
        });
      });
    });
  });
});require('source-map-support').install();


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvYmFzZWRyaXZlci9oZWxwZXJzLWUyZS1zcGVjcy5qcyJdLCJuYW1lcyI6WyJjaGFpIiwic2hvdWxkIiwidXNlIiwiY2hhaUFzUHJvbWlzZWQiLCJnZXRGaXh0dXJlIiwiZmlsZSIsInBhdGgiLCJyZXNvbHZlIiwiX19kaXJuYW1lIiwiZGVzY3JpYmUiLCJpdCIsIm5ld0FwcFBhdGgiLCJjb250YWluIiwiY29udGVudHMiLCJmcyIsInJlYWRGaWxlIiwiZXFsIiwiYmUiLCJyZWplY3RlZFdpdGgiLCJwb3J0Iiwic2VydmVyVXJsIiwiZXZlbnR1YWxseSIsInNlcnZlciIsImJlZm9yZSIsImRpciIsInNlcnZlIiwiaW5kZXgiLCJzZXRIZWFkZXJzIiwicmVzIiwic2V0SGVhZGVyIiwiaHR0cCIsImNyZWF0ZVNlcnZlciIsInJlcSIsInVybCIsImluZGV4T2YiLCJ3cml0ZUhlYWQiLCJlbmQiLCJjb250ZW50VHlwZSIsIlVSTFNlYXJjaFBhcmFtcyIsInBhcnNlIiwic2VhcmNoIiwiZ2V0IiwiY2xvc2UiLCJiaW5kIiwiQiIsImRlbGF5IiwicmVqZWN0Iiwib24iLCJlcnIiLCJsaXN0ZW4iLCJhZnRlciIsInJlamVjdGVkIiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwibm90Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFHQUEsY0FBS0MsTUFBTDs7QUFDQUQsY0FBS0UsR0FBTCxDQUFTQyx1QkFBVDs7QUFFQSxTQUFTQyxVQUFULENBQXFCQyxJQUFyQixFQUEyQjtBQUN6QixTQUFPQyxjQUFLQyxPQUFMLENBQWFDLFNBQWIsRUFBd0IsSUFBeEIsRUFBOEIsSUFBOUIsRUFBb0MsSUFBcEMsRUFBMEMsTUFBMUMsRUFBa0QsWUFBbEQsRUFBZ0UsVUFBaEUsRUFBNEVILElBQTVFLENBQVA7QUFDRDs7QUFFREksUUFBUSxDQUFDLGdDQUFELEVBQW1D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UjtBQWtIRCxLQTVITyxDQUFSO0FBNkhELEdBbEtPLENBQVI7QUFtS0QsQ0FwS08sQ0FBUiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjaGFpIGZyb20gJ2NoYWknO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgdXJsIGZyb20gJ3VybCc7XG5pbXBvcnQgY2hhaUFzUHJvbWlzZWQgZnJvbSAnY2hhaS1hcy1wcm9taXNlZCc7XG5pbXBvcnQgeyBmcyB9IGZyb20gJ2FwcGl1bS1zdXBwb3J0JztcbmltcG9ydCB7IGNvbmZpZ3VyZUFwcCB9IGZyb20gJy4uLy4uL2xpYi9iYXNlZHJpdmVyL2hlbHBlcnMnO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgZmluYWxoYW5kbGVyIGZyb20gJ2ZpbmFsaGFuZGxlcic7XG5pbXBvcnQgc2VydmVTdGF0aWMgZnJvbSAnc2VydmUtc3RhdGljJztcbmltcG9ydCBjb250ZW50RGlzcG9zaXRpb24gZnJvbSAnY29udGVudC1kaXNwb3NpdGlvbic7XG5pbXBvcnQgQiBmcm9tICdibHVlYmlyZCc7XG5cblxuY2hhaS5zaG91bGQoKTtcbmNoYWkudXNlKGNoYWlBc1Byb21pc2VkKTtcblxuZnVuY3Rpb24gZ2V0Rml4dHVyZSAoZmlsZSkge1xuICByZXR1cm4gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJ3Rlc3QnLCAnYmFzZWRyaXZlcicsICdmaXh0dXJlcycsIGZpbGUpO1xufVxuXG5kZXNjcmliZSgnYXBwIGRvd25sb2FkIGFuZCBjb25maWd1cmF0aW9uJywgZnVuY3Rpb24gKCkge1xuICBkZXNjcmliZSgnY29uZmlndXJlQXBwJywgZnVuY3Rpb24gKCkge1xuICAgIGl0KCdzaG91bGQgZ2V0IHRoZSBwYXRoIGZvciBhIGxvY2FsIC5hcHAnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgbmV3QXBwUGF0aCA9IGF3YWl0IGNvbmZpZ3VyZUFwcChnZXRGaXh0dXJlKCdGYWtlSU9TQXBwLmFwcCcpLCAnLmFwcCcpO1xuICAgICAgbmV3QXBwUGF0aC5zaG91bGQuY29udGFpbignRmFrZUlPU0FwcC5hcHAnKTtcbiAgICAgIGxldCBjb250ZW50cyA9IGF3YWl0IGZzLnJlYWRGaWxlKG5ld0FwcFBhdGgsICd1dGY4Jyk7XG4gICAgICBjb250ZW50cy5zaG91bGQuZXFsKCd0aGlzIGlzIG5vdCByZWFsbHkgYW4gYXBwXFxuJyk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBnZXQgdGhlIHBhdGggZm9yIGEgbG9jYWwgLmFwaycsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBuZXdBcHBQYXRoID0gYXdhaXQgY29uZmlndXJlQXBwKGdldEZpeHR1cmUoJ0Zha2VBbmRyb2lkQXBwLmFwaycpLCAnLmFwaycpO1xuICAgICAgbmV3QXBwUGF0aC5zaG91bGQuY29udGFpbignRmFrZUFuZHJvaWRBcHAuYXBrJyk7XG4gICAgICBsZXQgY29udGVudHMgPSBhd2FpdCBmcy5yZWFkRmlsZShuZXdBcHBQYXRoLCAndXRmOCcpO1xuICAgICAgY29udGVudHMuc2hvdWxkLmVxbCgndGhpcyBpcyBub3QgcmVhbGx5IGFuIGFwa1xcbicpO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgdW56aXAgYW5kIGdldCB0aGUgcGF0aCBmb3IgYSBsb2NhbCAuYXBwLnppcCcsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBuZXdBcHBQYXRoID0gYXdhaXQgY29uZmlndXJlQXBwKGdldEZpeHR1cmUoJ0Zha2VJT1NBcHAuYXBwLnppcCcpLCAnLmFwcCcpO1xuICAgICAgbmV3QXBwUGF0aC5zaG91bGQuY29udGFpbignRmFrZUlPU0FwcC5hcHAnKTtcbiAgICAgIGxldCBjb250ZW50cyA9IGF3YWl0IGZzLnJlYWRGaWxlKG5ld0FwcFBhdGgsICd1dGY4Jyk7XG4gICAgICBjb250ZW50cy5zaG91bGQuZXFsKCd0aGlzIGlzIG5vdCByZWFsbHkgYW4gYXBwXFxuJyk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCB1bnppcCBhbmQgZ2V0IHRoZSBwYXRoIGZvciBhIGxvY2FsIC5pcGEnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgbmV3QXBwUGF0aCA9IGF3YWl0IGNvbmZpZ3VyZUFwcChnZXRGaXh0dXJlKCdGYWtlSU9TQXBwLmlwYScpLCAnLmFwcCcpO1xuICAgICAgbmV3QXBwUGF0aC5zaG91bGQuY29udGFpbignRmFrZUlPU0FwcC5hcHAnKTtcbiAgICAgIGxldCBjb250ZW50cyA9IGF3YWl0IGZzLnJlYWRGaWxlKG5ld0FwcFBhdGgsICd1dGY4Jyk7XG4gICAgICBjb250ZW50cy5zaG91bGQuZXFsKCd0aGlzIGlzIG5vdCByZWFsbHkgYW4gYXBwXFxuJyk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBmYWlsIGZvciBhIGJhZCB6aXAgZmlsZScsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGF3YWl0IGNvbmZpZ3VyZUFwcChnZXRGaXh0dXJlKCdCYWRaaXBwZWRBcHAuemlwJyksICcuYXBwJylcbiAgICAgICAgLnNob3VsZC5iZS5yZWplY3RlZFdpdGgoL1BLLyk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBmYWlsIGlmIGV4dGVuc2lvbnMgZG8gbm90IG1hdGNoJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgYXdhaXQgY29uZmlndXJlQXBwKGdldEZpeHR1cmUoJ0Zha2VJT1NBcHAuYXBwJyksICcud3JvbmcnKVxuICAgICAgICAuc2hvdWxkLmJlLnJlamVjdGVkV2l0aCgvZGlkIG5vdCBoYXZlIGV4dGVuc2lvbi8pO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgZmFpbCBpZiB6aXAgZmlsZSBkb2VzIG5vdCBjb250YWluIGFuIGFwcCB3aG9zZSBleHRlbnNpb24gbWF0Y2hlcycsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGF3YWl0IGNvbmZpZ3VyZUFwcChnZXRGaXh0dXJlKCdGYWtlSU9TQXBwLmFwcC56aXAnKSwgJy53cm9uZycpXG4gICAgICAgIC5zaG91bGQuYmUucmVqZWN0ZWRXaXRoKC9kaWQgbm90IGhhdmUgZXh0ZW5zaW9uLyk7XG4gICAgfSk7XG4gICAgZGVzY3JpYmUoJ3Nob3VsZCBkb3dubG9hZCBhbiBhcHAgZnJvbSB0aGUgd2ViJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgcG9ydCA9IDgwMDA7XG4gICAgICBjb25zdCBzZXJ2ZXJVcmwgPSBgaHR0cDovL2xvY2FsaG9zdDoke3BvcnR9YDtcblxuICAgICAgZGVzY3JpYmUoJ3NlcnZlciBub3QgYXZhaWxhYmxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdCgnc2hvdWxkIGhhbmRsZSBzZXJ2ZXIgbm90IGF2YWlsYWJsZScsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBhd2FpdCBjb25maWd1cmVBcHAoYCR7c2VydmVyVXJsfS9GYWtlSU9TQXBwLmFwcC56aXBgLCAnLmFwcCcpXG4gICAgICAgICAgICAuc2hvdWxkLmV2ZW50dWFsbHkuYmUucmVqZWN0ZWRXaXRoKC9FQ09OTlJFRlVTRUQvKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGRlc2NyaWJlKCdzZXJ2ZXIgYXZhaWxhYmxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB1c2UgYSBsb2NhbCBzZXJ2ZXIgc28gdGhlcmUgaXMgbm8gZGVwZW5kZW5jeSBvbiB0aGUgaW50ZXJuZXRcbiAgICAgICAgbGV0IHNlcnZlcjtcbiAgICAgICAgYmVmb3JlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zdCBkaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAndGVzdCcsICdiYXNlZHJpdmVyJywgJ2ZpeHR1cmVzJyk7XG4gICAgICAgICAgY29uc3Qgc2VydmUgPSBzZXJ2ZVN0YXRpYyhkaXIsIHtcbiAgICAgICAgICAgIGluZGV4OiBmYWxzZSxcbiAgICAgICAgICAgIHNldEhlYWRlcnM6IChyZXMsIHBhdGgpID0+IHtcbiAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicsIGNvbnRlbnREaXNwb3NpdGlvbihwYXRoKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoZnVuY3Rpb24gKHJlcSwgcmVzKSB7XG4gICAgICAgICAgICBpZiAocmVxLnVybC5pbmRleE9mKCdtaXNzaW5nJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoNDA0KTtcbiAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBmb3IgdGVzdGluZyB6aXAgZmlsZSBjb250ZW50IHR5cGVzXG4gICAgICAgICAgICBjb25zdCBjb250ZW50VHlwZSA9IG5ldyBVUkxTZWFyY2hQYXJhbXModXJsLnBhcnNlKHJlcS51cmwpLnNlYXJjaCkuZ2V0KCdjb250ZW50LXR5cGUnKTtcbiAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCBjb250ZW50VHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXJ2ZShyZXEsIHJlcywgZmluYWxoYW5kbGVyKHJlcSwgcmVzKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29uc3QgY2xvc2UgPSBzZXJ2ZXIuY2xvc2UuYmluZChzZXJ2ZXIpO1xuICAgICAgICAgIHNlcnZlci5jbG9zZSA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHBhdXNlIGEgbW9tZW50IG9yIHdlIGdldCBFQ09OUkVTRVQgZXJyb3JzXG4gICAgICAgICAgICBhd2FpdCBCLmRlbGF5KDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IG5ldyBCKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgc2VydmVyLm9uKCdjbG9zZScsIHJlc29sdmUpO1xuICAgICAgICAgICAgICBjbG9zZSgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikgcmVqZWN0KGVycik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY3VybHlcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHNlcnZlci5saXN0ZW4ocG9ydCk7XG4gICAgICAgIH0pO1xuICAgICAgICBhZnRlcihhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgYXdhaXQgc2VydmVyLmNsb3NlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgZG93bmxvYWQgemlwIGZpbGUnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgbGV0IG5ld0FwcFBhdGggPSBhd2FpdCBjb25maWd1cmVBcHAoYCR7c2VydmVyVXJsfS9GYWtlSU9TQXBwLmFwcC56aXBgLCAnLmFwcCcpO1xuICAgICAgICAgIG5ld0FwcFBhdGguc2hvdWxkLmNvbnRhaW4oJ0Zha2VJT1NBcHAuYXBwJyk7XG4gICAgICAgICAgbGV0IGNvbnRlbnRzID0gYXdhaXQgZnMucmVhZEZpbGUobmV3QXBwUGF0aCwgJ3V0ZjgnKTtcbiAgICAgICAgICBjb250ZW50cy5zaG91bGQuZXFsKCd0aGlzIGlzIG5vdCByZWFsbHkgYW4gYXBwXFxuJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnc2hvdWxkIGRvd25sb2FkIHppcCBmaWxlIHdpdGggcXVlcnkgc3RyaW5nJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGxldCBuZXdBcHBQYXRoID0gYXdhaXQgY29uZmlndXJlQXBwKGAke3NlcnZlclVybH0vRmFrZUlPU0FwcC5hcHAuemlwP3N2PWFiYyZzcj1kZWZgLCAnLmFwcCcpO1xuICAgICAgICAgIG5ld0FwcFBhdGguc2hvdWxkLmNvbnRhaW4oJy5hcHAnKTtcbiAgICAgICAgICBsZXQgY29udGVudHMgPSBhd2FpdCBmcy5yZWFkRmlsZShuZXdBcHBQYXRoLCAndXRmOCcpO1xuICAgICAgICAgIGNvbnRlbnRzLnNob3VsZC5lcWwoJ3RoaXMgaXMgbm90IHJlYWxseSBhbiBhcHBcXG4nKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdzaG91bGQgZG93bmxvYWQgYW4gYXBwIGZpbGUnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgbGV0IG5ld0FwcFBhdGggPSBhd2FpdCBjb25maWd1cmVBcHAoYCR7c2VydmVyVXJsfS9GYWtlSU9TQXBwLmFwcGAsICcuYXBwJyk7XG4gICAgICAgICAgbmV3QXBwUGF0aC5zaG91bGQuY29udGFpbignLmFwcCcpO1xuICAgICAgICAgIGxldCBjb250ZW50cyA9IGF3YWl0IGZzLnJlYWRGaWxlKG5ld0FwcFBhdGgsICd1dGY4Jyk7XG4gICAgICAgICAgY29udGVudHMuc2hvdWxkLmVxbCgndGhpcyBpcyBub3QgcmVhbGx5IGFuIGFwcFxcbicpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCBhY2NlcHQgbXVsdGlwbGUgZXh0ZW5zaW9ucycsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBsZXQgbmV3QXBwUGF0aCA9IGF3YWl0IGNvbmZpZ3VyZUFwcChgJHtzZXJ2ZXJVcmx9L0Zha2VJT1NBcHAuYXBwLnppcGAsIFsnLmFwcCcsICcuYWFiJ10pO1xuICAgICAgICAgIG5ld0FwcFBhdGguc2hvdWxkLmNvbnRhaW4oJ0Zha2VJT1NBcHAuYXBwJyk7XG4gICAgICAgICAgbGV0IGNvbnRlbnRzID0gYXdhaXQgZnMucmVhZEZpbGUobmV3QXBwUGF0aCwgJ3V0ZjgnKTtcbiAgICAgICAgICBjb250ZW50cy5zaG91bGQuZXFsKCd0aGlzIGlzIG5vdCByZWFsbHkgYW4gYXBwXFxuJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnc2hvdWxkIGRvd25sb2FkIGFuIGFwayBmaWxlJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGxldCBuZXdBcHBQYXRoID0gYXdhaXQgY29uZmlndXJlQXBwKGAke3NlcnZlclVybH0vRmFrZUFuZHJvaWRBcHAuYXBrYCwgJy5hcGsnKTtcbiAgICAgICAgICBuZXdBcHBQYXRoLnNob3VsZC5jb250YWluKCcuYXBrJyk7XG4gICAgICAgICAgbGV0IGNvbnRlbnRzID0gYXdhaXQgZnMucmVhZEZpbGUobmV3QXBwUGF0aCwgJ3V0ZjgnKTtcbiAgICAgICAgICBjb250ZW50cy5zaG91bGQuZXFsKCd0aGlzIGlzIG5vdCByZWFsbHkgYW4gYXBrXFxuJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnc2hvdWxkIGhhbmRsZSB6aXAgZmlsZSB0aGF0IGNhbm5vdCBiZSBkb3dubG9hZGVkJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGF3YWl0IGNvbmZpZ3VyZUFwcChgJHtzZXJ2ZXJVcmx9L21pc3NpbmcvRmFrZUlPU0FwcC5hcHAuemlwYCwgJy5hcHAnKVxuICAgICAgICAgICAgLnNob3VsZC5ldmVudHVhbGx5LmJlLnJlamVjdGVkO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgaW52YWxpZCBwcm90b2NvbCcsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBhd2FpdCBjb25maWd1cmVBcHAoJ2ZpbGU6Ly9DOi9taXNzaW5nL0Zha2VJT1NBcHAuYXBwLnppcCcsICcuYXBwJylcbiAgICAgICAgICAgIC5zaG91bGQuZXZlbnR1YWxseS5iZS5yZWplY3RlZFdpdGgoL2lzIG5vdCBzdXBwb3J0ZWQvKTtcbiAgICAgICAgICBhd2FpdCBjb25maWd1cmVBcHAoJ2Z0cDovL2xvY2FsaG9zdDo4MDAwL21pc3NpbmcvRmFrZUlPU0FwcC5hcHAuemlwJywgJy5hcHAnKVxuICAgICAgICAgICAgLnNob3VsZC5ldmVudHVhbGx5LmJlLnJlamVjdGVkV2l0aCgvaXMgbm90IHN1cHBvcnRlZC8pO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWlzc2luZyBmaWxlIGluIFdpbmRvd3MgcGF0aCBmb3JtYXQnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgYXdhaXQgY29uZmlndXJlQXBwKCdDOlxcXFxtaXNzaW5nXFxcXEZha2VJT1NBcHAuYXBwLnppcCcsICcuYXBwJylcbiAgICAgICAgICAgIC5zaG91bGQuZXZlbnR1YWxseS5iZS5yZWplY3RlZFdpdGgoL2RvZXMgbm90IGV4aXN0IG9yIGlzIG5vdCBhY2Nlc3NpYmxlLyk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnc2hvdWxkIHJlY29nbml6ZSB6aXAgbWltZSB0eXBlcyBhbmQgdW56aXAgdGhlIGRvd25sb2FkZWQgZmlsZScsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBsZXQgbmV3QXBwUGF0aCA9IGF3YWl0IGNvbmZpZ3VyZUFwcChgJHtzZXJ2ZXJVcmx9L0Zha2VBbmRyb2lkQXBwLmFzZD9jb250ZW50LXR5cGU9JHtlbmNvZGVVUklDb21wb25lbnQoJ2FwcGxpY2F0aW9uL3ppcCcpfWAsICcuYXBrJyk7XG4gICAgICAgICAgbmV3QXBwUGF0aC5zaG91bGQuY29udGFpbignRmFrZUFuZHJvaWRBcHAuYXBrJyk7XG4gICAgICAgICAgbmV3QXBwUGF0aC5zaG91bGQubm90LmNvbnRhaW4oJy5hc2QnKTtcbiAgICAgICAgICBsZXQgY29udGVudHMgPSBhd2FpdCBmcy5yZWFkRmlsZShuZXdBcHBQYXRoLCAndXRmOCcpO1xuICAgICAgICAgIGNvbnRlbnRzLnNob3VsZC5lcWwoJ3RoaXMgaXMgbm90IHJlYWxseSBhbiBhcGtcXG4nKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdzaG91bGQgcmVjb2duaXplIHppcCBtaW1lIHR5cGVzIHdpdGggcGFyYW1ldGVyIGFuZCB1bnppcCB0aGUgZG93bmxvYWRlZCBmaWxlJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGxldCBuZXdBcHBQYXRoID0gYXdhaXQgY29uZmlndXJlQXBwKGAke3NlcnZlclVybH0vRmFrZUFuZHJvaWRBcHAuYXNkP2NvbnRlbnQtdHlwZT0ke2VuY29kZVVSSUNvbXBvbmVudCgnYXBwbGljYXRpb24vemlwOyBwYXJhbWV0ZXI9dmFsdWUnKX1gLCAnLmFwaycpO1xuICAgICAgICAgIG5ld0FwcFBhdGguc2hvdWxkLmNvbnRhaW4oJ0Zha2VBbmRyb2lkQXBwLmFwaycpO1xuICAgICAgICAgIG5ld0FwcFBhdGguc2hvdWxkLm5vdC5jb250YWluKCcuYXNkJyk7XG4gICAgICAgICAgbGV0IGNvbnRlbnRzID0gYXdhaXQgZnMucmVhZEZpbGUobmV3QXBwUGF0aCwgJ3V0ZjgnKTtcbiAgICAgICAgICBjb250ZW50cy5zaG91bGQuZXFsKCd0aGlzIGlzIG5vdCByZWFsbHkgYW4gYXBrXFxuJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnc2hvdWxkIHJlY29nbml6ZSB6aXAgbWltZSB0eXBlcyBhbmQgdW56aXAgdGhlIGRvd25sb2FkZWQgZmlsZSB3aXRoIHF1ZXJ5IHN0cmluZycsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBsZXQgbmV3QXBwUGF0aCA9IGF3YWl0IGNvbmZpZ3VyZUFwcChgJHtzZXJ2ZXJVcmx9L0Zha2VBbmRyb2lkQXBwLmFzZD9jb250ZW50LXR5cGU9JHtlbmNvZGVVUklDb21wb25lbnQoJ2FwcGxpY2F0aW9uL3ppcCcpfSZzdj1hYmMmc3I9ZGVmYCwgJy5hcGsnKTtcbiAgICAgICAgICBuZXdBcHBQYXRoLnNob3VsZC5jb250YWluKCdGYWtlQW5kcm9pZEFwcC5hcGsnKTtcbiAgICAgICAgICBuZXdBcHBQYXRoLnNob3VsZC5ub3QuY29udGFpbignLmFzZCcpO1xuICAgICAgICAgIGxldCBjb250ZW50cyA9IGF3YWl0IGZzLnJlYWRGaWxlKG5ld0FwcFBhdGgsICd1dGY4Jyk7XG4gICAgICAgICAgY29udGVudHMuc2hvdWxkLmVxbCgndGhpcyBpcyBub3QgcmVhbGx5IGFuIGFwa1xcbicpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCB0cmVhdCBhbiB1bmtub3duIG1pbWUgdHlwZSBhcyBhbiBhcHAnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgbGV0IG5ld0FwcFBhdGggPSBhd2FpdCBjb25maWd1cmVBcHAoYCR7c2VydmVyVXJsfS9GYWtlQW5kcm9pZEFwcC5hcGs/Y29udGVudC10eXBlPSR7ZW5jb2RlVVJJQ29tcG9uZW50KCdhcHBsaWNhdGlvbi9iaXAnKX1gLCAnLmFwaycpO1xuICAgICAgICAgIG5ld0FwcFBhdGguc2hvdWxkLmNvbnRhaW4oJy5hcGsnKTtcbiAgICAgICAgICBsZXQgY29udGVudHMgPSBhd2FpdCBmcy5yZWFkRmlsZShuZXdBcHBQYXRoLCAndXRmOCcpO1xuICAgICAgICAgIGNvbnRlbnRzLnNob3VsZC5lcWwoJ3RoaXMgaXMgbm90IHJlYWxseSBhbiBhcGtcXG4nKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdLCJmaWxlIjoidGVzdC9iYXNlZHJpdmVyL2hlbHBlcnMtZTJlLXNwZWNzLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uIn0=
