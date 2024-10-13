import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { TranspilerError } from '@aoi.js/core/Error';
import { parseString } from '@aoi.js/core/parsers/string';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult, parseData, stringify } from '@aoi.js/utils/Helpers/core';

/**
 * define a variable with a value
 * @example
 * ```aoi
 * ---
 * name: let
 * type: basic
 * ---
 * 
 * $let[variable;value]
 * $get[variable] // value
 * ```
 */
const $let = new FunctionBuilder()
	.setName('$let')
	.setBrackets(true)
	.setOptional(true)
	.setFields([
		{
			name: 'variable',
			type: ReturnType.String,
			required: true,
			description: 'The variable name to store the value in.',
		},
		{
			name: 'value',
			type: ReturnType.Any,
			required: true,
			description: 'The value to store.',
		},
	])
	.setReturns(ReturnType.Void)
	.setType(FunctionType.Setter)
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [variable, value] = data.splits();

		if (!variable && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw TranspilerError.CompileError('Variable name not provided.', data);
		}

		if (!value && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw TranspilerError.CompileError('Value not provided.', data);
		}

		let parsedValue = parseData(value);

		if (typeof parsedValue === 'string') {
			parsedValue = parseString(parsedValue);
		} else {
			parsedValue = stringify(parsedValue);
		}

		const result = thisArg.defineVar(variable, parsedValue, currentScope.hasVariable(variable));

		if (!currentScope.hasVariable(variable)) {
			currentScope.addVariables(variable);
		}

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $let };
	