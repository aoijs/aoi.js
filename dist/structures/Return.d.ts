import { ReturnType } from "../typings/enums/ReturnType";
export declare class Return<T extends ReturnType = ReturnType, K = unknown> {
    #private;
    constructor(type: T, content?: K);
    static string(data?: unknown): Return<ReturnType.Success, string>;
    static success(data?: unknown): Return<ReturnType.Success, unknown>;
    isBreakStatement(): this is Return<ReturnType.Break, null>;
    static error(data?: unknown): Return<ReturnType.Error, unknown>;
    get type(): T;
    isError(): this is Return<ReturnType.Error, string>;
    isErrorStatement(): this is Return<ReturnType.Statement, string>;
    isAnyError(): this is Return<ReturnType.Statement | ReturnType.Error, string>;
    isSuccess(): this is Return<ReturnType.Success, K>;
    unwrap(): K;
    unwrapAs<T>(): T;
    as<V>(): Return<T, V>;
    isAnythingButReturn(): boolean;
    isAnythingButSuccess(): boolean;
    isAnythingButError(): boolean;
    isAnythingButSuccessOrReturn(): boolean;
    isReturnKeyword(): this is Return<ReturnType.ReturnKeyword, string>;
}
//# sourceMappingURL=Return.d.ts.map