import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';
import { jsEval } from '@aoi.js/utils/Helpers/functions.js';

/**
 * Evaluate JavaScript code
 * @example
 * ```aoi
 * ---
 * name: jseval
 * type: basic
 * ---
 * 
 * $jseval[false;console.log('Hello, World!')]
 * ```
 */
const $jseval = new FunctionBuilder()
	.setName('$jseval')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.FunctionGetter)
	.setReturns(ReturnType.Any)
	.setFields([
		{
			name: 'return Output',
			type: ReturnType.Boolean,
			required: true,
			description: 'Whether to return the output of the code.',
		},
		{
			name: 'code',
			type: ReturnType.String,
			required: true,
			description: 'The JavaScript code to evaluate.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [returnOutput, ...code] = thisArg.getParams(data);

		if (!returnOutput && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'returnOutput\' in function $jseval',
				data,
			);
		}

		const parsedReturnOutput = thisArg.parseData(returnOutput, ReturnType.Boolean);
		const joined = thisArg.parseData(code.join(';'), ReturnType.String);

		if (!thisArg.isCorrectType(parsedReturnOutput, ReturnType.Boolean) && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid parameter type for 'returnOutput' in function $jseval, got ${parsedReturnOutput}, expected boolean`,
				data,
			);
		}

		if (!thisArg.hasFunction(currentScope, jsEval.name)) {
			thisArg.addFunction(currentScope, jsEval);
		}

		const escaped = escapeResult(
			thisArg.getResultString(
			 // eslint-disable-next-line @typescript-eslint/return-await
			 async (discordData) => await jsEval.call(discordData, '$0'),
			 [joined],
			),
		);

		return {
			code: parsedReturnOutput ? escaped : '',
			scope: scopes,
		};

	})
	.build();

export { $jseval };