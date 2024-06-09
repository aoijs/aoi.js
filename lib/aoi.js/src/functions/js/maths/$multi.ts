import AoiJSFunction from '../../../structures/AoiJSFunction.js';
import { escapeMathResult, parseResult } from '../../../util/transpilerHelpers.js';
import { TranspilerCustoms } from '../../../typings/enums.js';

const multi = new AoiJSFunction()
	.setName('$multi')
	.setType('getter')
	.setBrackets(true)
	.setOptional(false)
	.setField(
		{
			name: 'numbers',
			type: 'number',
			description: 'The numbers to multiply',
			required: true,
		}
	)
	.setVersion('7.0.0')
	.setDefault(['void'])
	.setReturns('number')
	.setDescription('Returns the multiplication of the numbers')
	.setExample(`
		$multi[1;2] // returns 2
		$multi[1;2;3] // returns 6
	`)
	multi.setCode((data, scope, thisArg) => {
		const numbers = data.splits;
		const currentScope = scope[scope.length - 1];
		if (
			data.splits.length === 0 &&
			!currentScope.name.startsWith('$try_') &&
			!currentScope.name.startsWith('$catch_')
		) {
			throw new Error(`${data.name} requires at least 1 argument`);
		}

		const multi = numbers
			.map((x) =>
				x.includes(TranspilerCustoms.FS) ||
				x.includes('__$DISCORD_DATA$__') ||
				x.includes(TranspilerCustoms.MFS)
					? parseResult(x.trim())
					: Number(x),
			)
			.join('*');

		const res = escapeMathResult(`(${multi})`);
		currentScope.update(res, data);
		return {
			code: res,
			scope,
		};
	},multi);

export const $multi = multi.build();
	
