/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-constant-condition */
import { InteractionResponseTypes, MessageFlags, type Snowflake } from 'zeneth';
import AoiJSFunction from '../../../structures/AoiJSFunction.js';
import { escapeResult } from '../../../util/transpilerHelpers.js';

const interactionDefer = new AoiJSFunction()
	.setName('$interactionDefer')
	.setType('setter')
	.setBrackets(true)
	.setOptional(true)
	.setFields([
		{
			name: 'ephermal',
			type: 'string',
			description: 'Whether the interaction should be ephermal or not',
			required: false,
		},
	])
	.setVersion('7.0.0')
	.setDefault(['false'])
	.setReturns('void')
	.setDescription(
		'defers the interaction from initial 3 seconds response time limit to 15 minutes',
	).setExample(`
        $interactionDefer // defers the interaction

        $interactionDefer[true] // defers the interaction and makes it ephemeral
    `);

interactionDefer.setCode((data, scope, thisArg) => {
	const currentScope = thisArg.getCurrentScope(scope);
	//code here

	const ephemeral = data.inside ?? 'false';

	const resultString = thisArg.getResultString(
		async (discord) =>
			discord.client.createInteractionResponse(
				discord.interaction?.id!,
				discord.interaction?.token!,
				// @ts-ignore
				'$0' as unknown as InteractionResponseTypes,
				{
					flags: '$1' ? '$2' : 0,
				},
			),
		[
			InteractionResponseTypes.DeferredChannelMessageWithSource.toString(),
			ephemeral,
			MessageFlags.Ephemeral.toString(),
		],
	);

	const res = escapeResult(resultString);
	currentScope.update(res, data);

	return {
		code: res,
		scope,
	};
}, interactionDefer);

export const $interactionDefer = interactionDefer.build();
