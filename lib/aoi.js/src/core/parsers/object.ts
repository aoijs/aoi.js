import { parseData } from '@aoi.js/utils/helpers.js';
import StringObject from '../builders/StringObject.js';
import { parseString } from './string.js';
import { TranspilerCustoms } from '@aoi.js/typings/enum.js';

export const OBJECT_QUOTE_REGEX = /".*?"/g;

export function _handleStringData(text: string, object: StringObject) {
	if (text.startsWith('\'') || text.startsWith('"') || text.startsWith('`')) {
		text = text.slice(1, text.length - 1);
		text = parseString(text);
	} else if (text.includes(TranspilerCustoms.FS)) {
		if (
			text
				.replaceAll(/#FUNCTION_START#(.+?)#FUNCTION_END#/g, '')
				.trim() !== ''
		) {
			text = parseString(text);
		}
	} else {
		text = parseString(text);
	}

	object.addValue(text);
}

export function _getObjectAst(
	objectString: string,
	currentObject: StringObject,
) {
	let i = 0,
		text = '',
		arrayEnded = false;

	while (i < objectString.length) {
		const char = objectString[i];
		if (char === '{' || char === '[') {
			const newObject = new StringObject(char, currentObject);
			currentObject.addValue(`#StringObject_${newObject.name}#`);
			currentObject = newObject;
		} else if (char === '}' || char === ']') {
			currentObject.addEnd(char);

			if (text.trim() !== '') {
				const t = parseData(text.trim());
				if (typeof t === 'string') {
					_handleStringData(t, currentObject);
					text = '';
				}
			}

			currentObject.parent?.pushChild(currentObject);
			currentObject = currentObject.parent!;
		} else if (char === ':') {
			currentObject.addKey(text.trim());
			text = '';
		} else if (char === ',') {
			if (arrayEnded) {
				i++;
				arrayEnded = false;
				continue;
			}

			if (currentObject.start === '[' || currentObject.start === '{') {
				const t = parseData(text.trim());
				if (typeof t === 'string') {
					_handleStringData(t, currentObject);
				}

				text = '';
			}
		} else {
			text += char;
		}
	}

	while (currentObject.parent) {
		currentObject = currentObject.parent;
	}

	return currentObject;
}

export function _escapeObjectSymbols(text: string) {
	return text
		.replaceAll(':', TranspilerCustoms.OSEP)
		.replaceAll('{', TranspilerCustoms.OS)
		.replaceAll('}', TranspilerCustoms.OE)
		.replaceAll('[', TranspilerCustoms.AS)
		.replaceAll(']', TranspilerCustoms.AE)
		.replaceAll(',', TranspilerCustoms.ASEP);
}

export function parseStringObject(text: string, stringObject: StringObject) {
	const quotes = text.match(OBJECT_QUOTE_REGEX);

	if (quotes) {
		for (const quote of quotes) {
			text = text.replace(quote, _escapeObjectSymbols(quote));
		}
	}

	return _getObjectAst(text.slice(1, text.length - 1), stringObject);
}
