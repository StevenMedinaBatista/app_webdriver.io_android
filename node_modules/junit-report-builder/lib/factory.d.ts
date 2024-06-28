import Builder = require('./builder');
import TestSuite = require('./test_suite');
import TestCase = require('./test_case');
declare class Factory {
    newBuilder(): Builder;
    newTestSuite(): TestSuite;
    newTestCase(): TestCase;
}
export = Factory;
