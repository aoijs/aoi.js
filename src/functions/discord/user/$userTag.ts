import { FunctionData } from "../../../typings/interfaces.js";
import {
    escapeResult, parseResult,
} from "../../../util/transpilerHelpers.js";

export const $userTag: FunctionData = {
    name: "$userTag",
    type: "getter",
    brackets: true,
    optional: true,
    fields: [
        {
            name: "user",
            type: "bigint",
            required: false,
        }
    ],
    version: "7.0.0",
    default: ["authorId"],
    returns: "string",
    description: "Returns the tag of the user",
    example: `
        $userTag // returns the tag of the author

        $userTag[123456789012345678] // returns the tag of the user with id 123456789012345678
    `,
    code: (data, scope) => {
        const currentScope = scope[scope.length - 1];

        const userTag = data.inside ? `(await __$DISCORD_DATA$__.bot.util.getUser(${parseResult(data.inside)}))?.tag` : "__$DISCORD_DATA$__.author?.tag";

        const res = escapeResult(`(${userTag})`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
