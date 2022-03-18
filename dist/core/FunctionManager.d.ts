import { RawFunctionData } from "aoi-compiler";
import { Collection } from "discord.js";
import { FunctionData } from "../typings/interfaces/FunctionData";
import { Option } from "../typings/types/Option";
declare class FunctionManager {
    #private;
    nativeFunctions: Collection<string, FunctionData>;
    allFunctions: Collection<string, FunctionData>;
    inside: Option<string>;
    constructor();
    get adapter(): RawFunctionData[];
    setInside(str: Option<string>): this;
}
declare const _default: FunctionManager;
/**
 * Do not assing this anywhere, you can statically require and use it.
 * This is cached by the process.
 */
export default _default;
//# sourceMappingURL=FunctionManager.d.ts.map