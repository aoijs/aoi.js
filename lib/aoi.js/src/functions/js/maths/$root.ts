import AoiJSFunction from '../../../structures/AoiJSFunction.js';
import { escapeMathResult, escapeResult, parseResult } from '../../../util/transpilerHelpers.js';
import { TranspilerCustoms } from '../../../typings/enums.js';

const root = new AoiJSFunction()
	.setName('$root')
	.setType('getter')
	.setBrackets(true)
	.setOptional(false)
	.setField(
		{
			name: 'numbers',
			type: 'number',
			description: 'The numbers to get the root from',
			required: true,
		}
	)
	.setVersion('7.0.0')
	.setDefault(['void'])
	.setReturns('number')
	.setDescription('Returns the root of the numbers')
	.setExample(`
		$root[4;2] // returns 2
		$root[27;3] // returns 3

		$root[625;4;2] // returns 5
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

		if (!currentScope.functions.includes('function nthRoot')) {
			currentScope.functions += (`function nthRoot(x, n) {
			
                function nthRoot(x, n) {
                 try {
            var negate = n % 2 == 1 && x < 0;
            if (negate) x = -x;
         var possible = Math.pow(x, 1 / n);
         n = Math.pow(possible, n);
        if (Math.abs(x - n) < 1 && (x > 0 == n > 0)) return negate ? -possible : possible;
        } catch (e) {}
        }

thisArg.updateFunction(currentScope, nthRoot, [])


		const root = numbers.map((x) =>
			x.includes(TranspilerCustoms.FS) ||
			x.includes('__$DISCORD_DATA$__') ||
			x.includes(TranspilerCustoms.MFS)
				? parseResult(x.trim())
				: Number(x),
		);
		const rec = (a: string | number, b: string | number) => {
			let ans = '';
			let i = 2;
			while (i <= root.length) {
				ans = thisArg.getResultString(() => nthRoot('$0','$1'), [ a, b])
				i += 1;
				a = ans;
				b = root[i - 1];
			}

			return ans;
		};

		const res = escapeResult(escapeMathResult(`(${rec(root[0], root[1])})`));
		currentScope.update(res, data);

		return {
			code: res,
			scope,
		};
	});

export const $root = root.build();
