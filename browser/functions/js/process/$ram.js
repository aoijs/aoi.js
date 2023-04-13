import { parseString } from "../../..";
import { escapeResult } from "../../../util/transpilerHelpers.js";
export const $ram = {
    name: "$ram",
    brackets: true,
    optional: true,
    type: "getter",
    fields: [
        {
            name: "type",
            type: "rss|heapUsed|heapTotal|external|arrayBuffer",
            required: false,
        },
    ],
    version: "7.0.0",
    default: ["rss"],
    returns: "number",
    description: "Returns the bot's ram usage",
    code: (data, scope) => {
        const currentScope = scope[scope.length - 1];
        const type = parseString(data.inside ?? "rss");
        const res = escapeResult(`(process.memoryUsage()[${type}] / 1024 / 1024).toFixed(2)`);
        currentScope.rest = currentScope.rest.replace(data.total, res);
        return {
            code: res,
            scope: scope,
        };
    },
};
//# sourceMappingURL=$ram.js.map