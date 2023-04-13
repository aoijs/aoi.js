import { conditionLexer } from "../../../index.js";
import { escapeFunctionResult, parseResult } from "../../../util/transpilerHelpers.js";
export const $and = {
    name: "$and",
    type: "getter",
    brackets: true,
    optional: false,
    version: "7.0.0",
    fields: [
        {
            name: "condition",
            type: "string",
            required: true,
        },
    ],
    default: ["void"],
    returns: "boolean",
    description: "Returns true if all conditions are true",
    code: (data, scope) => {
        const conditions = data.splits;
        const currentScope = scope[scope.length - 1];
        const solved = conditionLexer(conditions.join("&&")).solve();
        const res = escapeFunctionResult(parseResult(solved));
        currentScope.update(res, data);
        return {
            code: res,
            scope,
            data,
        };
    },
};
//# sourceMappingURL=$and.js.map