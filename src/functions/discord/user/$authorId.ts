import { TranspilerError } from "../../../core/error.js";
import { TranspilerCustoms } from "../../../typings/enums.js";
import { FunctionData } from "../../../typings/interfaces.js";
import {
    escapeMathResult,
    escapeResult,
    parseResult,
} from "../../../util/transpilerHelpers.js";

export const $authorId: FunctionData = {
    name: "$authorId",
    type: "getter",
    brackets: false,
    optional: false,
    fields: [],
    version: "7.0.0",
    default: [],
    returns: "number",
    description: "Returns the id of the author",
    code: (data, scope) => {
        const currentScope = scope[scope.length - 1];

        const authorId = `__$DISCORD_DATA$__.author?.id`;

        const res = escapeResult(`(${authorId})`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
