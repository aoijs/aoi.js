import AoiJSFunction from '../../../structures/AoiJSFunction.js';
import { escapeMathResult, parseResult } from '../../../util/transpilerHelpers.js';
import { TranspilerCustoms } from '../../../typings/enums.js';

const sum = new AoiJSFunction()
	.setName('$sum')
	.setType('getter')
	.setBrackets(true)
	.setOptional(false)
	.setField(
		{
			name: 'numbers',
			type: 'number',
			description: 'The numbers to add',
			required: true,
		}
	)
	.setVersion('7.0.0')
	.setDefault(['void'])
	.setReturns('number')
	.setDescription('Returns the sum of the numbers')
	.setExample(`
		$sum[1;2] // returns 3
		$sum[7;4;3] // returns 14
	`)
	.setCode((data, scope, thisArg) => {
		const numbers = data.splits;
		const currentScope = scope[scope.length - 1];
		if (
			data.splits.length === 0 &&
			!currentScope.name.startsWith('$try_') &&
			!currentScope.name.startsWith('$catch_')
		) {
			throw new Error(`${data.name} requires at least 1 argument`);
		}

		const sum = numbers
			.map((x) =>
				x.includes(TranspilerCustoms.FS) ||
				x.includes('__$DISCORD_DATA$__') ||
				x.includes(TranspilerCustoms.MFS)
					? parseResult(x.trim())
					: Number(x),
			)
			.join('+');

		const res = escapeMathResult(`(${sum})`);
		currentScope.update(res, data);

		return {
			code: res,
			scope,
		};
	});

export const $sum = sum.build();
