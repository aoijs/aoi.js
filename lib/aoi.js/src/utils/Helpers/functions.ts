import { parseResult } from './core.js';

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
