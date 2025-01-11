import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import StringObject from '@aoi.js/core/builders/StringObject.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { parseStringObject } from '@aoi.js/core/parsers/object.js';
import Transpiler from '@aoi.js/core/Transpiler.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { type CommandTypes } from '@aoi.js/typings/type.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * loops through a code for a certain amount of times
 * @example
 * ```aoi
 * ---
 * name: loop
 * type: basic
 * ---
 * $loop[5;{ number:1 };$log[looping: $env[loop_number]]]
 * ```
 */
const $loop = new FunctionBuilder()
	.setName('$loop')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Scope)
	.setReturns(ReturnType.Void)
	.setFields([
		{
			name: 'times',
			type: ReturnType.Number,
			required: true,
			description: 'Number of times to loop',
		},
		{
			name: 'data to pass',
			type: ReturnType.Object,
			required: false,
			description:
				'Data to loop through. leave empty to not send any data',
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
		const [times, dataToPass, ...code] = thisArg.getParams(data);

		if (
			(!times || !code.length) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameters',
				data,
			);
		}

		const parsedTime = thisArg.parseData(times, ReturnType.Number);
		const parsedData = thisArg.parseData(dataToPass, ReturnType.Object);
		const joined = thisArg.parseData(code.join(';'), ReturnType.Any);

		if (
			!thisArg.isCorrectType(parsedTime, ReturnType.Number) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidParameter,
				`provided \`times\` param is not a number, got: ${times} expected: number`,
				data,
			);
		}

		if (
			!thisArg.isCorrectType(parsedData, ReturnType.Object) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidParameter,
				`provided \`data to pass\` param is not an object, got: ${dataToPass} expected: object`,
				data,
			);
		}

		let stringObject: StringObject | undefined;

		if (dataToPass) {
			const obj = new StringObject('{');
			obj.addEnd('}');
			stringObject = parseStringObject(dataToPass, obj);
		}

		if (stringObject) {
			stringObject.keys = stringObject.keys.map((key) => `loop_${key}`);
		}

		let execute;

		if (joined.startsWith('{execute:') && joined.endsWith('}')) {
			const [name, type] = joined.slice(9, -1).split(':').map((x) => x.trim());

			if (!name || !type) {
				throw AoijsErrorHandler.FunctionError(
					ErrorCode.InvalidParameter,
					'No name or type provided in execute',
					data,
				);
			}

			if (!currentScope.client.managers.commands[type as CommandTypes]?.find((cmd) => cmd.name === name)) {
				throw AoijsErrorHandler.FunctionError(
					ErrorCode.InvalidParameter,
					`Command ${name} not found in ${type}`,
					data,
				);
			}

			const loopIndex = thisArg.as<number>('loop_index');

			execute = thisArg.for(0, parsedTime as number, loopIndex.build() + '++', thisArg.getCommand(name, type as CommandTypes, stringObject));
		} else {
			let transpiler = Transpiler.instance!;
			const hash = Math.random().toString(36).substring(7);
			const { result, scope } = transpiler.transpile(joined, {
				sendMessage: true,
				asFunction: false,
				scopeData: {
					vars: currentScope.variables,
					name: `${data.name}_${hash}`,
					object: currentScope.objects,
					env: [...currentScope.env, ...(stringObject?.keys ?? [])],
				},
				reverse: data.cmd?.reverseRead ?? false,
				command: data.cmd,
			});

			currentScope.functions += scope.functions + '\n';
			currentScope.packages += scope.packages + '\n';

			execute = thisArg.for(0, parsedTime as number, 'loop_index++', result);
		}

		const escaped = escapeResult(execute);

		return {
			code: escaped, 
			scope: scopes,
		};
	})
	.build();

export { $loop };
