import { Collection } from "discord.js";
import { FunctionData } from "../typings/interfaces/FunctionData";
declare class FunctionManager {
    #private;
    nativeFunctions: Collection<string, FunctionData>;
    constructor();
    get fregex(): RegExp;
    get regex(): RegExp;
    matches(str: string): ReturnType<String["matchAll"]>;
}
declare const _default: FunctionManager;
/**
 * Do not assing this anywhere, you can statically require and use it.
 * This is cached by the process.
 */
export default _default;
//# sourceMappingURL=FunctionManager.d.ts.map