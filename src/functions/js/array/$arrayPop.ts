import { TranspilerError } from "../../../core/error.js";
import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import { escapeResult, escapeVars } from "../../../util/transpilerHelpers.js";
export const $arrayPop: FunctionData = {
    name: "$arrayPop",
    brackets: true,
    optional: false,
    type: "getter",
    fields: [
        {
            name: "array",
            type: "string",
            required: true,
        },
    ],
    description:
        "Removes the last element from an array and returns that element. This method changes the length of the array.",
    default: ["void"],
    returns: "any",
    version: "7.0.0",
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope.at(-1) as Scope;
        const name = data.inside as string;

        if (
            !currentScope.variables.includes(name) &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        )
            throw new TranspilerError(
                `${data.name}: Array ${name} does not exist`,
            );

        const res = escapeResult(`${escapeVars(name)}.pop()`);

        return {
            code: res,
            scope,
        };
    },
};
