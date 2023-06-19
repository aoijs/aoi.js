import { TranspilerError,Scope } from "../../../core/index.js";

import { funcData, FunctionData } from "../../../typings/interfaces.js";
import { escapeResult } from "../../../util/transpilerHelpers.js";
export const $env: FunctionData = {
    name: "$env",
    brackets: true,
    optional: false,
    type: "getter",
    fields: [
        {
            name: "env",
            type: "string",
            description: "The env to get from the current scope",
            required: true,
        },
    ],
    description: "returns the value of an scoped variable of the current scope",
    default: ["void"],
    version: "7.0.0",
    returns: "?string",
    example: `
    $try[
        $let[;1]
    ]
    $catch[
        $log[ 
            $env[catch_error]
        ]
    ]
`,
    code: (data: funcData, scope: Scope[]) => {
        const env = data.inside;
        const currentScope = scope[scope.length - 1];
        if (
            !env &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        ) {
            throw new TranspilerError(`${data.name}: ENV Not Provided.`);
        }
        const mainenv = env?.split(".")[0];

        if (
            !currentScope.env.includes(<string>mainenv) &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        ) {
            throw new TranspilerError(`${data.name}: ENV ${env} Not Found`);
        }
        const res = escapeResult(`${env}`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
