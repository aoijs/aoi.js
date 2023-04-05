import { TranspilerError } from "../../../core/error.js";
import { TranspilerCustoms } from "../../../typings/enums.js";
import { FunctionData } from "../../../typings/interfaces.js";
import {
    escapeMathResult,
    escapeResult,
    parseResult,
} from "../../../util/transpilerHelpers.js";

export const $guildName: FunctionData = {
    name: "$guildName",
    type: "getter",
    brackets: false,
    optional: false,
    fields: [],
    version: "7.0.0",
    default: [],
    returns: "number",
    description: "Returns the name of current guild",
    code: (data, scope) => {
        const currentScope = scope[scope.length - 1];

        const guildName = `__$DISCORD_DATA$__.guild?.name`;

        const res = escapeResult(`(${guildName})`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
