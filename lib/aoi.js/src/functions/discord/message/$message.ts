import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoiError from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the message content
 * @example
 * ```aoi
 * ---
 * name: message
 * type: basic
 * ---
 * 
 * $message // returns the whole message
 * $message[1] // returns the first argument
 * ```
 */
const $message = new FunctionBuilder()
	.setName('$message')
	.setBrackets(true)
	.setOptional(true)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.String)
	.setFields([
		{
			name: 'index',
			type: ReturnType.Number,
			required: false,
			description:
				'The index of the argument to get. If not provided, it will return the whole message.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [index] = thisArg.getParams(data);

		let resultString: string;
		if (!index) {
			resultString = thisArg.getResultString(
				(discord) => discord.args?.join(' '),
			);
		} else {
			if ((isNaN(Number(index)) || Number(index) < 0 || !Number.isInteger(Number(index))) && !thisArg.canSuppressAtComp(data, currentScope)) {
				throw AoiError.FunctionError(ErrorCode.InvalidArgumentType, `Expected a positive integer for index, received ${index}.`, data);
			}

			resultString = thisArg.getResultString(
				(discord) => discord.args?.['$0' as unknown as number],
				[index],
			);
		}

		const escaped = escapeResult(resultString);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $message };
