import { TranspilerError } from "../../../core/error.js";
import { TranspilerCustoms } from "../../../typings/enums.js";
import { FunctionData } from "../../../typings/interfaces.js";
import {
    escapeMathResult,
    parseResult,
} from "../../../util/transpilerHelpers.js";

export const $abs: FunctionData = {
    name: "$abs",
    type: "getter",
    brackets: true,
    optional: false,
    fields: [
        {
            name: "numbers",
            type: "number",
            required: true,
        },
    ],
    version: "7.0.0",
    default: ["void"],
    returns: "number",
    description: "Returns the Absolute value of the number",
    code: (data, scope) => {
        const numbers = data.inside;
        const currentScope = scope[scope.length - 1];
        if (
            data.splits.length === 0 &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        ) {
            throw new TranspilerError(
                `${data.name} requires at least 1 argument`,
            );
        }
        if(!numbers) throw new TranspilerError(`${data.name} requires at least 1 argument`);
        let abs =
            numbers.includes( TranspilerCustoms.FS ) ||
                numbers.includes( "__$DISCORD_DATA$__" ) ||
                numbers.includes( TranspilerCustoms.MFS )
                ? parseResult( numbers.trim() )
                : Number( numbers );
        abs = `Math.abs(${abs})`

        const res = escapeMathResult(`(${abs})`);
         currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};