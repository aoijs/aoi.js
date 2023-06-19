import { TranspilerError } from "../../../core/error.js";
import Scope from "../../../core/structs/Scope.js";
import { Transpiler, conditionLexer, functions } from "../../../index.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import {
    escapeResult,
    escapeVars,
    getFunctionList,
    parseResult,
} from "../../../util/transpilerHelpers.js";
export const $arrayFind: FunctionData = {
    name: "$arrayFind",
    brackets: true,
    optional: false,
    type: "scope_getter",
    fields: [
        {
            name: "name",
            type: "string",
            description: "The name of the array",
            required: true,
        },
        {
            name: "query",
            type: "function",
            description: "The query to check",
            required: true,
        },
    ],
    description: "finds the first element in the array based on the condition",
    default: ["void", "void"],
    returns: "any",
    version: "7.0.0",
    example: `
        $arrayCreate[myArray;1;2;3;4;5]
        $arrayFind[myArray;$env[array_element]<=;5] // returns 1
        $arrayFind[myArray;$env[array_element]>=;5] // returns 5
    `,
    code: (data: funcData, scope: Scope[]) => {
        const [name, ...values] = data.splits;
        const currentScope = scope[scope.length - 1];
        if (
            !currentScope.variables.includes(name) &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        )
            throw new TranspilerError(
                `${data.name}: Variable ${name} does not exists`,
            );

        const condition = values.join(";");
        const conditionFunctionList = getFunctionList(
            condition,
            Object.keys(functions),
        );
        let executedCondition;
        if (conditionFunctionList.length) {
            executedCondition = Transpiler(condition, {
                sendMessage: false,
                scopeData: {
                    variables: currentScope.variables,
                    name: currentScope.name,
                    objects: currentScope.objects,
                    env: [...currentScope.env, "array_element"],
                },
                client: currentScope.client,
            });
            currentScope.functions +=
                executedCondition.scope[0].functions + "\n";
            currentScope.packages += executedCondition.scope[0].packages;
            executedCondition = executedCondition.code;
        } else {
            executedCondition = condition;
        }
        executedCondition = conditionLexer(executedCondition);

        executedCondition = executedCondition.solve();

        const res = escapeResult(
            `${escapeVars(name)}.find(array_element => ${ parseResult(executedCondition)})`,
        );

        currentScope.update(res, data);

        return {
            code: res,
            scope,
            data,
        };
    },
};
