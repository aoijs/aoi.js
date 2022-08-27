import { RawFunctionData } from "aoi-compiler";
import { Collection } from "discord.js";
import { AoiOptions } from "../typings";
import { FunctionData } from "../typings";
declare class AoiFunctionManager {
    #private;
    nativeFunctions: Collection<string, FunctionData>;
    allFunctions: Collection<string, FunctionData>;
    constructor();
    loadPlugins(plugins?: AoiOptions["plugins"]): void;
    get adapter(): RawFunctionData[];
}
declare const _default: AoiFunctionManager;
/**
 * Do not assign this anywhere, you can statically require and use it.
 * This is cached by the process.
 */
export default _default;
//# sourceMappingURL=AoiFunctionManager.d.ts.map