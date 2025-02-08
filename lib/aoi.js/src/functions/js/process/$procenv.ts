import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the environment variable of the process for given key.
 * @example
 * ```aoi
 * ---
 * name: procenv
 * type: basic
 * ---
 * 
 * $procenv // returns all environment variables as an object
 * $procenv[KEY] // returns the value of the environment variable
 * ```
 */
const $procenv = new FunctionBuilder()
	.setName('$procenv')
	.setBrackets(true)
	.setOptional(true)
	.setType(FunctionType.Getter)
	.setFields([
		{
			name: 'key',
			type: ReturnType.String,
			required: false,
			description: 'The key of the environment variable to get.',
		},
	])
	.setReturns(ReturnType.String | ReturnType.Object)
	.setCode((data, scopes, thisArg) => {
		const [key] = thisArg.getParams(data);

		if (!key) {
			const result = thisArg.getResultString(() => process.env);

			const escaped = escapeResult(result);

			return {
				code: escaped,
				scope: scopes,
			};
		}

		const result = thisArg.getResultString(() => process.env['"$0"'], [key]);

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $procenv };
