import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import AoiError from '@aoi.js/core/Error.js';
import { FunctionType, ReturnType, ErrorCode } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the userId of the user.
 * @example
 * ```aoi
 * ---
 * name: findUser
 * type: basic
 * ---
 *
 * $findUser[$authorid] // returns the userId of the current user
 * $findUser[supremesupreme] // returns the userId of the specified user
 * ```
 */

const $finduser = new FunctionBuilder()
	.setName('$findUser')
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.String | ReturnType.Void)
	.setBrackets(true)
	.setOptional(true)
	.setFields([
		{
			name: 'userResolver',
			type: ReturnType.String,
			required: true,
			description: 'User to search for',
		},
		{
			name: 'returnSelf',
			type: ReturnType.Void,
			required: false,
			description: 'Returns author id',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		let [userResolver, returnSelf = 'false'] = thisArg.getParams(data);
		let parsedReturnSelf = thisArg.parseData(
			returnSelf,
			ReturnType.Boolean,
		);

		userResolver = userResolver.replace(/[\\<>@!]/g, '').trim();

		let res;
		if (!userResolver && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoiError.FunctionError(
				ErrorCode.MissingParameter,
				'userResolver not found.',
				data,
			);
		} else {
			res = thisArg.getResultString(
				async (discordData) =>
					discordData.client.users.cache.find(
						(user) => user.id == '$0' || user.username == '$0',
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						// eslint-disable-next-line no-constant-condition
					)?.id ?? ('$1' ? discordData.author?.id : ''),
				[parseString(userResolver), parsedReturnSelf.toString()],
			);
		}

		const escaped = escapeResult(res);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $finduser };
