import { BundlerCustoms } from "@aoi.js/typings/enum";
import { TranspilerError } from "./Error";
import Transpiler from "./Transpiler.js";

export default class AoiReader {

	_parseEmbeddedJS(code: string) {
		let cntr = 0, isPotentialStart = false, tmp = '';
		const embeds = [];
		
		for (let i = 0; i < code.length; i++) {
			const char = code[i];

			if ( char === '$') {
				if (cntr) {
					tmp += char;
				}

				if (!isPotentialStart) {
					isPotentialStart = true;
				}
			} else if (char === '{') {
				if (isPotentialStart && !cntr) {
					cntr++;
				} else if (cntr) {
					tmp += char;
					cntr++;
				}
			} else if (char === '}') {
				if (cntr) {
					cntr--;

					if (!cntr) {
						embeds.push(tmp);
						tmp = '';
						isPotentialStart = false;
					} else {
						tmp += char;
					}
				} else if (isPotentialStart) {
					isPotentialStart = false;
				}
			} else {
				if (cntr) {
					tmp += char;
				}
			}
		}

		if (cntr) {
			throw TranspilerError.AoiReaderError('Invalid embedded JS', { code });
		}

		return embeds;
	}

	_updateEmbedJs(compiled: string, embeds: string[]) {
		while (embeds.length) {
			const embed = embeds.pop()!;
			compiled = this._replaceLast(compiled, BundlerCustoms.EJS, embed);
		}

		return compiled;
	}

	_replaceLast(str: string, find: string, replace: string) {
		const index = str.lastIndexOf(find);
		if (index === -1) {
			return str;
		}

		return str.slice(0, index) + replace + str.slice(index + find.length);
	}
}