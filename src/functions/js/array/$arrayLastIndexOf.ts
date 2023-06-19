import { TranspilerError } from "../../../core/error.js";
import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import { escapeResult, escapeVars } from "../../../util/transpilerHelpers.js";
export const $arrayLastIndexOf: FunctionData = {
    name: "$arrayLastIndexOf",
    brackets: true,
    optional: false,
    type: "getter",
    fields: [
        {
            name: "array",
            type: "string",
            description: "The name of the array",
            required: true,
        },
        {
            name: "value",
            type: "string",
            description: "The value to check",
            required: true,
        },
    ],
    description:
        "Returns the index of the last occurrence of a value in an array, or 0 if it is not present.",
    default: ["void", "void"],
    returns: "number",
    version: "7.0.0",
    example: `
        $arrayCreate[myArray;hello;world;nya;hello]
        $arrayLastIndexOf[myArray;hello] // returns 4

        $arrayLastIndexOf[myArray;hi] // returns 0
    `,
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

        const res = escapeResult(
            `${escapeVars(name)}.lastIndexOf(${value}) + 1`,
        );
        currentScope.update(res, data);

        return {
            code: res,
            scope,
        };
    },
};
