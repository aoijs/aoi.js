import { TranspilerError } from "../../../core/error.js";
import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import { escapeResult, escapeVars } from "../../../util/transpilerHelpers.js";
export const $deleteObjectProperty: FunctionData = {
    name: "$deleteObjectProperty",
    brackets: true,
    optional: false,
    type: "function",
    fields: [
        {
            name: "name",
            type: "string",
            description: "The name of the object to delete the property from",
            required: true,
        },
        {
            name: "key",
            type: "string",
            description: "The key of the property to delete",
            required: true,
        },
    ],
    version: "7.0.0",
    description: "deletes the key in the object",
    default: ["void", "void", ],
    returns: "void",
    example: `
        $createObject[object;{key:value}]
        $deleteObjectProperty[object;key]
        $getObjectProperty[object;key] // returns undefined
    `,
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope[scope.length - 1];
        const [name, key] = data.splits;

        if (
            !key.length &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        ) {
            throw new TranspilerError(`${data.name}: No Key Provided`);
        }
        if (
            !currentScope.objects[name] &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        ) {
            throw new TranspilerError(
                `${data.name}: Invalid Object Name Provided`,
            );
        }
        const o = currentScope.objects[name];
        const index = o.keys.indexOf(key);
        o.keys.splice(index, 1);
        o.values.splice(index, 1);
        const res = escapeResult(`delete ${escapeVars(name)}.${key}`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
