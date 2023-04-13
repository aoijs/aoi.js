import { funcData } from "../../typings/interfaces.js";
import StringObject from "./StringObject.js";
export default class Scope {
    name: string;
    parent: string | undefined;
    children: Scope[];
    sendData: {
        content: string;
    };
    embeds: unknown[];
    components: unknown[];
    files: unknown[];
    stickers: unknown[];
    env: string[];
    ephemeral: boolean;
    variables: string[];
    setters: string;
    objects: Record<string, StringObject>;
    rest: string;
    hasSendData: boolean;
    sendFunction: string;
    functions: string;
    addReturn: boolean;
    useChannel?: bigint;
    packages: string;
    constructor(name: string, parent?: string, code?: string, addReturn?: boolean);
    addVariables(scopeVars: string[]): void;
    addEmbeds(embeds: unknown[]): void;
    addFunction(func: string): void;
    replaceLast(str: string, replacer: string, replacedTo: string): string;
    replace(str: string, replacer: string, replacedTo: string): string;
    addChild(child: string): void;
    getChild(name: string): Scope | undefined;
    removeChild(name: string): void;
    toString(sendMessage?: boolean): string;
    getFunction(sendMessage?: boolean, execute?: boolean): string;
    editMessage(channel: string, message: string): string;
    update(res: string, data: funcData): void;
    rawString(): string;
}
//# sourceMappingURL=Scope.d.ts.map