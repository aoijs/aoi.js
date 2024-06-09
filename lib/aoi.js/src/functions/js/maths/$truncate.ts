import AoiJSFunction from '../../../structures/AoiJSFunction.js';
import { escapeMathResult, parseResult } from '../../../util/transpilerHelpers.js';
import { TranspilerCustoms } from '../../../typings/enums.js';

const truncate = new AoiJSFunction()
	.setName('$truncate')
	.setType('getter')
	.setBrackets(true)
	.setOptional(false)
	.setField(
		{
			name: 'number',
			type: 'number',
			description: 'The number to truncate off',
			required: true,
		}
	)
	.setVersion('7.0.0')
	.setDefault(['void'])
	.setReturns('number')
	.setDescription('Returns the Truncate off value of the number')
	.setExample(`
		$truncate[1.22342] // returns 1
	`)
	truncate.setCode((data, scope, thisArg) => {
		const number = data.inside ?? '';
		const currentScope = scope[scope.length - 1];
		if (
			data.splits.length === 0 &&
			!currentScope.name.startsWith('$try_') &&
			!currentScope.name.startsWith('$catch_')
		) {
			throw new Error(`${data.name} requires at least 1 argument`);
		}

		if (!number)
			throw new Error(`${data.name} requires at least 1 argument`);

		let truncate =
			number.includes(TranspilerCustoms.FS) ||
			number.includes('__$DISCORD_DATA$__') ||
			number.includes(TranspilerCustoms.MFS)
				? parseResult(number.trim())
				: Number(number);

		truncate = thisArg.getResultString(() => Math.trunc('$0'), [truncate]);

		const res = escapeMathResult(`(${truncate})`);
		currentScope.update(res, data);

		return {
			code: res,
			scope,
		};
	},truncate);

export const $truncate = truncate.build();
	

		
