import { StringObject, parseStringObject } from "../../../index.js";
import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import {
    escapeResult,
} from "../../../util/transpilerHelpers.js";
export const $useComponent: FunctionData = {
    name: "$useComponent",
    brackets: true,
    optional: false,
    type: "function_getter",
    fields: [
        {
            name: "name",
            type: "string",
            description: "The name of the component to use",
            required: true,
        },
        {
            name: "data",
            type: "object",
            description: "The data to pass to the component",
            required: false,
        },
    ],
    description: "use a component in the code",
    default: ["void", "undefined"],
    returns: "any",
    version: "7.0.0",
    example: `
        $useComponent[hello;{hello: world}] // executes the component hello with the data {hello: world}
    `,
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope.at(-1) as Scope;
        //code here

        const [name,...rest] = data.splits;
        const actualRestData = rest.join(";");

        const currentObj = new StringObject("{");
        currentObj.addEnd("}");

        const obj = parseStringObject(actualRestData, currentObj);

        const res= escapeResult(`
         ${currentScope.client.returnComponent(name,obj.solve())}
          `
        );

        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
