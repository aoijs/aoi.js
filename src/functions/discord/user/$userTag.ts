import { FunctionData } from "../../../typings/interfaces.js";
import {
    escapeResult,
} from "../../../util/transpilerHelpers.js";

export const $userTag: FunctionData = {
    name: "$userTag",
    type: "getter",
    brackets: true,
    optional: false,
    fields: [
        {
            name: "user",
            type: "bigint",
            required: true,
        }
    ],
    version: "7.0.0",
    default: [],
    returns: "string",
    description: "Returns the tag of the user",
    code: (data, scope) => {
        const currentScope = scope[scope.length - 1];

        const userTag = `(await __$DISCORD_DATA$__.bot.util.getUser(${data.inside}))?.tag`;

        const res = escapeResult(`(${userTag})`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
