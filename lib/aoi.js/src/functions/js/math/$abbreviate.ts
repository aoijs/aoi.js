import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { TranspilerError } from '@aoi.js/core/Error.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

function _abbreviate(number: number, decimal: number) {
	const SI_SYMBOLS = [
		'',
		'K',
		'M',
		'B',
		'T',
		'Qa',
		'Qi',
		'Sx',
		'Sp',
		'Oc',
		'No',
		'Dc',
		'Udc',
		'Ddc',
		'Tdc',
		'Qadc',
		'Qidc',
		'Sxdc',
		'Spdc',
		'Ocdc',
		'Nmdc',
		'Vg',
		'Uvg',
		'Dvg',
		'Tvg',
		'Qavg',
		'Qvg',
		'Sxvg',
		'Spvg',
		'Ovg',
		'Nvg',
		'Tg',
	] as const;

	const tier = Math.floor(Math.log10(Math.abs(number || 1)) / 3);
	if (tier === 0) return number;
	const suffix = SI_SYMBOLS[tier];
	const scale = Math.pow(10, tier * 3);
	const scaled = number / scale;
	return scaled.toFixed(decimal) + suffix;
}
/**
 * Returns the abbreviation of provided value to decimal place
 * @example
 * ```aoi
 * ---
 * name: abbreviate
 * type: basic
 * ---
 *
 * $abbreviate[20000;2] // returns 2.00K
 * ```
 */

const $abbreviate = new FunctionBuilder()
	.setName('$abbreviate')
	.setBrackets(true)
	.setOptional(false)
	.setFields([
		{
			name: 'number',
			type: ReturnType.Number,
			required: true,
			description: 'The number to abbreviate.',
		},
		{
			name: 'decimals',
			type: ReturnType.Number,
			required: false,
			description: 'The number of decimals to keep. Defaults to 2.',
		},
	])
	.setReturns(ReturnType.String)
	.setType(FunctionType.FunctionGetter)
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [number, decimals] = thisArg.getParams(data);

		const parsedDecimal = Number(decimals ?? 2);
		const parsedNumber = Number(number);

		if (
			isNaN(parsedNumber) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw TranspilerError.CompileError(
				`Provided number is not a number, received ${number}`,
				data,
			);
		}

		if (
			isNaN(parsedDecimal) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw TranspilerError.CompileError(
				`Provided number is not a valid decimal position, received ${decimals}`,
				data,
			);
		}

		thisArg.addFunction(currentScope, _abbreviate);
		const resultString = thisArg.getResultString(
			// @ts-expect-error - intended behaviour
			() => _abbreviate('$0', '$1'),
			[parsedNumber.toString(), parsedDecimal.toString()],
		);

		const result = escapeResult(resultString);

		return {
			code: result,
			scope: scopes,
		};
	})
	.build();

export { $abbreviate };
