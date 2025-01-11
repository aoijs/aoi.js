import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { ErrorCode, FunctionType, ReturnType, TranspilerCustoms } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns a value and leaves that scope
 * @example
 * ```aoi
 * ---
 * name: return
 * type: basic
 * ---
 * 
 * $return[Hello World]
 * $log[This function will not be executed]
 * ```
 */
const $return = new FunctionBuilder()
	.setName('$return')
	.setBrackets(true)
	.setOptional(true)
	.setType(FunctionType.Function)
	.setReturns(ReturnType.Void)
	.setFields([
		{
			name: 'value',
			type: ReturnType.Any,
			required: false,
			description: 'The value to return.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [value] = thisArg.getParams(data);

		let parsedValue = thisArg.parseData(value, ReturnType.Any);

		if (!thisArg.isCorrectType(parsedValue, ReturnType.Any) && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid argument type 'value' in function $return, got ${value}, expected ReturnType.${ReturnType[ReturnType.Any]}`,
				data,
			);
		}

		if (typeof parsedValue === 'string' && ![TranspilerCustoms.FS, TranspilerCustoms.FFS, TranspilerCustoms.MFS].some(x => parsedValue.startsWith(x)) && ![TranspilerCustoms.FE, TranspilerCustoms.FFE, TranspilerCustoms.MFE].some(x => parsedValue.endsWith(x))) {
			parsedValue = parseString(parsedValue);
		}

		const escaped = escapeResult(
			thisArg.getResultString(
				() => {
					return '$0';
				},
				[parsedValue],
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $return };
