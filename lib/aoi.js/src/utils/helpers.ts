import { TranspilerCustoms } from '@aoi.js/typings/enum.js';

/**
 * Escapes a variable name by wrapping it with '__$' and '$__'.
 *
 * @param  name - The variable name to escape.
 * @returns The escaped variable name.
 * @example
 * ```js
 * escapeVars("a") // "__$a$__"
 * ```
 */
export function escapeVars(name: string) {
	return `__$${name}$__`;
}

/**
 * Escapes a result by wrapping it with TranspilerCustoms.FS and TranspilerCustoms.FE.
 * @param res - The result to escape.
 * @returns The escaped result.
 * 
 * @example
 * ```js
 * escapeResult("a") // "#FUNCTION_START#a#FUNCTION_END#"
 * ```
 */

export function escapeResult(res: string) {
	return `${TranspilerCustoms.FS}${res}${TranspilerCustoms.FE}`;
}


/**
 * parse the result by removing all the customs
 * @param result - The result to parse.
 * @returns The parsed result.
 * @example
 * ```js
 * parseResult("#MATH_FUNCTION_START#1+1#MATH_FUNCTION_END#") // "1+1"
 * ```
 */
export function parseResult(result: string) {
	if (typeof result !== 'string') return result;
	return result
		.replaceAll(TranspilerCustoms.FS, '')
		.replaceAll(TranspilerCustoms.FE, '')
		.replaceAll(TranspilerCustoms.FSEP, ';')
		.replaceAll(TranspilerCustoms.FFUN, '')
		.replaceAll(TranspilerCustoms.FSET, '')
		.replaceAll(TranspilerCustoms.FGET, '')
		.replaceAll(TranspilerCustoms.FISS, '')
		.replaceAll(TranspilerCustoms.FISE, '')
		.replaceAll(TranspilerCustoms.FSS, '')
		.replaceAll(TranspilerCustoms.FSE, '')
		.replaceAll(TranspilerCustoms.FFS, '')
		.replaceAll(TranspilerCustoms.FFE, '')
		.replaceAll(TranspilerCustoms.MFS, '')
		.replaceAll(TranspilerCustoms.MFE, '')
		.replaceAll(TranspilerCustoms.OS, '{')
		.replaceAll(TranspilerCustoms.OE, '}')
		.replaceAll(TranspilerCustoms.OSEP, ':')
		.replaceAll(TranspilerCustoms.AS, '[')
		.replaceAll(TranspilerCustoms.AE, ']')
		.replaceAll(TranspilerCustoms.ASEP, ',');
}

/**
 * remove the set function
 * @param code - The code to parse
 * @returns The parsed result.
 * @example
 * ```js
 * parseResult("#FUNCTION_SETTER#i#FUNCTION_SETTER#") // "i"
 * ```
 */

export function removeSetFunc(code: string) {
	return code
		.replaceAll(TranspilerCustoms.FSET, '')
		.replaceAll(TranspilerCustoms.FFUN, '');
}

/**
 * Removes the multi line comments from the given code.
 * @param code - The code to remove the comments from.
 * @returns Returns the code without the comments.
 * @example
 * ```js
 * removeMultiLineComments("/* comment *\/") // ""
 * ```
 */
export function removeMultiLineComments(code: string) {
	return code.replace(/\/\*[\s\S]*?\*\//g, '');
}