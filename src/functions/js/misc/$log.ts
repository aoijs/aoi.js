import { TranspilerError } from "../../../core/error.js";
import fixMath from "../../../core/parsers/mathParser.js";
import Scope from "../../../core/structs/Scope.js";
import { parseString } from "../../../core/parsers/stringParser.js";
import { funcData, FunctionData } from "../../../typings/interfaces.js";
import { escapeFunctionResult } from "../../../util/transpilerHelpers.js";
export const $log: FunctionData = {
    name: "$log",
    brackets: true,
    optional: false,
    type: "function",
    fields: [
        {
            name: "text",
            type: "string",
            required: true,
        },
    ],
    version: "7.0.0",
    default: ["void"],
    returns: "void",
    description: "Logs the text",
    code: (data: funcData, scope: Scope[]) => {

        const splits = data.splits;
        const currentScope = scope[scope.length - 1];
        if ($log.brackets) {
            if (
                !data.total.startsWith($log.name + "[") &&
                (!currentScope.name.startsWith("$try_") ||
                    !currentScope.name.startsWith("$catch_"))
            ) {
                throw new TranspilerError(
                    `${data.name} requires closure brackets`,
                );
            }
        }
        if (
            splits.length !== 1 &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        ) {
            throw new TranspilerError(`${data.name} requires 1 argument`);
        }
        const text = splits[0];
        if (
            text === "" &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        ) {
            throw new TranspilerError(`${data.name} requires a text`);
        }
        const parsedText = parseString(fixMath(text));
        const res = `${escapeFunctionResult(`console.log(${parsedText});`)}`;
        currentScope.update(res, data);
        return { code: res, scope: scope, data };
    },
};

