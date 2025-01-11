import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';

/**
 * Adds a comment to the code
 * @example
 * ```aoi
 * ---
 * name: comment
 * type: basic
 * ---
 * 
 * $comment[This is a comment $log[this won't be logged]]
 * $log[This will be logged]
 * ```
 */
const $comment = new FunctionBuilder()
	.setName('$comment')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Scope)
	.setReturns(ReturnType.Void)
	.setFields([
		{
			name: 'comment',
			type: ReturnType.String,
			required: true,
			description: 'The comment to add.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		return {
			code: '',
			scope: scopes,
		};
	})
	.build();

export { $comment };