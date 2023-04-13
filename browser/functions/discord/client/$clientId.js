import { escapeResult } from "../../../util/transpilerHelpers.js";
export const $clientId = {
    name: "$clientId",
    type: "getter",
    brackets: false,
    optional: false,
    fields: [],
    version: "7.0.0",
    default: [],
    returns: "number",
    description: "Returns the ID of client",
    code: (data, scope) => {
        // Getting the current scope
        const currentScope = scope[scope.length - 1];
        // Getting the client ID
        const clientId = "__$DISCORD_DATA$__.client?.user.id";
        // Returning the result
        const res = escapeResult(clientId);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
//# sourceMappingURL=$clientId.js.map