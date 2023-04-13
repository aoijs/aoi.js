import { TranspilerOptions } from "../typings/interfaces.js";
import Scope from "./structs/Scope.js";
import { AsyncFunction } from "../typings/types.js";
export declare function Transpiler(code: string, options: TranspilerOptions): {
    func: AsyncFunction;
    code: string;
    scope: Scope[];
};
//# sourceMappingURL=transpiler.d.ts.map