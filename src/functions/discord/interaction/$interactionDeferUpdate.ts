import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import {
    escapeResult,
} from "../../../util/transpilerHelpers.js";
export const $interactionDeferUpdate: FunctionData = {
    name: "$interactionDeferUpdate",
    brackets: false,
    optional: false,
    type: "setter",
    fields: [],
    description:
        "defers the interaction for updating from initial 3 seconds response time limit to 15 minutes",
    default: [],
    returns: "void",
    version: "7.0.0",
    example: `
        $interactionDeferUpdate // defers the interaction for updating the original message
    `,
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope.at(-1) as Scope;
        //code here

        const res = escapeResult(
            "await __$DISCORD_DATA$__.client.createInteractionResponse(__$DISCORD_DATA$__.interaction.id, __$DISCORD_DATA$__.interaction.token,6,undefined);",
        );

        currentScope.update(res, data);

        return {
            code: res,
            scope,
        };
    },
};
