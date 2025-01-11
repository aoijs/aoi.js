import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoiError from '@aoi.js/core/Error.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * slices a message
 * @example
 * ```aoi
 * ---
 * name: messageslice
 * type: basic
 * ---
 *
 * $messageslice // slices a message
 * ```
 */
const $messageslice = new FunctionBuilder()
	.setName('$messageslice')
	.setBrackets(true)
	.setOptional(true)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.String)
	.setFields([
		{
			name: 'from',
			type: ReturnType.Number,
			required: false,
			description: 'where to start',
		},
		{
			name: 'to',
			type: ReturnType.String,
			required: false,
			description: 'where to end',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const [from, to] = thisArg.getParams(data);
		const currentScope = thisArg.getCurrentScope(scopes);
		let result;

		let parsedFrom = thisArg.parseData(from, ReturnType.Number);
		let parsedTo = thisArg.parseData(to, ReturnType.Number);

		if (!thisArg.isCorrectType(parsedFrom, ReturnType.Number) && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'from' in function $messageslice, got ${parsedFrom} expected: number.`,
				data,
			);
		}

		if (!thisArg.isCorrectType(parsedTo, ReturnType.Number) && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'messageId' in function $messageslice, got ${parsedTo} expected: number.`,
				data,
			);
		}

		result = thisArg.getResultString(
			async (discordData) =>
			  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
			  //@ts-expect-error
				discordData.args?.slice('$0', '$1').join(' ') ?? '',
			[parsedFrom.toString(), parsedTo.toString()],
		  );

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $messageslice };
