import { escapeResult, } from "../../../util/transpilerHelpers.js";
export const $message = {
    name: "$message",
    type: "getter",
    brackets: false,
    optional: false,
    fields: [],
    version: "7.0.0",
    default: [],
    returns: "string",
    description: "Returns the author's message",
    code: (data, scope) => {
        const currentScope = scope[scope.length - 1];
        const message = "__$DISCORD_DATA$__.args?.join(\" \")";
        const res = escapeResult(`(${message})`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
//# sourceMappingURL=$message.js.map