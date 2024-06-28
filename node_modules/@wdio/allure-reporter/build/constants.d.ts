import type { Status } from './types';
export declare const PASSED = "passed";
export declare const FAILED = "failed";
export declare const BROKEN = "broken";
export declare const PENDING = "pending";
export declare const CANCELED = "canceled";
export declare const SKIPPED = "skipped";
declare const testStatuses: Record<string, Status>;
declare const stepStatuses: Record<string, Status>;
declare const events: {
    readonly addLabel: "allure:addLabel";
    readonly addFeature: "allure:addFeature";
    readonly addStory: "allure:addStory";
    readonly addSeverity: "allure:addSeverity";
    readonly addIssue: "allure:addIssue";
    readonly addTestId: "allure:addTestId";
    readonly addEnvironment: "allure:addEnvironment";
    readonly addDescription: "allure:addDescription";
    readonly addAttachment: "allure:addAttachment";
    readonly startStep: "allure:startStep";
    readonly endStep: "allure:endStep";
    readonly addStep: "allure:addStep";
    readonly addArgument: "allure:addArgument";
};
declare const mochaEachHooks: readonly ["\"before each\" hook", "\"after each\" hook"];
declare const mochaAllHooks: readonly ["\"before all\" hook", "\"after all\" hook"];
declare const linkPlaceholder = "{}";
export { testStatuses, stepStatuses, events, mochaEachHooks, mochaAllHooks, linkPlaceholder };
//# sourceMappingURL=constants.d.ts.map