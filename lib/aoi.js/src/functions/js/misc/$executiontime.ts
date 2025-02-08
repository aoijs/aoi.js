import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult, escapeVars } from '@aoi.js/utils/Helpers/core.js';

/**
 * returns the time taken to execute the script
 * @example
 * ```aoi
 * ---
 * name: executiontime
 * type: basic
 * ---
 * 
 * took $executiontime ms to execute
 * ```
 */
const $executiontime = new FunctionBuilder()
	.setName('$executiontime')
	.setBrackets(false)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Number)
	.setFields([])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		currentScope.addExecutionTime = true;

		const escaped = escapeResult(
			thisArg.getResultString(
				() => performance.now() - ('$0' as unknown as number),
				[escapeVars(`${currentScope.name}_EXECUTION_TIME`)],
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $executiontime };
