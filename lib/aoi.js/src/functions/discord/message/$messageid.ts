import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoiError from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the message id
 * @example
 * ```aoi
 * ---
 * name: messageId
 * type: basic
 * ---
 *
 * $messageId // returns the messageId
 * ```
 */
const $messageId = new FunctionBuilder()
	.setName('$messageId')
	.setBrackets(false)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.String)
	.setFields([])
	.setCode((data, scopes, thisArg) => {

		let resultString: string;

		resultString = thisArg.getResultString(
			(discordData) => discordData.message?.id,
		);

		const escaped = escapeResult(resultString);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $messageId };
