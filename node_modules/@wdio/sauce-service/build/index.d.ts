import SauceLauncher from './launcher';
import SauceService from './service';
import { SauceServiceConfig } from './types';
export default SauceService;
export declare const launcher: typeof SauceLauncher;
export * from './types';
declare global {
    namespace WebdriverIO {
        interface ServiceOption extends SauceServiceConfig {
        }
    }
}
//# sourceMappingURL=index.d.ts.map