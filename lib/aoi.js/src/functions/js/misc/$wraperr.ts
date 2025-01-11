import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import type { IErr } from '@aoi.js/typings/interface.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * checks if the wrapped output is an error
 * @example
 * ```aoi
 * ---
 * name: wraperr
 * type: basic
 * ---
 * 
 * $let[a; $wrap[false;$throw[Error]]]
 * $wraperr[$get[a]] // true
 * ```
 */
const $wraperr = new FunctionBuilder()
	.setName('$wraperr')
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
				`Invalid argument type 'wrapped output' in function $wraperr, got ${wrappedOutput}, expected ReturnType.${ReturnType.Object}`,
				data,
			);
		}

		const escaped = escapeResult(
			thisArg.getResultString(
				() => !('$0' as unknown as IErr<Error>).success,
				[parsedWrappedOutput],
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $wraperr };
