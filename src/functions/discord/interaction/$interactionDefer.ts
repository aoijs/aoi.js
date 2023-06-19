import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import {
    escapeResult,
} from "../../../util/transpilerHelpers.js";
export const $interactionDefer: FunctionData = {
    name: "$interactionDefer",
    brackets: true,
    optional: true,
    type: "setter",
    fields: [
        {
            name: "ephermal",
            type: "string",
            description: "Whether the interaction should be ephermal or not",
            required: false,
        },
    ],
    description:
        "defers the interaction from initial 3 seconds response time limit to 15 minutes",
    default: ["false"],
    returns: "void",
    version: "7.0.0",
    example: `
        $interactionDefer // defers the interaction

        $interactionDefer[true] // defers the interaction and makes it ephemeral
    `,
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope.at(-1) as Scope;
        //code here

        const ephemeral = data.inside ?? "false";

        const res = escapeResult(
            `await __$DISCORD_DATA$__.client.createInteractionResponse(__$DISCORD_DATA$__.interaction.id, __$DISCORD_DATA$__.interaction.token,5,{
                flags: ${ephemeral === "true" ? 64 : 0}
            });`,
        );

        currentScope.update(res, data);

        return {
            code: res,
            scope,
        };
    },
};
