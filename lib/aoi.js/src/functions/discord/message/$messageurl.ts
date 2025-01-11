import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoiError from '@aoi.js/core/Error.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import DEFAULTS from '@aoi.js/utils/Constants/functions.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the message url
 * @example
 * ```aoi
 * ---
 * name: messageurl
 * type: basic
 * ---
 *
 * $messageurl // returns the message url
 * ```
 */
const $messageurl = new FunctionBuilder()
	.setName('$messageurl')
	.setBrackets(true)
	.setOptional(true)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.String)
	.setFields([
		{
			name: 'channelId',
			type: ReturnType.String,
			required: false,
			description: 'channelId to use',
		},
		{
			name: 'messageId',
			type: ReturnType.String,
			required: false,
			description: 'messageId to check',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const [messageId, channelId = DEFAULTS.channel('id')] = thisArg.getParams(data);
		const currentScope = thisArg.getCurrentScope(scopes);
		let result;

		if (
			!messageId &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoiError.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'messageId\' in function $messageexist.',
				data,
			);
		}

		let parsedChannelId = thisArg.parseData(channelId, ReturnType.String);
		if (!thisArg.isCorrectType(parsedChannelId, ReturnType.String) && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'channelId' in function $messageurl, got ${parsedChannelId} expected: String.`,
				data,
			);
		}

		let parsedMessageId = thisArg.parseData(messageId, ReturnType.String);

		if (!thisArg.isCorrectType(parsedMessageId, ReturnType.String) && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'messageId' in function $messageurl, got ${parsedMessageId} expected: String.`,
				data,
			);
		}

		result = thisArg.getResultString(
			async (discordData) =>
			  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
			  //@ts-expect-error
			  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
			  (await discordData.client.channels.cache.get('$0')?.messages.fetch('$1'))?.url ?? '',
			[parseString(channelId), parseString(messageId)],
		  );

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $messageurl };
