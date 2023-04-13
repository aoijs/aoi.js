import { TranspilerError } from "../../../core/index.js";
import { escapeResult } from "../../../util/transpilerHelpers.js";
export const $passData = {
    name: "$passData",
    brackets: true,
    optional: false,
    type: "getter",
    fields: [
        {
            name: "passData",
            type: "string",
            required: true,
        },
    ],
    description: "return the data passed to the command from another command",
    default: ["void"],
    version: "7.0.0",
    returns: "?string",
    code: (data, scope) => {
        const passData = data.inside;
        const currentScope = scope[scope.length - 1];
        if (!passData &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")) {
            throw new TranspilerError(`${data.name}: PASSDATA Not Provided.`);
        }
        const res = escapeResult(`__$DISCORD_DATA$__${passData}`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
//# sourceMappingURL=$passData.js.map