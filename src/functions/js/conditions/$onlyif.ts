import { FunctionData, funcData, Scope, TranspilerError, Transpiler, conditionLexer } from "../../../index.js";
import funcs from "../../index.js";
import { getFunctionList, escapeResult } from "../../../util/transpilerHelpers.js";

export const $onlyIf: FunctionData = {
    name: "$onlyIf",
    brackets: true,
    optional: false,
    type: "scope",
    fields: [
        {
            name: "condition",
            type: "string",
            description: "The condition to check",
            required: true,
        },
        {
            name: "errorMsg",
            type: "string",
            description: "The error message to send if the condition is false",
            required: false,
        },
    ],
    version: "7.0.0",
    default: ["void", ""],
    returns: "void",
    description: "onlyIf statement",
    example: `
        $onlyIf[$ping<100;
        $log[ping is less than 100]
    ]`,
    code: (data: funcData, scope: Scope[]) => {
        const splits = data.splits;
        const currentScope = scope[scope.length - 1];
        if ($onlyIf.brackets) {
            if (
                !data.total.startsWith($onlyIf.name + "[") &&
                (!currentScope.name.startsWith("$try_") ||
                    !currentScope.name.startsWith("$catch_"))
            ) {
                throw new TranspilerError(
                    `${data.name} requires closure brackets`,
                );
            }
        }
        const [condition, ...errorMsg] = splits;
        const conditionFunctionList = getFunctionList(
            condition,
            Object.keys(funcs),
        );
        let executedCondition;
        if (conditionFunctionList.length) {
            executedCondition = Transpiler(condition, {
                sendMessage: false,
                scopeData: {
                    variables: currentScope.variables,
                    name: currentScope.name,
                    objects: currentScope.objects,
                    env: currentScope.env,
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
        const hash = Math.floor(Math.random() * 100000);
        const newscope = new Scope(
            `${data.name}_${hash}`,
            currentScope.client,
            currentScope.name,
            errorMsg.join(";"),
            true,
        );

        let executedErrorMsg;
        const errorMsgFunctionList = getFunctionList(
            errorMsg.join(";"),
            Object.keys(funcs),
        );
        if (errorMsgFunctionList.length) {
            executedErrorMsg = Transpiler(errorMsg.join(";"), {
                sendMessage: false,
                scopeData: {
                    variables: currentScope.variables,
                    name: currentScope.name,
                    objects: currentScope.objects,
                    env: currentScope.env,
                },
                client: currentScope.client,
            });
            newscope.functions = executedErrorMsg.scope[0].functions + "\n";
            newscope.packages = executedErrorMsg.scope[0].packages + "\n";
            newscope.setters = executedErrorMsg.scope[0].setters + "\n";
            newscope.rest = executedErrorMsg.scope[0].rest + "\n";
            newscope.sendData = executedErrorMsg.scope[0].sendData;
            newscope.embeds = executedErrorMsg.scope[0].embeds;
            newscope.components = executedErrorMsg.scope[0].components;
            newscope.files = executedErrorMsg.scope[0].files;
            newscope.stickers = executedErrorMsg.scope[0].stickers;
            newscope.variables = executedErrorMsg.scope[0].variables;
        } else {
            executedErrorMsg = errorMsg.join(";");
            newscope.rest = executedErrorMsg + "\n";
            newscope.sendData.content = executedErrorMsg;
        }
        newscope.addReturn = true;
        const res = escapeResult(`
    if(!(${executedCondition})) {
      ${newscope.toString( true )}
      return ;
    }
    `);
        currentScope.rest = currentScope.rest.replace(data.total, res);
        return {
            code: res,
            scope: scope,
            data,
        };
    },
};
