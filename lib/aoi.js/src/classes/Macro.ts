import type { AsyncFunction } from '@aoi.js/typings/type.js';
import type AoiClient from './AoiClient.js';

export default class Macro {
	readonly #name: string;
	readonly #code: string | AsyncFunction;

	constructor( name: string, code: string | AsyncFunction) {
		this.#name = name;
		this.#code = code;
	}

	#replaceArgInFunctionStringWithDiscord(func: string, arg: string) {
		// it will replace all arg with __$DISCORD_DATA$__ and wont replace same word if it is a part of another word or a property

		const regex = new RegExp(
			`(?<![a-zA-Z0-9_.])(${arg})(?![a-zA-Z0-9_])`,
			'g',
		);
		return func.replaceAll(regex, '__$DISCORD_DATA$__');
	}

	#toString() {
		const body = this.#code.toString();

		const matchWholeArgwithAsync = /(async\s*)?\(?\s*(\w)*\s*\)?(?=\s*=>)/;
		const argRegex = /\(?\s*(\w)*\s*\)?(?=\s*=>)/;

		const getArg = argRegex.exec(body);
		if (!getArg) throw new Error('Function Arg must be present');

		const arg = getArg[0].replace('(', '').replace(')', '').trim();

		let bodyWithoutArg = body.replace(matchWholeArgwithAsync, '');

		if (arg !== '') {
			bodyWithoutArg = this.#replaceArgInFunctionStringWithDiscord(
				bodyWithoutArg,
				arg,
			);
		}

		const removedArrow = bodyWithoutArg.replace('=>', '').trim();

		const bodyWithoutBrackets = removedArrow.startsWith('{')
			? removedArrow.slice(1, -1)
			: removedArrow;
		
		let result = bodyWithoutBrackets.trim();

		return result;
	}

	get name() {
		return this.#name;
	}

	get code() {
		if (typeof this.#code === 'string') {
			return this.#code;
		}

		return this.#toString();
	}

	get isFn() {
		return typeof this.#code === 'function';
	}
}
