import { DEFAULTS } from './constants';
import { getPrototype } from './utils';
import type { Options, Client, AttachOptions } from './types';
export default class WebDriver {
    static newSession(options?: Options, modifier?: (...args: any[]) => any, userPrototype?: {}, customCommandWrapper?: (...args: any[]) => any): Promise<Client>;
    static attachToSession(options?: AttachOptions, modifier?: (...args: any[]) => any, userPrototype?: {}, commandWrapper?: (...args: any[]) => any): Client;
    static reloadSession(instance: Client): Promise<string>;
    static get WebDriver(): typeof WebDriver;
}
export { getPrototype, DEFAULTS };
//# sourceMappingURL=index.d.ts.map