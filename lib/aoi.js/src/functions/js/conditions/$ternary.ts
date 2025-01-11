import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { parseCondition } from '@aoi.js/core/parsers/condition.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Executes the code based on the condition
 * @example
 * ```aoi
 * ---
 * name: ternary
 * type: basic
 * ---
 * 
 * $ternary[$message[1]==hi; hello; goodbye] // returns hello if the message is hi, otherwise goodbye
 * ```
 */
const $ternary = new FunctionBuilder()
	.setName('$ternary')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Any)
	.setFields([
		{
			name: 'condition',
			type: ReturnType.Boolean,
			required: true,
			description: 'The condition to check.',
		},
		{
			name: 'trueCode',
			type: ReturnType.Any,
			required: true,
			description: 'The code to execute if the condition is true.',
		},
		{
			name: 'falseCode',
			type: ReturnType.Any,
			required: true,
			description: 'The code to execute if the condition is false.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [condition, trueCode, falseCode] = thisArg.getParams(data);

		if (!condition && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'missing condition',
				data,
			);
		}

		const solvedCondition = parseCondition(condition).solve();
		const parsedTrueCode = parseString(trueCode);
		const parsedFalseCode = parseString(falseCode);

		const resultString = thisArg.getResultString(
			() =>
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				// eslint-disable-next-line no-constant-condition
				'$0' ? '$1' : '$2',
			[solvedCondition, parsedTrueCode, parsedFalseCode],
		);

		const escaped = escapeResult(resultString);

		return {
			code: escaped, 
			scope: scopes,
		};
	})
	.build();

export { $ternary };
