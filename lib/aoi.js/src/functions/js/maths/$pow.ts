import { TranspilerError } from '../../../core/error.js';
import { TranspilerCustoms } from '../../../typings/enums.js';
import { type FunctionData } from '../../../typings/interfaces.js';
import {
	escapeMathResult,
	parseResult,
} from '../../../util/transpilerHelpers.js';

export const $pow: FunctionData = {
	name: '$pow',
	type: 'getter',
	brackets: true,
	optional: false,
	fields: [
		{
			name: 'numbers',
			type: 'number',
			description: 'The numbers to get the power from',
			required: true,
		},
	],
	version: '7.0.0',
	default: ['void'],
	returns: 'number',
	description: 'Returns the power of the numbers',
	example: `
    $pow[1;2] // returns 1
    $pow[7;4;3] // returns 2401
    `,
	code: (data, scope) => {
		const numbers = data.splits;
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

		const pow = numbers
			.map((x) =>
				x.includes(TranspilerCustoms.FS) ||
                x.includes('__$DISCORD_DATA$__') ||
                x.includes(TranspilerCustoms.MFS)
					? parseResult(x.trim())
					: Number(x),
			)
			.join('**');

		const res = escapeMathResult(`(${pow})`);
		currentScope.update(res, data);
		return {
			code: res,
			scope,
		};
	},
};
