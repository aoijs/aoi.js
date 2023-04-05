import { TranspilerError } from "../../../core/error.js";
import { TranspilerCustoms } from "../../../typings/enums.js";
import { FunctionData } from "../../../typings/interfaces.js";
import {
    escapeMathResult,
    escapeResult,
    parseResult,
} from "../../../util/transpilerHelpers.js";

export const $ping: FunctionData = {
    name: "$ping",
    type: "getter",
    brackets: false,
    optional: false,
    fields: [],
    version: "7.0.0",
    default: [],
    returns: "number",
    description: "Returns the Ping of client",
    code: (data, scope) => {
        const currentScope = scope[scope.length - 1];
        
        const ping = `__$DISCORD_DATA$__.client.ws.ping`;

        const res = escapeResult(`(${ping})`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
