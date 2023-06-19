import { FunctionData, funcData, Scope, parseString } from "../../../index.js";
import { escapeResult } from "../../../util/transpilerHelpers.js";

export const $includes: FunctionData = {
    name: "$includes",
    brackets: true,
    optional: false,
    type: "getter",
    fields: [
        {
            name: "text",
            type: "string",
            description: "The text to check",
            required: true,
        },
        {
            name: "search",
            type: "string",
            description: "The text to search for",
            required: true,
        },
    ],
    version: "7.0.0",
    default: ["void", "void"],
    returns: "boolean",
    description: "Checks if the text includes the search",
    example: `
        $includes[Hello World;Hello] // returns true
        $includes[Hello World;hello] // returns false
    `,
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope[scope.length - 1];
        const [text, search] = data.splits;
        const parsedText = parseString(text);
        const parsedSearch = parseString(search);
        const res = escapeResult(`${parsedText}.includes(${parsedSearch})`);
        currentScope.rest = currentScope.rest.replace(data.total, res);
        return {
            code: res,
            scope: scope,
        };
    },
};
