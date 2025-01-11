import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import Transpiler from '@aoi.js/core/Transpiler.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Loops through an object
 * @example
 * ```aoi
 * ---
 * name: forin
 * type: basic
 * ---
 * 
 * $createObject[hi;\{ a: b, c: d \}]
 * $forin[key;hi; 
 * 	$log[
 * 		key -\> $env[key]
 * 		value -\> $getObjectProperty[hi; $env[key]]
 * 	]
 * ] // logs the key and value of the object
 * ```
 */
const $forin = new FunctionBuilder()
	.setName('$forin')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Scope)
	.setReturns(ReturnType.Void)
	.setFields([
		{
			name: 'variable name',
			type: ReturnType.String,
			required: true,
			description: 'Name of the variable',
		},
		{
			name: 'objectName',
			type: ReturnType.String,
			required: true,
			description: 'Object to loop through',
		},
		{
			name: 'code',
			type: ReturnType.Any,
			required: true,
			description: 'Code to execute',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [variableName, objectName, ...code] = thisArg.getParams(data);

		if (!variableName && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'variable name\' in function $forin',
				data,
			);
		}	

		if (!objectName && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'objectName\' in function $forin',
				data,
			);
		}

		if (!currentScope.objects[objectName] && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(ErrorCode.InvalidArgumentType, `Object ${objectName} not found`, data);
		}

		const transpiler = Transpiler.instance!;
		currentScope.env.push(variableName);
		const joined = code.join(';');

		const hash = Math.random().toString(36).substring(7);

		const { result, scope: codeScope } = transpiler.transpile(
			joined,
			{
				sendMessage: true,
				asFunction: false,
				scopeData: {
					vars: currentScope.variables,
					name: `${data.name}_${hash}`,
					object: currentScope.objects,
					env: currentScope.env,
				},
				reverse: data.cmd?.reverseRead ?? false,
				command: data.cmd,
			},
		);

		currentScope.functions += codeScope.functions + '\n';
		currentScope.packages += codeScope.packages + '\n';

		const escaped = escapeResult(thisArg.forIn(variableName, objectName, result));

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $forin };