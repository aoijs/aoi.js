import { conditionLexer } from "../../../index.js";
import { FunctionData } from "../../../typings/interfaces.js";
import {
    escapeResult, parseResult,
} from "../../../util/transpilerHelpers.js";
export const $checkCondition: FunctionData = {
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
        const conditions = <string>data.inside;
        const currentScope = scope[scope.length - 1];
        const solved = conditionLexer(conditions).solve();
        const res = escapeResult(parseResult(solved));
        currentScope.update( res, data );

        return {
            code: res,
            scope,
        };
    },
};
