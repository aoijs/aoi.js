import { Scope } from "../../../index.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import { escapeResult } from "../../../util/transpilerHelpers.js";

export const $clientAvatar: FunctionData = {
    name: "$clientAvatar",
    type: "getter",
    brackets: true,
    optional: true,
    fields: [
        {
            name: "size",
            type: "number",
            required: false,
        },
        {
            name: "format",
            type: "string",
            required: false,
        },
        {
            name: "dynamic",
            type: "boolean",
            required: false,
        },
    ],
    version: "7.0.0",
    default: ["void", "void", "void"],
    returns: "string",
    description: "Returns the Avatar of client",
    code: (data: funcData, scope: Scope[]) => {
        // Adding default values
        const [size = 4096, dynamic = "true", format = "png"] = data.splits;

        // Getting the current scope
        const currentScope = scope[scope.length - 1];

        // Getting the client avatar
        const clientAvatar = `__$DISCORD_DATA$__.client.readyData.user.avatarUrl({ size: ${size}, dynamic: ${dynamic}, format: "${format}" })`;

        // Returning the result
        const res = escapeResult(clientAvatar);

        // Updating the scope
        currentScope.update(res, data);

        // Returning the result
        return {
            code: res,
            scope,
        };
    },
};
