import { FunctionData, TranspilerError, Transpiler } from "../../../index.js";
import Scope from "../../../core/structs/Scope.js";
import { getFunctionList, escapeResult, escapeVars } from "../../../util/transpilerHelpers.js";
import funcs from "../../index.js";
export const $forIn: FunctionData = {
    name: "$forIn",
    type: "scope",
    brackets: true,
    optional: false,
    fields: [
        {
            name: "variable",
            type: "string",
            required: true,
        }, {
            name: "objectName",
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
    default: ["void","void", "void"],
    returns: "void",
    description: "ForIn statement",
    code: (data, scope) => {
        const splits = data.splits;
        const currentScope = scope[scope.length - 1];
        if (
            data.inside?.trim() === "" ||
            (!data.inside &&
                (!currentScope.name.startsWith("$try_") ||
                    !currentScope.name.startsWith("$catch_")))
        ) {
            throw new TranspilerError(
                `${data.name} function requires variable ,objectName and code`,
            );
        }
        if (
            data.splits.length < 2 &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        ) {
            throw new TranspilerError(
                `${data.name} function requires objectName and code`,
            );
        }
        const [ variable,objectName, ...code ] = splits;

        currentScope.env.push( variable );
        if ( currentScope.objects[ objectName ] === undefined && !currentScope.name.startsWith( "$try_" ) && !currentScope.name.startsWith( "$catch_" ) )
        {
            throw new TranspilerError(
                `${ data.name } function requires objectName field as string`,
            );
        }

        let executedCode;
        const codeFunctionList = getFunctionList(
            code.join(";"),
            Object.keys(funcs),
        );
        if (codeFunctionList.length) {
            executedCode = Transpiler( code.join( ";" ), {
                sendMessage: false,
                scopeData: {
                    variables: currentScope.variables,
                    embeds: currentScope.embeds,
                    name: currentScope.name,
                    objects: currentScope.objects,
                    env: currentScope.env,
                }
            } );
        } else {
            executedCode = code.join( ";" );
        }
        const res = escapeResult(`
for(let ${variable} in ${escapeVars(objectName)}){
       ${
    typeof executedCode === "string"
        ? executedCode
        : (<{ code: string; scope: Scope[]; func: unknown }>(
                     executedCode
                 ))?.scope[0].toString(false)
}
}
`);
        currentScope.update(res,data);
        return { code: res, scope: scope, data };
    },
};
