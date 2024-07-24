import StringObject from '@aoi.js/core/builders/StringObject';
import { parseStringObject } from '@aoi.js/core/parsers/object';
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

/**
 * parse data to its actual type
 * @param text - The string to check.
 * @returns - Returns the parsed data.
 * @example
 * ```js
 * parseData("1") // 1
 * parseData("1n") // 1n
 * parseData("null") // null
 * // and so on...
 * ```
 */
export function parseData(text: string) {
	if (text === '') return text;
	else if (!isNaN(Number(text)) && Number.isSafeInteger(Number(text)))
		return Number(text);
	else if (
		(!isNaN(Number(text)) && !Number.isSafeInteger(text)) ||
		isBigInt(text)
	)
		return BigInt(text.replace('n', ''));
	else if (text === 'null') return null;
	else if (text === 'undefined') return undefined;
	else if (text === 'true' || text === 'false') return text === 'true';
	else {
		try {
			return JSON.parse(text) as Record<string, unknown>;
		} catch {
			if (text.startsWith('{') && text.endsWith('}')) {
				const so = new StringObject('{');
				so.addEnd('}');
				let e: Record<string, unknown>;
				eval(`e = ${parseStringObject(text, so).solve()}`);
				// @ts-expect-error - we use eval here
				return e;
			} else if (text.startsWith('[') && text.endsWith(']')) {
				const so = new StringObject('[');
				so.addEnd(']');
				let e: unknown[];
				eval(`e = ${parseStringObject(text, so).solve()}`);
				// @ts-expect-error - we use eval here
				return e;
			} else return text;
		}
	}
}

/**
 * Checks if the given string is a bigint.
 * @param string - The string to check.
 * @returns - Returns true if the string is a bigint, false otherwise.
 * @example
 * ```js
 * isBigInt("1n") // true
 * isBigInt("1") // false
 * ```
 */

export function isBigInt(string: string) {
	return (/^-?\d+n$/.exec(string)) !== null;
}

export function stringify(data: any): string {
	switch (typeof data) {
		case 'bigint':
			return data + 'n';
		case 'object':
			return JSON.stringify(data);
		case 'undefined': 
			return 'undefined';
		default:
			return data.toString();
	}
}