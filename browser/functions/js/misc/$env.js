import { TranspilerError } from "../../../core/index.js";
import { escapeResult } from "../../../util/transpilerHelpers.js";
export const $env = {
    name: "$env",
    brackets: true,
    optional: false,
    type: "getter",
    fields: [
        {
            name: "env",
            type: "string",
            required: true,
        },
    ],
    description: "returns the value of an scoped variable of the current scope",
    default: ["void"],
    version: "7.0.0",
    returns: "?string",
    code: (data, scope) => {
        const env = data.inside;
        const currentScope = scope[scope.length - 1];
        if (!env &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")) {
            throw new TranspilerError(`${data.name}: ENV Not Provided.`);
        }
        const mainenv = env?.split(".")[0];
        if (!currentScope.env.includes(mainenv) &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")) {
            throw new TranspilerError(`${data.name}: ENV ${env} Not Found`);
        }
        const res = escapeResult(`${env}`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
//# sourceMappingURL=$env.js.map