import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoiError from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

const units = {
	b: 1,
	kb: 1024,
	mb: 1024 ** 2,
	gb: 1024 ** 3,
	tb: 1024 ** 4,
	pb: 1024 ** 5,
	eb: 1024 ** 6,
	zb: 1024 ** 7,
	yb: 1024 ** 8,
} as const;

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
			description:
				'The type of memory to get. Can be `heapUsed`, `heapTotal`, `rss`, `external`, `arrayBuffers`.',
		},
		{
			name: 'unit',
			type: ReturnType.String,
			required: false,
			description: 'The unit to return the memory in. default is b.',
		},
	])
	.setReturns(ReturnType.String)
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		let [type, unit] = thisArg.getParams(data);

		if (!type) {
			type = 'heapUsed';
		}

		if (
			![
				'heapUsed',
				'heapTotal',
				'rss',
				'external',
				'arrayBuffers',
			].includes(type) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid memory type: ${type}`,
				data,
			);
		}

		if (!unit) {
			unit = 'b';
		}

		if (
			!['b', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'].includes(unit)
		) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid memory unit: ${unit}, must be one of b, kb, mb, gb, tb, pb, eb, zb, yb`,
				data,
			);
		}


		const result = thisArg.getResultString(
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			() => process.memoryUsage()['"$0"'] / '$1',
			[type, units[unit as keyof typeof units ].toString()],
		);

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $ram };
