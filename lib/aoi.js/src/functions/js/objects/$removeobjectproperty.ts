import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult, escapeVars } from '@aoi.js/utils/Helpers/core.js';

/**
 * Removes a property from an object
 * @example
 * ```aoi
 * ---
 * name: removeObjectProperty
 * type: basic
 * ---
 * 
 * $createObject[object;\{key:value\}]
 * $removeObjectProperty[object;key]
 * $getObject[object] // \{\}
 * ```
 */
const $removeobjectproperty = new FunctionBuilder()
	.setName('$removeobjectproperty')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Any)
	.setFields([
		{
			name: 'objectName',
			type: ReturnType.String,
			required: true,
			description: 'The name of the object to get the property from.',
		},
		{
			name: 'propertyName',
			type: ReturnType.String,
			required: true,
			description: 'The name of the property to remove.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [objectName, propertyName] = thisArg.getParams(data);

		if (!objectName && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'objectName\' in function $removeobjectproperty',
				data,
			);
		}

		if (!propertyName && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'propertyName\' in function $removeobjectproperty',
				data,
			);
		}

		if (!currentScope.objects[objectName] && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.ObjectDoesNotExist,
				`Object '${objectName}' does not exist.`,
				data,
			);
		}

		const escaped = escapeResult(
			`delete ${escapeVars(objectName)}.${propertyName}`,
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $removeobjectproperty };
