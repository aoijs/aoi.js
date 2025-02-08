import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import {
	ErrorCode,
	FunctionType,
	ReturnType,
	TranspilerCustoms,
} from '@aoi.js/typings/enum.js';
import {
	escapeMathResult,
	escapeResult,
	parseResult,
} from '@aoi.js/utils/Helpers/core.js';
import { nthRoot } from '@aoi.js/utils/Helpers/functions.js';

/**
 * Returns the nth root of a number
 * @example
 * ```aoi
 * ---
 * name: root
 * type: basic
 * ---
 * 
 * $root[8;3] // Returns 2
 * $root[27;3] // Returns 3
 * ```
 */
const $root = new FunctionBuilder()
	.setName('$root')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.FunctionGetter)
	.setReturns(ReturnType.Number)
	.setFields([
		{
			name: 'numbers',
			type: ReturnType.Number | ReturnType.Array,
			required: true,
			description: 'The numbers to get nth root of.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const numbers = thisArg.getParams(data);

		if (!numbers.length && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing numbers to calculate root.',
				data,
			);
		}

		if (!thisArg.hasFunction(currentScope, nthRoot.name)) {
			thisArg.addFunction(currentScope, nthRoot);
		}

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
				ans = `nthRoot(${a}, ${b})`;
				i += 1;
				a = ans;
				b = root[i - 1];
			}

			return ans;
		};

		const escaped = escapeMathResult(`(${rec(root[0], root[1])})`);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $root };
