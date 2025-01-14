import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoiError from '@aoi.js/core/Error.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import {
	ErrorCode,
	FunctionType,
	ReturnType,
	TranspilerCustoms,
} from '@aoi.js/typings/enum.js';
import {
	escapeResult,
	parseData,
	stringify,
} from '@aoi.js/utils/Helpers/core.js';

/**
 * define a variable with a value
 * @example
 * ```aoi
 * ---
 * name: letget
 * type: basic
 * ---
 *
 * $let[v;value]
 * $get[v] // returns value
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
			throw AoiError.FunctionError(
				ErrorCode.MissingParameter,
				'Variable name not provided.',
				data,
			);
		}

		if (!value && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoiError.FunctionError(
				ErrorCode.MissingParameter,
				'Value not provided.',
				data,
			);
		}

		let parsedValue = parseData(value.trim());

		if (typeof parsedValue === 'string') {
			if (
				!(
					(parsedValue.startsWith(TranspilerCustoms.FS) &&
						parsedValue.endsWith(TranspilerCustoms.FE)) ||
					(parsedValue.startsWith(TranspilerCustoms.FFS) &&
						parsedValue.endsWith(TranspilerCustoms.FFE)) ||
					(parsedValue.startsWith(TranspilerCustoms.MFS) &&
						parsedValue.endsWith(TranspilerCustoms.MFE))
				)
			) {
				parsedValue = parseString(parsedValue);
			}
		} else {
			parsedValue = stringify(parsedValue);
		}

		const result = thisArg.defineVar(
			variable,
			parsedValue,
			currentScope.hasVariable(variable),
		);

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
