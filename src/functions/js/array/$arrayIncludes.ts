import { TranspilerError } from "../../../core/error.js";
import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import { escapeResult, escapeVars } from "../../../util/transpilerHelpers.js";
export const $arrayIncludes: FunctionData = {
    name: "$arrayIncludes",
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
            name: "value",
            type: "string",
            required: true,
        },
    ],
    description: "Checks if array includes value",
    default: ["void", "void"],
    returns: "boolean",
    version: "7.0.0",
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope[scope.length - 1];
        const [name, value] = data.splits;

        if (
            !currentScope.variables.includes(name) &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        )
            throw new TranspilerError(
                `${data.name}: Array ${name} does not exist`,
            );

        const res = escapeResult(`${escapeVars(name)}.includes(${value})`);
        currentScope.update(res, data);

        return {
            code: res,
            scope,
        };
    },
};
