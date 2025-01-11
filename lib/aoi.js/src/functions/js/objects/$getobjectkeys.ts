import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Gets the keys of an object
 * @example
 * ```aoi
 * ---
 * name: getObjectKeys
 * type: basic
 * ---
 * 
 * $createObject[object;\{key:value\}]
 * $toString[$getObjectKeys[object]] // key
 * ```
 */
const $getobjectkeys = new FunctionBuilder()
	.setName('$getobjectkeys')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Array)
	.setFields([
		{
			name: 'objectName',
			type: ReturnType.String,
			required: true,
			description: 'The name of the object to get the keys from.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [objectName] = thisArg.getParams(data);

		if (!objectName && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'objectName\' in function $getobjectkeys',
				data,
			);
		}

		const escaped = escapeResult(
			thisArg.getResultString(() => Object.keys('$0'), [objectName]),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $getobjectkeys };
