"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("source-map-support/register");

var _helpers = require("../../lib/basedriver/helpers");

var _chai = _interopRequireDefault(require("chai"));

var _chaiAsPromised = _interopRequireDefault(require("chai-as-promised"));

_chai.default.use(_chaiAsPromised.default);

const should = _chai.default.should();

describe('helpers', function () {
  describe('#isPackageOrBundle', function () {
    it('should accept packages and bundles', function () {
      (0, _helpers.isPackageOrBundle)('io.appium.testapp').should.be.true;
    });
    it('should not accept non-packages or non-bundles', function () {
      (0, _helpers.isPackageOrBundle)('foo').should.be.false;
      (0, _helpers.isPackageOrBundle)('/path/to/an.app').should.be.false;
      (0, _helpers.isPackageOrBundle)('/path/to/an.apk').should.be.false;
    });
  });
  describe('#duplicateKeys', function () {
    it('should translate key in an object', function () {
      (0, _helpers.duplicateKeys)({
        'foo': 'hello world'
      }, 'foo', 'bar').should.eql({
        'foo': 'hello world',
        'bar': 'hello world'
      });
    });
    it('should translate key in an object within an object', function () {
      (0, _helpers.duplicateKeys)({
        'key': {
          'foo': 'hello world'
        }
      }, 'foo', 'bar').should.eql({
        'key': {
          'foo': 'hello world',
          'bar': 'hello world'
        }
      });
    });
    it('should translate key in an object with an array', function () {
      (0, _helpers.duplicateKeys)([{
        'key': {
          'foo': 'hello world'
        }
      }, {
        'foo': 'HELLO WORLD'
      }], 'foo', 'bar').should.eql([{
        'key': {
          'foo': 'hello world',
          'bar': 'hello world'
        }
      }, {
        'foo': 'HELLO WORLD',
        'bar': 'HELLO WORLD'
      }]);
    });
    it('should duplicate both keys', function () {
      (0, _helpers.duplicateKeys)({
        'keyOne': {
          'foo': 'hello world'
        },
        'keyTwo': {
          'bar': 'HELLO WORLD'
        }
      }, 'foo', 'bar').should.eql({
        'keyOne': {
          'foo': 'hello world',
          'bar': 'hello world'
        },
        'keyTwo': {
          'bar': 'HELLO WORLD',
          'foo': 'HELLO WORLD'
        }
      });
    });
    it('should not do anything to primitives', function () {
      [0, 1, -1, true, false, null, undefined, '', 'Hello World'].forEach(item => {
        should.equal((0, _helpers.duplicateKeys)(item), item);
      });
    });
    it('should rename keys on big complex objects', function () {
      const input = [{
        'foo': 'bar'
      }, {
        hello: {
          world: {
            'foo': 'BAR'
          }
        },
        foo: 'bahr'
      }, 'foo', null, 0];
      const expectedOutput = [{
        'foo': 'bar',
        'FOO': 'bar'
      }, {
        hello: {
          world: {
            'foo': 'BAR',
            'FOO': 'BAR'
          }
        },
        foo: 'bahr',
        FOO: 'bahr'
      }, 'foo', null, 0];
      (0, _helpers.duplicateKeys)(input, 'foo', 'FOO').should.deep.equal(expectedOutput);
    });
  });
});
describe('parseCapsArray', function () {
  it('should parse string into array', function () {
    (0, _helpers.parseCapsArray)('/tmp/my/app.zip').should.eql(['/tmp/my/app.zip']);
  });
  it('should parse array into array', function () {
    (0, _helpers.parseCapsArray)('["/tmp/my/app.zip"]').should.eql(['/tmp/my/app.zip']);
    (0, _helpers.parseCapsArray)('["/tmp/my/app.zip","/tmp/my/app2.zip"]').should.eql(['/tmp/my/app.zip', '/tmp/my/app2.zip']);
  });
});require('source-map-support').install();


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvYmFzZWRyaXZlci9oZWxwZXJzLXNwZWNzLmpzIl0sIm5hbWVzIjpbImNoYWkiLCJ1c2UiLCJjaGFpQXNQcm9taXNlZCIsInNob3VsZCIsImRlc2NyaWJlIiwiaXQiLCJiZSIsInRydWUiLCJmYWxzZSIsImVxbCIsInVuZGVmaW5lZCIsImZvckVhY2giLCJpdGVtIiwiZXF1YWwiLCJpbnB1dCIsImhlbGxvIiwid29ybGQiLCJmb28iLCJleHBlY3RlZE91dHB1dCIsIkZPTyIsImRlZXAiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUdBQSxjQUFLQyxHQUFMLENBQVNDLHVCQUFUOztBQUNBLE1BQU1DLE1BQU0sR0FBR0gsY0FBS0csTUFBTCxFQUFmOztBQUVBQyxRQUFRLENBQUMsU0FBRCxFQUFZLFlBQVk7QUFDOUJBLEVBQUFBLFFBQVEsQ0FBQyxvQkFBRCxFQUF1QixZQUFZO0FBQ3pDQyxJQUFBQSxFQUFFLENBQUMsb0NBQUQsRUFBdUMsWUFBWTtBQUNuRCxzQ0FBa0IsbUJBQWxCLEVBQXVDRixNQUF2QyxDQUE4Q0csRUFBOUMsQ0FBaURDLElBQWpEO0FBQ0QsS0FGQyxDQUFGO0FBR0FGLElBQUFBLEVBQUUsQ0FBQywrQ0FBRCxFQUFrRCxZQUFZO0FBQzlELHNDQUFrQixLQUFsQixFQUF5QkYsTUFBekIsQ0FBZ0NHLEVBQWhDLENBQW1DRSxLQUFuQztBQUNBLHNDQUFrQixpQkFBbEIsRUFBcUNMLE1BQXJDLENBQTRDRyxFQUE1QyxDQUErQ0UsS0FBL0M7QUFDQSxzQ0FBa0IsaUJBQWxCLEVBQXFDTCxNQUFyQyxDQUE0Q0csRUFBNUMsQ0FBK0NFLEtBQS9DO0FBQ0QsS0FKQyxDQUFGO0FBS0QsR0FUTyxDQUFSO0FBV0FKLEVBQUFBLFFBQVEsQ0FBQyxnQkFBRCxFQUFtQixZQUFZO0FBQ3JDQyxJQUFBQSxFQUFFLENBQUMsbUNBQUQsRUFBc0MsWUFBWTtBQUNsRCxrQ0FBYztBQUFDLGVBQU87QUFBUixPQUFkLEVBQXNDLEtBQXRDLEVBQTZDLEtBQTdDLEVBQW9ERixNQUFwRCxDQUEyRE0sR0FBM0QsQ0FBK0Q7QUFBQyxlQUFPLGFBQVI7QUFBdUIsZUFBTztBQUE5QixPQUEvRDtBQUNELEtBRkMsQ0FBRjtBQUdBSixJQUFBQSxFQUFFLENBQUMsb0RBQUQsRUFBdUQsWUFBWTtBQUNuRSxrQ0FBYztBQUFDLGVBQU87QUFBQyxpQkFBTztBQUFSO0FBQVIsT0FBZCxFQUErQyxLQUEvQyxFQUFzRCxLQUF0RCxFQUE2REYsTUFBN0QsQ0FBb0VNLEdBQXBFLENBQXdFO0FBQUMsZUFBTztBQUFDLGlCQUFPLGFBQVI7QUFBdUIsaUJBQU87QUFBOUI7QUFBUixPQUF4RTtBQUNELEtBRkMsQ0FBRjtBQUdBSixJQUFBQSxFQUFFLENBQUMsaURBQUQsRUFBb0QsWUFBWTtBQUNoRSxrQ0FBYyxDQUNaO0FBQUMsZUFBTztBQUFDLGlCQUFPO0FBQVI7QUFBUixPQURZLEVBRVo7QUFBQyxlQUFPO0FBQVIsT0FGWSxDQUFkLEVBR0csS0FISCxFQUdVLEtBSFYsRUFHaUJGLE1BSGpCLENBR3dCTSxHQUh4QixDQUc0QixDQUMxQjtBQUFDLGVBQU87QUFBQyxpQkFBTyxhQUFSO0FBQXVCLGlCQUFPO0FBQTlCO0FBQVIsT0FEMEIsRUFFMUI7QUFBQyxlQUFPLGFBQVI7QUFBdUIsZUFBTztBQUE5QixPQUYwQixDQUg1QjtBQU9ELEtBUkMsQ0FBRjtBQVNBSixJQUFBQSxFQUFFLENBQUMsNEJBQUQsRUFBK0IsWUFBWTtBQUMzQyxrQ0FBYztBQUNaLGtCQUFVO0FBQ1IsaUJBQU87QUFEQyxTQURFO0FBSVosa0JBQVU7QUFDUixpQkFBTztBQURDO0FBSkUsT0FBZCxFQU9HLEtBUEgsRUFPVSxLQVBWLEVBT2lCRixNQVBqQixDQU93Qk0sR0FQeEIsQ0FPNEI7QUFDMUIsa0JBQVU7QUFDUixpQkFBTyxhQURDO0FBRVIsaUJBQU87QUFGQyxTQURnQjtBQUsxQixrQkFBVTtBQUNSLGlCQUFPLGFBREM7QUFFUixpQkFBTztBQUZDO0FBTGdCLE9BUDVCO0FBaUJELEtBbEJDLENBQUY7QUFtQkFKLElBQUFBLEVBQUUsQ0FBQyxzQ0FBRCxFQUF5QyxZQUFZO0FBQ3JELE9BQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFDLENBQVIsRUFBVyxJQUFYLEVBQWlCLEtBQWpCLEVBQXdCLElBQXhCLEVBQThCSyxTQUE5QixFQUF5QyxFQUF6QyxFQUE2QyxhQUE3QyxFQUE0REMsT0FBNUQsQ0FBcUVDLElBQUQsSUFBVTtBQUM1RVQsUUFBQUEsTUFBTSxDQUFDVSxLQUFQLENBQWEsNEJBQWNELElBQWQsQ0FBYixFQUFrQ0EsSUFBbEM7QUFDRCxPQUZEO0FBR0QsS0FKQyxDQUFGO0FBS0FQLElBQUFBLEVBQUUsQ0FBQywyQ0FBRCxFQUE4QyxZQUFZO0FBQzFELFlBQU1TLEtBQUssR0FBRyxDQUNaO0FBQUMsZUFBTztBQUFSLE9BRFksRUFFWjtBQUNFQyxRQUFBQSxLQUFLLEVBQUU7QUFDTEMsVUFBQUEsS0FBSyxFQUFFO0FBQ0wsbUJBQU87QUFERjtBQURGLFNBRFQ7QUFNRUMsUUFBQUEsR0FBRyxFQUFFO0FBTlAsT0FGWSxFQVVaLEtBVlksRUFXWixJQVhZLEVBWVosQ0FaWSxDQUFkO0FBY0EsWUFBTUMsY0FBYyxHQUFHLENBQ3JCO0FBQUMsZUFBTyxLQUFSO0FBQWUsZUFBTztBQUF0QixPQURxQixFQUVyQjtBQUNFSCxRQUFBQSxLQUFLLEVBQUU7QUFDTEMsVUFBQUEsS0FBSyxFQUFFO0FBQ0wsbUJBQU8sS0FERjtBQUVMLG1CQUFPO0FBRkY7QUFERixTQURUO0FBT0VDLFFBQUFBLEdBQUcsRUFBRSxNQVBQO0FBUUVFLFFBQUFBLEdBQUcsRUFBRTtBQVJQLE9BRnFCLEVBWXJCLEtBWnFCLEVBYXJCLElBYnFCLEVBY3JCLENBZHFCLENBQXZCO0FBZ0JBLGtDQUFjTCxLQUFkLEVBQXFCLEtBQXJCLEVBQTRCLEtBQTVCLEVBQW1DWCxNQUFuQyxDQUEwQ2lCLElBQTFDLENBQStDUCxLQUEvQyxDQUFxREssY0FBckQ7QUFDRCxLQWhDQyxDQUFGO0FBaUNELEdBekVPLENBQVI7QUEwRUQsQ0F0Rk8sQ0FBUjtBQXdGQWQsUUFBUSxDQUFDLGdCQUFELEVBQW1CLFlBQVk7QUFDckNDLEVBQUFBLEVBQUUsQ0FBQyxnQ0FBRCxFQUFtQyxZQUFZO0FBQy9DLGlDQUFlLGlCQUFmLEVBQWtDRixNQUFsQyxDQUF5Q00sR0FBekMsQ0FBNkMsQ0FBQyxpQkFBRCxDQUE3QztBQUNELEdBRkMsQ0FBRjtBQUdBSixFQUFBQSxFQUFFLENBQUMsK0JBQUQsRUFBa0MsWUFBWTtBQUM5QyxpQ0FBZSxxQkFBZixFQUFzQ0YsTUFBdEMsQ0FBNkNNLEdBQTdDLENBQWlELENBQUMsaUJBQUQsQ0FBakQ7QUFDQSxpQ0FBZSx3Q0FBZixFQUF5RE4sTUFBekQsQ0FBZ0VNLEdBQWhFLENBQW9FLENBQ2xFLGlCQURrRSxFQUVsRSxrQkFGa0UsQ0FBcEU7QUFJRCxHQU5DLENBQUY7QUFPRCxDQVhPLENBQVIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc1BhY2thZ2VPckJ1bmRsZSwgZHVwbGljYXRlS2V5cywgcGFyc2VDYXBzQXJyYXkgfSBmcm9tICcuLi8uLi9saWIvYmFzZWRyaXZlci9oZWxwZXJzJztcbmltcG9ydCBjaGFpIGZyb20gJ2NoYWknO1xuaW1wb3J0IGNoYWlBc1Byb21pc2VkIGZyb20gJ2NoYWktYXMtcHJvbWlzZWQnO1xuXG5cbmNoYWkudXNlKGNoYWlBc1Byb21pc2VkKTtcbmNvbnN0IHNob3VsZCA9IGNoYWkuc2hvdWxkKCk7XG5cbmRlc2NyaWJlKCdoZWxwZXJzJywgZnVuY3Rpb24gKCkge1xuICBkZXNjcmliZSgnI2lzUGFja2FnZU9yQnVuZGxlJywgZnVuY3Rpb24gKCkge1xuICAgIGl0KCdzaG91bGQgYWNjZXB0IHBhY2thZ2VzIGFuZCBidW5kbGVzJywgZnVuY3Rpb24gKCkge1xuICAgICAgaXNQYWNrYWdlT3JCdW5kbGUoJ2lvLmFwcGl1bS50ZXN0YXBwJykuc2hvdWxkLmJlLnRydWU7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBub3QgYWNjZXB0IG5vbi1wYWNrYWdlcyBvciBub24tYnVuZGxlcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlzUGFja2FnZU9yQnVuZGxlKCdmb28nKS5zaG91bGQuYmUuZmFsc2U7XG4gICAgICBpc1BhY2thZ2VPckJ1bmRsZSgnL3BhdGgvdG8vYW4uYXBwJykuc2hvdWxkLmJlLmZhbHNlO1xuICAgICAgaXNQYWNrYWdlT3JCdW5kbGUoJy9wYXRoL3RvL2FuLmFwaycpLnNob3VsZC5iZS5mYWxzZTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNkdXBsaWNhdGVLZXlzJywgZnVuY3Rpb24gKCkge1xuICAgIGl0KCdzaG91bGQgdHJhbnNsYXRlIGtleSBpbiBhbiBvYmplY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBkdXBsaWNhdGVLZXlzKHsnZm9vJzogJ2hlbGxvIHdvcmxkJ30sICdmb28nLCAnYmFyJykuc2hvdWxkLmVxbCh7J2Zvbyc6ICdoZWxsbyB3b3JsZCcsICdiYXInOiAnaGVsbG8gd29ybGQnfSk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCB0cmFuc2xhdGUga2V5IGluIGFuIG9iamVjdCB3aXRoaW4gYW4gb2JqZWN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgZHVwbGljYXRlS2V5cyh7J2tleSc6IHsnZm9vJzogJ2hlbGxvIHdvcmxkJ319LCAnZm9vJywgJ2JhcicpLnNob3VsZC5lcWwoeydrZXknOiB7J2Zvbyc6ICdoZWxsbyB3b3JsZCcsICdiYXInOiAnaGVsbG8gd29ybGQnfX0pO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgdHJhbnNsYXRlIGtleSBpbiBhbiBvYmplY3Qgd2l0aCBhbiBhcnJheScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGR1cGxpY2F0ZUtleXMoW1xuICAgICAgICB7J2tleSc6IHsnZm9vJzogJ2hlbGxvIHdvcmxkJ319LFxuICAgICAgICB7J2Zvbyc6ICdIRUxMTyBXT1JMRCd9XG4gICAgICBdLCAnZm9vJywgJ2JhcicpLnNob3VsZC5lcWwoW1xuICAgICAgICB7J2tleSc6IHsnZm9vJzogJ2hlbGxvIHdvcmxkJywgJ2Jhcic6ICdoZWxsbyB3b3JsZCd9fSxcbiAgICAgICAgeydmb28nOiAnSEVMTE8gV09STEQnLCAnYmFyJzogJ0hFTExPIFdPUkxEJ31cbiAgICAgIF0pO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgZHVwbGljYXRlIGJvdGgga2V5cycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGR1cGxpY2F0ZUtleXMoe1xuICAgICAgICAna2V5T25lJzoge1xuICAgICAgICAgICdmb28nOiAnaGVsbG8gd29ybGQnLFxuICAgICAgICB9LFxuICAgICAgICAna2V5VHdvJzoge1xuICAgICAgICAgICdiYXInOiAnSEVMTE8gV09STEQnLFxuICAgICAgICB9LFxuICAgICAgfSwgJ2ZvbycsICdiYXInKS5zaG91bGQuZXFsKHtcbiAgICAgICAgJ2tleU9uZSc6IHtcbiAgICAgICAgICAnZm9vJzogJ2hlbGxvIHdvcmxkJyxcbiAgICAgICAgICAnYmFyJzogJ2hlbGxvIHdvcmxkJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ2tleVR3byc6IHtcbiAgICAgICAgICAnYmFyJzogJ0hFTExPIFdPUkxEJyxcbiAgICAgICAgICAnZm9vJzogJ0hFTExPIFdPUkxEJyxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBub3QgZG8gYW55dGhpbmcgdG8gcHJpbWl0aXZlcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIFswLCAxLCAtMSwgdHJ1ZSwgZmFsc2UsIG51bGwsIHVuZGVmaW5lZCwgJycsICdIZWxsbyBXb3JsZCddLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgc2hvdWxkLmVxdWFsKGR1cGxpY2F0ZUtleXMoaXRlbSksIGl0ZW0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCByZW5hbWUga2V5cyBvbiBiaWcgY29tcGxleCBvYmplY3RzJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgaW5wdXQgPSBbXG4gICAgICAgIHsnZm9vJzogJ2Jhcid9LFxuICAgICAgICB7XG4gICAgICAgICAgaGVsbG86IHtcbiAgICAgICAgICAgIHdvcmxkOiB7XG4gICAgICAgICAgICAgICdmb28nOiAnQkFSJyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGZvbzogJ2JhaHInXG4gICAgICAgIH0sXG4gICAgICAgICdmb28nLFxuICAgICAgICBudWxsLFxuICAgICAgICAwXG4gICAgICBdO1xuICAgICAgY29uc3QgZXhwZWN0ZWRPdXRwdXQgPSBbXG4gICAgICAgIHsnZm9vJzogJ2JhcicsICdGT08nOiAnYmFyJ30sXG4gICAgICAgIHtcbiAgICAgICAgICBoZWxsbzoge1xuICAgICAgICAgICAgd29ybGQ6IHtcbiAgICAgICAgICAgICAgJ2Zvbyc6ICdCQVInLFxuICAgICAgICAgICAgICAnRk9PJzogJ0JBUicsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmb286ICdiYWhyJyxcbiAgICAgICAgICBGT086ICdiYWhyJ1xuICAgICAgICB9LFxuICAgICAgICAnZm9vJyxcbiAgICAgICAgbnVsbCxcbiAgICAgICAgMFxuICAgICAgXTtcbiAgICAgIGR1cGxpY2F0ZUtleXMoaW5wdXQsICdmb28nLCAnRk9PJykuc2hvdWxkLmRlZXAuZXF1YWwoZXhwZWN0ZWRPdXRwdXQpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgncGFyc2VDYXBzQXJyYXknLCBmdW5jdGlvbiAoKSB7XG4gIGl0KCdzaG91bGQgcGFyc2Ugc3RyaW5nIGludG8gYXJyYXknLCBmdW5jdGlvbiAoKSB7XG4gICAgcGFyc2VDYXBzQXJyYXkoJy90bXAvbXkvYXBwLnppcCcpLnNob3VsZC5lcWwoWycvdG1wL215L2FwcC56aXAnXSk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHBhcnNlIGFycmF5IGludG8gYXJyYXknLCBmdW5jdGlvbiAoKSB7XG4gICAgcGFyc2VDYXBzQXJyYXkoJ1tcIi90bXAvbXkvYXBwLnppcFwiXScpLnNob3VsZC5lcWwoWycvdG1wL215L2FwcC56aXAnXSk7XG4gICAgcGFyc2VDYXBzQXJyYXkoJ1tcIi90bXAvbXkvYXBwLnppcFwiLFwiL3RtcC9teS9hcHAyLnppcFwiXScpLnNob3VsZC5lcWwoW1xuICAgICAgJy90bXAvbXkvYXBwLnppcCcsXG4gICAgICAnL3RtcC9teS9hcHAyLnppcCdcbiAgICBdKTtcbiAgfSk7XG59KTtcbiJdLCJmaWxlIjoidGVzdC9iYXNlZHJpdmVyL2hlbHBlcnMtc3BlY3MuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4ifQ==
