import { TranspilerError } from '../../../core/error.js';
import { TranspilerCustoms } from '../../../typings/enums.js';
import { type FunctionData } from '../../../typings/interfaces.js';
import {
	escapeMathResult,
	parseResult,
} from '../../../util/transpilerHelpers.js';

export const $truncate: FunctionData = {
	name: '$truncate',
	type: 'getter',
	brackets: true,
	optional: false,
	fields: [
		{
			name: 'number',
			type: 'number',
			description: 'The number to truncate off',
			required: true,
		},
	],
	version: '7.0.0',
	default: ['void'],
	returns: 'number',
	description: 'Returns the Truncate off value of the number',
	example: `
    $truncate[1.22342] // returns 1
`,
	code: (data, scope) => {
		const number = data.inside ?? '';
		const currentScope = scope[scope.length - 1];
		if (
			data.splits.length === 0 &&
            !currentScope.name.startsWith('$try_') &&
            !currentScope.name.startsWith('$catch_')
		) {
			throw new TranspilerError(
				`${data.name} requires at least 1 argument`,
			);
		}

		if (!number)
			throw new TranspilerError(
				`${data.name} requires at least 1 argument`,
			);
		let truncate =
            number.includes(TranspilerCustoms.FS) ||
            number.includes('__$DISCORD_DATA$__') ||
            number.includes(TranspilerCustoms.MFS)
            	? parseResult(number.trim())
            	: Number(number);

		truncate = `(Math.trunc(${truncate}))`;

		const res = escapeMathResult(`(${truncate})`);
		currentScope.update(res, data);
		return {
			code: res,
			scope,
		};
	},
};
