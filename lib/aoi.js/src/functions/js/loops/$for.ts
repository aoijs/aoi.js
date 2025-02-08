import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import Transpiler from '@aoi.js/core/Transpiler.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Loops through a range of numbers
 * @example
 * ```aoi
 * ---
 * name: for
 * type: basic
 * ---
 * 
 * $for[1;10;1;
 * 	$log[Current number: $1]
 * ]
 * // logs numbers from 1 to 10
 * ```
 */
const $for = new FunctionBuilder()
	.setName('$for')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Scope)
	.setReturns(ReturnType.Void)
	.setFields([
		{
			name: 'start',
			type: ReturnType.Number,
			required: true,
			description: 'Start value',
		},
		{
			name: 'end',
			type: ReturnType.Number,
			required: true,
			description: 'End value',
		},
		{
			name: 'increment',
			type: ReturnType.Fn,
			required: true,
			description: 'Increment value',
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
		const [start, end, increment, ...code] = thisArg.getParams(data);

		if (!start && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'start\' in function $for',
				data,
			);
		}

		if (!end && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'end\' in function $for',
				data,
			);
		}

		if (!increment && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'increment\' in function $for',
				data,
			);
		}

		const parsedStart = thisArg.parseData(start, ReturnType.Number);
		const parsedEnd = thisArg.parseData(end, ReturnType.Number);
		const incrementFn = thisArg.parseData(increment, ReturnType.Fn);
		const joined = thisArg.parseData(code.join(';'), ReturnType.Any);

		if (
			!thisArg.isCorrectType(parsedStart, ReturnType.Number) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'start' in function $for, got: ${parsedStart} expected: number`,
				data,
			);
		}

		if (
			!thisArg.isCorrectType(parsedEnd, ReturnType.Number) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'end' in function $for, got: ${parsedEnd} expected: number`,
				data,
			);
		}

		if (
			!thisArg.isCorrectType(incrementFn, ReturnType.Fn) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'increment' in function $for, got: ${incrementFn} expected: function`,
				data,
			);
		}

		const transpiler = Transpiler.instance!;
		const hash = thisArg.generateHash();
		const { result, scope } = transpiler.transpile(joined, {
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

		const { result: incrementResult, scope: incrementScope } =
			transpiler.transpile(incrementFn, {
				sendMessage: false,
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

		currentScope.functions += incrementScope.functions + '\n';
		currentScope.packages += incrementScope.packages + '\n';
		currentScope.functions += scope.functions + '\n';
		currentScope.packages += scope.packages + '\n';

		const escaped = escapeResult(
			thisArg.for(
				parsedStart as number,
				parsedEnd as number,
				incrementResult,
				result,
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $for };
