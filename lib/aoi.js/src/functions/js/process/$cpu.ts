import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { TranspilerError } from '@aoi.js/core/Error.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';
import type os from 'os';

/**
 * Returns the CPU usage of the process or the OS.
 * @example
 * ```aoi
 * ---
 * name: cpu
 * type: basic
 * ---
 *
 * $cpu // returns the CPU usage of the process
 * $cpu[os] // returns the CPU usage of the OS
 * ```
 */
const $cpu = new FunctionBuilder()
	.setName('$cpu')
	.setBrackets(true)
	.setOptional(true)
	.setType(FunctionType.FunctionGetter)
	.setFields([
		{
			name: 'type',
			type: ReturnType.String,
			required: false,
			description: 'The type of CPU to get. Can be `process` or `os`.',
		},
	])
	.setReturns(ReturnType.String)
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		let [type] = thisArg.getParams(data);

		if (!type) {
			type = 'process';
		}

		if (
			!['process', 'os'].includes(type) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw TranspilerError.CompileError(`Invalid CPU type: ${type}`, data);
		}

		if (!currentScope.hasPkg('OS')) {
			currentScope.addPkg('OS', 'const OS = await import("os")');
		}

		if (!currentScope.hasPkg('TRANSPILE_ERROR')) {
			currentScope.addPkg(
				'TRANSPILE_ERROR',
				'const TRANSPILE_ERROR = await import("aoi.js/core/Error.js")',
			);
		}

		// placeholder for the actual module
		const OS = thisArg.as<typeof os>('OS');
		const TRANSPILE_ERROR =
			thisArg.as<typeof TranspilerError>('TRANSPILE_ERROR');

		function secNSec2ms(secNSec: number | number[]) {
			if (Array.isArray(secNSec)) {
				return secNSec[0] * 1000 + secNSec[1] / 1000000;
			}

			return secNSec / 1000;
		}

		function __$getCPUUsage$__(type: string) {
			if (type === 'process') {
				const startTime = process.hrtime();
				const startUsage = process.cpuUsage();

				const now = Date.now();
				while (Date.now() - now < 100) {}

				const elapTime = process.hrtime(startTime);
				const elapUsage = process.cpuUsage(startUsage);

				const elapTimeMS = secNSec2ms(elapTime);
				const elapUserMS = secNSec2ms(elapUsage.user);
				const elapSystMS = secNSec2ms(elapUsage.system);
				const cpuPercent = (
					(100 * (elapUserMS + elapSystMS)) /
					elapTimeMS
				).toFixed(2);
				return cpuPercent;
			} else if (type === 'os') {
				return ((OS.loadavg()[0] * 100) / OS.cpus().length).toFixed(2);
			} else {
				throw TRANSPILE_ERROR.RunTimeError(
					`Invalid CPU type: ${type}`,
					data,
				) as TranspilerError;
			}
		}

		thisArg.addFunction(currentScope, secNSec2ms);
		thisArg.addFunction(currentScope, __$getCPUUsage$__);

		const result = thisArg.getResultString(
			() => __$getCPUUsage$__('$0'),
			[type],
		);

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $cpu };
