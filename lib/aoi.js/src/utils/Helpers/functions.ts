import type { AsyncFunction, Safe } from '@aoi.js/typings/type.js';
import { parseResult, safe } from './core.js';
import * as UTIL from 'node:util';
import type { IErr, IOk } from '@aoi.js/typings/interface.js';

export function isMathExpression(expression: string): boolean {
	expression = parseResult(expression.trim());
	const numbers = [
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'.',
		',',
	];
	const mathOperators = [
		'+',
		'-',
		'*',
		'/',
		'%',
		'**',
		'(',
		')',
		'^',
		'|',
		'&',
		'>>',
		'<<',
	];
	const mathClassFunctions = [
		'abs',
		'acos',
		'acosh',
		'asin',
		'asinh',
		'atan',
		'atan2',
		'atanh',
		'cbrt',
		'ceil',
		'clz32',
		'cos',
		'cosh',
		'exp',
		'expm1',
		'floor',
		'fround',
		'hypot',
		'imul',
		'log',
		'log10',
		'log1p',
		'log2',
		'max',
		'min',
		'pow',
		'random',
		'round',
		'sign',
		'sin',
		'sinh',
		'sqrt',
		'tan',
		'tanh',
		'trunc',
	];
	const mathClassProperties = [
		'EULERNUM',
		'LN10',
		'LN2',
		'LOG10E',
		'LOG2E',
		'PI',
		'SQRT1_2',
		'SQRT2',
	];
	const ops = [
		...numbers,
		...mathOperators,
		...mathClassFunctions,
		...mathClassProperties,
	];

	for (const op of ops) {
		expression = expression.replaceAll(op, '');
	}

	return expression.trim() === '';
}

export function abbreviate(number: number, decimal: number) {
	const SI_SYMBOLS = [
		'',
		'K',
		'M',
		'B',
		'T',
		'Qa',
		'Qi',
		'Sx',
		'Sp',
		'Oc',
		'No',
		'Dc',
		'Udc',
		'Ddc',
		'Tdc',
		'Qadc',
		'Qidc',
		'Sxdc',
		'Spdc',
		'Ocdc',
		'Nmdc',
		'Vg',
		'Uvg',
		'Dvg',
		'Tvg',
		'Qavg',
		'Qvg',
		'Sxvg',
		'Spvg',
		'Ovg',
		'Nvg',
		'Tg',
	] as const;

	const tier = Math.floor(Math.log10(Math.abs(number || 1)) / 3);
	if (tier === 0) return number;
	const suffix = SI_SYMBOLS[tier];
	const scale = Math.pow(10, tier * 3);
	const scaled = number / scale;
	return scaled.toFixed(decimal) + suffix;
}

export function nthRoot(x: number, n: number): number {
	var negate = n % 2 == 1 && x < 0;
	if (negate) x = -x;
	var possible = Math.pow(x, 1 / n);
	n = Math.pow(possible, n);
	if (Math.abs(x - n) < 1 && x > 0 == n > 0)
		return negate ? -possible : possible;
	else return NaN;
}

export function randomFromRange(
	min: number,
	max: number,
	allowDecimal: boolean,
) {
	if (allowDecimal) {
		return Math.random() * (max - min) + min;
	} else {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}

export function toString(value: unknown) {
	if (typeof value === 'object') {
		if (value === null) return 'null';
		if ('success' in value && 'error' in value)
			return JSON.stringify({
				success: value.success,
				error:
					(value.error as Error).message,
			});
		if (value instanceof Error) return value.message;
		const res = safe(() => JSON.stringify(value));
		if (res.success) return res.data;

		return UTIL.inspect(value, { depth: 0 });
	} else {
		return String(value);
	}
}

export function toBigInt(value: unknown) {
	const res = safe(() => BigInt(value as string));
	if (res.success) return res.data;
	return 0n;
}

export function objectExists(variable: unknown) {
	try {
		return typeof variable === 'object';
	} catch {
		return false;
	}
}

export async function jsEval(code: string) {
	try {
		const evaled = (await eval(code)) as unknown;
		return evaled;
	} catch (error) {
		return error;
	}
}

// implement result type
export async function wrap<T, E>(promise: Promise<T>): Promise<Safe<T, E>> {
	return promise
		.then((data) => {
			return {
				success: true,
				data: data,
			} satisfies IOk<T>;
		})
		.catch((e) => {
			return {
				success: false,
				error: e as E,
			} satisfies IErr<E>;
		});
}
