import type DevToolsDriver from '../devtoolsdriver';
export default function getNamedCookie(this: DevToolsDriver, { name }: {
    name: string;
}): Promise<import("devtools-protocol").Protocol.Network.Cookie>;
//# sourceMappingURL=getNamedCookie.d.ts.map