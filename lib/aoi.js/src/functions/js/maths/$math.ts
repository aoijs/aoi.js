import AoiJSFunction from '../../../structures/AoiJSFunction.js';
import { escapeMathResult, parseResult, removeF, removeFF, removeMF } from '../../../util/transpilerHelpers.js';

function isMathExpression(expression: string): boolean {
	expression = parseResult( removeFF( removeMF( removeF( expression.trim() ) ) ) );
	const mathOperators = ['+', '-', '*', '/', '%', '**', '(', ')', '^', '|', '&', '>>', '<<'];
	const MathClassFunctions = [
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
	const MathClassProperties = [
		'E',
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
		...MathClassFunctions,
		...MathClassProperties,
	];

	for (const op of ops) {
		expression = expression.replaceAll(op, '');
	}

	return expression.trim() === '';
}

const math = new AoiJSFunction()
	.setName('$math')
	.setType('getter')
	.setBrackets(true)
	.setOptional(false)
	.setField(
		{
			name: 'expression',
			type: 'number',
			description: 'The math expression to evaluate',
			required: true,
		}
	)
	.setVersion('7.0.0')
	.setDefault(['void'])
	.setReturns('number')
	.setDescription('evaluates a math expression')
	.setExample(`
		$math[1 + 1] // returns 2
		$math[1 + 1 * 2] // returns 3

		$math[sin(1) + cos(1)] // returns 1.3817732906760363
	`)
	.setCode((data, scope, thisArg) => {
		const numbers = data.inside;
		const currentScope = scope[scope.length - 1];
		if (
			data.splits.length === 0 &&
			!currentScope.name.startsWith('$try_') &&
			!currentScope.name.startsWith('$catch_')
		) {
			throw new Error(`${data.name} requires at least 1 argument`);
		}

		if (numbers && !isMathExpression(numbers)) {
			throw new Error(`${data.name} requires a valid math expression`);
		}

		const regex = /(abs|acos|acosh|asin|asinh|atan|atan2|atanh|cbrt|ceil|clz32|cos|cosh|exp|expm1|floor|fround|hypot|imul|log|log10|log1p|log2|max|min|pow|random|round|sign|sin|sinh|sqrt|tan|tanh|trunc|LN10|LN2|LOG10E|LOG2E|PI|SQRT1_2|SQRT2)/g;
		const mathExpression = numbers
			?.replaceAll(regex, 'Math.$1')
			.replaceAll('EULERNUM', 'Math.E');
		if (!mathExpression) {
			throw new Error(`${data.name} requires a valid math expression`);
		}

		const res = escapeMathResult(`(${parseResult(mathExpression)})`);
		currentScope.update(res, data);

		return {
			code: res,
			scope,
		};
	});

export const $math = math.build();
