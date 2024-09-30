import TestSuite = require('./test_suite');
import TestCase = require('./test_case');
import Factory = require('./factory');
declare class JUnitReportBuilder {
    private _factory;
    private _testSuitesAndCases;
    constructor(factory: Factory);
    writeTo(reportPath: string): void;
    build(): string;
    testSuite(): TestSuite;
    testCase(): TestCase;
    newBuilder(): JUnitReportBuilder;
}
export = JUnitReportBuilder;
