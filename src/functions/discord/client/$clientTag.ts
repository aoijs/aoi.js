import { FunctionData } from "../../../typings/interfaces.js";
import { escapeResult } from "../../../util/transpilerHelpers.js";

export const $clientTag: FunctionData = {
    name: "$clientTag",
    type: "getter",
    brackets: false,
    optional: false,
    fields: [],
    version: "7.0.0",
    default: [],
    returns: "string",
    description: "Returns the username of client with discriminator",
    example: `
        $clientTag // returns the username of client with discriminator
    `,
    code: (data, scope) => {
        // Getting the current scope
        const currentScope = scope[scope.length - 1];

        // Getting the client tag
        const clientTag = "__$DISCORD_DATA$__.client?.user.tag()";

        // Returning the result
        const res = escapeResult(clientTag);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
