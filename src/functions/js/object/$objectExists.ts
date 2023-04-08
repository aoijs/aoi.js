import { TranspilerError } from "../../../core/error.js";
import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import { escapeResult } from "../../../util/transpilerHelpers.js";
export const $objectExists: FunctionData = {
    name: "$objectExists",
    brackets: true,
    optional: false,
    type: "getter",
    fields: [
        {
            name: "name",
            type: "string",
            required: true,
        },
    ],
    version: "7.0.0",
    description: "returns whether object exists or not",
    default: ["void"],
    returns: "object",
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope[scope.length - 1];
        const name = data.inside;
        if (
            !name &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.endsWith("$catch_")
        ) {
            throw new TranspilerError(`${data.name}: No Object Name Provided`);
        }
        const res = escapeResult(
            `${!!currentScope.objects[<string>name ?? ""]}`,
        );

        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
