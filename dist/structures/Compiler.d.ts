import { Compiler as CPL } from "aoi-compiler";
import intoFunction from "../util/functions/intoFunction";
import { Function } from "./Function";
export declare class Compiler extends CPL {
    parsedFunctions: Function[];
    executor: ReturnType<typeof intoFunction>;
    constructor(code: string);
    start(): this;
}
//# sourceMappingURL=Compiler.d.ts.map