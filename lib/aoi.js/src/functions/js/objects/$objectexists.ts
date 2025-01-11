import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import {
	ErrorCode,
	FunctionType,
	ReturnType,
	TranspilerCustoms,
} from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Checks if an object exists
 * @example
 * ```aoi
 * ---
 * name: objectExists
 * type: basic
 * ---
 * 
 * $createObject[object;\{key:value\}]
 * $objectExists[object] // true
 * ```
 */
const $objectexists = new FunctionBuilder()
	.setName('$objectexists')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Boolean)
	.setFields([
		{
			name: 'objectName',
			type: ReturnType.String,
			required: true,
			description: 'The name of the object to create.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);

		const [objectName] = thisArg.getParams(data);

		if (!objectName && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'objectName\' in function $objectexists',
				data,
			);
		}

		let res: string;
		
		if (
			[TranspilerCustoms.FS, TranspilerCustoms.FFS].some((x) =>
				objectName.startsWith(x),
			) ||
			objectName.includes('__$DISCORD_DATA$__')
		) {
			res = thisArg.getResultString(
				() =>
					(() => {
						try {
							return typeof '$0' === 'object';
						} catch {
							return false;
						}
					})(),
				[objectName],
			);
		} else {
			res = (!!currentScope.objects[objectName]).toString();
		}

		const escaped = escapeResult(res);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $objectexists };
