import { ErrorMessages } from "../typings/enums/ErrorMessages";
export declare class AoiError extends Error {
    #private;
    constructor(msg: ErrorMessages | keyof typeof ErrorMessages, ...params: unknown[]);
}
//# sourceMappingURL=AoiError.d.ts.map