import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { parseCondition } from '@aoi.js/core/parsers/condition.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult, parseResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Checks if the condition is true
 * @example
 * ```aoi
 * ---
 * name: checkcondition
 * type: basic
 * ---
 * 
 * $checkcondition[1==1 || 1 == 2] // returns true
 * $checkcondition[1==2] // returns false
 * ```
 */
const $checkcondition = new FunctionBuilder()
	.setName('$checkcondition')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Boolean)
	.setFields([
		{
			name: 'condition',
			type: ReturnType.Boolean,
			required: true,
			description: 'The condition to check.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const [condition] = thisArg.getParams(data);

		const result = parseCondition(condition).solve();
		const escaped = escapeResult(parseResult(result));

		return  {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $checkcondition };
	