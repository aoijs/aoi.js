import { Scope, parseString } from "../../../index.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import {
    convertToBool,
    escapeResult,
} from "../../../util/transpilerHelpers.js";
export const $eval: FunctionData = {
    name: "$eval",
    type: "function",
    brackets: true,
    optional: false,
    fields: [
        {
            name: "output",
            type: "boolean",
            description: "Whether to send the output to the channel",
            required: true,
        },
        {
            name: "code",
            type: "string",
            description: "The code to evaluate",
            required: true,
        },
    ],
    default: ["void", "void"],
    returns: "any",
    version: "7.0.0",
    description: "Evaluates the aoi.js code",
    example: `
    $eval[true;$ping] // sends the ping to the channel
    `,
    code: (data: funcData, scope: Scope[]) => {
        const [output, ...code] = data.splits;
        const parsedOutput = convertToBool(output);
        const currentScope = scope[scope.length - 1];
        const executedCode = `Transpiler(${parseString(
            code.join(";"),
        )}, {sendMessage: ${parsedOutput} ,minify: false }).func(__$DISCORD_DATA$__);\n`;
        const res = escapeResult(`
    ${executedCode}
    `);
        if (
            !currentScope.packages.includes(
                "const { Transpiler } = await import('./transpiler.js');",
            )
        ) {
            currentScope.packages += "const { Transpiler } = await import('./transpiler.js');\n";
        }
        currentScope.rest = currentScope.rest.replace(data.total, res);
        data.funcs = [];
        return {
            code: res,
            scope: scope,
            data: data,
        };
    },
};
