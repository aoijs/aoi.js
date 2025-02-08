import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import StringObject from '@aoi.js/core/builders/StringObject.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { parseStringObject } from '@aoi.js/core/parsers/object.js';
import {
	ErrorCode,
	FunctionType,
	ReturnType,
	TranspilerCustoms,
} from '@aoi.js/typings/enum.js';
import { escapeResult, safe } from '@aoi.js/utils/Helpers/core.js';

/**
 * Creates an object
 * @example
 * ```aoi
 * ---
 * name: createObject
 * type: basic
 * ---
 * 
 * $createObject[object;\{key:value\}]
 * $getObject[object] // \{key:value\}
 * ```
 */
const $createobject = new FunctionBuilder()
	.setName('$createobject')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Setter)
	.setReturns(ReturnType.Void)
	.setFields([
		{
			name: 'objectName',
			type: ReturnType.String,
			required: true,
			description: 'The name of the object to create.',
		},
		{
			name: 'objectData',
			type: ReturnType.Object,
			required: true,
			description: 'The data to set for the object.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);

		const [objectName, ...objectData] = thisArg.getParams(data);

		if (!objectName && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'objectName\' in function $createobject',
				data,
			);
		}

		const joined = thisArg
			.parseData(objectData.join(';'), ReturnType.Object)
			.trim();

		if (
			currentScope.objects[objectName] &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.ObjectAlreadyExists,
				`Object '${objectName}' already exists.`,
				data,
			);
		}

		if (
			!thisArg.isCorrectType(joined, ReturnType.Object) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'objectData'. got ${joined} expected object`,
				data,
			);
		}

		const stringObject = new StringObject('{');
		stringObject.addEnd('}');

		let obj;

		if (
			[TranspilerCustoms.FS, TranspilerCustoms.FFS].some((x) =>
				joined.startsWith(x),
			)
		) {
			obj = joined;
		} else {
			if (joined.startsWith('[') && joined.endsWith(']')) {
				stringObject.start = '[';
				stringObject.end = ']';
			}
			
			obj = parseStringObject(joined, stringObject).solve();
		}

		const escaped = escapeResult(
			thisArg.defineVar(objectName, obj, currentScope.hasVariable(objectName)),
		);

		currentScope.objects[objectName] = stringObject;
		currentScope.addVariables(objectName);
		
		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $createobject };
