import { TranspilerError } from "../../../index.js";
import { FunctionData } from "../../../typings/interfaces.js";
import {
    escapeResult,
} from "../../../util/transpilerHelpers.js";

export const $userId: FunctionData = {
    name: "$userId",
    type: "getter",
    brackets: true,
    optional: false,
    fields: [{ name: "username", type: "string", required: true}],
    version: "7.0.0",
    default: [],
    returns: "bigint",
    description: "Returns the id of the user",
    code: (data, scope) => {
        const currentScope = scope[scope.length - 1];
        const name = data.inside;
        if (
            name === "" &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        ) {
            throw new TranspilerError(`${data.name} requires a username.`);
        }
        const userId = `(await __$DISCORD_DATA$__.bot.util.findUser(\`${name}\`))?.id`;

        const res = escapeResult(`(${userId})`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
