import { TranspilerCustoms } from '@aoi.js/typings/enum.js';

const mathRegex =
	/#MATH_FUNCTION_START#[#$._0-9a-\s*+-/%^&|?()]*#MATH_FUNCTION_END#/gi;

export function fixMath(code: string) {
	let res = code;
	const matches = res.match(mathRegex);

	if (!matches) return res;

	for (const match of matches) {
		res = res.replace(
			match,
			`\${ ${match
				.replaceAll(TranspilerCustoms.MFS, '(')
				.replaceAll(TranspilerCustoms.MFE, ')')} }`,
		);
	}

	return res;
}
