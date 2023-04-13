import { TranspilerError } from "../../../core/error.js";
import { escapeResult } from "../../../util/transpilerHelpers.js";
export const $objectExists = {
    name: "$objectExists",
    brackets: true,
    optional: false,
    type: "getter",
    fields: [
        {
            name: "name",
            type: "string",
            required: true,
        },
    ],
    version: "7.0.0",
    description: "returns whether object exists or not",
    default: ["void"],
    returns: "object",
    code: (data, scope) => {
        const currentScope = scope[scope.length - 1];
        const name = data.inside;
        if (!name &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.endsWith("$catch_")) {
            throw new TranspilerError(`${data.name}: No Object Name Provided`);
        }
        const res = escapeResult(`${!!currentScope.objects[name ?? ""]}`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
//# sourceMappingURL=$objectExists.js.map