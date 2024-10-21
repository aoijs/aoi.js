import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { TranspilerError } from '@aoi.js/core/Error.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the memory usage of the process for given type.
 * @example
 * ```aoi
 * ---
 * name: ram
 * type: basic
 * ---
 * 
 * $ram // returns heapUsed
 * $ram[heapTotal] // returns heapTotal
 * $ram[rss] // returns rss
 * $ram[external] // returns external
 * $ram[arrayBuffers] // returns arrayBuffers
 * ```
 */
const $ram = new FunctionBuilder()
	.setName('$ram')
	.setBrackets(true)
	.setOptional(true)
	.setType(FunctionType.Getter)
	.setFields([
		{
			name: 'type',
			type: ReturnType.String,
			required: false,
			description: 'The type of memory to get. Can be `heapUsed`, `heapTotal`, `rss`, `external`, `arrayBuffers`.',

		},
	])
	.setReturns(ReturnType.String)
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		let [type] = thisArg.getParams(data);

		if (!type) {
			type = 'heapUsed';
		}

		if (
			!['heapUsed', 'heapTotal', 'rss', 'external', 'arrayBuffers'].includes(type) && 
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw TranspilerError.CompileError(`Invalid memory type: ${type}`, data);
		}

		const result = thisArg.getResultString(
			// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error, @typescript-eslint/ban-ts-comment
			// @ts-ignore
			// eslint-disable-next-line @typescript-eslint/dot-notation, @typescript-eslint/no-unsafe-return
			() => process.memoryUsage()['"$0"'],
			[type],
		);

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $ram };