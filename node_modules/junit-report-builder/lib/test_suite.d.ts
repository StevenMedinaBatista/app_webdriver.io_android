import TestCase = require('./test_case');
import Factory = require('./factory');
import { XMLElement } from 'xmlbuilder';
declare class TestSuite {
    private _factory;
    private _attributes;
    private _testCases;
    private _properties;
    constructor(factory: Factory);
    name(name: string): this;
    time(timeInSeconds: number): this;
    timestamp(timestamp: Date | string): this;
    property(name: string, value: any): this;
    testCase(): TestCase;
    getFailureCount(): number;
    getErrorCount(): number;
    getSkippedCount(): number;
    _sumTestCaseCounts(counterFunction: (testCase: TestCase) => number): number;
    build(parentElement: XMLElement): void;
}
export = TestSuite;
