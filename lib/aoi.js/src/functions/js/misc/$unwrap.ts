import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import type { IErr, IOk } from '@aoi.js/typings/interface.js';
import type { Safe } from '@aoi.js/typings/type.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * unwraps the wrapped output
 * @example
 * ```aoi
 * ---
 * name: unwrap
 * type: basic
 * ---
 * 
 * $let[a; $wrap[false;$return[1]]]
 * $unwrap[$get[a]] // 1
 * 
 * $let[b; $wrap[true;$throw[Error]]]
 * $log[$toString[$unwrap[$get[b]]]] // Error
 * ```
 */
const $unwrap = new FunctionBuilder()
	.setName('$unwrap')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Any)
	.setFields([
		{
			name: 'wrapped output',
			type: ReturnType.Object,
			required: true,
			description: 'The wrapped output to be unwrapped.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [wrappedOutput] = thisArg.getParams(data);

		const parsedWrappedOutput = thisArg.parseData(
			wrappedOutput,
			ReturnType.Object,
		);

		if (
			!thisArg.isCorrectType(parsedWrappedOutput, ReturnType.Object) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid argument type 'wrapped output' in function $unwrap, got ${wrappedOutput}, expected ReturnType.${ReturnType.Object}`,
				data,
			);
		}

		const escaped = escapeResult(
			thisArg.getResultString(
				() =>
					('$0' as unknown as Safe<unknown, Error>).success
						? ('$0' as unknown as IOk<unknown>).data
						: ('$0' as unknown as IErr<Error>).error,
				[parsedWrappedOutput],
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $unwrap };
