import { TranspilerError } from "../../../core/error.js";
import { TranspilerCustoms } from "../../../typings/enums.js";
import { FunctionData } from "../../../typings/interfaces.js";
import {
    escapeMathResult,
    parseResult,
} from "../../../util/transpilerHelpers.js";

export const $divide: FunctionData = {
    name: "$divide",
    type: "getter",
    brackets: true,
    optional: false,
    fields: [
        {
            name: "numbers",
            type: "number",
            description: "The numbers to divide",
            required: true,
        },
    ],
    version: "7.0.0",
    default: ["void"],
    returns: "number",
    description: "Returns the division of the numbers",
    example: `
    $divide[1;2] // returns 0.5
    $divide[1;2;3] // returns 0.16666666666666666
    `,
    code: (data, scope) => {
        const numbers = data.splits;
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
        const divide = numbers
            .map((x) =>
                x.includes(TranspilerCustoms.FS) ||
                x.includes("__$DISCORD_DATA$__") ||
                x.includes(TranspilerCustoms.MFS)
                    ? parseResult(x.trim())
                    : Number(x),
            )
            .join("/");

        const res = escapeMathResult(`(${divide})`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
