import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult, escapeVars } from '@aoi.js/utils/Helpers/core.js';
import type util from 'node:util';

/**
 * Gets an object
 * @example
 * ```aoi
 * $createObject[object;\{key:value\}]
 * $getObject[object] // \{key:value\}
 * ```
 */
const $getobject = new FunctionBuilder()
	.setName('$getobject')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.String)
	.setFields([
		{
			name: 'objectName',
			type: ReturnType.String,
			required: true,
			description: 'The name of the object to get.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [objectName] = thisArg.getParams(data);

		if (!objectName && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'objectName\' in function $getobject',
				data,
			);
		}

		if (
			!currentScope.objects[objectName] &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.ObjectDoesNotExist,
				`Object '${objectName}' does not exist.`,
				data,
			);
		}

		if (!currentScope.hasPkg('UTIL')) {
			currentScope.addPkg(
				'UTIL',
				'const UTIL = await import("node:util")',
			);
		}

		const UTIL = thisArg.as<typeof util>('UTIL');

		const escaped = escapeResult(
			thisArg.getResultString(
				() => UTIL.inspect('$0', { depth: null }),
				[escapeVars(objectName)],
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $getobject };
