import {
    FunctionData,
    funcData,
    Scope,
    TranspilerError,
    Transpiler,
} from "../../../index.js";
import funcs from "../../index.js";
import {
    getFunctionList,
    escapeResult,
} from "../../../util/transpilerHelpers.js";

export const $switch: FunctionData = {
    name: "$switch",
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
            name: "code",
            type: "string",
            description: "The code to execute if the switch statement is true",
            required: true,
        },
    ],
    version: "7.0.0",
    default: ["void", "void"],
    returns: "void",
    description: "Switch statement",
    example: `
        $let[num;1]
    $switch[$get[num];
        $case[1;
            $log[hello world]
        ]
        $case[2;
            $log[hello world 2]
        ]
        $default[
            $log[hello world default]
        ]
    ]`,
    code: (data: funcData, scope: Scope[]) => {
        const splits = data.splits;
        const currentScope = scope[scope.length - 1];
        if ($switch.brackets) {
            if (
                !data.total.startsWith($switch.name + "[") &&
                (!currentScope.name.startsWith("$try_") ||
                    !currentScope.name.startsWith("$catch_"))
            ) {
                throw new TranspilerError(
                    `${data.name} requires closure brackets`,
                );
            }
        }
        const [ variable, ...errorMsg ] = splits;

        let Execvariable;

        const variableFunctionList = getFunctionList(
            variable,
            Object.keys( funcs ),
        );

        if ( variableFunctionList.length )
        {
            Execvariable = Transpiler(variable, {
                sendMessage: false,
                scopeData: {
                    variables: currentScope.variables,
                    embeds: currentScope.embeds,
                    name: currentScope.name,
                    objects: currentScope.objects,
                    env: currentScope.env,
                },
                client: currentScope.client,
            }).code;
        }
        else
        {
            Execvariable = variable;

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
                parsedStringOnly: true,
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
    switch(${Execvariable}) {
      ${newscope.rawString()}
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
