import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { parseCondition } from '@aoi.js/core/parsers/condition.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult, parseResult } from '@aoi.js/utils/Helpers/core.js';

<<<<<<< HEAD
/**
 * Checks if any of the conditions are true
 * @example
 * ```aoi
 * ---
 * name: or
 * type: basic
 * ---
 * 
 * $or[1 == 1; 2 == 3] // Returns true
 * $or[1 == 2; 2 == 3] // Returns false
 * ```
 */
=======
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
const $or = new FunctionBuilder()
	.setName('$or')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setFields([
		{
			name: 'conditions',
			type: ReturnType.Any,
			required: true,
			description: 'conditions to check',
		},
	])
	.setReturns(ReturnType.Boolean)
	.setCode((data, scopes, thisArg) => {
		const conditions = thisArg.getParams(data);
		const solved = parseCondition(conditions.join(' || ')).solve();
		const escaped = escapeResult( parseResult(solved) );

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $or };