import { TranspilerError } from "../../../core/error.js";
import { escapeResult, escapeVars, } from "../../../util/transpilerHelpers.js";
export const $getObjectProperty = {
    name: "$getObjectProperty",
    brackets: true,
    optional: false,
    type: "function",
    fields: [
        {
            name: "name",
            type: "string",
            required: true,
        },
        {
            name: "key",
            type: "string",
            required: true,
        },
    ],
    version: "7.0.0",
    description: "gets the value of the key in the object",
    default: ["void", "void"],
    returns: "void",
    code: (data, scope) => {
        const currentScope = scope[scope.length - 1];
        const [name, key] = data.splits;
        if (!currentScope.objects[name] &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")) {
            throw new TranspilerError(`${data.name}: Invalid Object Name Provided`);
        }
        const res = escapeResult(`${escapeVars(name)}.${key}`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
//# sourceMappingURL=$getObjectProperty.js.map