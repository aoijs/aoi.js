import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import StringObject from '@aoi.js/core/builders/StringObject.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { parseStringObject } from '@aoi.js/core/parsers/object.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import type { CommandTypes } from '@aoi.js/typings/type.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * executes a command
 * @example
 * ```aoi
 * $execute[log;awaited;\{name:"value"\}]
 * 
 * // in command log
 * $log[$passeddata[name]] // logs value
 * ```
 */
const $execute = new FunctionBuilder()
	.setName('$execute')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.FunctionGetter)
	.setReturns(ReturnType.Any)
	.setFields([
		{
			name: 'command',
			type: ReturnType.String,
			required: true,
			description: 'The command to execute.',
		},
		{
			name: 'type',
			type: ReturnType.String,
			required: true,
			description: 'The type of command to execute.',
		},
		{
			name: 'data',
			type: ReturnType.Object,
			required: false,
			description: 'The data to pass to the command.',
		},	
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [command, type, dataToPass, scope] = thisArg.getParams(data);

		const parsedCommand = thisArg.parseData(command, ReturnType.String);
		const parsedData = thisArg.parseData(dataToPass, ReturnType.Object);

		if (
			!thisArg.isCorrectType(parsedCommand, ReturnType.String) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid argument type 'command' in function $execute, got ${command}, expected ReturnType.${ReturnType.String}`,
				data,
			);
		}

		if (
			!currentScope.client.managers.commands.types.includes(type) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid argument type 'type' in function $execute, got ${type}, expected one of ${currentScope.client.managers.commands.types.join(', ')}`,
				data,
			);
		}

		if (
			!thisArg.isCorrectType(parsedData, ReturnType.Object) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid argument type 'data' in function $execute, got ${dataToPass}, expected ReturnType.${ReturnType.Object}`,
				data,
			);
		}

		let stringObject: StringObject | undefined;

		if (dataToPass) {
			const obj = new StringObject('{');
			obj.addEnd('}');
			stringObject = parseStringObject(dataToPass, obj);
		}

		const commandToExecute = thisArg.getCommand(command, type as CommandTypes, stringObject);

		const escaped = escapeResult(commandToExecute);

		return {
			code: escaped,
			scope: scopes,
		};	
	})
	.build();

export { $execute };
