import { TranspilerError } from "../../../core/error.js";
import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import { escapeResult, escapeVars } from "../../../util/transpilerHelpers.js";
export const $arrayJoin: FunctionData = {
    name: "$arrayJoin",
    brackets: true,
    optional: false,
    type: "getter",
    fields: [
        {
            name: "array",
            type: "string",
            required: true,
        },
        {
            name: "separator",
            type: "string",
            required: false,
        },
    ],
    description: "Joins all elements of an array into a string.",
    default: ["void", ", "],
    returns: "string",
    version: "7.0.0",
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope[scope.length - 1];
        const [name, separator = ", "] = data.splits;

        if (
            !currentScope.variables.includes(name) &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        )
            throw new TranspilerError(
                `${data.name}: Array ${name} does not exist`,
            );

        const res = escapeResult(`${escapeVars(name)}.join(${separator})`);
        currentScope.update(res, data);

        return {
            code: res,
            scope,
        };
    },
};
