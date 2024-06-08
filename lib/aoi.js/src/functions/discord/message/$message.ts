import { type FunctionData } from '../../../typings/interfaces.js';
import { escapeResult } from '../../../util/transpilerHelpers.js';

export const $message: FunctionData = {
	name: '$message',
	type: 'getter',
	brackets: true,
	optional: true,
	fields: [
		{
			name: 'argsIndex',
			description: 'The index of the argument',
			type: 'number',
			required: false,
		},
	],
	version: '7.0.0',
	default: ['all'],
	returns: 'string',
	description: 'Returns the author\'s message',
	example: `
        $message // returns the author's message

        $message[1] // returns the first argument
        `,
	code: (data, scope) => {
		const currentScope = scope[scope.length - 1];
		const argsIndex = data.inside;
		const message = argsIndex
			? `__$DISCORD_DATA$__.args?.[${argsIndex}]`
			: '__$DISCORD_DATA$__.args?.join(\' \')';

		const res = escapeResult(`(${message})`);
		currentScope.update(res, data);
		return {
			code: res,
			scope,
		};
	},
};
