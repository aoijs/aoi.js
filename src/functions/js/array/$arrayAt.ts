import { TranspilerError } from "../../../core/error.js";
import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import {
    escapeResult,
    escapeVars,
} from "../../../util/transpilerHelpers.js";
export const $arrayAt: FunctionData = {
    name: "$arrayAt",
    brackets: true,
    optional: false,
    type: "getter",
    fields: [
        {
            name: "name",
            type: "string",
            required: true,
        },
        {
            name: "index",
            type: "number",
            required: true,
        },
    ],
    description: "returns the value of the array at the specified index",
    default: ["void", "void"],
    returns: "any",
    version: "7.0.0",
    code: (data: funcData, scope: Scope[]) => {
        const [name, index] = data.splits;
        const currentScope = scope[scope.length - 1];
        if (
            !currentScope.variables.includes(name) &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        )
            throw new TranspilerError(
                `${data.name}: Variable ${name} doesn't exist`,
            );

        const parsedIndex = Number(index)-1;
        if (
            isNaN(parsedIndex) &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        )
            throw new TranspilerError(`${data.name}: Index must be a number`);

        const res = escapeResult(`${escapeVars(name)}[${parsedIndex}]`);
        currentScope.update(res, data);

        return {
            code: res,
            scope,
        };
    },
};
