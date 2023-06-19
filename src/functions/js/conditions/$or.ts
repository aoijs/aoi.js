import { conditionLexer } from "../../../index.js";
import { FunctionData } from "../../../typings/interfaces.js";
import {
    escapeResult, parseResult,
} from "../../../util/transpilerHelpers.js";
export const $or: FunctionData = {
    name: "$or",
    type: "getter",
    brackets: true,
    optional: false,
    version: "7.0.0",
    fields: [
        {
            name: "condition",
            type: "string",
            description: "The condition to check",
            required: true,
        },
    ],
    default: ["void"],
    returns: "boolean",
    description: "Returns true if any condition is true",
    example: `
    $or[$isNumber[1];$isNumber[2]] // returns true
    $or[$isNumber[1];$isNumber[abc]] // returns true
    `,
    code: (data, scope) => {
        const conditions = data.splits;
        const currentScope = scope[scope.length - 1];
        const solved = conditionLexer(conditions.join("||")).solve();

        const res = escapeResult(parseResult(solved));
        currentScope.update( res, data );

        return {
            code: res,
            scope,
        };
    },
};
