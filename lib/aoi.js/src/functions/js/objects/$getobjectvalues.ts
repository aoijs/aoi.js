import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Gets the values of an object
 * @example
 * ```aoi
 * ---
 * name: getObjectValues
 * type: basic
 * ---
 * 
 * $createObject[object;\{key:value\}]
 * $toString[$getObjectValues[object]] // value
 * ```
 */
const $getobjectvalues = new FunctionBuilder()
	.setName('$getobjectvalues')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Array)
	.setFields([
		{
			name: 'objectName',
			type: ReturnType.String,
			required: true,
			description: 'The name of the object to get the values from.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [objectName] = thisArg.getParams(data);

		if (!objectName && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'objectName\' in function $getobjectvalues',
				data,
			);
		}

		const escaped = escapeResult(
			thisArg.getResultString(() => Object.values('$0'), [objectName]),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $getobjectvalues };
