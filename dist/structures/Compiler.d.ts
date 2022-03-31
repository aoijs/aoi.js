import { Compiler as CPL } from "aoi-compiler";
import intoFunction from "../util/functions/intoFunction";
import { Function } from "./Function";
declare type CompilerRef = unknown & {
    toString(): string;
};
export declare class Compiler<T extends CompilerRef = CompilerRef> extends CPL<T> {
    parsedFunctions: Function[];
    executor: ReturnType<typeof intoFunction>;
    start(): this;
}
export {};
//# sourceMappingURL=Compiler.d.ts.map