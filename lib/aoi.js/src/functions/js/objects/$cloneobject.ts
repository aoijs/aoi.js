import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult, escapeVars } from '@aoi.js/utils/Helpers/core.js';

/**
 * Clones an object
 * @example
 * ```aoi
 * ---
 * name: cloneObject
 * type: basic
 * ---
 *
 * $createObject[object;\{key:value\}]
 * $cloneObject[object;newObject]
 * $getObject[newObject] // \{key:value\}
 * ```
 */
const $cloneobject = new FunctionBuilder()
	.setName('$cloneobject')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Setter)
	.setReturns(ReturnType.Void)
	.setFields([
		{
			name: 'objectName',
			type: ReturnType.String,
			required: true,
			description: 'The name of the object to clone.',
		},
		{
			name: 'newObjectName',
			type: ReturnType.String,
			required: true,
			description: 'The name of the new object.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [objectName, newObjectName] = thisArg.getParams(data);

		if (!objectName && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'objectName\' in function $cloneobject',
				data,
			);
		}

		if (!newObjectName && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'newObjectName\' in function $cloneobject',
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

		if (
			currentScope.objects[newObjectName] &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.ObjectAlreadyExists,
				`Object '${newObjectName}' already exists.`,
				data,
			);
		}

		currentScope.objects[newObjectName] = currentScope.objects[objectName];

		const escaped = escapeResult(
			thisArg.defineVar(
				newObjectName,
				thisArg.getResultString(
					() => structuredClone('$0'),
					[escapeVars(objectName)],
				),
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $cloneobject };
