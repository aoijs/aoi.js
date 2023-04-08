import { FunctionData } from "../../../typings/interfaces.js";
import {
    escapeResult,
} from "../../../util/transpilerHelpers.js";

export const $guildId: FunctionData = {
    name: "$guildId",
    type: "getter",
    brackets: false,
    optional: false,
    fields: [],
    version: "7.0.0",
    default: [],
    returns: "number",
    description: "Returns the guildId of current guild",
    code: (data, scope) => {
        const currentScope = scope[scope.length - 1];

        const guildId = "__$DISCORD_DATA$__.guild?.id";

        const res = escapeResult(`(${guildId})`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
