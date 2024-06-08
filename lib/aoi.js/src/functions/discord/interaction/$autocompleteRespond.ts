/* eslint-disable @typescript-eslint/ban-ts-comment */
import { InteractionResponseTypes, type Snowflake } from 'zeneth';
import { StringObject, parseStringObject } from '../../../index.js';
import AoiJSFunction from '../../../structures/AoiJSFunction.js';
import { escapeResult } from '../../../util/transpilerHelpers.js';

const autocomplete = new AoiJSFunction()
	.setName('$autocompleteRespond')
	.setType('setter')
	.setBrackets(true)
	.setOptional(true)
	.setFields([
		{
			name: 'options',
			type: 'array  | object',
			description: 'The options to respond with',
			required: true,
		},
	])
	.setVersion('7.0.0')
	.setDefault(['void'])
	.setReturns('void')
	.setDescription(
		'responds to the autocomplete interaction with the provided options',
	).setExample(`
        $autocompleteRespond[{
            name: "Hello World",
            value: "helloworld"
        };{
            name: "Hello World 2",
            value: "helloworld2"
        }] // responds to the autocomplete interaction with the provided options (object)

        $autocompleteRespond[Hello World;helloworld;Hello World 2;helloworld2] // responds to the autocomplete interaction with the provided options (array)
    `);

autocomplete.setCode((data, scope, thisArg) => {
	const currentScope = thisArg.getCurrentScope(scope);
	const opts = thisArg.getParams(data);
	const options = [];
	let i = 0;
	while (i < opts.length) {
		const opt = opts[i].trim();
		if (opt.startsWith('{') && opt.endsWith('}')) {
			const currentObj = new StringObject('{');
			currentObj.addEnd('}');

			const obj = parseStringObject(opt, currentObj);
			options.push(obj.solve());
			i += 1;
		} else {
			const name = opt;
			const value = opts[i + 1];
			options.push(`{name: "${name}", value: "${value}" }`);
			i += 2;
		}
	}

	const resultString = thisArg.getResultString(
		async (discord) =>
			discord.client.createInteractionResponse(
				discord.interaction?.id!,
				discord.interaction?.token!,
				//@ts-expect-error
				'$0',
				{
					choices: ['$1'] as any,
				},
			),
		[InteractionResponseTypes.ApplicationCommandAutocompleteResult.toString(), options.join(',\n')],
	);

	const res = escapeResult(resultString);
	currentScope.update(res, data);

	return {
		code: res,
		scope,
	};
}, autocomplete);

export const $autocompleteRespond = autocomplete.build();
