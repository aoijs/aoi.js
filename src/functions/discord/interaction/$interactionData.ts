import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import {
    escapeResult,
} from "../../../util/transpilerHelpers.js";
export const $interactionData: FunctionData = {
    name: "$interactionData",
    brackets: true,
    optional: true,
    type: "getter",
    fields: [
        {
            name: "property",
            type: "string",
            required: true,
        },
    ],
    description: "gets the interaction data",
    default: ["void"],
    returns: "any",
    version: "7.0.0",
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope.at(-1) as Scope;
        //code here
        const property = data.inside;

        const res = escapeResult(
            !property?.trim()
                ? "__$Discord_Data$__.interaction"
                : `__$Discord_Data$__.interaction?.${property}`,
        );

        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
