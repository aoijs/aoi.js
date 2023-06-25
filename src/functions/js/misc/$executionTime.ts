import Scope from "../../../core/structs/Scope.js";
import { funcData, FunctionData } from "../../../typings/interfaces.js";
import {
    escapeResult,
} from "../../../util/transpilerHelpers.js";
export const $executionTime: FunctionData = {
    name: "$executionTime",
    brackets: false,
    optional: false,
    type: "getter",
    fields: [],
    version: "7.0.0",
    default: [],
    returns: "number",
    description: "Returns the execution time of the code",
    example: `
        $executionTime // returns the execution time of the code
    `,
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope.at(-1) as Scope;

        currentScope.setters = `const startTime = performance.now();\n${currentScope.setters}`;
        const res = `${escapeResult("((performance.now() - startTime).toFixed(3))")}`;
        currentScope.update(res, data);

        return {
            code: res,
            scope: scope,
        };
    },
};
