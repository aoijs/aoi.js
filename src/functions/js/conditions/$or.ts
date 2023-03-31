import { conditionLexer } from "../../../index.js";
import { FunctionData } from "../../../typings/interfaces.js";
import {
    escapeResult,
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
            required: true,
        },
    ],
    default: ["void"],
    returns: "boolean",
    description: "Returns true if any condition is true",
    code: (data, scope) => {
        const conditions = data.splits;
        const currentScope = scope[scope.length - 1];
        const solved = conditionLexer(conditions.join("||")).solve(false);

        const res = escapeResult(solved);
        currentScope.update( res, data );

        return {
            code: res,
            scope,
        };
    },
};
