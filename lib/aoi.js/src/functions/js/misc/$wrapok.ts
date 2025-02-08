import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import type { IOk } from '@aoi.js/typings/interface.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * checks if the wrapped output is an ok
 * @example
 * ```aoi
 * ---
 * name: wrapok
 * type: basic
 * ---
 * 
 * $let[a; $wrap[false;$return[1]]]
 * $wrapok[$get[a]] // true
 * ```
 */
const $wrapok = new FunctionBuilder()
	.setName('$wrapok')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Boolean)
	.setFields([
		{
			name: 'wrapped output',
			type: ReturnType.Object,
			required: true,
			description: 'The wrapped output to be checked.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [wrappedOutput] = thisArg.getParams(data);

		const parsedWrappedOutput = thisArg.parseData(wrappedOutput, ReturnType.Object);

		if (!thisArg.isCorrectType(parsedWrappedOutput, ReturnType.Object) && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid argument type 'wrapped output' in function $wrapok, got ${wrappedOutput}, expected ReturnType.${ReturnType.Object}`,
				data,
			);
		}

		const escaped = escapeResult(
			thisArg.getResultString(
				() => ('$0' as unknown as IOk<unknown>).success,
				[parsedWrappedOutput],
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $wrapok };
