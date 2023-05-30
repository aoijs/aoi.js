import { TranspilerError } from "../../../core/error.js";
import Scope from "../../../core/structs/Scope.js";
import { StringObject, parseStringObject } from "../../../index.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import {
    escapeResult,
    escapeVars,
    parseData,
} from "../../../util/transpilerHelpers.js";
export const $arrayCreate: FunctionData = {
    name: "$arrayCreate",
    brackets: true,
    optional: false,
    type: "setter",
    fields: [
        {
            name: "name",
            type: "string",
            required: true,
        },
        {
            name: "values",
            type: "unknown",
            required: true,
        },
    ],
    description: "creates an array with the specified values",
    default: ["void", "void"],
    returns: "void",
    version: "7.0.0",
    code: (data: funcData, scope: Scope[]) => {
        const [name, ...values] = data.splits;
        const currentScope = scope[scope.length - 1];
        if (
            currentScope.objects[name] &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        )
            throw new TranspilerError(
                `${data.name}: Variable ${name} already exists`,
            );
        const parsedValues = values.map((v) => parseData(v));
        const currentObj = new StringObject("[");
        currentObj.addEnd("]");

        const array = parseStringObject(
            `[${parsedValues.join(" , ")}]`,
            currentObj,
        );

        currentScope.objects[name] = <StringObject>array;
        currentScope.variables.push(name);

        const res = escapeResult(
            `const ${escapeVars(name)} = ${array.solve()};`,
        );
        currentScope.update(res, data);

        return {
            code: "",
            scope,
        };
    },
};
