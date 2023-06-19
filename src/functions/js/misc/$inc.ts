import { FunctionData, funcData, TranspilerError } from "../../../index.js";
import Scope from "../../../core/structs/Scope.js";
import { escapeFunctionResult } from "../../../util/transpilerHelpers.js";

export const $inc: FunctionData = {
    name: "$inc",
    type: "function",
    brackets: true,
    optional: false,
    fields: [
        {
            name: "variable",
            type: "string",
            description: "The variable to increment",
            required: true,
        },
        {
            name: "incrementFunction",
            type: "function",
            description: "The function to increment the variable",
            required: false,
        },
    ],
    version: "7.0.0",
    default: ["void", "++"],
    example: "$inc[$get[i]]",
    returns: "void",
    description: "Increments the variable",
    code: (data: funcData, scope: Scope[]) => {
        const [variable, ...incrementFunction] = data.splits;
        const currentScope = scope[scope.length - 1];
        if (
            variable === "" &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        ) {
            throw new TranspilerError(`${data.name} requires a variable`);
        }
        if (incrementFunction.length === 0) {
            incrementFunction.push("++");
        }
        const incrementFunctionString = incrementFunction.join(";");
        const res = escapeFunctionResult(
            `${variable}${incrementFunctionString};`,
        );
        currentScope.update( res, data );
        return {
            code: res,
            scope: scope,
        };
    },
};
