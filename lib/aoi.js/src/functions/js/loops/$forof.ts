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
 * name: forof
 * type: basic
 * ---
*
 * $arrayCreate[hi;1;2;3;4]
 * $forof[key;hi;
 * 	$log[
 * 		$env[key]
 * 	]
 * ] // logs the key and value of the object
 * ```
 */
const $forof = new FunctionBuilder()
	.setName('$forof')
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
			name: 'ArrayName',
			type: ReturnType.String,
			required: true,
			description: 'Array to loop through',
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
		const [variableName, arrayName, ...code] = thisArg.getParams(data);

		if (!variableName && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'variable name\' in function $forof',
				data,
			);
		}

		if (!arrayName && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'ArrayName\' in function $forof',
				data,
			);
		}

		if (
			!currentScope.objects[arrayName] &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Array ${arrayName} not found`,
				data,
			);
		}

		if (
			!currentScope.objects[arrayName] &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Object ${arrayName} not found`,
				data,
			);
		}
		
		currentScope.env.push(variableName);

		const transpiler = Transpiler.instance!;
		const joined = code.join(';');
		const hash = thisArg.generateHash();

		const { result, scope: codeScope } = transpiler.transpile(joined, {
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
		});

		currentScope.functions += codeScope.functions + '\n';
		currentScope.packages += codeScope.packages + '\n';

		const escaped = escapeResult(
			thisArg.forOf(variableName, arrayName, result),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $forof };
