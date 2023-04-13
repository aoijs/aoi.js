import { conditionLexer } from "../../../index.js";
import { escapeResult, parseResult, } from "../../../util/transpilerHelpers.js";
export const $checkCondition = {
    name: "$checkCondition",
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
    description: "Returns true if the condition is true",
    code: (data, scope) => {
        const conditions = data.inside;
        const currentScope = scope[scope.length - 1];
        const solved = conditionLexer(conditions).solve();
        const res = escapeResult(parseResult(solved));
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
//# sourceMappingURL=$checkCondition.js.map