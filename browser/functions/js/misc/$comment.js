import { escapeResult } from "../../../util/transpilerHelpers.js";
export const $comment = {
    name: "$comment",
    type: "scope",
    brackets: true,
    optional: false,
    version: "7.0.0",
    fields: [
        {
            name: "comment",
            type: "string",
            required: true,
        },
    ],
    default: ["void"],
    returns: "void",
    description: "Converts provided code to a comment",
    code: (data, scope) => {
        const comment = data.inside;
        const currentScope = scope[scope.length - 1];
        const res = escapeResult(`/*${comment}*/`);
        currentScope.update(res, data);
        return {
            code: res,
            scope: scope,
            data: data,
        };
    },
};
//# sourceMappingURL=$comment.js.map