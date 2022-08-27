import { Function } from "../../structures/Function";
import { Return } from "../../structures/Return";
import { ThisArg } from "../../structures/ThisArg";
import { ReturnType } from "../../typings/enums/ReturnType";
import { RuntimeErrorType } from "../../typings/enums/RuntimeErrorType";
declare function createRuntimeError(arg: ThisArg, fn: Function, type: RuntimeErrorType.INVALID_INPUT, input: string, argType: string): Return<ReturnType.Error, string>;
declare function createRuntimeError(arg: ThisArg, fn: Function, type: RuntimeErrorType.MISSING_FIELD, field: string): Return<ReturnType.Error, string>;
declare function createRuntimeError(arg: ThisArg, fn: Function, type: RuntimeErrorType.UNKNOWN_PROPERTY, input: string): Return<ReturnType.Error, string>;
declare function createRuntimeError(arg: ThisArg, fn: Function, type: RuntimeErrorType.UNKNOWN_OPERATOR, op: string): Return<ReturnType.Error, string>;
declare function createRuntimeError(arg: ThisArg, fn: Function, type: RuntimeErrorType.INVALID_DATA, data: string, input: string): Return<ReturnType.Error, string>;
declare function createRuntimeError(arg: ThisArg, fn: Function, type: RuntimeErrorType.OTHER, input: string): Return<ReturnType.Error, string>;
export default createRuntimeError;
//# sourceMappingURL=createRuntimeError.d.ts.map