import { FunctionData } from "../../../typings/interfaces.js";
import {
    escapeResult,
} from "../../../util/transpilerHelpers.js";

export const $authorId: FunctionData = {
    name: "$authorId",
    type: "getter",
    brackets: false,
    optional: false,
    fields: [],
    version: "7.0.0",
    default: [],
    returns: "bigint",
    description: "Returns the id of the author",
    example: "author id is `$authorId`",
    code: (data, scope) => {
        const currentScope = scope[scope.length - 1];

        const authorId = "__$DISCORD_DATA$__.author?.id";

        const res = escapeResult(`(${authorId})`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
