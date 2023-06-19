import { FunctionData, funcData, Scope } from "../../../index.js";
import { escapeResult } from "../../../util/transpilerHelpers.js";

export const $ram: FunctionData = {
    name: "$ram",
    brackets: true,
    optional: true,
    type: "getter",
    fields: [
        {
            name: "type",
            type: "rss|heapUsed|heapTotal|external|arrayBuffer",
            description: "The type of ram to get",
            required: false,
        },
    ],
    version: "7.0.0",
    default: ["rss"],
    returns: "number",
    description: "Returns the bot's ram usage",
    example: `
        $ram // returns the rss ram usage
        $ram[heapUsed] // returns the heapUsed ram usage
        $ram[heapTotal] // returns the heapTotal ram usage
        $ram[external] // returns the external ram usage
        $ram[arrayBuffer] // returns the arrayBuffer ram usage
        `,
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope[scope.length - 1];
        const type = data.inside ?? "rss";

        const res = escapeResult(
            `(process.memoryUsage().${type} / 1024 / 1024).toFixed(2)`,
        );
        currentScope.rest = currentScope.rest.replace(data.total, res);
        return {
            code: res,
            scope: scope,
        };
    },
};
