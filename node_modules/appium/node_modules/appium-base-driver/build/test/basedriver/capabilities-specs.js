"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("source-map-support/register");

var _capabilities = require("../../lib/basedriver/capabilities");

var _chai = _interopRequireDefault(require("chai"));

var _chaiAsPromised = _interopRequireDefault(require("chai-as-promised"));

var _lodash = _interopRequireDefault(require("lodash"));

var _desiredCaps = require("../../lib/basedriver/desired-caps");

_chai.default.use(_chaiAsPromised.default);

const should = _chai.default.should();

describe('caps', function () {
  describe('#validateCaps', function () {
    it('returns invalid argument error if "capability" is not a JSON object (1)', function () {
      for (let arg of [undefined, null, 1, true, 'string']) {
        (function () {
          (0, _capabilities.validateCaps)(arg);
        }).should.throw(/must be a JSON object/);
      }
    });
    it('returns result {} by default if caps is empty object and no constraints provided (2)', function () {
      (0, _capabilities.validateCaps)({}).should.deep.equal({});
    });
    describe('throws errors if constraints are not met', function () {
      it('returns invalid argument error if "present" constraint not met on property', function () {
        (() => (0, _capabilities.validateCaps)({}, {
          foo: {
            presence: true
          }
        })).should.throw(/'foo' can't be blank/);
      });
      it('returns the capability that was passed in if "skipPresenceConstraint" is false', function () {
        (0, _capabilities.validateCaps)({}, {
          foo: {
            presence: true
          }
        }, {
          skipPresenceConstraint: true
        }).should.deep.equal({});
      });
      it('returns invalid argument error if "isString" constraint not met on property', function () {
        (() => (0, _capabilities.validateCaps)({
          foo: 1
        }, {
          foo: {
            isString: true
          }
        })).should.throw(/'foo' must be of type string/);
      });
      it('returns invalid argument error if "isNumber" constraint not met on property', function () {
        (() => (0, _capabilities.validateCaps)({
          foo: 'bar'
        }, {
          foo: {
            isNumber: true
          }
        })).should.throw(/'foo' must be of type number/);
      });
      it('returns invalid argument error if "isBoolean" constraint not met on property', function () {
        (() => (0, _capabilities.validateCaps)({
          foo: 'bar'
        }, {
          foo: {
            isBoolean: true
          }
        })).should.throw(/'foo' must be of type boolean/);
      });
      it('returns invalid argument error if "inclusion" constraint not met on property', function () {
        (() => (0, _capabilities.validateCaps)({
          foo: '3'
        }, {
          foo: {
            inclusionCaseInsensitive: ['1', '2']
          }
        })).should.throw(/'foo' 3 not part of 1,2/);
      });
      it('returns invalid argument error if "inclusionCaseInsensitive" constraint not met on property', function () {
        (() => (0, _capabilities.validateCaps)({
          foo: 'a'
        }, {
          foo: {
            inclusion: ['A', 'B', 'C']
          }
        })).should.throw(/'foo' a is not included in the list/);
      });
    });
    it('should not throw errors if constraints are met', function () {
      let caps = {
        number: 1,
        string: 'string',
        present: 'present',
        extra: 'extra'
      };
      let constraints = {
        number: {
          isNumber: true
        },
        string: {
          isString: true
        },
        present: {
          presence: true
        },
        notPresent: {
          presence: false
        }
      };
      (0, _capabilities.validateCaps)(caps, constraints).should.deep.equal(caps);
    });
  });
  describe('#mergeCaps', function () {
    it('returns a result that is {} by default (1)', function () {
      (0, _capabilities.mergeCaps)().should.deep.equal({});
    });
    it('returns a result that matches primary by default (2, 3)', function () {
      (0, _capabilities.mergeCaps)({
        hello: 'world'
      }).should.deep.equal({
        hello: 'world'
      });
    });
    it('returns invalid argument error if primary and secondary have matching properties (4)', function () {
      (() => (0, _capabilities.mergeCaps)({
        hello: 'world'
      }, {
        hello: 'whirl'
      })).should.throw(/property 'hello' should not exist on both primary [\w\W]* and secondary [\w\W]*/);
    });
    it('returns a result with keys from primary and secondary together', function () {
      let primary = {
        a: 'a',
        b: 'b'
      };
      let secondary = {
        c: 'c',
        d: 'd'
      };
      (0, _capabilities.mergeCaps)(primary, secondary).should.deep.equal({
        a: 'a',
        b: 'b',
        c: 'c',
        d: 'd'
      });
    });
  });
  describe('#parseCaps', function () {
    let caps;
    beforeEach(function () {
      caps = {};
    });
    it('should return invalid argument if no caps object provided', function () {
      (() => (0, _capabilities.parseCaps)()).should.throw(/must be a JSON object/);
    });
    it('sets "requiredCaps" to property named "alwaysMatch" (2)', function () {
      caps.alwaysMatch = {
        hello: 'world'
      };
      (0, _capabilities.parseCaps)(caps).requiredCaps.should.deep.equal(caps.alwaysMatch);
    });
    it('sets "requiredCaps" to empty JSON object if "alwaysMatch" is not an object (2.1)', function () {
      (0, _capabilities.parseCaps)(caps).requiredCaps.should.deep.equal({});
    });
    it('returns invalid argument error if "requiredCaps" don\'t match "constraints" (2.2)', function () {
      caps.alwaysMatch = {
        foo: 1
      };
      (() => (0, _capabilities.parseCaps)(caps, {
        foo: {
          isString: true
        }
      })).should.throw(/'foo' must be of type string/);
    });
    it('sets "allFirstMatchCaps" to property named "firstMatch" (3)', function () {
      (0, _capabilities.parseCaps)({}, [{}]).allFirstMatchCaps.should.deep.equal([{}]);
    });
    it('sets "allFirstMatchCaps" to [{}] if "firstMatch" is undefined (3.1)', function () {
      (0, _capabilities.parseCaps)({}).allFirstMatchCaps.should.deep.equal([{}]);
    });
    it('returns invalid argument error if "firstMatch" is not an array and is not undefined (3.2)', function () {
      for (let arg of [null, 1, true, 'string']) {
        caps.firstMatch = arg;
        (function () {
          (0, _capabilities.parseCaps)(caps);
        }).should.throw(/must be a JSON array or undefined/);
      }
    });
    it('has "validatedFirstMatchCaps" property that is empty by default if no valid firstMatch caps were found (4)', function () {
      (0, _capabilities.parseCaps)(caps, {
        foo: {
          presence: true
        }
      }).validatedFirstMatchCaps.should.deep.equal([]);
    });
    describe('returns a "validatedFirstMatchCaps" array (5)', function () {
      it('that equals "firstMatch" if firstMatch is one empty object and there are no constraints', function () {
        caps.firstMatch = [{}];
        (0, _capabilities.parseCaps)(caps).validatedFirstMatchCaps.should.deep.equal(caps.firstMatch);
      });
      it('returns "null" matchedCaps if nothing matches', function () {
        caps.firstMatch = [{}];
        should.equal((0, _capabilities.parseCaps)(caps, {
          foo: {
            presence: true
          }
        }).matchedCaps, null);
      });
      it(`should return capabilities if presence constraint is matched in at least one of the 'firstMatch' capabilities objects`, function () {
        caps.alwaysMatch = {
          foo: 'bar'
        };
        caps.firstMatch = [{
          hello: 'world'
        }, {
          goodbye: 'world'
        }];
        (0, _capabilities.parseCaps)(caps, {
          goodbye: {
            presence: true
          }
        }).matchedCaps.should.deep.equal({
          foo: 'bar',
          goodbye: 'world'
        });
      });
      it(`throws invalid argument if presence constraint is not met on any capabilities`, function () {
        caps.alwaysMatch = {
          foo: 'bar'
        };
        caps.firstMatch = [{
          hello: 'world'
        }, {
          goodbye: 'world'
        }];
        should.equal((0, _capabilities.parseCaps)(caps, {
          someAttribute: {
            presence: true
          }
        }).matchedCaps, null);
      });
      it('that equals firstMatch if firstMatch contains two objects that pass the provided constraints', function () {
        caps.alwaysMatch = {
          foo: 'bar'
        };
        caps.firstMatch = [{
          foo: 'bar1'
        }, {
          foo: 'bar2'
        }];
        let constraints = {
          foo: {
            presence: true,
            isString: true
          }
        };
        (0, _capabilities.parseCaps)(caps, constraints).validatedFirstMatchCaps.should.deep.equal(caps.firstMatch);
      });
      it('returns invalid argument error if the firstMatch[2] is not an object', function () {
        caps.alwaysMatch = 'Not an object and not undefined';
        caps.firstMatch = [{
          foo: 'bar'
        }, 'foo'];
        (() => (0, _capabilities.parseCaps)(caps, {})).should.throw(/must be a JSON object/);
      });
    });
    describe('returns a matchedCaps object (6)', function () {
      beforeEach(function () {
        caps.alwaysMatch = {
          hello: 'world'
        };
      });
      it('which is same as alwaysMatch if firstMatch array is not provided', function () {
        (0, _capabilities.parseCaps)(caps).matchedCaps.should.deep.equal({
          hello: 'world'
        });
      });
      it('merges caps together', function () {
        caps.firstMatch = [{
          foo: 'bar'
        }];
        (0, _capabilities.parseCaps)(caps).matchedCaps.should.deep.equal({
          hello: 'world',
          foo: 'bar'
        });
      });
      it('with merged caps', function () {
        caps.firstMatch = [{
          hello: 'bar',
          foo: 'foo'
        }, {
          foo: 'bar'
        }];
        (0, _capabilities.parseCaps)(caps).matchedCaps.should.deep.equal({
          hello: 'world',
          foo: 'bar'
        });
      });
    });
  });
  describe('#processCaps', function () {
    it('should return "alwaysMatch" if "firstMatch" and "constraints" were not provided', function () {
      (0, _capabilities.processCapabilities)({}).should.deep.equal({});
    });
    it('should return merged caps', function () {
      (0, _capabilities.processCapabilities)({
        alwaysMatch: {
          hello: 'world'
        },
        firstMatch: [{
          foo: 'bar'
        }]
      }).should.deep.equal({
        hello: 'world',
        foo: 'bar'
      });
    });
    it('should strip out the "appium:" prefix for non-standard capabilities', function () {
      (0, _capabilities.processCapabilities)({
        alwaysMatch: {
          'appium:hello': 'world'
        },
        firstMatch: [{
          'appium:foo': 'bar'
        }]
      }).should.deep.equal({
        hello: 'world',
        foo: 'bar'
      });
    });
    it('should still accept prefixed caps even if they are standard capabilities (https://www.w3.org/TR/webdriver/#dfn-table-of-standard-capabilities)', function () {
      (0, _capabilities.processCapabilities)({
        alwaysMatch: {
          'appium:platformName': 'Whatevz'
        },
        firstMatch: [{
          'appium:browserName': 'Anything'
        }]
      }).should.deep.equal({
        platformName: 'Whatevz',
        browserName: 'Anything'
      });
    });
    it('should prefer standard caps that are non-prefixed to prefixed', function () {
      (0, _capabilities.processCapabilities)({
        alwaysMatch: {
          'appium:platformName': 'Foo',
          'platformName': 'Bar'
        },
        firstMatch: [{
          'appium:browserName': 'FOO',
          'browserName': 'BAR'
        }]
      }).should.deep.equal({
        platformName: 'Bar',
        browserName: 'BAR'
      });
    });
    it('should throw exception if duplicates in alwaysMatch and firstMatch', function () {
      (() => (0, _capabilities.processCapabilities)({
        alwaysMatch: {
          'platformName': 'Fake',
          'appium:fakeCap': 'foobar'
        },
        firstMatch: [{
          'appium:platformName': 'bar'
        }]
      })).should.throw(/should not exist on both primary/);
    });
    it('should not throw an exception if presence constraint is not met on a firstMatch capability', function () {
      const caps = (0, _capabilities.processCapabilities)({
        alwaysMatch: {
          'platformName': 'Fake',
          'appium:fakeCap': 'foobar'
        },
        firstMatch: [{
          'foo': 'bar'
        }]
      }, {
        platformName: {
          presence: true
        },
        fakeCap: {
          presence: true
        }
      });
      caps.platformName.should.equal('Fake');
      caps.fakeCap.should.equal('foobar');
      caps.foo.should.equal('bar');
    });
    it('should throw an exception if no matching caps were found', function () {
      (() => (0, _capabilities.processCapabilities)({
        alwaysMatch: {
          'platformName': 'Fake',
          'appium:fakeCap': 'foobar'
        },
        firstMatch: [{
          'foo': 'bar'
        }]
      }, {
        platformName: {
          presence: true
        },
        fakeCap: {
          presence: true
        },
        missingCap: {
          presence: true
        }
      })).should.throw(/'missingCap' can't be blank/);
    });
    describe('validate Appium constraints', function () {
      let constraints = { ..._desiredCaps.desiredCapabilityConstraints
      };
      let matchingCaps = {
        'platformName': 'Fake',
        'automationName': 'Fake',
        'deviceName': 'Fake'
      };
      let caps;
      it('should validate when alwaysMatch has the proper caps', function () {
        caps = {
          alwaysMatch: matchingCaps,
          firstMatch: [{}]
        };
        (0, _capabilities.processCapabilities)(caps, constraints).should.deep.equal(matchingCaps);
      });
      it('should validate when firstMatch[0] has the proper caps', function () {
        caps = {
          alwaysMatch: {},
          firstMatch: [matchingCaps]
        };
        (0, _capabilities.processCapabilities)(caps, constraints).should.deep.equal(matchingCaps);
      });
      it('should validate when alwaysMatch and firstMatch[0] have the proper caps when merged together', function () {
        caps = {
          alwaysMatch: _lodash.default.omit(matchingCaps, ['deviceName']),
          firstMatch: [{
            'appium:deviceName': 'Fake'
          }]
        };
        (0, _capabilities.processCapabilities)(caps, constraints).should.deep.equal(matchingCaps);
      });
      it('should validate when automationName is omitted', function () {
        caps = {
          alwaysMatch: _lodash.default.omit(matchingCaps, ['automationName'])
        };
        (0, _capabilities.processCapabilities)(caps, constraints).should.deep.equal(_lodash.default.omit(matchingCaps, 'automationName'));
      });
      it('should pass if first element in "firstMatch" does validate and second element does not', function () {
        caps = {
          alwaysMatch: {},
          firstMatch: [matchingCaps, {
            badCaps: 'badCaps'
          }]
        };
        (0, _capabilities.processCapabilities)(caps, constraints).should.deep.equal(matchingCaps);
      });
      it('should pass if first element in "firstMatch" does not validate and second element does', function () {
        caps = {
          alwaysMatch: {},
          firstMatch: [{
            badCaps: 'badCaps'
          }, matchingCaps]
        };
        (0, _capabilities.processCapabilities)(caps, constraints).should.deep.equal(matchingCaps);
      });
      it('should fail when bad parameters are passed in more than one firstMatch capability', function () {
        caps = {
          alwaysMatch: {},
          firstMatch: [{
            bad: 'params'
          }, {
            more: 'bad-params'
          }]
        };
        (() => (0, _capabilities.processCapabilities)(caps, constraints)).should.throw(/Could not find matching capabilities/);
      });
    });
  });
  describe('.findNonPrefixedCaps', function () {
    it('should find alwaysMatch caps with no prefix', function () {
      (0, _capabilities.findNonPrefixedCaps)({
        alwaysMatch: {
          'non-standard': 'dummy'
        }
      }).should.eql(['non-standard']);
    });
    it('should not find a standard cap in alwaysMatch', function () {
      (0, _capabilities.findNonPrefixedCaps)({
        alwaysMatch: {
          'platformName': 'Any'
        }
      }).should.eql([]);
    });
    it('should find firstMatch caps with no prefix', function () {
      (0, _capabilities.findNonPrefixedCaps)({
        alwaysMatch: {},
        firstMatch: [{
          'non-standard': 'dummy'
        }]
      }).should.eql(['non-standard']);
    });
    it('should not find a standard cap in prefix', function () {
      (0, _capabilities.findNonPrefixedCaps)({
        alwaysMatch: {},
        firstMatch: [{
          'platformName': 'Any'
        }]
      }).should.eql([]);
    });
    it('should find firstMatch caps in second item of firstMatch array', function () {
      (0, _capabilities.findNonPrefixedCaps)({
        alwaysMatch: {},
        firstMatch: [{}, {
          'non-standard': 'dummy'
        }]
      }).should.eql(['non-standard']);
    });
    it('should remove duplicates from alwaysMatch and firstMatch', function () {
      (0, _capabilities.findNonPrefixedCaps)({
        alwaysMatch: {
          'non-standard': 'something'
        },
        firstMatch: [{
          'non-standard': 'dummy'
        }]
      }).should.eql(['non-standard']);
    });
    it('should remove duplicates from firstMatch', function () {
      (0, _capabilities.findNonPrefixedCaps)({
        firstMatch: [{
          'non-standard': 'dummy'
        }, {
          'non-standard': 'dummy 2'
        }]
      }).should.eql(['non-standard']);
    });
    it('should remove duplicates and keep standard capabilities', function () {
      const alwaysMatch = {
        platformName: 'Fake',
        nonStandardOne: 'non-standard',
        nonStandardTwo: 'non-standard'
      };
      const firstMatch = [{
        nonStandardThree: 'non-standard',
        nonStandardFour: 'non-standard',
        browserName: 'FakeBrowser'
      }, {
        nonStandardThree: 'non-standard',
        nonStandardFour: 'non-standard',
        nonStandardFive: 'non-standard',
        browserVersion: 'whateva'
      }];
      (0, _capabilities.findNonPrefixedCaps)({
        alwaysMatch,
        firstMatch
      }).should.eql(['nonStandardOne', 'nonStandardTwo', 'nonStandardThree', 'nonStandardFour', 'nonStandardFive']);
    });
  });
});require('source-map-support').install();


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvYmFzZWRyaXZlci9jYXBhYmlsaXRpZXMtc3BlY3MuanMiXSwibmFtZXMiOlsiY2hhaSIsInVzZSIsImNoYWlBc1Byb21pc2VkIiwic2hvdWxkIiwiZGVzY3JpYmUiLCJpdCIsImFyZyIsInVuZGVmaW5lZCIsInRocm93IiwiZGVlcCIsImVxdWFsIiwiZm9vIiwicHJlc2VuY2UiLCJza2lwUHJlc2VuY2VDb25zdHJhaW50IiwiaXNTdHJpbmciLCJpc051bWJlciIsImlzQm9vbGVhbiIsImluY2x1c2lvbkNhc2VJbnNlbnNpdGl2ZSIsImluY2x1c2lvbiIsImNhcHMiLCJudW1iZXIiLCJzdHJpbmciLCJwcmVzZW50IiwiZXh0cmEiLCJjb25zdHJhaW50cyIsIm5vdFByZXNlbnQiLCJoZWxsbyIsInByaW1hcnkiLCJhIiwiYiIsInNlY29uZGFyeSIsImMiLCJkIiwiYmVmb3JlRWFjaCIsImFsd2F5c01hdGNoIiwicmVxdWlyZWRDYXBzIiwiYWxsRmlyc3RNYXRjaENhcHMiLCJmaXJzdE1hdGNoIiwidmFsaWRhdGVkRmlyc3RNYXRjaENhcHMiLCJtYXRjaGVkQ2FwcyIsImdvb2RieWUiLCJzb21lQXR0cmlidXRlIiwicGxhdGZvcm1OYW1lIiwiYnJvd3Nlck5hbWUiLCJmYWtlQ2FwIiwibWlzc2luZ0NhcCIsImRlc2lyZWRDYXBhYmlsaXR5Q29uc3RyYWludHMiLCJtYXRjaGluZ0NhcHMiLCJfIiwib21pdCIsImJhZENhcHMiLCJiYWQiLCJtb3JlIiwiZXFsIiwibm9uU3RhbmRhcmRPbmUiLCJub25TdGFuZGFyZFR3byIsIm5vblN0YW5kYXJkVGhyZWUiLCJub25TdGFuZGFyZEZvdXIiLCJub25TdGFuZGFyZEZpdmUiLCJicm93c2VyVmVyc2lvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUFBLGNBQUtDLEdBQUwsQ0FBU0MsdUJBQVQ7O0FBQ0EsTUFBTUMsTUFBTSxHQUFHSCxjQUFLRyxNQUFMLEVB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Y0FGRTtBQUdsQkMsUUFBQUEsY0FBYyxFQUFFO0FBSEUsT0FBcEI7QUFLQSxZQUFNbEIsVUFBVSxHQUFHLENBQ2pCO0FBQUNtQixRQUFBQSxnQkFBZ0IsRUFBRSxjQUFuQjtBQUFtQ0MsUUFBQUEsZUFBZSxFQUFFLGNBQXBEO0FBQW9FZCxRQUFBQSxXQUFXLEVBQUU7QUFBakYsT0FEaUIsRUFFakI7QUFBQ2EsUUFBQUEsZ0JBQWdCLEVBQUUsY0FBbkI7QUFBbUNDLFFBQUFBLGVBQWUsRUFBRSxjQUFwRDtBQUFvRUMsUUFBQUEsZUFBZSxFQUFFLGNBQXJGO0FBQXFHQyxRQUFBQSxjQUFjLEVBQUU7QUFBckgsT0FGaUIsQ0FBbkI7QUFJQSw2Q0FBb0I7QUFBQ3pCLFFBQUFBLFdBQUQ7QUFBY0csUUFBQUE7QUFBZCxPQUFwQixFQUErQ2xDLE1BQS9DLENBQXNEa0QsR0FBdEQsQ0FBMEQsQ0FBQyxnQkFBRCxFQUFtQixnQkFBbkIsRUFBcUMsa0JBQXJDLEVBQXlELGlCQUF6RCxFQUE0RSxpQkFBNUUsQ0FBMUQ7QUFDRCxLQVhDLENBQUY7QUFZRCxHQXBETyxDQUFSO0FBcURELENBdGFPLENBQVIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwYXJzZUNhcHMsIHZhbGlkYXRlQ2FwcywgbWVyZ2VDYXBzLCBwcm9jZXNzQ2FwYWJpbGl0aWVzLCBmaW5kTm9uUHJlZml4ZWRDYXBzIH0gZnJvbSAnLi4vLi4vbGliL2Jhc2Vkcml2ZXIvY2FwYWJpbGl0aWVzJztcbmltcG9ydCBjaGFpIGZyb20gJ2NoYWknO1xuaW1wb3J0IGNoYWlBc1Byb21pc2VkIGZyb20gJ2NoYWktYXMtcHJvbWlzZWQnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IGRlc2lyZWRDYXBhYmlsaXR5Q29uc3RyYWludHMgfSBmcm9tICcuLi8uLi9saWIvYmFzZWRyaXZlci9kZXNpcmVkLWNhcHMnO1xuXG5jaGFpLnVzZShjaGFpQXNQcm9taXNlZCk7XG5jb25zdCBzaG91bGQgPSBjaGFpLnNob3VsZCgpO1xuXG5kZXNjcmliZSgnY2FwcycsIGZ1bmN0aW9uICgpIHtcblxuICAvLyBUZXN0cyBiYXNlZCBvbjogaHR0cHM6Ly93d3cudzMub3JnL1RSL3dlYmRyaXZlci8jZGZuLXZhbGlkYXRlLWNhcHNcbiAgZGVzY3JpYmUoJyN2YWxpZGF0ZUNhcHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgaXQoJ3JldHVybnMgaW52YWxpZCBhcmd1bWVudCBlcnJvciBpZiBcImNhcGFiaWxpdHlcIiBpcyBub3QgYSBKU09OIG9iamVjdCAoMSknLCBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKGxldCBhcmcgb2YgW3VuZGVmaW5lZCwgbnVsbCwgMSwgdHJ1ZSwgJ3N0cmluZyddKSB7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7IHZhbGlkYXRlQ2FwcyhhcmcpOyB9KS5zaG91bGQudGhyb3coL211c3QgYmUgYSBKU09OIG9iamVjdC8pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgcmVzdWx0IHt9IGJ5IGRlZmF1bHQgaWYgY2FwcyBpcyBlbXB0eSBvYmplY3QgYW5kIG5vIGNvbnN0cmFpbnRzIHByb3ZpZGVkICgyKScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhbGlkYXRlQ2Fwcyh7fSkuc2hvdWxkLmRlZXAuZXF1YWwoe30pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3Rocm93cyBlcnJvcnMgaWYgY29uc3RyYWludHMgYXJlIG5vdCBtZXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpdCgncmV0dXJucyBpbnZhbGlkIGFyZ3VtZW50IGVycm9yIGlmIFwicHJlc2VudFwiIGNvbnN0cmFpbnQgbm90IG1ldCBvbiBwcm9wZXJ0eScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgKCgpID0+IHZhbGlkYXRlQ2Fwcyh7fSwge2Zvbzoge3ByZXNlbmNlOiB0cnVlfX0pKS5zaG91bGQudGhyb3coLydmb28nIGNhbid0IGJlIGJsYW5rLyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3JldHVybnMgdGhlIGNhcGFiaWxpdHkgdGhhdCB3YXMgcGFzc2VkIGluIGlmIFwic2tpcFByZXNlbmNlQ29uc3RyYWludFwiIGlzIGZhbHNlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YWxpZGF0ZUNhcHMoe30sIHtmb286IHtwcmVzZW5jZTogdHJ1ZX19LCB7c2tpcFByZXNlbmNlQ29uc3RyYWludDogdHJ1ZX0pLnNob3VsZC5kZWVwLmVxdWFsKHt9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgncmV0dXJucyBpbnZhbGlkIGFyZ3VtZW50IGVycm9yIGlmIFwiaXNTdHJpbmdcIiBjb25zdHJhaW50IG5vdCBtZXQgb24gcHJvcGVydHknLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICgoKSA9PiB2YWxpZGF0ZUNhcHMoe2ZvbzogMX0sIHtmb286IHtpc1N0cmluZzogdHJ1ZX19KSkuc2hvdWxkLnRocm93KC8nZm9vJyBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3JldHVybnMgaW52YWxpZCBhcmd1bWVudCBlcnJvciBpZiBcImlzTnVtYmVyXCIgY29uc3RyYWludCBub3QgbWV0IG9uIHByb3BlcnR5JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAoKCkgPT4gdmFsaWRhdGVDYXBzKHtmb286ICdiYXInfSwge2Zvbzoge2lzTnVtYmVyOiB0cnVlfX0pKS5zaG91bGQudGhyb3coLydmb28nIG11c3QgYmUgb2YgdHlwZSBudW1iZXIvKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgncmV0dXJucyBpbnZhbGlkIGFyZ3VtZW50IGVycm9yIGlmIFwiaXNCb29sZWFuXCIgY29uc3RyYWludCBub3QgbWV0IG9uIHByb3BlcnR5JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAoKCkgPT4gdmFsaWRhdGVDYXBzKHtmb286ICdiYXInfSwge2Zvbzoge2lzQm9vbGVhbjogdHJ1ZX19KSkuc2hvdWxkLnRocm93KC8nZm9vJyBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbi8pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdyZXR1cm5zIGludmFsaWQgYXJndW1lbnQgZXJyb3IgaWYgXCJpbmNsdXNpb25cIiBjb25zdHJhaW50IG5vdCBtZXQgb24gcHJvcGVydHknLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICgoKSA9PiB2YWxpZGF0ZUNhcHMoe2ZvbzogJzMnfSwge2Zvbzoge2luY2x1c2lvbkNhc2VJbnNlbnNpdGl2ZTogWycxJywgJzInXX19KSkuc2hvdWxkLnRocm93KC8nZm9vJyAzIG5vdCBwYXJ0IG9mIDEsMi8pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdyZXR1cm5zIGludmFsaWQgYXJndW1lbnQgZXJyb3IgaWYgXCJpbmNsdXNpb25DYXNlSW5zZW5zaXRpdmVcIiBjb25zdHJhaW50IG5vdCBtZXQgb24gcHJvcGVydHknLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICgoKSA9PiB2YWxpZGF0ZUNhcHMoe2ZvbzogJ2EnfSwge2Zvbzoge2luY2x1c2lvbjogWydBJywgJ0InLCAnQyddfX0pKS5zaG91bGQudGhyb3coLydmb28nIGEgaXMgbm90IGluY2x1ZGVkIGluIHRoZSBsaXN0Lyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHRocm93IGVycm9ycyBpZiBjb25zdHJhaW50cyBhcmUgbWV0JywgZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGNhcHMgPSB7XG4gICAgICAgIG51bWJlcjogMSxcbiAgICAgICAgc3RyaW5nOiAnc3RyaW5nJyxcbiAgICAgICAgcHJlc2VudDogJ3ByZXNlbnQnLFxuICAgICAgICBleHRyYTogJ2V4dHJhJyxcbiAgICAgIH07XG5cbiAgICAgIGxldCBjb25zdHJhaW50cyA9IHtcbiAgICAgICAgbnVtYmVyOiB7aXNOdW1iZXI6IHRydWV9LFxuICAgICAgICBzdHJpbmc6IHtpc1N0cmluZzogdHJ1ZX0sXG4gICAgICAgIHByZXNlbnQ6IHtwcmVzZW5jZTogdHJ1ZX0sXG4gICAgICAgIG5vdFByZXNlbnQ6IHtwcmVzZW5jZTogZmFsc2V9LFxuICAgICAgfTtcblxuICAgICAgdmFsaWRhdGVDYXBzKGNhcHMsIGNvbnN0cmFpbnRzKS5zaG91bGQuZGVlcC5lcXVhbChjYXBzKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gVGVzdHMgYmFzZWQgb246IGh0dHBzOi8vd3d3LnczLm9yZy9UUi93ZWJkcml2ZXIvI2Rmbi1tZXJnaW5nLWNhcHNcbiAgZGVzY3JpYmUoJyNtZXJnZUNhcHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgaXQoJ3JldHVybnMgYSByZXN1bHQgdGhhdCBpcyB7fSBieSBkZWZhdWx0ICgxKScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIG1lcmdlQ2FwcygpLnNob3VsZC5kZWVwLmVxdWFsKHt9KTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIGEgcmVzdWx0IHRoYXQgbWF0Y2hlcyBwcmltYXJ5IGJ5IGRlZmF1bHQgKDIsIDMpJywgZnVuY3Rpb24gKCkge1xuICAgICAgbWVyZ2VDYXBzKHtoZWxsbzogJ3dvcmxkJ30pLnNob3VsZC5kZWVwLmVxdWFsKHtoZWxsbzogJ3dvcmxkJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgaW52YWxpZCBhcmd1bWVudCBlcnJvciBpZiBwcmltYXJ5IGFuZCBzZWNvbmRhcnkgaGF2ZSBtYXRjaGluZyBwcm9wZXJ0aWVzICg0KScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICgoKSA9PiBtZXJnZUNhcHMoe2hlbGxvOiAnd29ybGQnfSwge2hlbGxvOiAnd2hpcmwnfSkpLnNob3VsZC50aHJvdygvcHJvcGVydHkgJ2hlbGxvJyBzaG91bGQgbm90IGV4aXN0IG9uIGJvdGggcHJpbWFyeSBbXFx3XFxXXSogYW5kIHNlY29uZGFyeSBbXFx3XFxXXSovKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIGEgcmVzdWx0IHdpdGgga2V5cyBmcm9tIHByaW1hcnkgYW5kIHNlY29uZGFyeSB0b2dldGhlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBwcmltYXJ5ID0ge1xuICAgICAgICBhOiAnYScsXG4gICAgICAgIGI6ICdiJyxcbiAgICAgIH07XG4gICAgICBsZXQgc2Vjb25kYXJ5ID0ge1xuICAgICAgICBjOiAnYycsXG4gICAgICAgIGQ6ICdkJyxcbiAgICAgIH07XG4gICAgICBtZXJnZUNhcHMocHJpbWFyeSwgc2Vjb25kYXJ5KS5zaG91bGQuZGVlcC5lcXVhbCh7XG4gICAgICAgIGE6ICdhJywgYjogJ2InLCBjOiAnYycsIGQ6ICdkJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICAvLyBUZXN0cyBiYXNlZCBvbjogaHR0cHM6Ly93d3cudzMub3JnL1RSL3dlYmRyaXZlci8jcHJvY2Vzc2luZy1jYXBzXG4gIGRlc2NyaWJlKCcjcGFyc2VDYXBzJywgZnVuY3Rpb24gKCkge1xuICAgIGxldCBjYXBzO1xuXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBjYXBzID0ge307XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBpbnZhbGlkIGFyZ3VtZW50IGlmIG5vIGNhcHMgb2JqZWN0IHByb3ZpZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgKCgpID0+IHBhcnNlQ2FwcygpKS5zaG91bGQudGhyb3coL211c3QgYmUgYSBKU09OIG9iamVjdC8pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3NldHMgXCJyZXF1aXJlZENhcHNcIiB0byBwcm9wZXJ0eSBuYW1lZCBcImFsd2F5c01hdGNoXCIgKDIpJywgZnVuY3Rpb24gKCkge1xuICAgICAgY2Fwcy5hbHdheXNNYXRjaCA9IHtoZWxsbzogJ3dvcmxkJ307XG4gICAgICBwYXJzZUNhcHMoY2FwcykucmVxdWlyZWRDYXBzLnNob3VsZC5kZWVwLmVxdWFsKGNhcHMuYWx3YXlzTWF0Y2gpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3NldHMgXCJyZXF1aXJlZENhcHNcIiB0byBlbXB0eSBKU09OIG9iamVjdCBpZiBcImFsd2F5c01hdGNoXCIgaXMgbm90IGFuIG9iamVjdCAoMi4xKScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHBhcnNlQ2FwcyhjYXBzKS5yZXF1aXJlZENhcHMuc2hvdWxkLmRlZXAuZXF1YWwoe30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgaW52YWxpZCBhcmd1bWVudCBlcnJvciBpZiBcInJlcXVpcmVkQ2Fwc1wiIGRvblxcJ3QgbWF0Y2ggXCJjb25zdHJhaW50c1wiICgyLjIpJywgZnVuY3Rpb24gKCkge1xuICAgICAgY2Fwcy5hbHdheXNNYXRjaCA9IHtmb286IDF9O1xuICAgICAgKCgpID0+IHBhcnNlQ2FwcyhjYXBzLCB7Zm9vOiB7aXNTdHJpbmc6IHRydWV9fSkpLnNob3VsZC50aHJvdygvJ2ZvbycgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy8pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3NldHMgXCJhbGxGaXJzdE1hdGNoQ2Fwc1wiIHRvIHByb3BlcnR5IG5hbWVkIFwiZmlyc3RNYXRjaFwiICgzKScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHBhcnNlQ2Fwcyh7fSwgW3t9XSkuYWxsRmlyc3RNYXRjaENhcHMuc2hvdWxkLmRlZXAuZXF1YWwoW3t9XSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2V0cyBcImFsbEZpcnN0TWF0Y2hDYXBzXCIgdG8gW3t9XSBpZiBcImZpcnN0TWF0Y2hcIiBpcyB1bmRlZmluZWQgKDMuMSknLCBmdW5jdGlvbiAoKSB7XG4gICAgICBwYXJzZUNhcHMoe30pLmFsbEZpcnN0TWF0Y2hDYXBzLnNob3VsZC5kZWVwLmVxdWFsKFt7fV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgaW52YWxpZCBhcmd1bWVudCBlcnJvciBpZiBcImZpcnN0TWF0Y2hcIiBpcyBub3QgYW4gYXJyYXkgYW5kIGlzIG5vdCB1bmRlZmluZWQgKDMuMiknLCBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKGxldCBhcmcgb2YgW251bGwsIDEsIHRydWUsICdzdHJpbmcnXSkge1xuICAgICAgICBjYXBzLmZpcnN0TWF0Y2ggPSBhcmc7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7IHBhcnNlQ2FwcyhjYXBzKTsgfSkuc2hvdWxkLnRocm93KC9tdXN0IGJlIGEgSlNPTiBhcnJheSBvciB1bmRlZmluZWQvKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdoYXMgXCJ2YWxpZGF0ZWRGaXJzdE1hdGNoQ2Fwc1wiIHByb3BlcnR5IHRoYXQgaXMgZW1wdHkgYnkgZGVmYXVsdCBpZiBubyB2YWxpZCBmaXJzdE1hdGNoIGNhcHMgd2VyZSBmb3VuZCAoNCknLCBmdW5jdGlvbiAoKSB7XG4gICAgICBwYXJzZUNhcHMoY2Fwcywge2Zvbzoge3ByZXNlbmNlOiB0cnVlfX0pLnZhbGlkYXRlZEZpcnN0TWF0Y2hDYXBzLnNob3VsZC5kZWVwLmVxdWFsKFtdKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdyZXR1cm5zIGEgXCJ2YWxpZGF0ZWRGaXJzdE1hdGNoQ2Fwc1wiIGFycmF5ICg1KScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGl0KCd0aGF0IGVxdWFscyBcImZpcnN0TWF0Y2hcIiBpZiBmaXJzdE1hdGNoIGlzIG9uZSBlbXB0eSBvYmplY3QgYW5kIHRoZXJlIGFyZSBubyBjb25zdHJhaW50cycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Fwcy5maXJzdE1hdGNoID0gW3t9XTtcbiAgICAgICAgcGFyc2VDYXBzKGNhcHMpLnZhbGlkYXRlZEZpcnN0TWF0Y2hDYXBzLnNob3VsZC5kZWVwLmVxdWFsKGNhcHMuZmlyc3RNYXRjaCk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3JldHVybnMgXCJudWxsXCIgbWF0Y2hlZENhcHMgaWYgbm90aGluZyBtYXRjaGVzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYXBzLmZpcnN0TWF0Y2ggPSBbe31dO1xuICAgICAgICBzaG91bGQuZXF1YWwocGFyc2VDYXBzKGNhcHMsIHtmb286IHtwcmVzZW5jZTogdHJ1ZX19KS5tYXRjaGVkQ2FwcywgbnVsbCk7XG4gICAgICB9KTtcblxuICAgICAgaXQoYHNob3VsZCByZXR1cm4gY2FwYWJpbGl0aWVzIGlmIHByZXNlbmNlIGNvbnN0cmFpbnQgaXMgbWF0Y2hlZCBpbiBhdCBsZWFzdCBvbmUgb2YgdGhlICdmaXJzdE1hdGNoJyBjYXBhYmlsaXRpZXMgb2JqZWN0c2AsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Fwcy5hbHdheXNNYXRjaCA9IHtcbiAgICAgICAgICBmb286ICdiYXInLFxuICAgICAgICB9O1xuICAgICAgICBjYXBzLmZpcnN0TWF0Y2ggPSBbe1xuICAgICAgICAgIGhlbGxvOiAnd29ybGQnLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZ29vZGJ5ZTogJ3dvcmxkJyxcbiAgICAgICAgfV07XG4gICAgICAgIHBhcnNlQ2FwcyhjYXBzLCB7Z29vZGJ5ZToge3ByZXNlbmNlOiB0cnVlfX0pLm1hdGNoZWRDYXBzLnNob3VsZC5kZWVwLmVxdWFsKHtcbiAgICAgICAgICBmb286ICdiYXInLFxuICAgICAgICAgIGdvb2RieWU6ICd3b3JsZCcsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KGB0aHJvd3MgaW52YWxpZCBhcmd1bWVudCBpZiBwcmVzZW5jZSBjb25zdHJhaW50IGlzIG5vdCBtZXQgb24gYW55IGNhcGFiaWxpdGllc2AsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Fwcy5hbHdheXNNYXRjaCA9IHtcbiAgICAgICAgICBmb286ICdiYXInLFxuICAgICAgICB9O1xuICAgICAgICBjYXBzLmZpcnN0TWF0Y2ggPSBbe1xuICAgICAgICAgIGhlbGxvOiAnd29ybGQnLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZ29vZGJ5ZTogJ3dvcmxkJyxcbiAgICAgICAgfV07XG4gICAgICAgIHNob3VsZC5lcXVhbChwYXJzZUNhcHMoY2Fwcywge3NvbWVBdHRyaWJ1dGU6IHtwcmVzZW5jZTogdHJ1ZX19KS5tYXRjaGVkQ2FwcywgbnVsbCk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3RoYXQgZXF1YWxzIGZpcnN0TWF0Y2ggaWYgZmlyc3RNYXRjaCBjb250YWlucyB0d28gb2JqZWN0cyB0aGF0IHBhc3MgdGhlIHByb3ZpZGVkIGNvbnN0cmFpbnRzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYXBzLmFsd2F5c01hdGNoID0ge1xuICAgICAgICAgIGZvbzogJ2JhcidcbiAgICAgICAgfTtcbiAgICAgICAgY2Fwcy5maXJzdE1hdGNoID0gW1xuICAgICAgICAgIHtmb286ICdiYXIxJ30sXG4gICAgICAgICAge2ZvbzogJ2JhcjInfSxcbiAgICAgICAgXTtcblxuICAgICAgICBsZXQgY29uc3RyYWludHMgPSB7XG4gICAgICAgICAgZm9vOiB7XG4gICAgICAgICAgICBwcmVzZW5jZTogdHJ1ZSxcbiAgICAgICAgICAgIGlzU3RyaW5nOiB0cnVlLFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBwYXJzZUNhcHMoY2FwcywgY29uc3RyYWludHMpLnZhbGlkYXRlZEZpcnN0TWF0Y2hDYXBzLnNob3VsZC5kZWVwLmVxdWFsKGNhcHMuZmlyc3RNYXRjaCk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3JldHVybnMgaW52YWxpZCBhcmd1bWVudCBlcnJvciBpZiB0aGUgZmlyc3RNYXRjaFsyXSBpcyBub3QgYW4gb2JqZWN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYXBzLmFsd2F5c01hdGNoID0gJ05vdCBhbiBvYmplY3QgYW5kIG5vdCB1bmRlZmluZWQnO1xuICAgICAgICBjYXBzLmZpcnN0TWF0Y2ggPSBbe2ZvbzogJ2Jhcid9LCAnZm9vJ107XG4gICAgICAgICgoKSA9PiBwYXJzZUNhcHMoY2Fwcywge30pKS5zaG91bGQudGhyb3coL211c3QgYmUgYSBKU09OIG9iamVjdC8pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgncmV0dXJucyBhIG1hdGNoZWRDYXBzIG9iamVjdCAoNiknLCBmdW5jdGlvbiAoKSB7XG4gICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Fwcy5hbHdheXNNYXRjaCA9IHtoZWxsbzogJ3dvcmxkJ307XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3doaWNoIGlzIHNhbWUgYXMgYWx3YXlzTWF0Y2ggaWYgZmlyc3RNYXRjaCBhcnJheSBpcyBub3QgcHJvdmlkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHBhcnNlQ2FwcyhjYXBzKS5tYXRjaGVkQ2Fwcy5zaG91bGQuZGVlcC5lcXVhbCh7aGVsbG86ICd3b3JsZCd9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnbWVyZ2VzIGNhcHMgdG9nZXRoZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhcHMuZmlyc3RNYXRjaCA9IFt7Zm9vOiAnYmFyJ31dO1xuICAgICAgICBwYXJzZUNhcHMoY2FwcykubWF0Y2hlZENhcHMuc2hvdWxkLmRlZXAuZXF1YWwoe2hlbGxvOiAnd29ybGQnLCBmb286ICdiYXInfSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3dpdGggbWVyZ2VkIGNhcHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhcHMuZmlyc3RNYXRjaCA9IFt7aGVsbG86ICdiYXInLCBmb286ICdmb28nfSwge2ZvbzogJ2Jhcid9XTtcbiAgICAgICAgcGFyc2VDYXBzKGNhcHMpLm1hdGNoZWRDYXBzLnNob3VsZC5kZWVwLmVxdWFsKHtoZWxsbzogJ3dvcmxkJywgZm9vOiAnYmFyJ30pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjcHJvY2Vzc0NhcHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gXCJhbHdheXNNYXRjaFwiIGlmIFwiZmlyc3RNYXRjaFwiIGFuZCBcImNvbnN0cmFpbnRzXCIgd2VyZSBub3QgcHJvdmlkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBwcm9jZXNzQ2FwYWJpbGl0aWVzKHt9KS5zaG91bGQuZGVlcC5lcXVhbCh7fSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBtZXJnZWQgY2FwcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHByb2Nlc3NDYXBhYmlsaXRpZXMoe1xuICAgICAgICBhbHdheXNNYXRjaDoge2hlbGxvOiAnd29ybGQnfSxcbiAgICAgICAgZmlyc3RNYXRjaDogW3tmb286ICdiYXInfV1cbiAgICAgIH0pLnNob3VsZC5kZWVwLmVxdWFsKHtoZWxsbzogJ3dvcmxkJywgZm9vOiAnYmFyJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzdHJpcCBvdXQgdGhlIFwiYXBwaXVtOlwiIHByZWZpeCBmb3Igbm9uLXN0YW5kYXJkIGNhcGFiaWxpdGllcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHByb2Nlc3NDYXBhYmlsaXRpZXMoe1xuICAgICAgICBhbHdheXNNYXRjaDogeydhcHBpdW06aGVsbG8nOiAnd29ybGQnfSxcbiAgICAgICAgZmlyc3RNYXRjaDogW3snYXBwaXVtOmZvbyc6ICdiYXInfV1cbiAgICAgIH0pLnNob3VsZC5kZWVwLmVxdWFsKHtoZWxsbzogJ3dvcmxkJywgZm9vOiAnYmFyJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzdGlsbCBhY2NlcHQgcHJlZml4ZWQgY2FwcyBldmVuIGlmIHRoZXkgYXJlIHN0YW5kYXJkIGNhcGFiaWxpdGllcyAoaHR0cHM6Ly93d3cudzMub3JnL1RSL3dlYmRyaXZlci8jZGZuLXRhYmxlLW9mLXN0YW5kYXJkLWNhcGFiaWxpdGllcyknLCBmdW5jdGlvbiAoKSB7XG4gICAgICBwcm9jZXNzQ2FwYWJpbGl0aWVzKHtcbiAgICAgICAgYWx3YXlzTWF0Y2g6IHsnYXBwaXVtOnBsYXRmb3JtTmFtZSc6ICdXaGF0ZXZ6J30sXG4gICAgICAgIGZpcnN0TWF0Y2g6IFt7J2FwcGl1bTpicm93c2VyTmFtZSc6ICdBbnl0aGluZyd9XSxcbiAgICAgIH0pLnNob3VsZC5kZWVwLmVxdWFsKHtwbGF0Zm9ybU5hbWU6ICdXaGF0ZXZ6JywgYnJvd3Nlck5hbWU6ICdBbnl0aGluZyd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcHJlZmVyIHN0YW5kYXJkIGNhcHMgdGhhdCBhcmUgbm9uLXByZWZpeGVkIHRvIHByZWZpeGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgcHJvY2Vzc0NhcGFiaWxpdGllcyh7XG4gICAgICAgIGFsd2F5c01hdGNoOiB7J2FwcGl1bTpwbGF0Zm9ybU5hbWUnOiAnRm9vJywgJ3BsYXRmb3JtTmFtZSc6ICdCYXInfSxcbiAgICAgICAgZmlyc3RNYXRjaDogW3snYXBwaXVtOmJyb3dzZXJOYW1lJzogJ0ZPTycsICdicm93c2VyTmFtZSc6ICdCQVInfV0sXG4gICAgICB9KS5zaG91bGQuZGVlcC5lcXVhbCh7cGxhdGZvcm1OYW1lOiAnQmFyJywgYnJvd3Nlck5hbWU6ICdCQVInfSk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCB0aHJvdyBleGNlcHRpb24gaWYgZHVwbGljYXRlcyBpbiBhbHdheXNNYXRjaCBhbmQgZmlyc3RNYXRjaCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICgoKSA9PiBwcm9jZXNzQ2FwYWJpbGl0aWVzKHtcbiAgICAgICAgYWx3YXlzTWF0Y2g6IHsncGxhdGZvcm1OYW1lJzogJ0Zha2UnLCAnYXBwaXVtOmZha2VDYXAnOiAnZm9vYmFyJ30sXG4gICAgICAgIGZpcnN0TWF0Y2g6IFt7J2FwcGl1bTpwbGF0Zm9ybU5hbWUnOiAnYmFyJ31dLFxuICAgICAgfSkpLnNob3VsZC50aHJvdygvc2hvdWxkIG5vdCBleGlzdCBvbiBib3RoIHByaW1hcnkvKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHRocm93IGFuIGV4Y2VwdGlvbiBpZiBwcmVzZW5jZSBjb25zdHJhaW50IGlzIG5vdCBtZXQgb24gYSBmaXJzdE1hdGNoIGNhcGFiaWxpdHknLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBjYXBzID0gcHJvY2Vzc0NhcGFiaWxpdGllcyh7XG4gICAgICAgIGFsd2F5c01hdGNoOiB7J3BsYXRmb3JtTmFtZSc6ICdGYWtlJywgJ2FwcGl1bTpmYWtlQ2FwJzogJ2Zvb2Jhcid9LFxuICAgICAgICBmaXJzdE1hdGNoOiBbeydmb28nOiAnYmFyJ31dLFxuICAgICAgfSwge1xuICAgICAgICBwbGF0Zm9ybU5hbWU6IHtcbiAgICAgICAgICBwcmVzZW5jZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgZmFrZUNhcDoge1xuICAgICAgICAgIHByZXNlbmNlOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgY2Fwcy5wbGF0Zm9ybU5hbWUuc2hvdWxkLmVxdWFsKCdGYWtlJyk7XG4gICAgICBjYXBzLmZha2VDYXAuc2hvdWxkLmVxdWFsKCdmb29iYXInKTtcbiAgICAgIGNhcHMuZm9vLnNob3VsZC5lcXVhbCgnYmFyJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBubyBtYXRjaGluZyBjYXBzIHdlcmUgZm91bmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAoKCkgPT4gcHJvY2Vzc0NhcGFiaWxpdGllcyh7XG4gICAgICAgIGFsd2F5c01hdGNoOiB7J3BsYXRmb3JtTmFtZSc6ICdGYWtlJywgJ2FwcGl1bTpmYWtlQ2FwJzogJ2Zvb2Jhcid9LFxuICAgICAgICBmaXJzdE1hdGNoOiBbeydmb28nOiAnYmFyJ31dLFxuICAgICAgfSwge1xuICAgICAgICBwbGF0Zm9ybU5hbWU6IHtcbiAgICAgICAgICBwcmVzZW5jZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgZmFrZUNhcDoge1xuICAgICAgICAgIHByZXNlbmNlOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIG1pc3NpbmdDYXA6IHtcbiAgICAgICAgICBwcmVzZW5jZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0pKS5zaG91bGQudGhyb3coLydtaXNzaW5nQ2FwJyBjYW4ndCBiZSBibGFuay8pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3ZhbGlkYXRlIEFwcGl1bSBjb25zdHJhaW50cycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBjb25zdHJhaW50cyA9IHsuLi5kZXNpcmVkQ2FwYWJpbGl0eUNvbnN0cmFpbnRzfTtcblxuICAgICAgbGV0IG1hdGNoaW5nQ2FwcyA9IHsncGxhdGZvcm1OYW1lJzogJ0Zha2UnLCAnYXV0b21hdGlvbk5hbWUnOiAnRmFrZScsICdkZXZpY2VOYW1lJzogJ0Zha2UnfTtcbiAgICAgIGxldCBjYXBzO1xuXG4gICAgICBpdCgnc2hvdWxkIHZhbGlkYXRlIHdoZW4gYWx3YXlzTWF0Y2ggaGFzIHRoZSBwcm9wZXIgY2FwcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2FwcyA9IHtcbiAgICAgICAgICBhbHdheXNNYXRjaDogbWF0Y2hpbmdDYXBzLFxuICAgICAgICAgIGZpcnN0TWF0Y2g6IFt7fV0sXG4gICAgICAgIH07XG4gICAgICAgIHByb2Nlc3NDYXBhYmlsaXRpZXMoY2FwcywgY29uc3RyYWludHMpLnNob3VsZC5kZWVwLmVxdWFsKG1hdGNoaW5nQ2Fwcyk7XG4gICAgICB9KTtcblxuXG4gICAgICBpdCgnc2hvdWxkIHZhbGlkYXRlIHdoZW4gZmlyc3RNYXRjaFswXSBoYXMgdGhlIHByb3BlciBjYXBzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYXBzID0ge1xuICAgICAgICAgIGFsd2F5c01hdGNoOiB7fSxcbiAgICAgICAgICBmaXJzdE1hdGNoOiBbbWF0Y2hpbmdDYXBzXSxcbiAgICAgICAgfTtcbiAgICAgICAgcHJvY2Vzc0NhcGFiaWxpdGllcyhjYXBzLCBjb25zdHJhaW50cykuc2hvdWxkLmRlZXAuZXF1YWwobWF0Y2hpbmdDYXBzKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHZhbGlkYXRlIHdoZW4gYWx3YXlzTWF0Y2ggYW5kIGZpcnN0TWF0Y2hbMF0gaGF2ZSB0aGUgcHJvcGVyIGNhcHMgd2hlbiBtZXJnZWQgdG9nZXRoZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhcHMgPSB7XG4gICAgICAgICAgYWx3YXlzTWF0Y2g6IF8ub21pdChtYXRjaGluZ0NhcHMsIFsnZGV2aWNlTmFtZSddKSxcbiAgICAgICAgICBmaXJzdE1hdGNoOiBbeydhcHBpdW06ZGV2aWNlTmFtZSc6ICdGYWtlJ31dLFxuICAgICAgICB9O1xuICAgICAgICBwcm9jZXNzQ2FwYWJpbGl0aWVzKGNhcHMsIGNvbnN0cmFpbnRzKS5zaG91bGQuZGVlcC5lcXVhbChtYXRjaGluZ0NhcHMpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgdmFsaWRhdGUgd2hlbiBhdXRvbWF0aW9uTmFtZSBpcyBvbWl0dGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYXBzID0ge1xuICAgICAgICAgIGFsd2F5c01hdGNoOiBfLm9taXQobWF0Y2hpbmdDYXBzLCBbJ2F1dG9tYXRpb25OYW1lJ10pLFxuICAgICAgICB9O1xuICAgICAgICBwcm9jZXNzQ2FwYWJpbGl0aWVzKGNhcHMsIGNvbnN0cmFpbnRzKS5zaG91bGQuZGVlcC5lcXVhbChfLm9taXQobWF0Y2hpbmdDYXBzLCAnYXV0b21hdGlvbk5hbWUnKSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBwYXNzIGlmIGZpcnN0IGVsZW1lbnQgaW4gXCJmaXJzdE1hdGNoXCIgZG9lcyB2YWxpZGF0ZSBhbmQgc2Vjb25kIGVsZW1lbnQgZG9lcyBub3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhcHMgPSB7XG4gICAgICAgICAgYWx3YXlzTWF0Y2g6IHt9LFxuICAgICAgICAgIGZpcnN0TWF0Y2g6IFtcbiAgICAgICAgICAgIG1hdGNoaW5nQ2FwcyxcbiAgICAgICAgICAgIHtiYWRDYXBzOiAnYmFkQ2Fwcyd9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH07XG4gICAgICAgIHByb2Nlc3NDYXBhYmlsaXRpZXMoY2FwcywgY29uc3RyYWludHMpLnNob3VsZC5kZWVwLmVxdWFsKG1hdGNoaW5nQ2Fwcyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBwYXNzIGlmIGZpcnN0IGVsZW1lbnQgaW4gXCJmaXJzdE1hdGNoXCIgZG9lcyBub3QgdmFsaWRhdGUgYW5kIHNlY29uZCBlbGVtZW50IGRvZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhcHMgPSB7XG4gICAgICAgICAgYWx3YXlzTWF0Y2g6IHt9LFxuICAgICAgICAgIGZpcnN0TWF0Y2g6IFtcbiAgICAgICAgICAgIHtiYWRDYXBzOiAnYmFkQ2Fwcyd9LFxuICAgICAgICAgICAgbWF0Y2hpbmdDYXBzLFxuICAgICAgICAgIF0sXG4gICAgICAgIH07XG4gICAgICAgIHByb2Nlc3NDYXBhYmlsaXRpZXMoY2FwcywgY29uc3RyYWludHMpLnNob3VsZC5kZWVwLmVxdWFsKG1hdGNoaW5nQ2Fwcyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBmYWlsIHdoZW4gYmFkIHBhcmFtZXRlcnMgYXJlIHBhc3NlZCBpbiBtb3JlIHRoYW4gb25lIGZpcnN0TWF0Y2ggY2FwYWJpbGl0eScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2FwcyA9IHtcbiAgICAgICAgICBhbHdheXNNYXRjaDoge30sXG4gICAgICAgICAgZmlyc3RNYXRjaDogW3tcbiAgICAgICAgICAgIGJhZDogJ3BhcmFtcycsXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbW9yZTogJ2JhZC1wYXJhbXMnLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9O1xuICAgICAgICAoKCkgPT4gcHJvY2Vzc0NhcGFiaWxpdGllcyhjYXBzLCBjb25zdHJhaW50cykpLnNob3VsZC50aHJvdygvQ291bGQgbm90IGZpbmQgbWF0Y2hpbmcgY2FwYWJpbGl0aWVzLyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCcuZmluZE5vblByZWZpeGVkQ2FwcycsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIGZpbmQgYWx3YXlzTWF0Y2ggY2FwcyB3aXRoIG5vIHByZWZpeCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGZpbmROb25QcmVmaXhlZENhcHMoe2Fsd2F5c01hdGNoOiB7XG4gICAgICAgICdub24tc3RhbmRhcmQnOiAnZHVtbXknLFxuICAgICAgfX0pLnNob3VsZC5lcWwoWydub24tc3RhbmRhcmQnXSk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBub3QgZmluZCBhIHN0YW5kYXJkIGNhcCBpbiBhbHdheXNNYXRjaCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGZpbmROb25QcmVmaXhlZENhcHMoe2Fsd2F5c01hdGNoOiB7XG4gICAgICAgICdwbGF0Zm9ybU5hbWUnOiAnQW55JyxcbiAgICAgIH19KS5zaG91bGQuZXFsKFtdKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIGZpbmQgZmlyc3RNYXRjaCBjYXBzIHdpdGggbm8gcHJlZml4JywgZnVuY3Rpb24gKCkge1xuICAgICAgZmluZE5vblByZWZpeGVkQ2Fwcyh7YWx3YXlzTWF0Y2g6IHt9LCBmaXJzdE1hdGNoOiBbe1xuICAgICAgICAnbm9uLXN0YW5kYXJkJzogJ2R1bW15JyxcbiAgICAgIH1dfSkuc2hvdWxkLmVxbChbJ25vbi1zdGFuZGFyZCddKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIG5vdCBmaW5kIGEgc3RhbmRhcmQgY2FwIGluIHByZWZpeCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGZpbmROb25QcmVmaXhlZENhcHMoe2Fsd2F5c01hdGNoOiB7fSwgZmlyc3RNYXRjaDogW3tcbiAgICAgICAgJ3BsYXRmb3JtTmFtZSc6ICdBbnknLFxuICAgICAgfV19KS5zaG91bGQuZXFsKFtdKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIGZpbmQgZmlyc3RNYXRjaCBjYXBzIGluIHNlY29uZCBpdGVtIG9mIGZpcnN0TWF0Y2ggYXJyYXknLCBmdW5jdGlvbiAoKSB7XG4gICAgICBmaW5kTm9uUHJlZml4ZWRDYXBzKHthbHdheXNNYXRjaDoge30sIGZpcnN0TWF0Y2g6IFt7fSwge1xuICAgICAgICAnbm9uLXN0YW5kYXJkJzogJ2R1bW15JyxcbiAgICAgIH1dfSkuc2hvdWxkLmVxbChbJ25vbi1zdGFuZGFyZCddKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIHJlbW92ZSBkdXBsaWNhdGVzIGZyb20gYWx3YXlzTWF0Y2ggYW5kIGZpcnN0TWF0Y2gnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBmaW5kTm9uUHJlZml4ZWRDYXBzKHthbHdheXNNYXRjaDoge1xuICAgICAgICAnbm9uLXN0YW5kYXJkJzogJ3NvbWV0aGluZycsXG4gICAgICB9LCBmaXJzdE1hdGNoOiBbe1xuICAgICAgICAnbm9uLXN0YW5kYXJkJzogJ2R1bW15JyxcbiAgICAgIH1dfSkuc2hvdWxkLmVxbChbJ25vbi1zdGFuZGFyZCddKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIHJlbW92ZSBkdXBsaWNhdGVzIGZyb20gZmlyc3RNYXRjaCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGZpbmROb25QcmVmaXhlZENhcHMoe2ZpcnN0TWF0Y2g6IFt7XG4gICAgICAgICdub24tc3RhbmRhcmQnOiAnZHVtbXknLFxuICAgICAgfSwge1xuICAgICAgICAnbm9uLXN0YW5kYXJkJzogJ2R1bW15IDInLFxuICAgICAgfV19KS5zaG91bGQuZXFsKFsnbm9uLXN0YW5kYXJkJ10pO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgcmVtb3ZlIGR1cGxpY2F0ZXMgYW5kIGtlZXAgc3RhbmRhcmQgY2FwYWJpbGl0aWVzJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgYWx3YXlzTWF0Y2ggPSB7XG4gICAgICAgIHBsYXRmb3JtTmFtZTogJ0Zha2UnLFxuICAgICAgICBub25TdGFuZGFyZE9uZTogJ25vbi1zdGFuZGFyZCcsXG4gICAgICAgIG5vblN0YW5kYXJkVHdvOiAnbm9uLXN0YW5kYXJkJyxcbiAgICAgIH07XG4gICAgICBjb25zdCBmaXJzdE1hdGNoID0gW1xuICAgICAgICB7bm9uU3RhbmRhcmRUaHJlZTogJ25vbi1zdGFuZGFyZCcsIG5vblN0YW5kYXJkRm91cjogJ25vbi1zdGFuZGFyZCcsIGJyb3dzZXJOYW1lOiAnRmFrZUJyb3dzZXInfSxcbiAgICAgICAge25vblN0YW5kYXJkVGhyZWU6ICdub24tc3RhbmRhcmQnLCBub25TdGFuZGFyZEZvdXI6ICdub24tc3RhbmRhcmQnLCBub25TdGFuZGFyZEZpdmU6ICdub24tc3RhbmRhcmQnLCBicm93c2VyVmVyc2lvbjogJ3doYXRldmEnfSxcbiAgICAgIF07XG4gICAgICBmaW5kTm9uUHJlZml4ZWRDYXBzKHthbHdheXNNYXRjaCwgZmlyc3RNYXRjaH0pLnNob3VsZC5lcWwoWydub25TdGFuZGFyZE9uZScsICdub25TdGFuZGFyZFR3bycsICdub25TdGFuZGFyZFRocmVlJywgJ25vblN0YW5kYXJkRm91cicsICdub25TdGFuZGFyZEZpdmUnXSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXSwiZmlsZSI6InRlc3QvYmFzZWRyaXZlci9jYXBhYmlsaXRpZXMtc3BlY3MuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4ifQ==
