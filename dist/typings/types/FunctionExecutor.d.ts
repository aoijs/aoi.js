import { Function } from "../../structures/Function";
import { Return } from "../../structures/Return";
import { ThisArg } from "../../structures/ThisArg";
import { ReturnType } from "../enums/ReturnType";
import { Async } from "./Async";
export declare type FunctionExecutor<T = unknown> = (this: ThisArg, fn: Function) => Async<Return<ReturnType, T>>;
//# sourceMappingURL=FunctionExecutor.d.ts.map