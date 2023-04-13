import { parseString } from "../../..";
import { escapeResult } from "../../../util/transpilerHelpers.js";
export const $includes = {
    name: "$includes",
    brackets: true,
    optional: false,
    type: "getter",
    fields: [
        {
            name: "text",
            type: "string",
            required: true,
        },
        {
            name: "search",
            type: "string",
            required: true,
        },
    ],
    version: "7.0.0",
    default: ["void", "void"],
    returns: "boolean",
    description: "Checks if the text includes the search",
    code: (data, scope) => {
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
//# sourceMappingURL=$includes.js.map