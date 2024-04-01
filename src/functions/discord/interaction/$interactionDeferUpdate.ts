/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-constant-condition */
import { InteractionResponseTypes, Snowflake } from "zeneth";
import AoiJSFunction from "../../../structures/AoiJSFunction.js";
import { escapeResult } from "../../../util/transpilerHelpers.js";

const interactionDeferUpdate = new AoiJSFunction()
    .setName("$interactionDeferUpdate")
    .setType("setter")
    .setBrackets(false)
    .setOptional(false)
    .setFields([])
    .setVersion("7.0.0")
    .setDefault([])
    .setReturns("void")
    .setDescription(
        "defers the interaction update from initial 3 seconds response time limit to 15 minutes",
    ).setExample(`
        $interactionDeferUpdate // defers the interaction
    `);

interactionDeferUpdate.setCode((data, scope, thisArg) => {
    const currentScope = thisArg.getCurrentScope(scope);
    //code here

    const resultString = thisArg.getResultString(
        async (discord) =>
            await discord.client.createInteractionResponse(
                discord.interaction?.id as Snowflake,
                discord.interaction?.token as string,
                //@ts-ignore
                "$0",
                undefined,
            ),
        [InteractionResponseTypes.DeferredUpdateMessage],
    );

    const res = escapeResult(resultString);
    currentScope.update(res, data);

    return {
        code: res,
        scope,
    };
}, interactionDeferUpdate);

export const $interactionDeferUpdate = interactionDeferUpdate.build();
