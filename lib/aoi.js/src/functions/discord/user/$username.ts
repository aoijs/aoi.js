import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';
import AoiError from '@aoi.js/core/Error.js';

/**
 * Returns the username of the user.
 * @example
 * ```aoi
 * ---
 * name: username
 * type: basic
 * ---
 *
 * $username // returns the username of the current user
 * $username[userid] // returns the username of the specified user
 * ```
 */

const $username = new FunctionBuilder()
	.setName('$username')
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.String | ReturnType.Void)
	.setBrackets(true)
	.setOptional(true)
	.setFields([
		{
			name: 'userId',
			type: ReturnType.String,
			required: false,
			description: 'UserId to search for',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [userId] = thisArg.getParams(data);

		let res;
		if (!userId) {
			res = thisArg.getResultString(
				(discordData) => discordData.author?.username,
			);
		} else {
			let parsedUserId = thisArg.parseData(userId, ReturnType.Number);

			if (!thisArg.isCorrectType(parsedUserId, ReturnType.Number) && !thisArg.canSuppressAtComp(data, currentScope)) {
				throw AoiError.FunctionError(
					ErrorCode.InvalidArgumentType,
					`Invalid type for parameter 'userid' in function $username, got ${parsedUserId} expected: number.`,
					data,
				);
			}

			res = thisArg.getResultString(
				async (discordData) =>
					(await discordData.client.users.fetch('$0'))?.username,
				[parseString(userId)],
			);
		}

		const escaped = escapeResult(res);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $username };
