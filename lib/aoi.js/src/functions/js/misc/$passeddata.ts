import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { DISCORD_DATA } from '@aoi.js/utils/Constants/functions.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * access the data passed from parent command to the current command
 * @example
 * ```aoi
 * ---
 * name: passeddata
 * type: basic
 * ---
 * 
 * $log[$passeddata[username]] // logs the username passed from parent command
 * ```
 */
const $passeddata = new FunctionBuilder()
	.setName('$passeddata')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Any)
	.setFields([
		{
			name: 'passeddata',
			type: ReturnType.String,
			required: true,
			description: 'The data passed from parent command to the current command.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [passeddata] = thisArg.getParams(data);
		
		if (!passeddata && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'passeddata\' in function $passeddata',
				data,
			);
		}

		const escaped = escapeResult(
			`${DISCORD_DATA}.data?.${passeddata}`,
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $passeddata };