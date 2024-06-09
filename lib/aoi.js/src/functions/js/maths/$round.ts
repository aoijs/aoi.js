import AoiJSFunction from '../../../structures/AoiJSFunction.js';
import { escapeMathResult, parseResult } from '../../../util/transpilerHelpers.js';
import { TranspilerCustoms } from '../../../typings/enums.js';

const round = new AoiJSFunction()
	.setName('$round')
	.setType('getter')
	.setBrackets(true)
	.setOptional(false)
	.setField(
		{
			name: 'number',
			type: 'number',
			description: 'The number to round off',
			required: true,
		},
		{
			name: 'decimal',
			type: 'number',
			description: 'The decimal to round off',
			required: false,
		}
	)
	.setVersion('7.0.0')
	.setDefault(['void'])
	.setReturns('number')
	.setDescription('Returns the Round off value of the number')
	.setExample(`
		$round[1;2] // returns 1.00
		$round[1.2;0] // returns 1
	`)
	round.setCode((data, scope, thisArg) => {
		const [number, decimal = '0'] = data.splits;
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

		let round =
			number.includes(TranspilerCustoms.FS) ||
			number.includes('__$DISCORD_DATA$__') ||
			number.includes(TranspilerCustoms.MFS)
				? parseResult(number.trim())
				: Number(number);
		const rounddecimal =
			decimal.includes(TranspilerCustoms.FS) ||
			decimal.includes('__$DISCORD_DATA$__') ||
			decimal.includes(TranspilerCustoms.MFS)
				? parseResult(decimal.trim())
				: Number(decimal);

	
         thisArg.getResultString( () => (('$0').toFixed('$1')), [round, rounddecimal] )


		const res = escapeMathResult(`(${round})`);
		currentScope.update(res, data);

		return {
			code: res,
			scope,
		};
	},round);

export const $round = round.build();
