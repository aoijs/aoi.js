import { FunctionData, funcData, Scope, TranspilerError, Transpiler } from "../../../index.js";
import funcs from "../../index.js";
import { getFunctionList, escapeFunctionResult } from "../../../util/transpilerHelpers.js";

export const $else: FunctionData = {
    name: "$else",
    brackets: true,
    optional: false,
    type: "scope",
    fields: [
        {
            name: "code",
            type: "string",
            required: false,
        },
    ],
    default: ["void"],
    version: "7.0.0",
    returns: "void",
    description: "Else statement",
    code: (data: funcData, scope: Scope[]) => {
        const splits = data.splits;
        const currentScope = scope[scope.length - 1];
        if ($else.brackets) {
            if (
                !data.total.startsWith($else.name + "[") &&
                (!currentScope.name.startsWith("$try_") ||
                    !currentScope.name.startsWith("$catch_"))
            ) {
                throw new TranspilerError(
                    `${data.name} requires closure brackets`,
                );
            }
        }
        const [...errorMsg] = splits;
        const hash = Math.floor(Math.random() * 100000);
        const newscope = new Scope(
            `${data.name}_${hash}`,
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
            executedErrorMsg = Transpiler( errorMsg.join( ";" ), {
                sendMessage: true, scopeData: {
                    variables: currentScope.variables,
                    embeds: currentScope.embeds,
                    env: currentScope.env,
                    name: currentScope.name,
                    objects: currentScope.objects,
                }

            } );
            newscope.functions = executedErrorMsg.scope[0].functions + "\n";
            newscope.packages = executedErrorMsg.scope[0].packages + "\n";
            newscope.setters = executedErrorMsg.scope[0].setters + "\n";
            executedErrorMsg.scope[0].addReturn = true;
            newscope.rest = executedErrorMsg.scope[0].rest + "\n";
            newscope.sendData = executedErrorMsg.scope[0].sendData;
        } else {
            executedErrorMsg = errorMsg.join(";");
            newscope.rest = executedErrorMsg + "\n";
            newscope.sendData.content = executedErrorMsg;
        }
        const res = escapeFunctionResult(`
    else {
      ${newscope.toString()}
    }
    `);
        currentScope.update( res, data );
        return {
            code: res,
            scope: scope,
            data,
        };
    },
};
