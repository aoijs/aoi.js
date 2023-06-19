import { FunctionData, funcData, Scope } from "../../../index.js";
import { escapeFunctionResult, parseData, parseResult } from "../../../util/transpilerHelpers.js";

export const $toString: FunctionData = {
    name: "$toString",
    brackets: true,
    optional: false,
    type: "function_getter",
    fields: [
        {
            name: "data",
            type: "any",
            description: "The data to convert to string",
            required: true,
        },
    ],
    version: "7.0.0",
    default: [ "void"],
    returns: "string",
    description: "Checks if the text toString the search",
    example: `
        $toString[Hello World] // returns "Hello World"
        $toString[1] // returns "1"
        $toString[true] // returns "true"
        `,
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope[scope.length - 1];
        const value = <string>data.inside;
        const parsedValue = parseResult(parseData(value));
        if(!currentScope.functions.includes("function __$toString$__(value) {")){
            currentScope.functions += `
function __$toString$__(value) {
    if(typeof value === "object") return UTIL.inspect(value,{depth:0});
    return value.toString();
}
`;
        }
        if(!currentScope.packages.includes("const UTIL = await import(\"util\");")){
            currentScope.packages += `
const UTIL = await import("util");
`;
        }

        const res = escapeFunctionResult(`__$toString$__(${parsedValue})`);
        currentScope.update(res, data);

        return {
            code: res,
            scope: scope,
        };
    },
};
