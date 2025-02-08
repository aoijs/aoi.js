import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import StringObject from '@aoi.js/core/builders/StringObject.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { parseStringObject } from '@aoi.js/core/parsers/object.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult, escapeVars } from '@aoi.js/utils/Helpers/core.js';

/**
 * Sets a property in an object
 * @example
 * ```aoi
 * ---
 * name: setObjectProperty
 * type: basic
 * ---
 * 
 * $createObject[object;\{\}]
 * $setObjectProperty[object;key;value]
 * $getObjectProperty[object;key] // value
 * ```
 */
const $setobjectproperty = new FunctionBuilder()
	.setName('$setobjectproperty')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Setter)
	.setReturns(ReturnType.Void)
	.setFields([
		{
			name: 'objectName',
			type: ReturnType.String,
			required: true,
			description: 'The name of the object to set the property in.',
		},
		{
			name: 'propertyName',
			type: ReturnType.String,
			required: true,
			description: 'The name of the property to set.',
		},
		{
			name: 'propertyValue',
			type: ReturnType.Any,
			required: true,
			description: 'The value to set for the property.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);

		const [objectName, propertyName, propertyValue] = data.splits();

		if (!objectName && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(ErrorCode.MissingParameter, 'Missing parameter \'objectName\' in function $setobjectproperty', data);
		}

		if (!propertyName && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(ErrorCode.MissingParameter, 'Missing parameter \'propertyName\' in function $setobjectproperty', data);
		}

		if (!propertyValue && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(ErrorCode.MissingParameter, 'Missing parameter \'propertyValue\' in function $setobjectproperty', data);
		}

		if (!currentScope.objects[objectName] && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(ErrorCode.ObjectDoesNotExist, `Object '${objectName}' does not exist.`, data);
		} 

		const parsedValue = thisArg.parseData(propertyValue, ReturnType.Any).trim();
		let valueToSet = parsedValue;
		if ( (parsedValue.startsWith('{') && parsedValue.endsWith('}')) || (parsedValue.startsWith('[') && parsedValue.endsWith(']')) ) {
			const isArray = parsedValue.startsWith('[') && parsedValue.endsWith(']');
			const stringObject = new StringObject(isArray ? '[' : '{');
			stringObject.addEnd(isArray ? ']' : '}');

			const obj = parseStringObject(parsedValue, stringObject);

			valueToSet = obj.solve();
		}

		const escaped = escapeResult(
			`${escapeVars(objectName)}.${propertyName} = ${valueToSet};\n`,
		);

		return {
			code: escaped,
			scope: scopes,
		};		
	})
	.build();

export { $setobjectproperty };
