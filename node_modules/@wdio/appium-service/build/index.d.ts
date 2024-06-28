import AppiumLauncher from './launcher';
export default class AppiumService {
}
export declare const launcher: typeof AppiumLauncher;
export * from './types';
import { AppiumServiceConfig } from './types';
declare global {
    namespace WebdriverIO {
        interface ServiceOption extends AppiumServiceConfig {
        }
    }
}
//# sourceMappingURL=index.d.ts.map