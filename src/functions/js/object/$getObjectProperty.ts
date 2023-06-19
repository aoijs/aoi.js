import { TranspilerError } from "../../../core/error.js";
import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import {
    escapeResult,
    escapeVars,
} from "../../../util/transpilerHelpers.js";
export const $getObjectProperty: FunctionData = {
    name: "$getObjectProperty",
    brackets: true,
    optional: false,
    type: "getter",
    fields: [
        {
            name: "name",
            type: "string",
            description: "The name of the object to get the property from",
            required: true,
        },
        {
            name: "key",
            type: "string",
            description: "The key of the property to get",
            required: true,
        },
    ],
    version: "7.0.0",
    description: "gets the value of the key in the object",
    default: ["void", "void"],
    returns: "void",
    example: `
        $createObject[object;{key:value}]
        $getObjectProperty[object;key] // returns value
    `,
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope[scope.length - 1];
        const [name, key ] = data.splits;

        if (
            !currentScope.objects[name] &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        ) {
            throw new TranspilerError(
                `${data.name}: Invalid Object Name Provided`,
            );
        }
        const res = escapeResult(`${escapeVars(name)}.${key}`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
