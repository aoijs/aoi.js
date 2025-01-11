import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * breaks the current loop
 * @example
 * ```aoi
 * ---
 * name: break
 * type: basic
 * ---
 * 
 * $let[i;0]
 * $while[$get[i]\<10;
 * 	$if[$get[i]==5;$break]
 * 	$log[$get[i]]
 *  $inc[$get[i]]  
 * ]
 * ```
 */
const $break = new FunctionBuilder()
	.setName('$break')
	.setBrackets(false)
	.setOptional(false)
	.setType(FunctionType.Function)
	.setReturns(ReturnType.Void)
	.setFields([])
	.setCode((data, scopes, thisArg) => {
		const escaped = escapeResult(
			'break;',
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $break };
