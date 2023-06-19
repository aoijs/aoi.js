import { FunctionData } from "../../../typings/interfaces.js";
import {
    escapeResult,
} from "../../../util/transpilerHelpers.js";

export const $guildName: FunctionData = {
    name: "$guildName",
    type: "getter",
    brackets: true,
    optional: true,
    fields: [{
        name: "guildId",
        type: "number",
        description: "The guild id to get the name from",
        required: false,
    }],
    version: "7.0.0",
    default: [
        "__$DISCORD_DATA$__.guild?.name"
    ],
    returns: "string",
    description: "Returns the name of current guild",
    example: `
        $guildName // returns the name of current guild

        $guildName[some id here] // returns the name of guild with provided id
        `,
    code: (data, scope) => {
        const currentScope = scope[scope.length - 1];
        const id = data.inside;
        const guildName = id ? `(await __$DISCORD_DATA$__.util.getGuild(${id}))?.name` : "__$DISCORD_DATA$__.guild?.name";

        const res = escapeResult(`(${guildName})`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
