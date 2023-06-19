import { FunctionData } from "../../../typings/interfaces.js";
import { escapeResult } from "../../../util/transpilerHelpers.js";

export const $clientToken: FunctionData = {
    name: "$clientToken",
    type: "getter",
    brackets: false,
    optional: false,
    fields: [],
    version: "7.0.0",
    default: [],
    returns: "string",
    description: "Returns the token of client",
    example: "client token is `$clientToken`",
    code: (data, scope) => {
        // Getting the current scope
        const currentScope = scope[scope.length - 1];

        // Getting the client token
        const clientToken = "__$DISCORD_DATA$__.client?.token";

        // Returning the result
        const res = escapeResult(clientToken);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    }
};