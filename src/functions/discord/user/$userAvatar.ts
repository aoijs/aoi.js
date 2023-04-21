import { FunctionData } from "../../../typings/interfaces.js";
import {
    escapeResult,
} from "../../../util/transpilerHelpers.js";

export const $userAvatar: FunctionData = {
    name: "$userAvatar",
    type: "getter",
    brackets: true,
    optional: false,
    fields: [
        {
            name: "user",
            type: "bigint",
            required: false,
        }
    ],
    version: "7.0.0",
    default: [],
    returns: "string",
    description: "Returns the avatar of the user",
    code: (data, scope) => {
        const currentScope = scope[scope.length - 1];

        const [id,size=1024,dynamic=true,format="'png'"] = data.splits;

        const avatar = `(await __$DISCORD_DATA$__.bot.util.getUser(${id}))?.avatarUrl({size: ${size}, dynamic: ${dynamic}, format: ${format} })`;

        const res = escapeResult(`(${avatar})`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
