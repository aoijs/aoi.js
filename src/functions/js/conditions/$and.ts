import funcs from "../../";
import { Transpiler, conditionLexer } from "../../../index.js";
import { FunctionData } from "../../../typings/interfaces.js";
import {
    escapeResult, getFunctionList,
} from "../../../util/transpilerHelpers.js";
export const $and: FunctionData = {
    name: "$and",
    type: "scope_getter",
    brackets: true,
    optional: false,
    version: "7.0.0",
    fields: [
        {
            name: "condition",
            type: "string",
            required: true,
        },
    ],
    default: ["void"],
    returns: "boolean",
    description: "Returns true if all conditions are true",
    code: (data, scope) => {
        const conditions = data.splits;
        const currentScope = scope[scope.length - 1];
        const cons = conditions.map( ( condition ) =>
        {
            let executedCondition;
            const conditionFunctionList = getFunctionList(
                condition,
                Object.keys( funcs ),
            );
            if (conditionFunctionList.length) {
                executedCondition = Transpiler( condition, {
                    sendMessage: false, scopeData: {
                        variables: currentScope.variables,
                        name: currentScope.name,
                        objects: currentScope.objects,
                        env: currentScope.env,
                    }
                } );
                currentScope.functions +=
                executedCondition.scope[0].functions + "\n";
                currentScope.packages += executedCondition.scope[0].packages;
                executedCondition = executedCondition.code;
            } else {
                executedCondition = condition;
            }
            return executedCondition;
        }
        );
        const solved = conditionLexer( cons.join( "&&" ) ).solve( false );
        const res = escapeResult( solved );
        currentScope.update( res, data );

        return {
            code: res,
            scope,
        };
    },
};
