import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { parseCondition } from '@aoi.js/core/parsers/condition.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult, parseResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * returns true if all conditions are true
 * @example
 * ```aoi
 * ---
 * name: and
 * type: basic
 * ---
 * 
 * $and[1==1;2==2] // returns true
 * $and[1==1;2==3] // returns false
 * ```
 */
const $and = new FunctionBuilder()
	.setName('$and')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setFields([
		{
			name: 'conditions',
			type: ReturnType.Array | ReturnType.Boolean,
			required: true,
			description: 'conditions to check',
		},
	])
	.setReturns(ReturnType.Boolean)
	.setCode((data, scopes, thisArg) => {
		const conditions = thisArg.getParams(data);
		const solved = parseCondition(conditions.join(' && ')).solve();
		const escaped = escapeResult( parseResult(solved) );

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $and };