import { TranspilerError } from "../../../core/error.js";
import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import {
    escapeResult,
    escapeVars,
} from "../../../util/transpilerHelpers.js";
export const $arrayConcat: FunctionData = {
    name: "$arrayConcat",
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
            type: "string[]",
            required: true,
        },
    ],
    description: "concatenates the specified values to the array",
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
        if (
            !currentScope.variables.every((x) => values.includes(x)) &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        )
            throw new TranspilerError(
                `${data.name}: array ${values
                    .filter((x) => !currentScope.variables.includes(x))
                    .join(", ")} do(es) not exist`,
            );

        currentScope.variables.push(name);
        const parsedValues = values.map((v) => escapeVars(v));
        const res = escapeResult(
            `const ${escapeVars(name)} = [...${parsedValues.join(", ...")}];`,
        );
        currentScope.update(res, data);

        return {
            code: "",
            scope,
        };
    },
};
