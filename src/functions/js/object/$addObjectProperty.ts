import { TranspilerError } from "../../../core/error.js";
import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import {
    escapeResult,
    escapeVars,
    parseData,
} from "../../../util/transpilerHelpers.js";
export const $addObjectProperty: FunctionData = {
    name: "$addObjectProperty",
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
        {
            name: "value",
            type: "any",
            required: true,
        },
    ],
    version: "7.0.0",
    description: "adds a value to the key in the object",
    default: ["void", "void", "void"],
    returns: "void",
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope[scope.length - 1];
        const [name, key, ...value] = data.splits;
        const parsedValue = parseData(value.join(";"));

        if (
            !value.length &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        ) {
            throw new TranspilerError(`${data.name}: No Value Provided`);
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
        currentScope.objects[name].addKey(key);
        currentScope.objects[name].addValue(parsedValue);
        const res = escapeResult(`${escapeVars(name)}.${key} = ${parsedValue}`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
