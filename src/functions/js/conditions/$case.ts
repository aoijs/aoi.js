import {
    FunctionData,
    funcData,
    Scope,
    TranspilerError,
    Transpiler,
    parseString,
} from "../../../index.js";
import funcs from "../../index.js";
import {
    getFunctionList,
    escapeResult,
    parseData,
} from "../../../util/transpilerHelpers.js";

export const $case: FunctionData = {
    name: "$case",
    brackets: true,
    optional: false,
    type: "scope",
    fields: [
        {
            name: "case",
            type: "string",
            required: true,
        },
        {
            name: "code",
            type: "string",
            required: true,
        },
    ],
    version: "7.0.0",
    default: ["void", "void"],
    returns: "void",
    description: "Case statement",
    code: (data: funcData, scope: Scope[]) => {
        const splits = data.splits;
        const currentScope = scope[scope.length - 1];
        if ($case.brackets) {
            if (
                !data.total.startsWith($case.name + "[") &&
                (!currentScope.name.startsWith("$try_") ||
                    !currentScope.name.startsWith("$catch_"))
            ) {
                throw new TranspilerError(
                    `${data.name} requires closure brackets`,
                );
            }
        }
        const [ caseValue, ...errorMsg ] = splits;

        const caseFunctionList = getFunctionList(
            caseValue,
            Object.keys( funcs ),
        );
        let exeCaseValue,parsedCase;
        if ( caseFunctionList.length )
        {
            exeCaseValue = Transpiler(caseValue, {
                sendMessage: false,
                scopeData: {
                    variables: currentScope.variables,
                    name: currentScope.name,
                    objects: currentScope.objects,
                    env: currentScope.env,
                },
                client: currentScope.client,
            });
            currentScope.functions += exeCaseValue.scope[ 0 ].functions + "\n";
            currentScope.packages += exeCaseValue.scope[ 0 ].packages;
            exeCaseValue = exeCaseValue.code;
            parsedCase = parseData( exeCaseValue );
        }
        else
        {
            exeCaseValue = caseValue;
            parsedCase = parseData(exeCaseValue);
            typeof parsedCase === "string" &&
                (parsedCase = parseString(parsedCase));
        }

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
                sendMessage: true,
                scopeData: {
                    variables: currentScope.variables,
                    embeds: currentScope.embeds,
                    name: currentScope.name,
                    objects: currentScope.objects,
                    env: currentScope.env,
                },
                client: currentScope.client,
                minify: true,
            });
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
        const res = escapeResult(`
    case ${parsedCase}:
      ${newscope.toString()}
      break;
    `);
        currentScope.update( res, data );
        return {
            code: res,
            scope: scope,
            data,
        };
    },
};
